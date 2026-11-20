#!/usr/bin/env python3
"""Static local preview, no credentials, uploads or backend state."""
import argparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)
    def end_headers(self):
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','no-referrer')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self' https://generativelanguage.googleapis.com; object-src 'none'; base-uri 'self'")
        super().end_headers()

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=3000)
    args=parser.parse_args()
    print(f'Frame running on port {args.port}',flush=True)
    ThreadingHTTPServer(('0.0.0.0',args.port),Handler).serve_forever()
