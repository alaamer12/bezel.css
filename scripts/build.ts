import * as sass from "sass";
import CleanCSS from "clean-css";
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");

const PF_LAYERS = [
  "_vars.css",
  "_shell.css",
  "_modifiers.css",
  "_slots.css",
  "_presets.css",
  "_compat-devices.css",
];

function ensureDist() {
  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
}

function minify(css: string): string {
  const result = new CleanCSS({ level: 2 }).minify(css);
  if (result.errors.length) {
    console.error("Minify errors:", result.errors);
    process.exit(1);
  }
  return result.styles;
}

function buildPhoneFrames() {
  const parts: string[] = [
    "/*! bezel.css / phone-frames | MIT License | github.com/alaamer12/bezel.css */\n",
  ];

  for (const file of PF_LAYERS) {
    const path = join(SRC, file);
    if (!existsSync(path)) {
      console.warn(`[build:pf] skip missing ${file}`);
      continue;
    }
    parts.push(`/* --- ${file} --- */\n`);
    parts.push(readFileSync(path, "utf8"));
    parts.push("\n");
  }

  const css = parts.join("");
  writeFileSync(join(DIST, "phone-frames.css"), css);
  writeFileSync(join(DIST, "phone-frames.min.css"), minify(css));
  console.log("[build:pf] dist/phone-frames.css");

  // Copy assets
  const assetsSrc = join(SRC, "assets");
  const assetsDist = join(DIST, "assets");
  if (existsSync(assetsSrc)) {
    cpSync(assetsSrc, assetsDist, { recursive: true });
    console.log("[build:pf] assets copied to dist/assets");
  }
}

function buildDevices() {
  const entry = join(SRC, "devices.scss");
  if (!existsSync(entry)) {
    console.warn("[build:devices] skip — src/devices.scss not found");
    return;
  }

  const result = sass.compile(entry, { style: "expanded" });
  writeFileSync(join(DIST, "devices.css"), result.css);
  writeFileSync(join(DIST, "devices.min.css"), minify(result.css));
  console.log("[build:devices] dist/devices.css");
}

const args = process.argv.slice(2);
const pfOnly = args.includes("--pf");
const devicesOnly = args.includes("--devices");

ensureDist();

if (pfOnly) {
  buildPhoneFrames();
} else if (devicesOnly) {
  buildDevices();
} else {
  buildPhoneFrames();
  buildDevices();
}
