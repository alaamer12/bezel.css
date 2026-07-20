# Agent Instructions — bezel.css

Preferences for AI agents working in this repository. Follow on every task, including subagent delegation.

---

## Mandatory context (read first, every conversation)

**At the start of every conversation — read these and keep them in mind:**

| File | Purpose |
|------|---------|
| [`.repertoire/.steering/structure.md`](.repertoire/.steering/structure.md) | Repo layout, file ownership, `pf-*` vs legacy |
| [`.repertoire/.steering/tech.md`](.repertoire/.steering/tech.md) | bun, build scripts, conventions |
| [`.repertoire/.steering/product.md`](.repertoire/.steering/product.md) | phone-frames features, success criteria |
| [`REQUIREMENTS.md`](REQUIREMENTS.md) | Full product spec |

Do not contradict steering docs without verifying the codebase first.

---

## Mandatory skill usage

Before starting implementation work:

1. **Use at least ONE skill** from [`.cursor/skills/`](.cursor/skills/).
2. **Read that skill's `SKILL.md` in full** — follow its workflow.
3. For parallel worker pools → read [`.cursor/skills/up-agents/SKILL.md`](.cursor/skills/up-agents/SKILL.md).
4. **State which skill(s) you used** when reporting results.

| Task hint | Skill |
|-----------|-------|
| Staggered worker pool + reviewer | `up-agents` |
| Branching fan-out research | `/pool-agents` command |

---

## Shell & commands

- **Prefer CMD over PowerShell.** Use `cmd /c "..."` for one-offs. PowerShell often hangs here.
- **Prefer one command at a time.** No `&&` / `||` chaining unless unavoidable.
- **Complex commands:** script in [`scratch/`](scratch/), run it, delete when done.
- **Package manager:** always **bun** and **bunx** (not npm, npx, or yarn).

### Build & demo

```bash
bun install
bun run build
python -m http.server 8080
```

---

## Project conventions

- **phone-frames:** plain CSS in `src/_*.css` — no SCSS for new `pf-*` code
- **Legacy devices.css:** SCSS partials in `src/_*.scss` — touch only for bug fixes
- **JS utilities:** root-level `iframe-scale.js`, `status-bar.js` — vanilla, no bundler
- **Customization:** CSS custom properties (`--pf-*`), not hardcoded theme values
- **Modularity:** one class = one job; presets are thin class aliases

---

## File ownership (up-agents)

When using `up-agents`, respect scoped paths:

| Worker | Owns |
|--------|------|
| W1 | Steering, `AGENTS.md`, `package.json`, `scripts/build.ts` |
| W2 | `src/_vars.css`, `_shell.css`, `_modifiers.css` |
| W3 | `src/_slots.css`, `_presets.css`, `_compat-devices.css`, `iframe-scale.js`, `status-bar.js` |
| Reviewer | `test.html`, integration fixes, screenshots |

One worker owns each path; others read-only.

---

## Debugging

- Try multiple approaches before giving up.
- Visual QA: open `test.html` via local HTTP server (not `file://`).
- Scratch debug files in `scratch/` — delete when finished.

---

## Subagent delegation

When spawning a subagent, **paste this block first:**

```
=== MANDATORY AGENT PREFERENCES (read and follow) ===

1. CONTEXT — Read at conversation start:
   - .repertoire/.steering/structure.md
   - .repertoire/.steering/tech.md
   - .repertoire/.steering/product.md
   - REQUIREMENTS.md

2. SKILLS — Use at least ONE skill from .cursor/skills/ (read SKILL.md in full).
   Parallel implementation → .cursor/skills/up-agents/SKILL.md

3. SHELL — Prefer CMD over PowerShell. One command at a time. Complex work → scratch/ script.

4. TOOLING — Use bun and bunx (not npm/npx/yarn).

5. CONVENTIONS — pf-* = plain CSS + CSS vars. Legacy .device-* = SCSS, read-only unless bugfix.

=== END PREFERENCES — task follows below ===
```

---

## up-agents notation

| User says | Meaning |
|-----------|---------|
| `up-agents` | 4 workers + 1 reviewer (defaults) |
| `up-agents 3 + 1` | 3 workers + 1 reviewer |
| `up-agents 4 + 1 @600` | reviewer sleeps 600s |

Full algorithm: [`.cursor/skills/up-agents/SKILL.md`](.cursor/skills/up-agents/SKILL.md)

---

## What NOT to do

- Do not refactor `docs/` legacy demo site in v1
- Do not add React/Vue wrappers
- Do not remove legacy `.device` classes
- Do not use node-sass or gulp for new work
- Do not edit `.env` files (none in this project)
