/**
 * LoginPage — Premium Login with dark luxury aesthetic.
 *
 * Matches landing page: Outfit/Sora fonts, violet/fuchsia gradients,
 * glassmorphism card, animated background orbs, floating particles.
 * All existing functionality preserved (admin/user/guest tabs, redirect, error handling).
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, User, Lock, ArrowRight, Eye, EyeOff, Sparkles,
    AlertCircle, ArrowLeft, Radar, Fingerprint,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const particlesData = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 12,
    delay: Math.random() * 5,
}));

const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particlesData.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle, rgba(139,92,246,0.4), rgba(139,92,246,0.05))`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.15, 0.5, 0.15],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

/* ── Feature badges shown below the card ─────────────── */
const FeatureBadge = ({ icon: Icon, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(139,92,246,0.08)',
        }}
    >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center">
            <Icon size={11} className="text-violet-400" />
        </div>
        <span className="text-[10px] text-slate-500" style={B}>{label}</span>
    </motion.div>
);

/* ── Main Login Component ────────────────────────────── */
export default function LoginPage() {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [activeTab, setActiveTab] = useState('guest');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        setError('');
        if (import.meta.env.DEV) {
            if (activeTab === 'admin') {
                setUsername('admin');
                setPassword('admin123');
            } else if (activeTab === 'user') {
                setUsername('user');
                setPassword('user123');
            } else {
                setUsername('');
                setPassword('');
            }
        } else {
            setUsername('');
            setPassword('');
        }
    }, [activeTab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            if (activeTab === 'admin' && data.role !== 'admin') {
                throw new Error('This account does not have admin privileges');
            }

            login({ token: data.access_token, role: data.role, username: data.username });
            navigate(data.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        } catch (err) {
            setError(err.message);
            setShake(true);
            setTimeout(() => setShake(false), 600);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        login({ token: 'guest_token', role: 'guest', username: 'Guest' });
        navigate('/dashboard', { replace: true });
    };

    const tabs = [
        { id: 'guest', label: 'Guest', icon: Sparkles },
        { id: 'user', label: 'User', icon: User },
        { id: 'admin', label: 'Admin', icon: Shield },
    ];

    const inputStyle = {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(139,92,246,0.12)',
        ...B,
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden selection:bg-violet-500/30"
            style={{ background: '#07070a' }}>

            {/* ── Background glow orbs ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-violet-600/[0.06] blur-[200px] rounded-full" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/[0.04] blur-[180px] rounded-full" />
                <div className="absolute top-[30%] right-[15%] w-[400px] h-[400px] bg-cyan-500/[0.03] blur-[160px] rounded-full" />
            </div>

            {/* Grid pattern overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />

            <FloatingParticles />

            {/* ── Main content ── */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Back to home */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => navigate('/')}
                    whileHover={{ x: -4 }}
                    className="mb-6 text-slate-500 hover:text-violet-300 flex items-center gap-2 text-sm transition-colors cursor-pointer"
                    style={B}
                >
                    <ArrowLeft size={15} />
                    Back to Home
                </motion.button>

                {/* ── Login Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                >
                    <div className="rounded-2xl p-7 relative overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(139,92,246,0.1)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Top gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(236,72,153,0.4), transparent)' }} />

                        {/* Inner glow */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at top center, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

                        {/* ── Logo ── */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                            className="flex justify-center mb-5"
                        >
                            <motion.div
                                animate={{ boxShadow: ['0 0 15px rgba(139,92,246,0.3)', '0 0 30px rgba(139,92,246,0.5)', '0 0 15px rgba(139,92,246,0.3)'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-16 rounded-2xl overflow-hidden"
                            >
                                <img src="/logo.png" alt="MuleX" className="h-full w-auto object-contain" />
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-2xl font-bold text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-300"
                            style={H}
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-500 text-center text-sm mb-7"
                            style={B}
                        >
                            Sign in to access the fraud detection system
                        </motion.p>

                        {/* ── Tab switcher ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="relative flex rounded-xl p-1 mb-7"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                            {/* Animated indicator */}
                            <motion.div
                                className="absolute top-1 bottom-1 rounded-lg"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))',
                                    border: '1px solid rgba(139,92,246,0.3)',
                                    boxShadow: '0 0 20px rgba(139,92,246,0.1)',
                                }}
                                animate={{
                                    left: activeTab === 'guest' ? '4px' : activeTab === 'user' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 4px)',
                                    width: 'calc(33.33% - 8px)',
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (tab.id === 'guest') {
                                            setActiveTab('guest');
                                            handleGuestLogin();
                                        } else {
                                            setActiveTab(tab.id);
                                        }
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium relative z-10 transition-colors cursor-pointer ${activeTab === tab.id ? 'text-violet-200' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    style={B}
                                >
                                    <tab.icon size={13} />
                                    {tab.label}
                                </button>
                            ))}
                        </motion.div>

                        {/* ── Form (hidden for guest) ── */}
                        {activeTab === 'guest' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-5 mt-2"
                            >
                                <p className="text-slate-400 text-center text-sm leading-relaxed" style={B}>
                                    Explore the fraud detection dashboard instantly — no account needed.
                                </p>
                                <motion.button
                                    type="button"
                                    onClick={handleGuestLogin}
                                    whileHover={{ scale: 1.01, boxShadow: '0 0 35px rgba(139,92,246,0.3)' }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.8), rgba(236,72,153,0.7))',
                                        boxShadow: '0 4px 20px rgba(139,92,246,0.2)',
                                        ...B,
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles size={16} />
                                        Continue as Guest
                                        <ArrowRight size={16} />
                                    </span>
                                </motion.button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username */}
                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative group"
                                >
                                    <label className="text-[10px] text-slate-600 mb-1.5 block uppercase tracking-wider" style={B}>Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User size={14} className="text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter username"
                                            className="w-full rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none transition-all placeholder-slate-600"
                                            style={inputStyle}
                                            autoComplete="username"
                                            onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.08)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative group"
                                >
                                    <label className="text-[10px] text-slate-600 mb-1.5 block uppercase tracking-wider" style={B}>Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock size={14} className="text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full rounded-xl py-3 pl-10 pr-12 text-white text-sm focus:outline-none transition-all placeholder-slate-600"
                                            style={inputStyle}
                                            autoComplete="current-password"
                                            onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.08)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-violet-400 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -8, height: 0 }}
                                            className="flex items-center gap-2 text-red-300 text-sm px-4 py-2.5 rounded-xl"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', ...B }}
                                        >
                                            <AlertCircle size={14} />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.01, boxShadow: loading ? 'none' : '0 0 35px rgba(139,92,246,0.3)' }}
                                    whileTap={{ scale: loading ? 1 : 0.99 }}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white text-sm relative overflow-hidden transition-all cursor-pointer ${loading ? 'opacity-60 cursor-wait' : ''
                                        }`}
                                    style={{
                                        background: loading
                                            ? 'rgba(139,92,246,0.3)'
                                            : 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.8), rgba(236,72,153,0.7))',
                                        boxShadow: '0 4px 20px rgba(139,92,246,0.2)',
                                        ...B,
                                    }}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Authenticating...
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {activeTab === 'admin' ? 'Sign in as Admin' : 'Sign in as User'}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        )}

                        {/* Footer note */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center text-slate-600 text-[11px] mt-5 flex items-center justify-center gap-1.5"
                            style={B}
                        >
                            <Sparkles size={10} className="text-violet-500" />
                            {activeTab === 'admin'
                                ? 'Admin accounts have full system access'
                                : 'Contact your admin for account credentials'}
                        </motion.p>
                    </div>
                </motion.div>

                {/* ── Feature badges below card ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-5 flex-wrap"
                >
                    <FeatureBadge icon={Shield} label="256-bit Encrypted" delay={0.85} />
                    <FeatureBadge icon={Radar} label="Real-time Analysis" delay={0.9} />
                    <FeatureBadge icon={Fingerprint} label="JWT Auth" delay={0.95} />
                </motion.div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}
