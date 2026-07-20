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

## Browser Support

- Chrome (Last 2)
- Firefox (Last 2)
- Safari (Last 2)
- Edge (Last 2)

## License

MIT License. Forked from [devices.css](https://github.com/picturepan2/devices.css) by [Yan Zhu](https://twitter.com/picturepan2).
