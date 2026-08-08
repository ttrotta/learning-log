# Design: Visual Identity System ("Multicolor Floating")

## Technical Approach

Implement the settled DESIGN.md as: (1) a global theme catalog of 6 `.theme-<name>` classes defining `--post-*` roles in `src/styles.css`, driven by a new `Post.theme` field resolved to a container class; (2) neutral navbar/footer shell chrome in the `App` template; (3) CSS-only floating motion (keyframes + existing `appTilt` directive) with a `prefers-reduced-motion` branch; (4) a curated theme gallery in the editor replacing the free-form `coverColor` picker. Functional stack (blocks, renderers, routes, SSR) stays untouched. Reference: `openspec/specs/visual-identity-system/spec.md` + deltas (post-listing, post-detail, block-editor).

## Architecture Decisions

### Decision: Theme catalog placement & binding
| Option | Tradeoff | Decision |
|---|---|---|
| Catalog in component stylesheet | 6 themes × 6 roles + keyframes exceeds 4kB `anyComponentStyle` warn (angular.json:48-50) | **Global `src/styles.css`** |
| Catalog in theme module TS | No CSS generated | TS module exports catalog *metadata* only; CSS stays global |

New module `src/app/theme/theme-catalog.ts`: `ThemeName` union (solaris, abyss, neon, meadow, candy, paper), `THEMES` array (name, label, blurb — powers gallery tiles), and `resolveTheme(v: unknown): ThemeName` mapping missing/unknown → `'paper'` (explicit default fallback, so legacy posts render styled). Container binds the resolved class:

```html
<!-- PostCard root -->
<article appTilt [routerLink]="['/post', post().slug]"
        [class]="'post-card theme-' + resolveTheme(post().theme)">
```
PostDetail container: `[class]="'post-detail theme-' + resolveTheme(post.theme)"` inside `@if (post(); as post)`. Rationale: dynamic class keys need the full string bound, not `[class.x]`; `resolveTheme` in the template is pure/idempotent and keeps one fallback source. Interface `theme` stays required (spec), resolver guards runtime.

### Decision: Role consumption map
| Role | Home card | Detail hero | Detail body | Tags | Headings | Body copy |
|---|---|---|---|---|---|---|
| `--post-bg` | — | hero bg | — | — | — | — |
| `--post-surface` | card bg (tinted at rest) | — | reading surface | — | — | — |
| `--post-ink` | text | title/date | text | — | — | body text |
| `--post-accent` | cover strip | — | — | pill bg | — | — |
| `--post-font-display` | title | title | headings | — | display font | — |
| `--post-font-body` | excerpt | — | body font | — | — | body font |

Angular emulated encapsulation rewrites **selectors**, not custom-property flow — `var()` declarations on a themed ancestor cascade into descendant renderer DOM without touching renderer files (verified in exploration §3). No `::ng-deep` anywhere.

### Decision: Shell chrome
Standalone `NavbarComponent` (`src/app/components/navbar/`) + `FooterComponent` (`src/app/components/footer/`) placed in `app.html` around `<main><router-outlet>`. App template markup is the only node shared by every route → chrome renders in all SSR modes (detail/admin = RenderMode.Server, home = Prerender) with zero route changes. Mobile collapse uses a native `<details>`/`<summary>` disclosure — accessible, keyboard-operable, SSR-safe, no JS, and the desktop media query forces it open. Brand is a link, never an `h1`. Home `h1` becomes an editorial heading (new copy, e.g. "A floating log of things I'm learning"); subtitle retained. `app.spec.ts` router-outlet assertion stays and gains navbar/footer assertions. Exactly one `h1` per page enforced in spec + tests.

### Decision: Post.theme field & migration
`post.model.ts`: remove `coverColor`, add `theme: ThemeName` (imported from catalog module; model stays pure types). Seeds migrate to distinct themes — Solaris / Abyss / Neon per proposal. `updatePost` signature corrected to `updatePost(slug: string, changes: Partial<Post>)` merging `{ ...p, ...changes }`:
| Option | Tradeoff | Decision |
|---|---|---|
| Full replace (current code) | Wipes untouched fields; contradicts its own spec (drift) | **Partial merge** |
| Partial merge | Editor passing full Post still works (full Post ⊳ Partial) | chosen |

Rationale: matches the documented contract, prevents body/slug loss on a theme-only edit, and stays backward-compatible with the editor's current full-Post save call.

### Decision: Editor theme gallery
Metadata form is inline in `editor.ts:31` (no separate metadata component; `src/app/utils/block-form.ts` handles content blocks only — untouched). Replace `coverColor: FormControl('#FF6B6B')` with `theme: FormControl<ThemeName>('paper')`. `editor.html:41-44` color input → gallery of 6 tiles from `THEMES` (`data-testid="theme-gallery"`, one `input type="radio"` or button per theme styled as a swatch + name). `save()` maps `theme`; patchValue maps `theme` on edit. `coverColor` fully removed.

