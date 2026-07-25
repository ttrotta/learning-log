# Proposal: Build Homepage

## Intent

The application has no real content — only a bare AppComponent with RouterOutlet and an empty Home route. This change brings the homepage to life with a post listing that establishes the "multicolor floating" visual identity and the core component architecture (models, services, reusable components, custom directives).

## Scope

### In Scope
- Post model interface (`id`, `title`, `slug`, `excerpt`, `createdAt`, `tags`, `coverColor`)
- Post service with mock data returning `Signal<Post[]>`
- PostCard presentational component with floating color aesthetic
- Tilt directive (CSS 3D `rotateX`/`rotateY` on mousemove with perspective)
- Home page integration — loads posts, renders PostCard list
- Unit tests for all new code (strict TDD)

### Out of Scope
- Backend/API integration (mock data only)
- Block editor
- Post detail page
- SSR optimization

## Capabilities

### New Capabilities
- `post-listing`: Homepage post list with mock data, PostCard component, and 3D tilt interaction

### Modified Capabilities
- None

## Approach

Create the Post model → Post service (mock data via Signal) → PostCard component with Tilt directive → Wire into Home page. All artifacts under `src/app/` following the agreed folder structure. Strict TDD: write tests first for each unit.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/models/post.model.ts` | New | Post interface |
| `src/app/services/post.service.ts` | New | Signal-based mock data service |
| `src/app/components/post-card/` | New | PostCard component + spec |
| `src/app/directives/tilt.directive.ts` | New | CSS 3D tilt directive + spec |
| `src/app/pages/home/` | Modified | Wire service + PostCard list |
| `src/app/app.routes.ts` | Check | Verify home route is correct |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tilt directive breaks in SSR context | Low | Uses `Renderer2`, gracefully degrades without mouse events |
| Signal API changes between Angular versions | Low | Pin Angular version; standard Signals API is stable |

## Rollback Plan

1. Revert all new files under `src/app/models/`, `src/app/services/`, `src/app/components/post-card/`, `src/app/directives/`.
2. Restore `src/app/pages/home/` to previous empty state via `git checkout`.
3. Verify `ng build` and `pnpm test -- --run` pass clean.

## Dependencies

- Angular 22 (installed)
- Vitest 4.0.8 (configured)

## Success Criteria

- [ ] `pnpm test -- --run` passes with coverage for model, service, PostCard, Tilt directive, Home page
- [ ] `pnpm build` succeeds
- [ ] Homepage renders post cards with colored cover backgrounds
- [ ] Cards respond to mouse movement with visible 3D tilt effect
