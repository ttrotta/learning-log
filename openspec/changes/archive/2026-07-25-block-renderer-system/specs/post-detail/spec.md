# Delta for Post Detail

## MODIFIED Requirements

### Requirement: PostDetail Component

The system MUST provide a standalone `PostDetail` component at `src/app/pages/post-detail/post-detail.ts` rendering the full post.

- MUST be standalone (no NgModule)
- MUST inject `PostService` via `inject()`
- MUST read the slug param via `input.required<string>()` + `withComponentInputBinding()` or `ActivatedRoute`
- MUST call `getPostBySlug(slug)` and store in a `Signal<Post | undefined>`
- Template MUST use `@if` (not `*ngIf`)
- Hero section: `coverColor` background div, `<h1>` title, formatted date, tag badges
- Body section: MUST render `post.body` via `<app-block-renderer>` passing `[blocks]="post.body"` instead of raw text interpolation
- No tilt directive on this page
(Previously: body section rendered `post.body` as raw text content via `{{ post.body }}`)

#### Scenario: PostDetail renders hero with post data

- GIVEN a valid slug param
- WHEN the component renders
- THEN DOM SHALL contain: coverColor background, h1 title, formatted date, tag badges
- AND SHALL contain an `<app-block-renderer>` element

#### Scenario: PostDetail uses signal with @if

- GIVEN the component
- WHEN inspected
- THEN post data SHALL be a `Signal<Post | undefined>` with `@if` for conditional rendering

#### Scenario: PostDetail delegates body rendering to BlockRendererComponent

- GIVEN a rendered PostDetail for a post with a heading block and a paragraph block
- WHEN the DOM is inspected
- THEN the `<app-block-renderer>` element SHALL contain a rendered heading with correct level and text
- AND SHALL contain a rendered paragraph with correct text
