# Proposal: Visual Identity System ("Multicolor Floating")

## Intent

Per-post visual identity is the product's positioning (PRODUCT.md); today "identity" is one inline hex (`coverColor`) on an unstyled 3-line shell. DESIGN.md settles the WHAT: neutral sky shell, 6 per-post themes via CSS custom properties, rainbow home grid, themed detail, ambient motion. This change ships the visual system; the functional stack (blocks, editor flow, SSR routes, existing content) stays untouched.

## Scope

### In Scope

- Shell chrome: neutral navbar (brand + links) + footer in App template; sticky nav; accessible collapse.
- Theme system: 6-theme catalog + `--post-*` roles (bg/surface/ink/accent + font-display/body) + `.theme-*` classes in a global stylesheet; applied on PostCard and detail containers.
- `Post.theme` field + seed migration; rainbow-tinted home cards; themed detail hero + body.
- Floating motion: ambient blobs, card levitation, `prefers-reduced-motion` degradation (blobs/float static, tilt → simple hover).
- Editor: curated theme gallery replacing the free-form color input; theme catalog module powers picker tiles.
- Code-block theming via catalog; renderers untouched.

### Out of Scope

Content model / block changes; free-form author color picking; Tailwind / Three.js; editor flow beyond theme selection; routing or SSR-route changes; e2e/eslint specs.

## Capabilities

> Contract with sdd-spec — research done against `openspec/specs/` (post-listing, post-detail, block-editor, block-renderer, e2e-playwright, eslint-config).

### New Capabilities

- `app-shell`: navbar + footer on every page; neutral chrome; sticky nav; accessible collapse.
- `visual-themes`: 6-theme catalog (palettes + typefaces), `--post-*` role system, `.theme-<name>` application contract, global theme stylesheet, Legibility Floor, code-block overrides, catalog module.
- `floating-motion`: ambient blobs, card float loop, `prefers-reduced-motion` degradation, tilt reduced-motion branch.

### Modified Capabilities

- `post-listing`: Post plus `theme`, minus `coverColor`; "distinct cover colors" scenario → "distinct themes"; PostCard tinted at rest; home h1 dedup.
- `post-detail`: hero + body themed via `theme`; `coverColor` binding removed; latent white-on-light contrast flaw fixed by `--post-ink`.
- `block-editor`: `coverColor` control → `theme` gallery; `updatePost` partial-merge fixed to match its own spec (spec/code drift exists).

## Approach

- **Fork 1 — coverColor: REPLACE.** Theme is the single color source. Cover strip → `--post-accent`; detail hero → `--post-bg` + `--post-ink`. The free-form picker dies anyway (DESIGN forbids it; editor tests change regardless), and dual color sources would compete. One-time migration: model + seeds + editor + consumers.
- **Fork 2 — code blocks: catalog owns them, renderers untouched.** `.hljs` literal colors beat inherited vars. Theme class + `hljs` classes are real DOM classes, so the global catalog adds `.theme-<name> code.hljs` overrides: container → `--post-surface`/`--post-ink`; light themes get light-appropriate token colors; dark themes (Neon, Abyss) keep `github-dark` tokens. No `::ng-deep`, no renderer edits.
- **Fork 3 — brand dedup: navbar owns it.** Brand string appears exactly once (navbar was never an h1 — it is a branded link). Home h1 becomes an editorial page heading (copy via design); exactly one h1 per page. `home.spec.ts` assertion updates in lockstep.
- **Theme field:** required `theme: ThemeName` union; resolver falls back to `paper` for missing/unknown values (additive → safe rollback). Seeds: 3 distinct hexes → Solaris / Abyss / Neon.
- **Global stylesheet:** catalog + keyframes in `src/styles.css` — 6 themes × 6 roles plus keyframes far exceed the 4kB `anyComponentStyle` warn; never a component stylesheet.
- **SSR:** navbar/footer only in App template; static chrome + CSS-only motion → no hydration/prerender risk with active `provideClientHydration()`. Theme typefaces via `index.html` `<link>` with `display=swap` (affects prerendered head — net-new).
- **Testability:** the observable contract is the theme CLASS on the container (`classList.contains('theme-solaris')`); jsdom stylesheet-cascade `var()` resolution is unreliable (verified Vitest 4 + jsdom 28).
- **Conventions:** `input.required<T>()`, Signals, standalone components; strict TDD with specs updated in lockstep.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/app.html` / `app.css` / `app.ts` (+ `app.spec.ts`) | Modified | Navbar + footer chrome; neutral shell tokens; sticky nav |
| `src/app/models/post.model.ts` | Modified | `+theme: ThemeName`; `−coverColor` |
| `src/app/services/post.service.ts` (+ spec) | Modified | Seeds → distinct themes; `updatePost` partial-merge fix |
| `src/app/components/post-card/*` (+ spec) | Modified | Theme class, `var()` roles, float loop, tinted-at-rest body |
| `src/app/pages/home/*` (+ spec) | Modified | Rainbow grid, h1 dedup, empty state intact |
| `src/app/pages/post-detail/*` (+ spec) | Modified | Themed hero + body container, blobs |
| `src/app/pages/editor/*` (+ spec) | Modified | Theme gallery picker; form / save / patch mapping |
| `src/app/directives/tilt.directive.ts` (+ spec) | Modified | Reduced-motion branch (matchMedia, no transform) |
| `src/styles.css` | Modified | Theme catalog, `@keyframes`, reduced-motion block, code overrides |
| `src/index.html` | Modified | Themed typeface `<link>`s |
| `openspec/specs/{post-listing,post-detail,block-editor}` | Modified | Delta specs (field tables, scenarios) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Legacy/unknown `theme` values render unstyled | Med | Resolver falls back to `paper`; interface stays required |
| `github-dark` tokens clash inside light themes | Med | Per-theme token overrides in the catalog; dark themes keep `github-dark` |
| Component style budget (4kB warn / 8kB error) | Med | Catalog + keyframes global-only, never in a component |
| Editor/service/shell spec churn | High | Spec-first deltas in lockstep; strict TDD, no Standard Mode |

## Rollback Plan

- **Shell:** revert App template/css additions + spec assertions; zero route changes (chrome lives only in App).
- **Theme:** field is additive — unknown/missing theme → Paper fallback keeps every existing post readable. Full revert: restore `coverColor` + picker, drop field.
- **Motion:** CSS-only; deleting keyframes / media block restores static instantly, no hydration risk.
- **Global stylesheet:** single-file revert of `src/styles.css` + `index.html` font links.

## Dependencies

None external. Themed typefaces are design-time picks loaded via `<link>` (Google Fonts or system stacks — design resolves exact families).

## Success Criteria

- [ ] Rainbow grid: every home card tinted at rest with its post's palette; detail hero + body themed; shell stays neutral (Legibility Floor holds in every theme).
- [ ] `pnpm ng test --watch=false` green — spec deltas updated in lockstep (strict TDD).
- [ ] Reduced motion: blobs/levitation static, tilt degrades to simple hover.
- [ ] Editor exposes a curated 6-theme gallery; `coverColor` fully removed from model, service, UI.

## Delivery Note

Review budget 400 lines. Forecast ≈ 700–900 changed lines (catalog + keyframes ≈ 300 alone) → budget risk Medium-High; likely chained PRs in 3 slices (1: shell + model/theme field, 2: themed surfaces + motion, 3: editor picker). Slicing refined at tasks/design. Decision needed before apply: Yes.