### Decision: Code-block theming
Global `.theme-<name> code.hljs` overrides appended after the `github-dark` import in `styles.css` (specificity `0,3,1` > `.hljs` `0,1,0`): island bg/surfaces use `--post-surface`/`--post-ink`; light themes (solaris, meadow, candy, paper) get light token palettes; dark themes (neon, abyss) keep `github-dark`. Renderers and `block-renderer.ts` untouched; real DOM classes make `::ng-deep` unnecessary.

### Decision: Floating motion (CSS-only)
- Ambient blobs: 2–3 blurred radial divs in the app shell background layer, `@keyframes blob-drift` (slow 18–30s alternate drift).
- Card levitation: `.post-card { animation: card-float 6s ease-in-out infinite }`.
- Tilt: `appTilt` gains a browser-guarded `matchMedia('(prefers-reduced-motion: reduce)')` check; when reduce is active it skips transform application (simple hover shade stays via CSS `:hover` box-shadow).
- Keyframes + reduced-motion block (`animation: none`) live in `src/styles.css`. CSS-only ⇒ no bootstrap DOM mutation ⇒ no hydration mismatch under `provideClientHydration()`.
- Themed typefaces load via `<link rel="preconnect">` + `<link>` with `display=swap` in `index.html` head.

## Data Flow

```
PostService(posts signal) ── Post.theme ──> PostCard/Detail template
      │                                          │
      │ (updatePost partial-merge)      [class]="'… theme-' + resolveTheme(theme)"
      ▼                                          ▼
editor gallery ─> metadataForm.theme ──> Post ──> container.theme-<name>
                                                      │ var(--post-*) inheritance
                                                      ▼
                                                    descendants (renderers)
```
Editor: tile click → `theme` FormControl → `save()` → `updatePost(slug, partial)` → signal → card/detail class binding → global catalog paints roles.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/theme/theme-catalog.ts` | Create | `ThemeName`, `THEMES`, `resolveTheme()` + spec |
| `src/app/components/navbar/` | Create | Navbar component (+ spec) |
| `src/app/components/footer/` | Create | Footer component (+ spec) |
| `src/styles.css` | Modify | 6 theme blocks, keyframes, reduced-motion, code.hljs overrides |
| `src/index.html` | Modify | Themed typeface `<link>`s (`display=swap`) |
| `src/app/app.html` / `app.css` / `app.ts` (+spec) | Modify | Navbar/footer chrome, ambient layer, neutral shell tokens |
| `src/app/models/post.model.ts` | Modify | `−coverColor`, `+theme: ThemeName` |
| `src/app/services/post.service.ts` (+spec) | Modify | Seeds → distinct themes; `updatePost` partial merge |
| `src/app/components/post-card/*` (+spec) | Modify | Theme class, tinted-at-rest surface, float loop |
| `src/app/pages/home/*` (+spec) | Modify | Editorial h1, h1 dedup |
| `src/app/pages/post-detail/*` (+spec) | Modify | Themed hero + body container (`--post-ink`, no white-on-light) |
| `src/app/pages/editor/editor.ts|html` (+spec) | Modify | Theme gallery, save/patch mapping |
| `src/app/directives/tilt.directive.ts` (+spec) | Modify | Reduced-motion branch |

## Interfaces / Contracts

```ts
// src/app/theme/theme-catalog.ts
export type ThemeName = 'solaris' | 'abyss' | 'neon' | 'meadow' | 'candy' | 'paper';
export const THEMES: { name: ThemeName; label: string; blurb: string }[];
export function resolveTheme(value: unknown): ThemeName; // unknown → 'paper'

// post.model.ts
import type { ThemeName } from '../theme/theme-catalog';
theme: ThemeName;   // replaces coverColor: string
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | `resolveTheme` fallback (missing/unknown→paper) | New `theme-catalog.spec.ts` |
| Unit | `updatePost` partial merge (theme-only edit leaves other fields) | `post.service.spec.ts` |
| Unit | `appTilt` reduced-motion branch (skip transform) | `tilt.directive.spec.ts` (mock `matchMedia`) |
| Integration | Theme CLASS observable `classList.contains('theme-<name>')` on card/detail root (jsdom var() cascade unreliable) | `post-card.spec.ts`, `post-detail.spec.ts` |
| Integration | Shell chrome (router-outlet + navbar + footer, no `.theme-*`) | `app.spec.ts` + navbar/footer specs |
| Integration | Home exactly one editorial `h1`; gallery renders 6 themes; Save writes `theme` | `home.spec.ts`, `editor.spec.ts` |

Specs updated in lockstep (strict TDD): `app`, `post-card`, `post-detail`, `editor`, `post.service`, `home`, `tilt.directive`.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Route table (`app.routes.ts`, `app.routes.server.ts`) is unchanged.

## Migration / Rollout

One-time source migration (model + seeds + editor + consumers) — no persisted data store. Field additive; `resolveTheme` fallback makes rollback safe (full revert restores `coverColor` + picker).

## Open Questions

- [ ] Exact palette/typeface values per theme + neutral shell tokens (design-time picks; resolved in implementation, recorded in task).
- [ ] Editorial home `h1` copy.
- [ ] Delivery strategy (review budget 400 lines; forecast ≈ 700–900) to be resolved at `sdd-tasks`.