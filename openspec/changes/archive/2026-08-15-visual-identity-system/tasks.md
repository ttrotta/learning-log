# Tasks: Visual Identity System

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Slice A) → PR 2 (Slice B) → PR 3 (Slice C) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test cmd | Runtime harness | Rollback |
|------|------|-----------|------------------|-----------------|----------|
| 1 | Foundation: catalog, model, service, global CSS, fonts | PR 1 | `pnpm ng test --watch=false` (catalog, post.service) | N/A — jsdom can't resolve `var()`; contract is the theme class | revert catalog/model/service/styles.css/index.html |
| 2 | Shell: navbar, footer, App, home h1 | PR 2 | `pnpm ng test --watch=false` (app, navbar, footer, home) | N/A — static SSR-safe markup in component tests | revert navbar/footer dirs, app.*, home.html |
| 3 | Consumers + motion: card, detail, gallery, tilt | PR 3 | `pnpm ng test --watch=false` (post-card, post-detail, editor, tilt) | `pnpm dev` browser: tilt, reduce-motion, gallery | revert post-card/, post-detail/, editor.*, tilt |

## Phase 1: Slice A — Foundation

- [x] 1.1 RED `theme-catalog.spec.ts`: `resolveTheme('' | 'unknown')` → `'paper'`
- [x] 1.2 Create `src/app/theme/theme-catalog.ts`: `ThemeName` union, `THEMES` (6), `resolveTheme(unknown)`
- [x] 1.3 RED `post.model.ts`: `theme` accepts only ThemeName (additive; `coverColor` removal deferred to Slice C)
- [x] 1.4 Modify `post.model.ts`: `+theme?: ThemeName` (pure types; import from catalog)
- [x] 1.5 RED `post.service.spec.ts`: `updatePost('hello', { theme: 'neon' })` merges, keeps other fields; seeds have distinct themes
- [x] 1.6 Modify `post.service.ts`: seeds → Solaris/Abyss/Neon; `updatePost(slug, Partial<Post>)` spread-merge
- [x] 1.7 Add to `src/styles.css`: 6 `.theme-*` blocks (6 `--post-*` each), `blob-drift`/`card-float` keyframes, reduced-motion block, `.theme-* code.hljs` overrides
- [x] 1.8 Add typeface `<link>`s (preconnect + `display=swap`) to `src/index.html`

## Phase 2: Slice B — Shell Chrome

- [x] 2.1 RED navbar/footer specs: brand link (not h1), nav links, footer meta, no `.theme-*`
- [x] 2.2 Create `navbar/` + `footer/` standalone components (native `<details>`/`<summary>` collapse)
- [x] 2.3 RED `app.spec.ts`: router-outlet + navbar + footer, neutral (no theme class)
- [x] 2.4 Modify `app.html`/`app.css`/`app.ts`: chrome around `<router-outlet>`, ambient blobs, neutral shell tokens, sticky nav
- [x] 2.5 RED `home.spec.ts`: exactly one `h1` — editorial heading, not brand
- [x] 2.6 Modify `home.html`: editorial page `h1`, subtitle retained

## Phase 3: Slice C — Consumers + Motion

- [x] 3.1 RED `post-card.spec.ts`: root has `theme-<name>` class; no inline coverColor bg
- [x] 3.2 Modify post-card `ts|html|css`: `[class]="'post-card theme-' + resolveTheme(post().theme)"`, `var()` roles, tinted-at-rest, float loop, `appTilt` + routerLink intact
- [x] 3.3 RED `post-detail.spec.ts`: themed hero + `<app-block-renderer>` body; title/date use `--post-ink`
- [x] 3.4 Modify post-detail `html|css`: `.theme-<name>` container, hero `--post-bg`/`--post-ink`, no hardcoded white
- [x] 3.5 RED `editor.spec.ts`: gallery shows 6 themes, select sets `theme`, save writes `theme`, no color input
- [x] 3.6 Modify `editor.ts|html`: `theme: FormControl<ThemeName>('paper')` replaces `coverColor`; gallery tiles (`data-testid="theme-gallery"`); save/patch map `theme`
- [x] 3.7 RED `tilt.directive.spec.ts`: mock `matchMedia` reduce → mousemove applies no transform
- [x] 3.8 Modify `tilt.directive.ts`: reduced-motion branch skips transform; Renderer2 only

## Phase 4: Verification

- [x] 4.1 `pnpm ng test --watch=false` — all suites green (spec deltas in lockstep)
- [x] 4.2 `pnpm build` — type check + SSR compile pass
- [ ] 4.3 `pnpm dev` browser pass: reduced-motion + chrome (harness in Unit 3)
