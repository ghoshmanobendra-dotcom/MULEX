"""
Money Muling Detection Engine — FastAPI Backend

Exposes endpoints for:
- CSV upload & fraud detection analysis (works for guests and authenticated users)
- User authentication (JWT-based)
- Admin panel (user management, usage history)
"""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from detector import FraudDetector
from models import AnalysisResult
from database import engine, get_db, Base
from db_models import User, UsageHistory
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
    SECRET_KEY,
    ALGORITHM,
)
from jose import jwt

# ── App Initialization ─────────────────────────────────────────────────
app = FastAPI(
    title="Money Muling Detection Engine",
    description="Graph-Based Financial Crime Detection System",
    version="2.0.0",
)

# ── CORS — allow frontend dev server ───────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mulex-git-main-manobs-projects.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Schemas for Auth ──────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"


class HistoryOut(BaseModel):
    id: int
    user_id: int
    username: Optional[str] = None
    action: str
    file_name: Optional[str] = None
    details: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Startup — create tables + seed admin ───────────────────────────────
@app.on_event("startup")
def on_startup():
    """Create all tables and seed a default admin user if none exists."""
    Base.metadata.create_all(bind=engine)

    db = next(get_db())
    try:
        # Seed admin
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            admin_user = User(
                username="admin",
                email="admin@frauddetection.com",
                hashed_password=hash_password("admin123"),
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("✅ Default admin user created (admin / admin123)")
        else:
            print("✅ Admin user already exists")

        # Seed default regular user
        default_user = db.query(User).filter(User.username == "user").first()
        if not default_user:
            new_user = User(
                username="user",
                email="user@frauddetection.com",
                hashed_password=hash_password("user123"),
                role="user",
                is_active=True,
            )
            db.add(new_user)
            db.commit()
            print("✅ Default user created (user / user123)")
        else:
            print("✅ Default user already exists")
    finally:
        db.close()


# ── Health Check ───────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "Money Muling Detection Engine"}


# ══════════════════════════════════════════════════════════════════════════
#  AUTH ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════

@app.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token(data={"sub": user.username, "role": user.role})

    # Log login action
    history = UsageHistory(user_id=user.id, action="login", details="User logged in")
    db.add(history)
    db.commit()

    return TokenResponse(access_token=token, role=user.role, username=user.username)


@app.get("/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Return current authenticated user info."""
    return current_user


# ══════════════════════════════════════════════════════════════════════════
#  ADMIN ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════

@app.get("/admin/users", response_model=List[UserOut])
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """List all users (admin only)."""
    return db.query(User).order_by(User.created_at.desc()).all()


@app.post("/admin/users", response_model=UserOut)
def create_user(req: CreateUserRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Create a new user (admin only)."""
    # Check uniqueness
    existing = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    if req.role not in ("admin", "user"):
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'user'")

    new_user = User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
        role=req.role,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log admin action
    history = UsageHistory(
        user_id=admin.id,
        action="create_user",
        details=f"Created user '{req.username}' with role '{req.role}'",
    )
    db.add(history)
    db.commit()

    return new_user


@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Delete a user (admin only). Cannot delete self."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    username = user.username
    db.delete(user)
    db.commit()

    # Log admin action
    history = UsageHistory(
        user_id=admin.id,
        action="delete_user",
        details=f"Deleted user '{username}'",
    )
    db.add(history)
    db.commit()

    return {"message": f"User '{username}' deleted successfully"}


@app.get("/admin/history", response_model=List[HistoryOut])
def get_all_history(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """View all usage history (admin only)."""
    records = (
        db.query(UsageHistory)
        .order_by(UsageHistory.timestamp.desc())
        .limit(200)
        .all()
    )
    result = []
    for r in records:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append(
            HistoryOut(
                id=r.id,
                user_id=r.user_id,
                username=user.username if user else "deleted",
                action=r.action,
                file_name=r.file_name,
                details=r.details,
                timestamp=r.timestamp,
            )
        )
    return result


# ══════════════════════════════════════════════════════════════════════════
#  USER ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════

@app.get("/user/history", response_model=List[HistoryOut])
def get_my_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """View own usage history."""
    records = (
        db.query(UsageHistory)
        .filter(UsageHistory.user_id == current_user.id)
        .order_by(UsageHistory.timestamp.desc())
        .limit(100)
        .all()
    )
    return [
        HistoryOut(
            id=r.id,
            user_id=r.user_id,
            username=current_user.username,
            action=r.action,
            file_name=r.file_name,
            details=r.details,
            timestamp=r.timestamp,
        )
        for r in records
    ]


# ══════════════════════════════════════════════════════════════════════════
#  CSV UPLOAD & ANALYSIS (PROTECTED)
# ══════════════════════════════════════════════════════════════════════════

@app.post("/predict", response_model=AnalysisResult)
async def upload_csv(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Accept a CSV file upload, run fraud detection analysis,
    and return structured results with graph visualization data.
    Works for both authenticated users and guests.
    """
    # ── Optional auth: try to identify user from Bearer token ──
    current_user = None
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        raw_token = auth_header[7:]
        try:
            payload = jwt.decode(raw_token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            if username:
                current_user = db.query(User).filter(User.username == username).first()
        except Exception:
            pass  # Invalid token — continue as guest

    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a CSV file.",
        )

    try:
        # Read file contents
        raw_bytes = await file.read()
        csv_content = raw_bytes.decode("utf-8")

        if not csv_content.strip():
            raise HTTPException(status_code=400, detail="Uploaded CSV file is empty.")

        # Run fraud detection
        detector = FraudDetector()
        result = detector.analyze(csv_content)

        # Log usage only for authenticated users
        if current_user:
            history = UsageHistory(
                user_id=current_user.id,
                action="upload_csv",
                file_name=file.filename,
                details=f"Analyzed {result.summary.total_accounts_analyzed} accounts, found {result.summary.suspicious_accounts_flagged} suspicious",
            )
            db.add(history)
            db.commit()

        return result

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="File encoding error. Please upload a UTF-8 encoded CSV.",
        )
    except Exception as e:
        import traceback
        with open("last_500_error.txt", "w") as f:
            f.write(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )


# ── Run with: uvicorn main:app --reload ───────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=1000, reload=True)
