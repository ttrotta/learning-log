# Proposal: Post Detail Page

## Intent

Users clicking a PostCard on the home page need a dedicated page to read the full article. Currently there's no `/post/:slug` route — clicking a card would navigate to a 404. This change closes that gap with a lazy-loaded PostDetail page using the same pattern as Home.

## Scope

### In Scope
- Add `body: string` to the `Post` model for full article content
- Add `getPostBySlug(slug: string): Post | undefined` to `PostService`
- Create lazy-loaded `PostDetail` page (component, template, styles, tests)
- Register `post/:slug` route in `app.routes.ts`
- Update mock posts with realistic body texts
- Cover not-found state: render "Post not found" for missing slugs

### Out of Scope
- `coverImage` / `readingTime` optional fields — deferred
- Nested routing or parent layout — overengineered at current scale
- API integration — stays synchronous mock; future API layer can convert to `resource()`
- SSR prerendering analysis — verified during design phase
- Related posts or post-to-post navigation — deferred

## Capabilities

### New Capabilities
- `post-detail`: Viewing individual post content at `/post/:slug`, with hero header (cover color background, title, date, tags) and full body rendering.

### Modified Capabilities
- `post-listing`: `Post` model gains `body: string` field. Existing fields unchanged. All existing specs remain valid.

## Approach

Lazy-loaded `PostDetail` component via `loadComponent`, matching the Home pattern. Component injects `PostService`, calls `getPostBySlug()` using the route slug param, and renders a hero header with `coverColor` background followed by the full body. Missing slug shows a "Post not found" fallback. Uses `inject()` DI, standalone config, Signals, and native `@if` control flow — consistent with existing conventions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/models/post.model.ts` | Modified | Add `body: string` field |
| `src/app/services/post.service.ts` | Modified | Add `getPostBySlug()` method |
| `src/app/services/post.service.spec.ts` | Modified | Add `getPostBySlug` tests |
| `src/app/pages/post-detail/post-detail.ts` | New | Standalone component |
| `src/app/pages/post-detail/post-detail.html` | New | Template with hero + body |
| `src/app/pages/post-detail/post-detail.css` | New | Post detail styles |
| `src/app/pages/post-detail/post-detail.spec.ts` | New | Tests |
| `src/app/app.routes.ts` | Modified | Add `post/:slug` lazy route |
| `src/app/app.routes.server.ts` | Modified | Verify SSR route config |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSR prerender fails for dynamic `/post/:slug` | Medium | Switch route to `RenderMode.Server` in design phase |
| Route param name mismatch | Low | Param is `slug` — matches PostCard `[routerLink]` exactly |

## Rollback Plan

Revert the route addition in `app.routes.ts`, delete `src/app/pages/post-detail/`, revert `body` from `post.model.ts`, revert `getPostBySlug` from `post.service.ts`. Pure additive change — no data migration.

## Dependencies

None. All changes self-contained.

## Success Criteria

- [ ] `pnpm test -- --run` exits with code 0
- [ ] Clicking a PostCard navigates to `/post/{slug}` and shows full post content
- [ ] Navigating to an unknown slug shows "Post not found"
- [ ] Change stays under 400-line review budget
