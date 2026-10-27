# Graphics Pipeline — Template & QA Conventions

## Contents
- Template authoring
- Shared stylesheet
- Screenshot placement & cropping
- Capture configuration
- QA feedback loop
- Demo page and 3D showcase
- RTL & fonts

## Template authoring

One HTML file per graphic in `templates/screens/`, named
`screen_<n>_<slug>.html` (slug = the feature being advertised, e.g.
`screen_2_checkout.html`). Structure:

- Full-bleed canvas sized in CSS to the target store pixels (see frames.md).
- Headline text at top, device frame centered, optional footer badge.
- Reference the input screenshot relatively: `../../input/<file>` — templates
  live two levels below the graphics root, so paths stay stable when the whole
  folder moves.
- Start from `assets/screen-template.html`; keep markup thin, put all visual
  weight in the shared stylesheet.

## Shared stylesheet

`templates/demo/styles.css` is the single design layer: CSS custom properties
for theme (`--bg`, `--accent`, `--text`, font stacks), frame helpers, headline
classes, and per-screen modifier classes (`.screen-crop-1`, `.theme-dark`).
Templates only add a body class + content.

## Screenshot placement & cropping

- Frame the screenshot with `object-fit: cover` and tune with
  `object-position` — never resize the frame to the image.
- **Aspect mismatch (common):** when the screenshot aspect (e.g. 9:16) differs
  from the real device frame aspect (e.g. 9:19.5), size the frame's *screen
  area* to the screenshot's own aspect instead of cropping. A few percent of
  frame exaggeration is invisible; clipped UI content is not.
- If the source screenshot includes device chrome (status bar, its own
  bezel), crop it via a wrapper with `overflow: hidden` and a negative offset
  or `scale()` — the frame in the graphic must be the only device chrome.
- **No status bar in the input?** Do not render a notch/Dynamic Island over
  the screen — real notches float above the status bar; app titles sit at the
  top of a bare screenshot and will collide. Either omit the cutout or add
  top padding inside the screen area.
- Different aspect between screenshot and frame screen? Prefer cropping over
  letterboxing; letterbox only when cropping would cut UI content.

## Capture configuration

`scripts/capture-config.json` in the graphics folder lists every shot:

```json
{
  "shots": [
    {"template": "graphics/templates/screens/screen_1_hero.html",
     "frame": "ios-6.9", "width": 1320, "height": 2868, "name": "screen_1"}
  ],
  "output_dir": "graphics/output"
}
```

Run from the project root:

```bash
python <skill-dir>/scripts/capture.py graphics/scripts/capture-config.json --root .
```

Output lands in `output/<frame>/<name>.png`. One `[OK]`/`[FAIL]` line per
shot; `[WARN]` lines list failed sub-resources (missing images/fonts) — treat
warnings as failures and fix the template.

## QA feedback loop

For every captured PNG:

1. Open the image and inspect: frame edges crisp? screenshot cropped
   sensibly (no cut-off text/buttons)? headline free of overflow? margins
   balanced at a glance?
2. Any defect → fix the template/CSS, not the PNG.
3. Recapture **only the affected shots** (trim the config or rerun all).
4. Repeat until a clean pass. Never deliver unviewed output.

## Demo page (optional)

`templates/demo/index.html`: browsable grid linking all templates and captured
outputs — build only when the user wants to review/pick variants. An
interactive 3D showcase (`templates/3d/`) is a separate, opt-in deliverable,
never a store asset.

## RTL & fonts

- Arabic/Hebrew copy: set `dir="rtl"` on the canvas, mirror decorative
  layouts, keep the device frame LTR-neutral.
- Arabic headlines need `line-height: 1.3` or looser — 1.15 clips diacritics
  and stacked marks.
- Load brand webfonts with `@import` in the shared stylesheet; `networkidle`
  + settle delay in capture.py gives fonts time to apply. Verify glyphs in
  the QA pass — a missing font (or offline capture run) silently falls back.
