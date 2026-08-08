# Exploration: visual-identity-system

Codebase survey verifying where the settled design (DESIGN.md — "Multicolor Floating") lands. Design decisions are final; this phase only maps the surfaces, files, and contracts they touch.

## Current State

### 1. App shell (navbar/footer anchor)

- `src/app/app.html` (3 lines): shell is `main > router-outlet` ONLY. No header, nav, or footer anywhere. `src/app/app.css` (7 lines) is the entire neutral shell: `main { min-height: 100vh; background-color: #f9fafb; color: #111827; padding: 1.5rem; font-size: 1.25rem }`.
- `src/app/app.ts`: standalone `App`, imports only `RouterOutlet`; `title = signal('learning-log')` exists but is unused in the template.
- Insertion point: `App` template is the only node shared by every route (Home, PostDetail, admin EditorPage) — navbar + footer placed there appear on all pages in every render mode (home is prerendered via `**` → `RenderMode.Prerender`; detail + admin are `RenderMode.Server` in `src/app/app.routes.server.ts`). Static chrome + CSS-only motion → no hydration risk with active `provideClientHydration()` (`src/app/app.config.ts:10`).
- Existing shell test `src/app/app.spec.ts:17-22` asserts `router-outlet` presence only — must grow navbar/footer DOM assertions when the shell changes.

### 2. Surfaces

