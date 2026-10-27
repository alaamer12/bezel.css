import os
import sys
import time
import socket
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def run_server(port, root_dir):
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=root_dir, **kwargs)
        def log_message(self, format, *args):
            pass
    httpd = HTTPServer(('127.0.0.1', port), Handler)
    httpd.serve_forever()

SCREENS = [
    {
        "id": 1,
        "slug": "best_funds",
        "file": "screen_1_ipad.html",
        "name": "screen_1_best_funds.png"
    },
    {
        "id": 2,
        "slug": "historical_performance",
        "file": "screen_2_ipad.html",
        "name": "screen_2_historical_performance.png"
    },
    {
        "id": 3,
        "slug": "smart_calculator",
        "file": "screen_3_ipad.html",
        "name": "screen_3_smart_calculator.png"
    },
    {
        "id": 4,
        "slug": "asset_allocation",
        "file": "screen_4_ipad.html",
        "name": "screen_4_asset_allocation.png"
    },
    {
        "id": 5,
        "slug": "favorites_watchlist",
        "file": "screen_5_ipad.html",
        "name": "screen_5_favorites_watchlist.png"
    },
    {
        "id": 6,
        "slug": "instant_notifications",
        "file": "screen_6_ipad.html",
        "name": "screen_6_instant_notifications.png"
    },
    {
        "id": 7,
        "slug": "custom_investments",
        "file": "screen_7_ipad.html",
        "name": "screen_7_custom_investments.png"
    }
]

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    port = find_free_port()
    
    server_thread = threading.Thread(target=run_server, args=(port, root_dir), daemon=True)
    server_thread.start()
    time.sleep(0.5)

    base_url = f"http://127.0.0.1:{port}"
    print(f"[*] Started HTTP server on {base_url}")

    out_dir = os.path.join(root_dir, "snduk-designs", "output", "screenshots", "ipad")
    os.makedirs(out_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 13" iPad Pro portrait resolution: 2064x2752
        page = browser.new_page(
            viewport={"width": 2064, "height": 2752},
            device_scale_factor=1
        )
        
        for sc in SCREENS:
            url = f"{base_url}/snduk-designs/templates/screens/{sc['file']}"
            print(f"[*] Rendering Screen {sc['id']}: {url}...")
            page.goto(url, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            time.sleep(0.5)
            
            canvas = page.query_selector(".ipad-canvas")
            screenshot_bytes = canvas.screenshot() if canvas else page.screenshot()
            
            target_path = os.path.join(out_dir, sc["name"])
            with open(target_path, "wb") as f:
                f.write(screenshot_bytes)
            print(f"  [+] Saved {target_path} ({len(screenshot_bytes)} bytes)")
            
        browser.close()
    print("[*] All 7 iPad screenshots successfully captured!")

if __name__ == "__main__":
    main()
