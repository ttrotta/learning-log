# Tasks: Post Detail Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150–220 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full PostDetail page (model, service, component, route wiring) | PR 1 | `pnpm test -- --run` | Navigate to `/post/getting-started-angular-signals` in dev server | Revert route addition in `app.routes.ts`/`app.routes.server.ts`/`app.config.ts`, delete `pages/post-detail/`, revert `body` + `getPostBySlug` in model/service |

## Phase 1: Foundation — Model & Service (TDD)

- [x] 1.1 RED: Add type-lock test in `post.service.spec.ts` — Post interface includes `body: string`
- [x] 1.2 RED: Add `getPostBySlug` tests in `post.service.spec.ts` — known slug returns post with body; unknown slug returns undefined
- [x] 1.3 GREEN: Add `body: string` to `Post` model, implement `getPostBySlug(slug)` lookup, add body content to all mock posts

## Phase 2: Core Implementation — PostDetail Component (TDD)

- [x] 2.1 RED: Create `post-detail.spec.ts` — valid slug renders hero (title, coverColor bg, date, tags, body); not-found shows "Post not found"; signal with `@if` conditional verified
- [x] 2.2 GREEN: Create standalone `PostDetail` component (`post-detail.ts` with `input.required('slug')` + `computed()` lookup, `post-detail.html` with hero + body + `@if` not-found, `post-detail.css` with coverColor hero bg + readable body typography)

## Phase 3: Integration — Route & SSR Wiring (TDD)

- [x] 3.1 RED: Add route navigation test to `post-detail.spec.ts` — `RouterTestingHarness` navigates to `/post/{slug}` and renders PostDetail
- [x] 3.2 GREEN: Add `post/:slug` lazy route via `loadComponent` in `app.routes.ts`, `withComponentInputBinding()` in `app.config.ts`, `RenderMode.Server` entry for `post/:slug` before `**` wildcard in `app.routes.server.ts`

## Phase 4: Verification

- [x] 4.1 Run `pnpm test -- --run` — all 10+ specs pass with exit code 0
