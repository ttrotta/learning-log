# Design: Build Homepage

## Technical Approach

Create a linear data pipeline — Post model → Signal-based PostService → PostCard presentational component → Home page integration — establishing the multicolor floating post listing. Each layer is independently testable. The Tilt directive adds CSS 3D interactivity via `Renderer2` for framework-safe DOM manipulation.

## Architecture Decisions

### Decision: Signals over RxJS for service state

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `BehaviorSubject` + `async` pipe | Mature, but heavier pipeline (subscription management, pipe operators) | ❌ |
| `Signal` + `asReadonly()` | Lighter, simpler for static mock data; native Angular 17+ reactivity | ✅ |

**Rationale**: The post data is immutable mock data loaded once. Signals provide a simpler API with no subscription lifecycle. If the service later fetches from an API, we can wrap `httpClient` calls with `toSignal()` or use `resource()` (Angular 19+) — the consumer API stays the same.

### Decision: Renderer2 over direct DOM access in TiltDirective

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `nativeElement.style` directly | Bypasses Angular's renderer; breaks SSR, breaks web workers | ❌ |
| `Renderer2.setStyle()` | SSR-safe, platform-agnostic, framework convention | ✅ |

**Rationale**: The spec explicitly requires Renderer2. Direct DOM manipulation is an anti-pattern in Angular — Renderer2 ensures the directive works in SSR, web workers, and testing environments without leaking platform-specific APIs.

### Decision: `inject()` over constructor DI

**Rationale**: Project convention. `inject()` avoids boilerplate constructor parameters and works better with property initialization in Standalone Components. Consistent with existing `App` component pattern.

### Decision: Separate mock data from service logic

**Choice**: Inline mock data inside `PostService`.
**Alternatives**: External JSON/MTS file.
**Rationale**: Simplifies TDD — tests import the service directly without mock file dependencies. The mock array is small (3 posts). Extraction can happen when the data source changes to an API.

## Data Flow

```
HomeComponent
  │
  ├─ inject(PostService)
  │     └─ posts = signal(mockData).asReadonly()
  │
  └─ @for (post of posts(); track post.id)
       └─ <app-post-card [post]="post" appTilt>
              │
              ├─ Renders: coverColor (bg), title, excerpt, tags, date
              └─ [routerLink]="/post/{{post.slug}}"
                    │
                    └─ Mousemove → TiltDirective
                           └─ Renderer2.setStyle(el, 'transform',
                                'perspective(600px) rotateX(...) rotateY(...)')
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/models/post.model.ts` | Create | `Post` interface — `id`, `title`, `slug`, `excerpt`, `createdAt`, `tags`, `coverColor` |
| `src/app/services/post.service.ts` | Create | `@Injectable({ providedIn: 'root' })` with `signal<Post[]>` + `asReadonly()` |
| `src/app/services/post.service.spec.ts` | Create | 3 tests: injectable, signal returns Post[], distinct coverColors |
| `src/app/components/post-card/post-card.ts` | Create | Standalone, `@Input({ required: true }) post: Post`, imports `[RouterLink, TiltDirective]` |
| `src/app/components/post-card/post-card.html` | Create | Cover div, heading, excerpt, tags badges, formatted date |
| `src/app/components/post-card/post-card.css` | Create | Card styling with border-radius, shadow, hover transitions |
| `src/app/components/post-card/post-card.spec.ts` | Create | 4+ tests: renders fields, requires input, has appTilt, navigates on click |
| `src/app/directives/tilt.directive.ts` | Create | `[appTilt]` standalone, `Renderer2` + `ElementRef`, `@HostListener('mousemove')` |
| `src/app/directives/tilt.directive.spec.ts` | Create | 4+ tests: transform on mousemove, graceful degradation, Renderer2 usage, cleanup |
| `src/app/pages/home/home.ts` | Modify | Inject `PostService`, expose `readonly posts = inject(PostService).getPosts` |
| `src/app/pages/home/home.html` | Modify | `@for` with `track post.id`, `@if` empty state, PostCard per post |
| `src/app/pages/home/home.css` | Modify | CSS grid layout with gap, responsiveness |
| `src/app/pages/home/home.spec.ts` | Modify | Update tests: renders PostCards for mock posts, shows empty state |

## Interfaces / Contracts

```typescript
// src/app/models/post.model.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: Date;
  tags: string[];
  coverColor: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | PostService | `TestBed.inject(PostService)` → assert signal returns `Post[]`, distinct colors, `Date` instances |
| Unit | PostCard | Create component with `TestBed`, set `post` input, query DOM for cover bg, title, excerpt, tags, date, `routerLink` |
| Unit | TiltDirective | Create host via `TestBed`, dispatch `mousemove`, assert transform via `Renderer2.setStyle`, verify cleanup on destroy |
| Integration | Home page | `TestBed` with `PostService`, verify `@for` renders N cards, mock empty array → assert empty message |

## Threat Matrix

N/A — no routing changes, no shell commands, no subprocesses, no VCS/PR automation, no executable-file classification, no process-integration boundary. The existing lazy-loaded home route stays unchanged.

## Migration / Rollout

No migration required. All new files; existing `home.ts`/`home.html`/`home.css` are overwritten; existing `home.spec.ts` is updated.

## Open Questions

None.
