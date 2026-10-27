---
name: graphics
description: Turn user-provided app screenshots into polished product graphics (app-store and Play Store screenshots, feature images, marketing visuals) using HTML/CSS device frames and Playwright capture. Use when the user asks for store screenshots, launch graphics, device mockups of their product, or supplies input screenshots to be framed. Always asks which device frames to support before building.
---

# Product Graphics

## Overview

Given a product's real app screenshots, produce store-ready graphics: each
screenshot is placed inside an HTML/CSS device frame on a designed canvas
(headline, background, accents), then captured at exact store pixel dimensions
with Playwright. Deterministic capture is handled by `scripts/capture.py`;
design judgment stays with the agent.

## Step 0 — Intake (mandatory before building anything)

Ask the user, in one round:

1. **Input screenshots** — required. User places them in `input/` (or sends
   them). Never invent product UI; only use what the user supplies.
2. **Which device frames to support** — required, never assume. Offer concrete
   choices: iPhone (which size), iPad, Samsung/Android, desktop. See
   [references/frames.md](references/frames.md) for canvases and pairings.
3. **Targets** — which stores/pages consume the output (App Store, Google Play,
   landing page, feature graphic). Determines pixel sizes.
4. **Brand** — colors, fonts, headline copy per screen, language/RTL needs.
5. **Inspiration** — optional. User may drop reference images in `inspire/`;
   analyze them for layout, gradient, and typography direction before designing.

## Directory layout

Create this inside the project's graphics folder (e.g. `graphics/` or the
user's preferred name):

```
graphics/
├── input/                 # user-supplied screenshots (read-only source)
├── output/                # generated PNGs, one subfolder per frame
│   └── <frame>/           # e.g. ios-6.9/, android/, ipad-13/
├── scripts/
│   └── capture-config.json    # shot list consumed by capture.py
├── templates/
│   ├── demo/              # index.html + styles.css (shared design layer)
│   ├── screens/           # screen_<n>_<slug>.html — one per graphic
│   └── 3d/                # optional: interactive 3D showcase page
└── inspire/               # optional: user reference images
```

## Workflow

Copy this checklist and track progress:

```
Graphics progress:
- [ ] 1. Intake complete; frames + sizes confirmed by user
- [ ] 2. Directory layout created; input/ populated
- [ ] 3. Shared styles.css written (theme, frame helpers, headline styles)
- [ ] 4. One template per screen, referencing input/ images relatively
- [ ] 5. capture-config.json written; run scripts/capture.py
- [ ] 6. QA every output PNG (see feedback loop below); fix + recapture
- [ ] 7. Deliver output/ (+ optional demo page listing all graphics)
```

Steps 3–4 and 6 have detailed conventions in
[references/pipeline.md](references/pipeline.md).

## Hard rules

- Capture at **exact target pixel dimensions** via viewport-sized pages — never
  scale a small render up.
- Product screenshots are rendered inside frames with `object-fit: cover` or
  explicit crop classes; never stretch or distort them.
- One shared stylesheet; per-screen templates stay thin (markup + data only).
- Every generated PNG must be opened and visually verified before delivery.
- Forward slashes in all paths; scripts run from the project root.

## Resources

- **`scripts/capture.py`** — run it (don't rewrite it):
  `python <skill-dir>/scripts/capture.py graphics/scripts/capture-config.json --root .`
  Prints one `[OK]`/`[FAIL]` line per shot plus a summary; exit code 0 = all OK.
- **`references/frames.md`** — device frames ↔ store canvas sizes table.
- **`references/pipeline.md`** — template conventions, QA feedback loop, demo page.
- **`assets/screen-template.html`** — starting skeleton for a screen template.
- **`assets/capture-config.example.json`** — example shot list.

Requires: `pip install playwright && playwright install chromium`.
