"""
Server thiệp sinh nhật — chạy: python server.py
Mở trình duyệt tại: http://localhost:5500
F5 để reload, Ctrl+C để dừng.
"""
import http.server
import socketserver
import webbrowser
import os
import threading
import socket
from urllib.parse import unquote

DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def translate_path(self, path):
        # Decode URL — xử lý tên file có dấu cách, tiếng Việt
        path = unquote(path)
        return super().translate_path(path)

    def log_message(self, format, *args):
        pass  # Tắt log cho gọn

    def end_headers(self):
        # Cho phép audio stream đúng
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

def tim_port(bat_dau=5500):
    for p in range(bat_dau, bat_dau + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("localhost", p)) != 0:
                return p
    return bat_dau

PORT = tim_port(5500)

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("")
    print("  🎂  THIỆP SINH NHẬT ĐANG CHẠY  🎂")
    print(" ─────────────────────────────────────")
    print(f"  🌐  Mở trình duyệt:  http://localhost:{PORT}")
    print("  🔄  Nhấn F5 để reload trang")
    print("  ⛔  Nhấn Ctrl+C để dừng server")
    print(" ─────────────────────────────────────")
    print("")
    threading.Timer(0.5, lambda: webbrowser.open(f"http://localhost:{PORT}")).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server đã dừng. Hẹn gặp lại! 👋")
