#!/usr/bin/env python3
"""
Snduk Designs — Google Play Store Screenshot Generator
Starts a local HTTP server and uses Playwright to capture pixel-perfect 810x1440 and high-res screenshots.
"""

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
            pass # Silent server logging

    httpd = HTTPServer(('127.0.0.1', port), Handler)
    httpd.serve_forever()

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    port = find_free_port()
    
    # Start HTTP server thread
    server_thread = threading.Thread(target=run_server, args=(port, root_dir), daemon=True)
    server_thread.start()
    time.sleep(0.5)

    base_url = f"http://127.0.0.1:{port}"
    print(f"[*] Started temporary HTTP server on {base_url}")

    templates = [
        ("screen_1_best_funds", "snduk-designs/templates/screen_1_best_funds.html"),
        ("screen_2_fund_details", "snduk-designs/templates/screen_2_fund_details.html"),
        ("screen_3_advanced_analysis", "snduk-designs/templates/screen_3_advanced_analysis.html"),
        ("screen_4_smart_recommendations", "snduk-designs/templates/screen_4_smart_recommendations.html"),
        ("screen_5_historical_prices", "snduk-designs/templates/screen_5_historical_prices.html"),
        ("screen_6_competing_funds", "snduk-designs/templates/screen_6_competing_funds.html"),
        ("screen_7_investor_community", "snduk-designs/templates/screen_7_investor_community.html"),
    ]

    output_dirs = [
        os.path.join(root_dir, "snduk-designs", "output", "screenshots"),
    ]

    for d in output_dirs:
        os.makedirs(d, exist_ok=True)

    print("[*] Launching Playwright browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Google Play standard resolution: 810x1440
        page = browser.new_page(
            viewport={"width": 810, "height": 1440},
            device_scale_factor=1
        )

        for name, rel_path in templates:
            target_url = f"{base_url}/{rel_path.replace(os.sep, '/')}"
            print(f"[*] Capturing: {name} (810x1440) ...")
            
            page.goto(target_url, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            time.sleep(0.6) # Wait for webfonts and layout

            canvas = page.query_selector(".play-canvas")
            screenshot_bytes = canvas.screenshot() if canvas else page.screenshot()
            for d in output_dirs:
                png_path = os.path.join(d, f"{name}.png")
                written = False
                for attempt in range(5):
                    try:
                        with open(png_path, "wb") as f:
                            f.write(screenshot_bytes)
                        written = True
                        print(f"    -> Saved: {png_path}")
                        break
                    except Exception as e:
                        time.sleep(0.3)
                if not written:
                    print(f"    [!] Warning: Could not write {png_path}")

        browser.close()

    print("\n[SUCCESS] All Google Play screenshots (810x1440) successfully generated!")

if __name__ == "__main__":
    main()
