#!/usr/bin/env python3
"""Capture device-framed product graphics from HTML templates with Playwright.

Usage:  python capture.py <config.json> [--root DIR]

Config JSON:
{
  "shots": [
    {"template": "templates/screens/screen_1.html",  # path relative to --root
     "frame": "ios-6.9",                             # output subfolder per frame
     "width": 1320, "height": 2868,                  # exact canvas pixels
     "name": "screen_1"}
  ],
  "output_dir": "output"    # <output_dir>/<frame>/<name>.png
}

Requires: pip install playwright && playwright install chromium
Serves --root over a temporary localhost server so relative assets resolve.
"""
import argparse
import json
import os
import socket
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# A page needs a moment after load for fonts and image decode before capture.
RENDER_SETTLE_MS = 500


def find_free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("config")
    parser.add_argument("--root", default=os.getcwd(),
                        help="Project root served over HTTP (default: cwd)")
    args = parser.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("FAIL: playwright not installed. Run: pip install playwright && playwright install chromium")
        return 1

    root = os.path.abspath(args.root)
    with open(args.config, encoding="utf-8") as f:
        cfg = json.load(f)
    shots = cfg.get("shots", [])
    output_dir = os.path.join(root, cfg.get("output_dir", "output"))
    if not shots:
        print("FAIL: config has no shots")
        return 1

    port = find_free_port()
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(QuietHandler, directory=root))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base_url = f"http://127.0.0.1:{port}"

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for shot in shots:
            name, frame = shot["name"], shot["frame"]
            out_path = os.path.join(output_dir, frame, f"{name}.png")
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            page = browser.new_page(viewport={
                "width": int(shot["width"]), "height": int(shot["height"])})
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("response",
                    lambda r: errors.append(f"HTTP {r.status} {r.url}")
                    if r.status >= 400 else None)
            url = f"{base_url}/{shot['template'].replace(os.sep, '/')}"
            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(RENDER_SETTLE_MS)
                page.screenshot(path=out_path)
                status = "OK" if not errors else "WARN " + "; ".join(errors[:3])
            except Exception as exc:
                status = f"FAIL {exc}"
                failures.append(name)
            page.close()
            print(f"[{status}] {out_path.replace(os.sep, '/')}")
        browser.close()
    server.shutdown()

    print(f"\nDone: {len(shots) - len(failures)}/{len(shots)} captured"
          + (f", failed: {', '.join(failures)}" if failures else ""))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
