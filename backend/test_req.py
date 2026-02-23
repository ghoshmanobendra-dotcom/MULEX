import urllib.request
import urllib.parse
from http.client import HTTPResponse

url = "http://127.0.0.1:8000/upload-csv"
file_path = "c:/Users/ghosh/Downloads/Mulex-main/Mulex-main/money-mulling.csv"

try:
    with open(file_path, "rb") as f:
        file_data = f.read()

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"money-mulling.csv\"\r\n"
        f"Content-Type: text/csv\r\n\r\n"
    ).encode("utf-8") + file_data + f"\r\n--{boundary}--\r\n".encode("utf-8")

    req = urllib.request.Request(url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    response = urllib.request.urlopen(req)
    print("STATUS:", response.getcode())
    print("RESPONSE:", response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("BODY:", e.read().decode())
except Exception as e:
    print("OTHER ERROR:", type(e), e)
