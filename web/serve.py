#!/usr/bin/env python3
"""Static local preview, no credentials, uploads or backend state."""
import argparse
import base64
import hashlib
import re
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)
    def end_headers(self):
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','no-referrer')
        html = (Path(__file__).parent / 'index.html').read_text(encoding='utf-8')
        scripts = re.findall(r'<script>(.*?)</script>', html, flags=re.S)
        hashes = ' '.join("'sha256-" + base64.b64encode(hashlib.sha256(script.encode()).digest()).decode() + "'" for script in scripts)
        self.send_header('Content-Security-Policy', f"default-src 'self'; script-src 'self' {hashes}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self' https://generativelanguage.googleapis.com; object-src 'none'; base-uri 'self'")
        super().end_headers()

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=3000)
    args=parser.parse_args()
    print(f'Frame running on port {args.port}',flush=True)
    ThreadingHTTPServer(('0.0.0.0',args.port),Handler).serve_forever()