- **Home** (`src/app/pages/home/home.ts|html|css`): `.home` `max-width: 960px` (line 2), `.home__grid` `repeat(auto-fill, minmax(300px, 1fr))` gap 1.5rem (lines 26-29) — both carried forward verbatim by DESIGN.md. `.home__header` renders "Learning Loop" h1 (`home.html:3`) — brand that will duplicate the new navbar brand (dedup decision). Empty state exists (`No posts yet`).
- **PostCard** (`src/app/components/post-card/`): root `<article appTilt [routerLink]="['/post', slug]">`; cover `<div data-testid="post-cover" [style.background-color]="post().coverColor">` (`post-card.html:9`) — single inline hex, NOT a custom property. `post-card.css` today: `border-radius: 1rem` (line 4), hardcoded `background: white` (line 6), rest `box-shadow: 0 4px 24px rgba(0,0,0,0.08)` / hover `0 8px 40px rgba(0,0,0,0.12)` (lines 7-14), `transition: box-shadow .3s`, `will-change: transform`; tags `border-radius: 999px` pills (line 66); cover `height: 120px` (line 18). NO float animation, NO theme class, white body regardless of cover hue ("tinted at rest" is net-new; today only a 120px strip is colored).
- **PostDetail** (`src/app/pages/post-detail/post-detail.ts|html|css`): hero `<div class="post-detail__hero" [style.background-color]="post.coverColor">` (`post-detail.html:5`); title/date/tags hardcoded white + text-shadow (`post-detail.css:23-30, 41-50`); body via `<app-block-renderer [blocks]="post.body">` (line 21). `.post-detail` `max-width: 800px` (line 2), hero `border-radius: 12px` (line 8) — both carried forward. No tilt on this page (per post-detail spec). Latent contrast flaw today: white text on light seed covers (#4ECDC4, #45B7D1) — the theme's `--post-ink` role is what fixes this.

### 3. Block renderers

- `src/app/blocks/block-renderer.ts` — `@switch` dispatch to 4 renderers; `block-renderer.css` only `:host { display:flex; flex-direction:column; gap:1rem }`.
- All renderers (`src/app/blocks/renderers/*.ts`) are inline-template standalone components with NO `styleUrl`s (heading/paragraph/image have zero own styles). `code-renderer.ts:8` emits `<pre><code class="hljs language-…">`; highlight.js `github-dark` (dark bg, light text) is imported globally at `src/styles.css:1`.
- Zero CSS custom properties used anywhere in `src/` today (grep `var(--` → no matches). No theme classes.
- **Implication (verified mechanism):** Angular emulated encapsulation rewrites selectors, NOT custom-property flow — `var()` custom properties declared on a themed ancestor container cascade into descendant renderer DOM without touching renderer files. Caveat: `.hljs` sets explicit `background`/`color`, which overrides inheritance → code blocks will NOT pick up theme ink/surface and will clash inside light themes (see Risks).

### 4. Post model / service / editor (theme field)

- `src/app/models/post.model.ts` — `Post` interface: `id, title, slug, excerpt, createdAt: Date, tags: string[], coverColor: string, body: Block[]`. **NO `theme` field.** OpenSpec mirrors this exactly (`openspec/specs/post-listing/spec.md:13-24` field table).
- `src/app/services/post.service.ts` — signal with 3 seed posts (lines 8-160), distinct hardcoded `coverColor` hexes (#FF6B6B, #4ECDC4, #45B7D1); `getPosts` readonly; `getPostBySlug`; `addPost`; `updatePost(slug, post)` (line 175 — full Post replacement; NOTE: spec doc says `Partial<Post>`, code replaces whole Post → spec/code drift already exists); `deletePost`.
- **Editor flow** `src/app/pages/editor/editor.ts|html`: `metadataForm` (editor.ts:31-46) includes `coverColor: new FormControl('#FF6B6B')`; `editor.html:41-44` renders `<input id="coverColor" type="color" formControlName="coverColor">` — authors TODAY have a free-form color picker, which DESIGN.md explicitly forbids ("curated gallery only", Don't section). Edit patches coverColor at editor.ts:75; `save()` (144-180) maps metadata into a Post (line 163).
- Where `theme` lands: Post interface + seed data + editor metadataForm + editor.html picker UI + save()/patchValue mapping. The home cover strip and detail hero currently key off `coverColor` — the proposal must decide coexist vs replace (e.g., theme palette supplies bg/surface/ink/accent, coverColor retired or re-mapped to accent).

### 5. Motion / tilt / reduced-motion

- `src/app/directives/tilt.directive.ts` — the existing `appTilt`: Renderer2, `perspective 600px`, `maxTilt 15`, mousemove → `transform: perspective() rotateX() rotateY()`, mouseleave removes transform, unlisten cleanup (`ngOnDestroy`). Sets `transition: transform 0.1s ease-out` on move (line 44). Applied ONLY on PostCard root (`post-card.html:2`); tested via stubbed `getBoundingClientRect` (`tilt.directive.spec.ts:23-26`).
- ZERO other animation in `src/`: grep `prefers-reduced-motion | @keyframes | animation | @media` → no matches. Card float loop, ambient blobs, and any reduced-motion handling are all net-new; `prefers-reduced-motion` has never been referenced in the codebase. TiltDirective itself may need a `matchMedia('(prefers-reduced-motion: reduce)')` branch to satisfy "tilt degrades to a simple hover response without transform animation" — that is a directive change, not just CSS.

### 6. Test setup (testability of the design)

- Test command confirmed: `pnpm ng test --watch=false` (`openspec/config.yaml` test_command; `package.json` `test: ng test`). Builder `@angular/build:unit-test` (`angular.json:76`), Vitest 4 + jsdom 28, `vitest/globals` types (`tsconfig.spec.json`), `strict_tdd: true`.
- Component test pattern: `TestBed.configureTestingModule({ imports })` + `createComponent` + `setInput` + `detectChanges`; asserts via `querySelector`/`data-testid`/`textContent`. Precedent for style assertions: `post-card.spec.ts:59-66` asserts `style.backgroundColor` (jsdom converts hex→rgb).
- **CSS custom property testability:** jsdom 28 resolves `getComputedStyle(el).getPropertyValue('--x')` reliably for INLINE-set properties; stylesheet cascade of custom properties is only partially supported. Robust contract: assert the **theme class** on the container (e.g., `classList.contains('theme-solaris')`) plus optional computed-style checks only where reliable. The spec must pick the class as the observable.

### 7. SSR constraints

- `src/app/app.routes.server.ts`: `post/:slug`, `admin/new`, `admin/edit/:slug` → `RenderMode.Server` (dynamic params crash prerender — previously discovered and fixed); `**` → `RenderMode.Prerender` (covers `/` home).
- Adding app-level navbar/footer: renders in ALL modes (server + prerender) with zero routing changes — no SSR gotcha for static chrome. Constraints: (a) keep post-specific motion CSS-only (`@keyframes`) — no JS-driven per-card transform at bootstrap, or hydration mismatches; (b) theme typefaces need loading (index.html `<link>` or styles.css `@import`) — currently `src/index.html` has no font links, so themed typography on first paint is net-new (affects prerendered `<head>`).

## Affected Areas

- `src/app/app.html` — add navbar + footer chrome around `<main>`.
- `src/app/app.css` — neutral shell tokens (sky, ink, surface), sticky navbar, footer; `main` padding may move out of the way of a sticky header.
- `src/app/app.spec.ts` — shell DOM assertions (router-outlet, navbar brand, footer).
- `src/app/models/post.model.ts` — `theme` field (and coverColor fate).
- `src/app/services/post.service.ts` — seed posts gain theme values; distinct-coverColor spec assertions affected.
- `src/app/components/post-card/` — theme class on root, var() consumption, tinted-at-rest body, float loop; `post-card.spec.ts` updated.
- `src/app/pages/home/` — grid/header interplay; `home.spec.ts`.
- `src/app/pages/post-detail/` — themed hero + themed body container, blobs; `post-detail.spec.ts`.
- `src/app/pages/editor/` — coverColor picker → theme selector (form group, html, save/patch); `editor.spec.ts`.
- `src/app/directives/tilt.directive.ts` — reduced-motion branch; `tilt.directive.spec.ts`.
- `src/app/blocks/` — only if code-block theming is resolved (see Risks) — renderers currently untouched.
- `src/styles.css` — likely home of theme catalog CSS + keyframes (component style budgets).
- `src/index.html` — theme typeface loading.
- `openspec/specs/post-listing/spec.md` + `post-detail/spec.md` — field table and hero requirements change (delta specs).

## Approaches (landing-surface forks the proposal must settle — design already fixed the WHAT)

1. **coverColor coexistence** — keep `coverColor` (map to accent/cover strip) vs remove in favor of theme palette.
   - Pros of remove: single source of color truth (theme roles), kills the free-form picker DESIGN forbids; Pros of keep: smaller model migration.
   - Cons of remove: editor tests + seed data + card/detail bindings all migrate in one PR; Cons of keep: two competing color sources.
   - Effort: Medium (either way, editor + model + consumers change).
2. **Code-block theming** — minimal `code-renderer` stylesheet consuming `var()` vs global `.hljs` override vs keep github-dark island.
   - Pros of var() in renderer: true theme integration; Pros of global override: renderers untouched.
   - Cons: renderer file change breaks "renderers stay untouched"; global override can't be per-theme scoped cleanly — needs a scoping decision (`::ng-deep` is deprecated).
   - Effort: Low-Medium.
3. **Shell chrome placement** — navbar/footer directly in `App` template (only shared node) — no real alternative exists; validate only.

## Recommendation

Exploration confirms feasibility with no blockers. The settled design lands on five surfaces, all currently simple: a 3-line shell, white cards keyed off a single inline `coverColor`, unstyled renderers, a free-form editor color input, and one tilt directive with no reduced-motion awareness. The proposal should proceed directly to spec; it MUST carry forward the three decision forks above (coverColor, code blocks, home-header brand dedup) as explicit open questions.

## Risks

- **No `theme` field in `Post` model** — spec/proposal must add it and migrate seed data; `post-listing/spec.md` field table needs a delta. Existing `updatePost` signature (full Post replace) conflicts with spec's `Partial<Post>` — resolve during migration.
- **Editor free-form color picker is legal today** (`editor.html:43`) but DESIGN forbids it — replacing it changes existing editor tests (default `#FF6B6B`, `editor.ts:45`) and post.service.spec distinct-coverColor assertions.
- **highlight.js `github-dark` overrides theme vars** — code blocks will not inherit theme ink/surface inside light themes; "renderers stay untouched" needs an explicit resolution.
- **Component style budget**: `angular.json` production `anyComponentStyle` 4kB warn / 8kB error — 6 theme palettes (~24+ custom props) + keyframes in a component stylesheet can blow it; theme catalog belongs in `src/styles.css` or a dedicated global theme stylesheet.
- **Testability of CSS vars in jsdom** — stylesheet-cascade custom properties are unreliable; spec must observe the theme CLASS, not computed var() values.
- **Shell change breaks existing specs** — `app.spec.ts` router-outlet assertion, plus any home/detail tests asserting layout text; strict TDD requires spec updates in lockstep.
- **SSR/hydration** — keep motion CSS-only; JS-generated per-card transforms at bootstrap would mismatch hydration (`provideClientHydration` active). Fonts in `index.html` affect prerendered head (FOUC).
- **Brand duplication** — `.home__header` "Learning Loop" vs navbar brand; dedup affects `home.spec.ts`.

## Ready for Proposal

Yes — surfaces verified, forks enumerated, feasibility confirmed.