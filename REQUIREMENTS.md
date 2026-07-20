# phone-frames — requirements

Fork of [picturepan2/devices.css](https://github.com/picturepan2/devices.css).  
Adds live HTML/iframe content support and a modular class system.

---

## Problem

`devices.css` accepts only `<img>` in the screen slot. You cannot put live HTML
or an iframe inside a phone shell without hand-crafting the frame yourself.
Every showcase site that needs live content does exactly that — there is no
reusable library for it.

---

## What we are building

A CSS+JS library that renders a phone shell around any content: raw HTML, an
`<iframe>`, or a static image. The shell is assembled from independent primitive
classes so users can opt out of any piece (no notch, no buttons, custom radius).
Device presets are thin aliases that call those primitives — nothing magic.

---

## Decision ladder applied

Before adding anything to scope, it must pass:

1. Does it need to exist? — skip if YAGNI
2. Is it already a browser/CSS primitive? — use that instead of code
3. Can it be one class or one CSS variable? — prefer that over a new file
4. Only then: the minimum implementation that works

---

## Scope

### In scope

**Primitive classes** — each does exactly one thing, combinable freely:

| class | does |
|---|---|
| `pf-shell` | outer frame shape, border-radius, bezel width |
| `pf-screen` | content viewport, overflow hidden, aspect ratio |
| `pf-island` | dynamic island pill (iPhone 14 Pro style) |
| `pf-notch` | centered notch cutout (iPhone X style) |
| `pf-punchhole` | single-camera cutout (Pixel / Galaxy style) |
| `pf-buttons` | side button set rendered with pseudo-elements |
| `pf-status-bar` | pinned-top bar: time, signal, battery slots |
| `pf-nav-bar` | pinned-top secondary bar: title + action slots |
| `pf-scroll-view` | flex-1 middle region, scrollable, hides scrollbar |
| `pf-tab-bar` | pinned-bottom bar: nav item slots |

**Modifier classes** — compose onto primitives:

| class | does |
|---|---|
| `pf--black` / `pf--silver` / `pf--gold` / `pf--titanium` | frame color via CSS vars |
| `pf--round` / `pf--square` / `pf--flat` | corner radius preset |
| `pf--sm` / `pf--md` / `pf--lg` | width preset (240 / 300 / 380 px) |
| `pf--landscape` | rotates shell 90°, swaps width/height |
| `pf--no-shadow` | removes drop shadow |
| `pf--no-buttons` | hides side buttons |

**Preset classes** — thin aliases, nothing more:

| class | expands to |
|---|---|
| `pf-iphone-14-pro` | `pf-shell pf-screen pf-island pf--titanium pf--round` |
| `pf-iphone-x` | `pf-shell pf-screen pf-notch pf--black pf--round` |
| `pf-pixel-7` | `pf-shell pf-screen pf-punchhole pf--black pf--flat` |
| `pf-galaxy-s23` | `pf-shell pf-screen pf-punchhole pf--black pf--round` |

**CSS custom properties** — override any value without touching source:

```css
--pf-width          /* shell width, default per size modifier */
--pf-ratio          /* screen aspect ratio, default 9/19.5 */
--pf-bezel          /* bezel thickness */
--pf-radius         /* outer corner radius */
--pf-screen-radius  /* inner screen corner radius */
--pf-frame-color    /* frame base color */
--pf-btn-color      /* side button color */
--pf-island-color   /* island/notch fill color */
--pf-shadow         /* drop-shadow value, set to none to remove */
```

**Content modes** — same HTML structure, different child element:

```html
<!-- HTML mode -->
<div class="pf-shell pf-screen pf-island pf--titanium pf--round">
  <div class="pf-screen">
    <div class="pf-status-bar"></div>
    <div class="pf-scroll-view">your content</div>
    <div class="pf-tab-bar"></div>
  </div>
</div>

<!-- iframe mode -->
<div class="pf-shell pf-island pf--titanium pf--round">
  <iframe class="pf-screen" src="https://example.com"></iframe>
</div>

<!-- image mode — backward compat with devices.css -->
<div class="pf-shell pf-island pf--titanium pf--round">
  <img class="pf-screen" src="screenshot.png" alt="">
</div>
```

**iframe auto-scaling (JS)** — one small script that:
- detects `<iframe class="pf-screen">`
- reads the shell's rendered width
- injects `transform: scale()` on the iframe so the embedded page fills the
  frame at its natural viewport width (375px baseline)
- re-runs on window resize via `ResizeObserver`

No framework. No build step required to use the CSS alone.

**`pf-status-bar` auto-fill (JS, optional)** — when the element is present and
empty, fills time (live clock), signal bars, and battery icon with inline SVG.
Skip if the user puts their own content inside.

---

### Out of scope (YAGNI)

- Tablet or laptop shells — add later if there is demand
- Animation or transition presets — CSS handles that at the app level
- React / Vue / Web Component wrappers — the HTML+CSS API is the API
- Theme system beyond CSS vars — vars are the theme system
- Build pipeline or npm package at v1 — single-file CDN drop-in first

---

## File structure

```
dist/
  phone-frames.css      — full bundle (all layers concatenated)
  phone-frames.min.css  — minified
src/
  _vars.css             — all CSS custom properties and defaults
  _shell.css            — pf-shell, pf-screen, pf-island, pf-notch, pf-punchhole, pf-buttons
  _modifiers.css        — pf--* modifier classes
  _slots.css            — pf-status-bar, pf-nav-bar, pf-scroll-view, pf-tab-bar
  _presets.css          — device preset aliases
iframe-scale.js         — iframe auto-scaling, standalone, ~30 lines
status-bar.js           — status-bar auto-fill, standalone, ~20 lines
```

No preprocessor required. Plain CSS custom properties throughout.  
`iframe-scale.js` and `status-bar.js` are opt-in — drop them in only if needed.

---

## Non-requirements (explicit)

- No opinons on the content inside `pf-scroll-view`
- No default fonts, colors, or spacing inside the screen — that is the app's job
- No JavaScript required to use the CSS primitives
- No removal of the original `devices.css` device classes — keep backward compat

---

## Backward compatibility

`devices.css` users can keep their existing markup. The original `.device` and
`.marvel-device` class namespaces are left untouched in a compat shim. This
library adds a new `pf-` namespace alongside them.

---

## Success criteria

A user can render an iPhone 14 Pro shell around a live scrollable HTML app with:

```html
<link rel="stylesheet" href="phone-frames.css">

<div class="pf-iphone-14-pro">
  <div class="pf-screen">
    <div class="pf-status-bar"></div>
    <div class="pf-scroll-view">
      <!-- any HTML here -->
    </div>
    <div class="pf-tab-bar"></div>
  </div>
</div>
```

And a user can render the same shell without the dynamic island by using
primitives directly:

```html
<div class="pf-shell pf--titanium pf--round">
  <div class="pf-screen">...</div>
</div>
```

Both must work with zero JavaScript.
