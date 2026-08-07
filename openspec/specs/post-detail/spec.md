# Post Detail Specification

## Purpose

Provide a dedicated page for reading individual post content at `/post/:slug` with a hero header and full body rendering, matching the home page's visual identity.

---

## Requirements

### Requirement: Route Definition

The system MUST define a lazy-loaded route at `post/:slug` in `src/app/app.routes.ts`.

- MUST use `loadComponent` (not eager import)
- Path MUST be `post/:slug` where `:slug` is the route parameter
- MUST be part of the existing `routes` array

#### Scenario: Route loads PostDetail lazily with slug param
- GIVEN the routes config
- WHEN navigating to `/post/getting-started-angular-signals`
- THEN the `PostDetail` component SHALL render
- AND the slug param SHALL equal `"getting-started-angular-signals"`

#### Scenario: Route rejects bare /post without slug
- GIVEN the routes config
- WHEN navigating to `/post`
- THEN the `post/:slug` route SHALL NOT match

---

### Requirement: PostDetail Component

The system MUST provide a standalone `PostDetail` component at `src/app/pages/post-detail/post-detail.ts` rendering the full post.

- MUST be standalone (no NgModule)
- MUST inject `PostService` via `inject()`
- MUST read the slug param via `input.required<string>()` + `withComponentInputBinding()` or `ActivatedRoute`
- MUST call `getPostBySlug(slug)` and store in a `Signal<Post | undefined>`
- Template MUST use `@if` (not `*ngIf`)
- Themed container: the hero and the reading body MUST live in a `.theme-<name>` container matching `post.theme`, consuming `--post-*` roles via `var()`
- Hero section: themed background via `--post-bg`, title/date via `--post-ink`, tag badges via `--post-accent`; no hardcoded white text (fixes the white-on-light contrast flaw on light themes)
- Body section: MUST render `post.body` via `<app-block-renderer>` passing `[blocks]="post.body"` instead of raw text interpolation, inside the themed reading body
- No tilt directive on this page

(Previously: hero used `[style.background-color]="post.coverColor"` with hardcoded white text + text-shadow; body had no themed container; no theme class)

#### Scenario: PostDetail renders themed hero with post data

- GIVEN a valid slug param for a post with `theme === 'meadow'`
- WHEN the component renders
- THEN the DOM SHALL contain a hero with class `theme-meadow`
- AND SHALL contain an h1 title, formatted date, and tag badges (accent-styled)
- AND SHALL contain an `<app-block-renderer>` element for the themed body

#### Scenario: PostDetail hero uses theme ink for legibility

- GIVEN a rendered PostDetail for a post with a light theme
- WHEN the hero's text color is inspected
- THEN the title and date SHALL use `--post-ink` (not a hardcoded white)
- AND SHALL remain legible against `--post-bg`

#### Scenario: PostDetail uses signal with @if
- GIVEN the component
- WHEN inspected
- THEN post data SHALL be a `Signal<Post | undefined>` with `@if` for conditional rendering

#### Scenario: PostDetail delegates body rendering to BlockRendererComponent
- GIVEN a rendered PostDetail for a post with a heading block and a paragraph block
- WHEN the DOM is inspected
- THEN the `<app-block-renderer>` element SHALL contain a rendered heading with correct level and text
- AND SHALL contain a rendered paragraph with correct text

---

### Requirement: Not-Found State

The system MUST display "Post not found" when `getPostBySlug` returns `undefined`.

- MUST render "Post not found" text
- MUST NOT render hero or body section
- MUST NOT throw or log errors
- MUST NOT redirect

#### Scenario: Invalid slug shows not-found
- GIVEN a PostDetail component with slug `"non-existent-slug"`
- WHEN it renders
- THEN `getPostBySlug` SHALL return `undefined`
- AND DOM SHALL contain "Post not found"
- AND no post content or console errors SHALL appear

---

### Requirement: SSR Route Configuration

The system MUST configure SSR rendering for `post/:slug` in `src/app/app.routes.server.ts`.

- MUST add `ServerRoute` with `path: 'post/:slug'` and `RenderMode.Server`
- Existing `**` with `RenderMode.Prerender` MUST remain
- Post route MUST appear before the wildcard

#### Scenario: SSR has post route before wildcard
- GIVEN the server routes config
- WHEN inspected
- THEN `serverRoutes` SHALL contain `'post/:slug'` with `RenderMode.Server` before `**`

#### Scenario: Existing wildcard unchanged
- GIVEN the server routes config
- WHEN inspected
- THEN `**` SHALL remain with `RenderMode.Prerender`

---

### Requirement: Test Coverage

The `PostDetail` component MUST have a test file at `src/app/pages/post-detail/post-detail.spec.ts` with ≥3 scenarios (Vitest + jsdom), including not-found coverage.

#### Scenario: All post-detail specs pass
- GIVEN the test file for PostDetail
- WHEN `pnpm test -- --run`
- THEN all PostDetail scenarios SHALL pass with exit code 0

#### Scenario: Post-detail tests cover not-found
- GIVEN `post-detail.spec.ts`
- WHEN inspected
- THEN it SHALL contain at least one test for unknown slug state
