"""Run with python scripts/test-3d.py (requires Python Playwright + Chromium)."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import argparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--screenshots', action='store_true')
args = parser.parse_args()


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: errors.append(str(response.status)) if response.status >= 400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/test_3d.html')
        page.wait_for_function("document.querySelector('img').naturalWidth === 810")
        assert page.locator('#phone > .pf-3d-side').count() == 68
        assert page.locator('.pf-3d-lens').count() == 3
        assert page.locator('#spin').get_attribute('aria-pressed') == 'false'
        assert page.locator('#phone').evaluate("e => getComputedStyle(e).transformStyle") == 'preserve-3d'

        def capture(name):
            if args.screenshots:
                page.screenshot(path=str(ROOT / 'scratch' / f'3d-{name}.png'), full_page=True)

        capture('hero')
        for name, yaw in [('Front', '0'), ('Back', '-180'), ('Edge', '-90'), ('Ports', '-28')]:
            page.get_by_role('button', name=name, exact=True).click()
            assert page.locator('#yaw').input_value() == yaw
            capture(name.lower())
        page.get_by_role('button', name='Reset', exact=True).click()
        area = page.locator('.rotation-area')
        area.focus()
        page.keyboard.press('ArrowRight')
        assert page.locator('#yaw').input_value() == '-23'
        page.keyboard.press('Home')
        assert page.locator('#yaw').input_value() == '-28'
        box = area.bounding_box()
        page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
        page.mouse.down()
        page.mouse.move(box['x'] + box['width'] / 2 + 80, box['y'] + box['height'] / 2, steps=5)
        page.mouse.up()
        assert page.locator('#yaw').input_value() == '12'
        page.locator('#pitch').fill('70')
        assert page.locator('#pitch-value').text_content() == '70°'
        page.get_by_role('button', name='Auto rotate', exact=True).click()
        page.wait_for_function("document.querySelector('#yaw').value !== '12'")
        page.get_by_role('button', name='Pause rotation', exact=True).click()
        frozen = page.locator('#yaw').input_value()
        page.wait_for_timeout(150)
        assert page.locator('#yaw').input_value() == frozen

        # Reinitialization is idempotent; invalid geometry produces no facets.
        page.evaluate("""() => {
          const invalid = document.createElement('div');
          invalid.id = 'invalid'; invalid.dataset.pfSolid = '0,40,30,-1';
          document.body.append(invalid);
        }""")
        page.add_script_tag(url='/phone-3d.js')
        assert page.locator('#phone > .pf-3d-side').count() == 68
        assert page.locator('#invalid > .pf-3d-side').count() == 0
        page.locator('#invalid').evaluate('e => e.remove()')
        page.get_by_role('button', name='Reset', exact=True).click()
        for width in [320, 390, 768]:
            page.set_viewport_size({'width': width, 'height': 844})
            page.wait_for_timeout(100)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}px'
            capture(f'mobile-{width}')
        for model, detail in [('tablet', '.pf-3d-connector'), ('watch', '.pf-3d-crown'), ('laptop', '.pf-3d-keyboard'), ('phone', '.pf-3d-camera')]:
            page.set_viewport_size({'width': 1280, 'height': 1000})
            page.locator('#device-model').select_option(model)
            assert page.locator(f'#phone {detail}').count() == 1
            assert page.locator('#phone .pf-3d-side').count() > 60
            page.wait_for_timeout(100)
            capture(f'{model}-hero')
            for view in ['Back', 'Edge', 'Ports']:
                page.get_by_role('button', name=view, exact=True).click()
                capture(f'{model}-{view.lower()}')
            page.get_by_role('button', name='Reset', exact=True).click()
            assert page.locator('#pitch').input_value() == ('-24' if model == 'laptop' else '-12')
            for width in [320, 390, 768]:
                page.set_viewport_size({'width': width, 'height': 844})
                page.wait_for_timeout(100)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{model} overflow at {width}px'
            capture(f'{model}-mobile')
        assert page.locator('#phone > .pf-3d-side').count() == 68
        assert not errors, errors
        browser.close()
        print('PASS: all four device models, geometry, assets, views, keyboard, drag, sliders, spin/pause, reduced-motion default, mobile widths; no browser errors.')
finally:
    server.shutdown()
    server.server_close()