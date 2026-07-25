## Exploration: Post Detail Page

### Current State

**Routing** (`src/app/app.routes.ts`): Single route mapping `''` to a lazy-loaded `Home` component via `loadComponent`. No `/post/:slug` route exists yet.

**Post Model** (`src/app/models/post.model.ts`): 7 fields — `id`, `title`, `slug`, `excerpt`, `createdAt`, `tags`, `coverColor`. Missing a `body` field for full article content and any optional metadata like `coverImage` or `readingTime`.

**PostService** (`src/app/services/post.service.ts`): Exposes `getPosts` as a `readonly Signal<Post[]>`. No `getPostBySlug()` method — consumers must filter themselves.

**PostCard** (`src/app/components/post-card/`): Standalone component with a required `post` input. The template already links to `/post/:slug` via `[routerLink]="['/post', post().slug]"`. Uses `appTilt`, `DatePipe`, renders coverColor background, title, excerpt, tags, date.

**Home Page**: Standalone lazy-loaded component using `inject(PostService)`, template uses `@for` with `track post.id` and `@if` empty state. CSS grid layout.

**SSR** (`src/app/app.routes.server.ts`): All routes set to `RenderMode.Prerender`. Express 5 with `AngularNodeAppEngine` handles SSR. No route-specific overrides.

**Key Observation**: PostCard routes to `/post/:slug` (singular), **not** `/posts/:slug` (plural) as mentioned in the mission description. The route path must match what PostCard already uses.

### Affected Areas

- `src/app/app.routes.ts` — add `{ path: 'post/:slug', loadComponent: ... }`
- `src/app/models/post.model.ts` — add `body` field (and optionally `coverImage`, `readingTime`)
- `src/app/services/post.service.ts` — add `getPostBySlug(slug: string): Post | undefined`
- `src/app/services/post.service.spec.ts` — add tests for `getPostBySlug`
- `src/app/pages/post-detail/post-detail.ts` — **new**: standalone component
- `src/app/pages/post-detail/post-detail.html` — **new**: detail page template
- `src/app/pages/post-detail/post-detail.css` — **new**: detail page styles
- `src/app/pages/post-detail/post-detail.spec.ts` — **new**: tests
- `src/app/app.routes.server.ts` — verify SSR route config works for `post/:slug`

### Approaches

1. **Lazy-loaded detail page (recommended)** — new standalone component loaded via `loadComponent` in routes, consistent with Home pattern.
   - Pros: Follows existing lazy-loading pattern, small initial bundle, consistent with Home page
   - Cons: Requires route config update (trivial)
   - Effort: Low

2. **Eager-loaded detail page** — import the component eagerly and add it to routes directly.
   - Pros: Slightly simpler, component is always available
   - Cons: Adds to initial bundle, inconsistent with existing pattern
   - Effort: Low

3. **Nested route under parent layout** — create a parent route with children for listing and detail.
   - Pros: Cleaner URL hierarchy for future expansion
   - Cons: Overengineered for current scale (only two pages), adds unnecessary nesting
   - Effort: Medium

### Recommendation

**Approach 1** — Lazy-loaded detail page. It matches the existing pattern (Home uses `loadComponent`), keeps the initial bundle lean, and is the standard Angular convention for page-level routes. The route path MUST be `post/:slug` (singular) to match what PostCard already uses.

**Model changes**: Add `body: string` to the `Post` interface for full content. Optionally add `coverImage?: string` and `readingTime?: number` for enhanced detail view.

**Service changes**: Add `getPostBySlug(slug: string): Post | undefined` as a simple method that finds by slug. Since mock data is synchronous, no async wrapping is needed yet. Future API integration can convert to `resource()` or `toSignal(httpClient.get(...))`.

**Visual approach**: Use the post's `coverColor` as a full-width hero background, display title, date, tags, then the full body below. Consistent multicolor floating theme.

### Risks

- **Route path mismatch**: The exploration mission says `/posts/:slug` but PostCard already uses `/post/:slug`. Must use the singular form to keep PostCard links working.
- **Mock data incompleteness**: Current mock posts have no `body` content. New mock data must include realistic body text for the detail view to render anything.
- **SSR prerendering**: `RenderMode.Prerender` for `**` means Angular will try to prerender `/post/:slug` at build time. Without known slugs at build time, this may fail or require switching to `RenderMode.Server` for that route. Need to verify.

### Ready for Proposal

Yes — the scope is well-defined, effort is small (~150-220 lines), and the approach is straightforward. The orchestrator should confirm the route path (`/post/:slug` vs `/posts/:slug`) with the user before proceeding.
