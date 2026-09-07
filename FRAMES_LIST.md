# bezel.css Frame Inventory

This document lists all available phone, tablet, computer, and wearable frames supported by `bezel.css`.

## Modern `pf-*` Frames (Modular Primitives)
These frames are built with plain CSS and support the full suite of modern features (high-precision scaling, native scrollbars, and Dynamic Island/notch awareness).

| Class | Device Model | Features |
|-------|--------------|----------|
| `.pf-iphone-14-pro` | iPhone 14 Pro | Dynamic Island, Rounded Corners |
| `.pf-iphone-x` | iPhone X | Classic Notch, Rounded Corners |
| `.pf-pixel-7` | Google Pixel 7 | Generic Punchhole, Flat Display |
| `.pf-galaxy-s23` | Samsung Galaxy S23 | Centered Punchhole, Rounded corners |

## Legacy `.device-*` Frames (Bridged)
These frames are inherited from `devices.css` and have been unified with `pf-*` features via the CSS bridge.

### Phones
- `.device-iphone-14-pro`
- `.device-iphone-14`
- `.device-iphone-x`
- `.device-iphone-8`
- `.device-iphone`
- `.device-google-pixel-6-pro`
- `.device-google-pixel-2-xl`
- `.device-google-pixel`
- `.device-galaxy-s8`

### Tablets
- `.device-ipad-pro-2017`
- `.device-ipad-pro`

### Computers & Displays
- `.device-macbook-pro-2018`
- `.device-macbook-pro`
- `.device-macbook`
- `.device-imac-pro`
- `.device-imac`
- `.device-pro-display-xdr`
- `.device-surface-book`
- `.device-surface-pro-2017`
- `.device-surface-studio`

### Wearables & Others
- `.device-apple-watch-ultra`
- `.device-apple-watch-s8`
- `.device-homepod`

## Feature Support Matrix
All frames (Modern and Legacy) now support the following features when using the unified bridge:

- **High-Precision Scaling**: Perfect fit for iframes via `iframe-scale.js`.
- **Native-Style Scrollbars**: iOS and Android scrollbar injection.
- **Safe Area Insets**: Notch/Island awareness via `.pf-safe-area-view--vertical`.
- **Customizable Colors**: Using CSS variables (for `pf-*`) or standard SCSS themes (for legacy).
