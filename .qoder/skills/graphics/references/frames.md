# Device Frames ↔ Store Canvases

## Contents
- iPhone (Apple App Store)
- iPad (Apple App Store)
- Android / Samsung (Google Play)
- Google Play non-screenshot assets
- Choosing frames
- Frame CSS notes

## iPhone — App Store

| Display | Canvas (px) | Typical device frame aspect |
|---|---|---|
| 6.9" (16 Pro Max class) | 1320 × 2868 | ~19.5:9 |
| 6.5" (12/13/14 class) | 1284 × 2778 | ~19.5:9 |
| 5.5" (legacy, optional) | 1242 × 2208 | 16:9 |

One 6.9" set is usually enough; Apple scales down. Ask the user before also
producing 6.5".

## iPad — App Store

| Display | Canvas (px) |
|---|---|
| 13" M4 class | 2066 × 2752 |
| 12.9" class | 2048 × 2732 |

## Android / Google Play

Play accepts any aspect between 9:16 and 16:9, 100–10000 px per side.
Conventions:

| Target | Canvas (px) | Notes |
|---|---|---|
| Phone (safe choice) | 1080 × 1920 | 9:16, fits all stores |
| Phone (tall frames) | 1440 × 3120 | Galaxy S Ultra class, 19.5:9 |
| 7" tablet | 1200 × 1600 | Pixel Tablet / Tab S series |

## Google Play non-screenshot assets

| Asset | Canvas (px) |
|---|---|
| Feature graphic | 1024 × 500 |
| App icon | 512 × 512 |

## Choosing frames

1. Ask the user which devices the product actually supports.
2. Match frame aspect to canvas aspect so the framed device fills ~60–80% of
   canvas height without letterboxing.
3. Produce the largest frame per platform first; smaller variants are usually
   re-captures with a different viewport + canvas size, not new designs.

## Frame CSS notes

- Use any pure-CSS device-frame library the project already ships (rounded
  shell + notch/punch-hole + bezel classes), or hand-roll a `.frame` div:
  `border-radius`, `box-shadow`, layered `::before` for the bezel.
- Keep the frame a component: same markup in every template, only content and
  theme tokens change.
- Status bars inside screenshots: if the input already includes one, crop it
  out with `object-position`; don't overlay a fake one on top.
