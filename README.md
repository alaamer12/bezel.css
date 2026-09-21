# bezel.css

**bezel.css** is a modular CSS library for rendering realistic, interactive phone shells around any content: live HTML, `<iframe>`, or static images.

Forked from [devices.css](https://github.com/picturepan2/devices.css), bezel.css introduces a modern, variable-driven approach (`pf-*`) while maintaining full backward compatibility with legacy `.device-*` classes.

## Features

- **Live Content Support**: Unlike legacy libraries, `bezel.css` is built for HTML and iframes.
- **Zero JS by Default**: Pure CSS primitives for frames, notches, and islands.
- **Modular Primitives**: Mix and match `pf-shell`, `pf-screen`, `pf-island`, `pf-notch`, and more.
- **CSS Variables First**: Customize width, bezel, radius, and colors without touch the source.
- **Interactive Slots**: Built-in slots for `pf-status-bar`, `pf-scroll-view`, and `pf-tab-bar`.
- **Legacy Compatible**: Keep using your existing `devices.css` markup; it just works.

## Getting Started

### 1. Include the CSS

Download `dist/phone-frames.css` or include it via CDN:

```html
<link rel="stylesheet" href="dist/phone-frames.css">
```

### 2. Use a Preset

```html
<div class="pf-iphone-14-pro">
  <div class="pf-screen">
    <!-- Your content here -->
    <div class="pf-status-bar"></div>
    <div class="pf-scroll-view">
      <h1>Hello Bezel!</h1>
    </div>
    <div class="pf-tab-bar"></div>
  </div>
</div>
```

### 3. Or Build Your Own

```html
<div class="pf-shell pf--titanium pf--round pf--lg">
  <div class="pf-screen">
    <iframe src="https://example.com"></iframe>
  </div>
</div>
```

## Presets

| Preset | Description |
|--------|-------------|
| `pf-iphone-14-pro` | Titanium finish, Dynamic Island, rounded corners |
| `pf-iphone-x` | Black finish, classic Notch, rounded corners |
| `pf-pixel-7` | Black finish, punch-hole camera, flat corners |
| `pf-galaxy-s23` | Black finish, punch-hole camera, rounded corners |

## Customization

Override default values using CSS custom properties:

```css
:root {
  --pf-width: 375px;
  --pf-frame-color: #ff0000;
  --pf-bezel: 12px;
}
```

## 3D stock-app device studio

Serve the repository with `python -m http.server 8080`, then open
`http://localhost:8080/test_3d.html`. Choose a titanium phone, iPad Pro-style
tablet, Apple Watch Ultra-style watch, or MacBook Pro-style laptop. Drag, use
arrow keys, or select front, back, edge, and port views. Auto-rotation is opt-in
and can be paused. No changes to the legacy `.device-*` models are required.

The demo uses the supplied Snduk artwork, cropped to its visible display
(the source already contains a frame and has a truncated lower screen).
These are CSS 3D concepts, not manufacturer CAD assets. Details include solid
rounded sidewalls, cameras, buttons, ports, watch bands/crown/rear sensors,
and a laptop keyboard, trackpad, hinge, and underside feet. Tablet and laptop
screens present the source as a static preview; the watch uses an adapted
static fund summary instead of squeezing the entire screenshot into a watch.

Reusable classes live in `src/_3d.css` and are included in the normal bundle.
Include `phone-3d.js` after your markup to generate sidewalls for
`.pf-3d-solid[data-pf-solid="width,height,radius,depth"]` (pixel dimensions).
Use `.pf-3d-face.pf-3d-front` and `.pf-3d-face.pf-3d-back` for its faces,
inside a `.pf-3d-scene` perspective container. Put `.pf-3d` on the rotating
solid and customize `--pf-rotate-x`, `--pf-rotate-y`, `--pf-perspective`,
`--pf-3d-metal`, `--pf-3d-glass`, and `--pf-3d-edge`. Keep clipping and opacity
off the 3D ancestors so browsers do not flatten the model.
Call `PhoneFrames3D.init(container)` after adding or replacing solid markup.
Device assembly examples are the templates in `test_3d.html`; the optional
`.pf-3d-tablet`, `.pf-3d-watch`, and `.pf-3d-laptop` classes style their parts.

Browser smoke tests: `python scripts/test-3d.py` (requires Python Playwright
and its Chromium browser). The test starts its own local HTTP server and checks
geometry, controls, asset loading, and mobile overflow.

## Browser Support

- Chrome (Last 2)
- Firefox (Last 2)
- Safari (Last 2)
- Edge (Last 2)

## License

MIT License. Forked from [devices.css](https://github.com/picturepan2/devices.css) by [Yan Zhu](https://twitter.com/picturepan2).
