# Tasks: Build Homepage

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250-350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr-default |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full homepage (model → service → directive → component → page) | PR 1 | `pnpm test -- --run` | `pnpm start` + navigate to `/`, verify cards + tilt | Revert all new files + restore modified home files via `git checkout` |

## Phase 1: Foundation (Model + Service)

- [x] 1.1 Create `src/app/models/post.model.ts` — `Post` interface with `id`, `title`, `slug`, `excerpt`, `createdAt`, `tags`, `coverColor`
- [x] 1.2 [RED] Write `src/app/services/post.service.spec.ts` — 3 tests: injectable, signal returns Post[] with Date instances, distinct coverColors
- [x] 1.3 [GREEN] Create `src/app/services/post.service.ts` — `@Injectable({ providedIn: 'root' })` with `signal<Post[]>.asReadonly()` + 3 mock posts

## Phase 2: Directive (TiltDirective)

- [x] 2.1 [RED] Write `src/app/directives/tilt.directive.spec.ts` — 4 tests: transform on mousemove, graceful degradation, Renderer2 usage, cleanup on destroy
- [x] 2.2 [GREEN] Create `src/app/directives/tilt.directive.ts` — standalone `[appTilt]`, `Renderer2` + `ElementRef`, `@HostListener('mousemove')` with `perspective(600px) rotateX/rotateY`

## Phase 3: Component (PostCard)

- [x] 3.1 [RED] Write `src/app/components/post-card/post-card.spec.ts` — 4+ tests: renders all fields, requires input, has appTilt directive, navigates via routerLink
- [x] 3.2 [GREEN] Create `src/app/components/post-card/post-card.ts` — standalone, `@Input({ required: true }) post: Post`, imports `[RouterLink, TiltDirective]`
- [x] 3.3 Create `src/app/components/post-card/post-card.html` — cover div with `coverColor` bg, title heading, excerpt, tag badges, formatted date
- [x] 3.4 Create `src/app/components/post-card/post-card.css` — border-radius, shadow, hover transitions

## Phase 4: Page Integration (Home)

- [x] 4.1 [RED] Update `src/app/pages/home/home.spec.ts` — 2 tests: renders N PostCards for mock posts, shows empty state
- [x] 4.2 [GREEN] Modify `src/app/pages/home/home.ts` — inject `PostService`, expose `readonly posts` signal
- [x] 4.3 Modify `src/app/pages/home/home.html` — `@for` over posts with `track post.id`, `@if` empty state, PostCard per post
- [x] 4.4 Modify `src/app/pages/home/home.css` — CSS grid layout with gap, responsive columns

## Phase 5: Integration Verification

- [x] 5.1 Run `pnpm test -- --run` — confirm all specs pass with exit code 0
