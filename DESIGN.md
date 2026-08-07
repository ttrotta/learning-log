<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: Learning Log
description: A visual learning log where each post is a floating world of its own color and type.
---

# Design System: Learning Log

## Overview

**Creative North Star: "Multicolor Floating"**

Learning Log is a constellation of floating posts. The light neutral shell is the sky; each post is a self-contained world with its own palette and typography, suspended over the surface with soft levitation and drifting ambient color. The home page is the rainbow — cards are tinted at rest, so the identity of every post is visible at a glance. The detail page is an immersive but legible world: the theme reaches the hero AND the reading body.

The system is intentionally playful and colorful without sacrificing comprehension — the multicolor aesthetic serves the learning log by making each subject feel distinct, but legibility is the floor. Every post is a small proof that a page can be vivid and readable at the same time.

**Key Characteristics:**
- Shell chrome: a neutral **navbar** (brand + nav links) and **footer** (meta/links) present on every page, part of the quiet sky — never themed per post.
- Per-post themes: each post carries its own palette (4 color roles) and typography pairing (2 roles), applied via CSS custom properties.
- Light neutral base: the shell and home stay neutral so the colorful posts float as islands.
- Full palette per post: 4 roles (`--post-bg`, `--post-surface`, `--post-ink`, `--post-accent`) + 2 type roles (`--post-font-display`, `--post-font-body`).
- Predefined themes: a curated gallery (6 themes) the author chooses in the editor; no free-form author color picking.
- Floating motion: ambient background blobs (slow drift) + card levitation (float loop) + CSS-based tilt on hover.
- Reduced motion respected: `prefers-reduced-motion` degrades blobs and float to static; tilt remains a simple hover response.
- Cards tinted at rest on the home grid.
- Theme reaches hero + body in the detail page.

## Colors

The system has two color layers: a neutral shell (the sky) and per-post theme palettes (the worlds).

### Neutral

- **Sky Background** (`#f7f7f8`-class, exact value [to be resolved during implementation]): the app shell, home page background, and all non-themed chrome. It must stay quiet so themed cards pop.
- **Neutral Ink** (`#111827`-era, exact value [to be resolved during implementation]): base text on the neutral shell.
- **Neutral Surface** (white, exact value [to be resolved during implementation]): cards and panels that are not themed.

### Per-Post Theme Roles (4 roles, values established per theme during implementation)

- **`--post-bg`**: the post's ambient background color.
- **`--post-surface`**: card/panel surface within the post.
- **`--post-ink`**: the post's text color, always chosen for contrast against `--post-bg`.
- **`--post-accent`**: the post's signature accent for titles, links, tags, and highlights.

Theme roles are applied to a post container via a theme class (`.theme-<name>`); descendant components consume them through `var()` references, which inherit across Angular's component tree even with scoped CSS. Renderers stay untouched.

**Catalog (6 themes, palettes [to be resolved during implementation]):**

1. **Solaris** — amber/coral warm; creative posts.
2. **Abyss** — deep blue/teal, cold grotesque; serious technical posts.
3. **Neon** — dark violet + neon, mono display; code-heavy posts.
4. **Meadow** — fresh green + yellow, humanist; productivity/methods posts.
5. **Candy** — pink/violet pop, rounded display; light posts.
6. **Paper** — neutral with one accent, reading serif; long-form posts.

**Named Rules:**

**The Rainbow Grid Rule.** The home grid is the catalog: every card is tinted by its post's palette at rest. No neutral cards on the home page — the rainbow is the point.

**The Legibility Floor Rule.** Ink contrast against background is non-negotiable in every theme. A theme that sacrifices legibility for vividness fails the system.

## Typography

Each theme carries its own pairing: a display face and a body face. Both are applied through the per-post type roles (`--post-font-display`, `--post-font-body`).

**Character:** type is part of the per-post identity. A code-heavy post reads in a mono display; a long-form post settles into a reading serif. The neutral shell uses a workhorse system stack.

### Neutral Shell (base app)
- **Display / Body**: system stack [to be resolved during implementation].

### Per-Post Theme Roles
- **Display** (weight/size/clamp [to be resolved during implementation]): post title and heading emphasis; its personality identifies the post.
- **Body** (weight/size [to be resolved during implementation]): post content; must remain comfortable at reading lengths (target 65–75ch max line length).

**Named Rules:**

**The Type Carries the Theme Rule.** Typography is a first-class theme property, not a default: each theme names its own display/body pair, chosen to match the palette's mood.

## Layout

- Light neutral shell with a centered content column (current containers: home `max-width: 960px`, detail `max-width: 800px` — carry forward and refine during implementation).
- **Navbar** at the top of every page: brand identity on the left, navigation links (Home, Admin/New Post where applicable) on the right. Sticky, neutral, quiet. Mobile treatment collapses links behind a simple accessible pattern `[to be resolved during implementation]`.
- **Footer** at the bottom of every page: small neutral meta (project name, year, links). Never themed per post.
- Home: responsive rainbow grid of tinted cards (current `auto-fill, minmax(300px, 1fr)` pattern carries forward).
- Detail: themed hero above a themed reading body.
- Spacing rhythm and responsive breakpoints `[to be resolved during implementation]`.

## Elevation & Depth

The system is **lifted**: depth is the floating metaphor made literal.

- **Ambient depth:** drifting background blobs of theme color behind content (CSS animations, slow drift).
- **Card levitation:** cards float on a gentle vertical loop with soft shadows at rest.
- **Tilt interaction:** CSS-based 3D tilt on hover via existing custom directive pattern (`rotateX`/`rotateY`/`perspective`); no heavy 3D libraries.
- **Reduced motion:** under `prefers-reduced-motion`, blobs and float loops become static; tilt degrades to a simple hover response without transform animation.

**Named Rules:**

**The Float, Don't Fling Rule.** Floating motion is slow and ambient. Nothing zips, bounces aggressively, or fights the reading flow.

## Shapes

- Cards: gently rounded (current `border-radius: 1rem` pattern carries forward).
- Hero: softer corner treatment (current `12px` pattern carries forward).
- Tags/chips: pill-shaped (current `999px` pattern carries forward).
- Exact radius scale [to be resolved during implementation].

## Do's and Don'ts

### Do:
- **Do** apply theme roles via CSS custom properties on the post container, letting components inherit through `var()`.
- **Do** tint home cards at rest with their post's palette.
- **Do** extend the theme to the detail hero AND the reading body.
- **Do** respect `prefers-reduced-motion` by degrading blobs and float loops to static.
- **Do** keep ink contrast against background legible in every theme.
- **Do** preserve the functional stack: blocks, editor, SSR routes, and existing content stay untouched (per PRODUCT.md).

### Don't:
- **Don't** add free-form author color picking — themes come from the curated gallery only.
- **Don't** make the neutral shell compete with themed posts; the sky stays quiet.
- **Don't** put heavy 3D libraries (e.g., Three.js) behind the floating effects — CSS is the tool.
- **Don't** ship a theme that fails WCAG-ish contrast on body text.
- **Don't** reintroduce `@Input()` decorators — modern `input.required<T>()` remains the Angular convention (per PRODUCT.md).