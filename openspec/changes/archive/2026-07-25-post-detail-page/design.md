# Design: Post Detail Page

## Technical Approach

Lazy-loaded `PostDetail` page registered via `loadComponent` at `post/:slug`. Route param `slug` is bound to a component input using `withComponentInputBinding()`. A `computed()` signal looks up the post from `PostService.getPosts()` by matching slug. The template renders a hero header using `post.coverColor` as background, then the full body. Invalid slugs show an inline "Post not found" fallback. SSR uses `RenderMode.Prerender` (static mock data, all slugs known at build).

## Architecture Decisions

### Route param access: `withComponentInputBinding()` + `input.required`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `input.required()` with `withComponentInputBinding()` | Declarative, reactive, no DI ceremony. Works with SSR. Requires enabling the feature in `provideRouter`. | **Chosen** — matches modern Angular practices, integrates cleanly with signals |
| `ActivatedRoute.snapshot.paramMap.get('slug')` | Imperative, couples component to router internals, requires `ngOnInit` or manual signal wiring | Rejected — more boilerplate, less reactive |

### Data fetching: `computed()` lookup

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `computed(() => posts().find(...))` | Reactive — slug input or posts signal changes recompute automatically | **Chosen** — zero lifecycle hooks, pure signal chain |
| Lifecycle hook (`ngOnInit`) calling `getPostBySlug()` | Imperative, requires manual state variable, breaks if posts change later | Rejected — less reactive, more ceremony |

### SSR strategy: `RenderMode.Prerender`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `RenderMode.Prerender` | Static generation at build time. Works now (all slugs known). Must be revisited when posts become dynamic. | **Chosen** — matches existing `**` config, no server runtime needed |
| `RenderMode.Server` | Dynamic SSR per request. Handles any slug, including unknown ones. Adds server rendering cost. | Rejected — overengineering for current scale |

### Component structure: Single component

Single `PostDetail` standalone component with BEM sections (`post-detail__hero`, `post-detail__body`). No sub-components — the page has two clear visual sections but is too simple to warrant decomposition. Revisit if body rendering grows complex (e.g., block editor renderer).

### Not-found state: Inline `@if`

`@if (post(); ...) { @if (post(); ...) { hero + body } @else { "Post not found" } }`. No redirect — keeps the URL intact for debugging and avoids unnecessary router navigation for a purely data-driven empty state.

## Data Flow

```
User clicks PostCard
       │
       ▼
Router navigates to /post/{slug}
       │
       ▼
PostDetail created ─── slug input ────┐
       │                                │
       ▼                                ▼
PostService.getPosts() ──→ computed() ──→ post | undefined
       │
       ▼
Template: @if (post()) → hero + body
          @else        → "Post not found"
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/models/post.model.ts` | Modify | Add `body: string` field |
| `src/app/services/post.service.ts` | Modify | Add `getPostBySlug(slug)`, add `body` to mock posts |
| `src/app/services/post.service.spec.ts` | Modify | Add `getPostBySlug` tests |
| `src/app/pages/post-detail/post-detail.ts` | Create | Standalone component, `input.required('slug')`, `computed()` |
| `src/app/pages/post-detail/post-detail.html` | Create | Hero header + body + not-found fallback |
| `src/app/pages/post-detail/post-detail.css` | Create | Hero background, readable typography body |
| `src/app/pages/post-detail/post-detail.spec.ts` | Create | Component tests |
| `src/app/app.routes.ts` | Modify | Add `post/:slug` lazy route |
| `src/app/app.routes.server.ts` | Modify | Add explicit `post/:slug` entry with `RenderMode.Prerender` |
| `src/app/app.config.ts` | Modify | Add `withComponentInputBinding()` to `provideRouter` |

## Interfaces / Contracts

The slug input contract uses Angular's `withComponentInputBinding()`: the route param name `slug` must match the component input name. `PostCard` already uses `[routerLink]="['/post', post().slug]"` — no change needed.

No new TypeScript interfaces. The `Post` model gains one field:

```typescript
export interface Post {
  // ... existing fields
  body: string;  // new
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `PostService.getPostBySlug()` | Existing mock data — test found and not-found cases |
| Integration | `PostDetail` component | `TestBed` + `provideRouter` (with `withComponentInputBinding`) — test render with valid slug, render with invalid slug |
| Integration | Route navigation | `RouterTestingHarness` — test that navigating to `/post/{slug}` renders the component |

## Threat Matrix

N/A — the change touches only declarative Angular framework routing (URL param binding). No shell commands, subprocesses, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Additive change: new route, new component, new field on `Post` with default body values in mock data. Existing Home page and PostCard unaffected.

## Open Questions

None.
