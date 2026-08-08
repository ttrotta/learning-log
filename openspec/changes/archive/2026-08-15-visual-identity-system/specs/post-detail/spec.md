# Delta for post-detail

## MODIFIED Requirements

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