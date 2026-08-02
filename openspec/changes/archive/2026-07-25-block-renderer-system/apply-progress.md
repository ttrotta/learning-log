# Apply Progress: Block Renderer System

**Date**: 2026-07-26
**Mode**: Strict TDD
**Delivery**: size:exception (single PR)

## Work Unit Evidence

| Evidence | Required value |
|----------|----------------|
| Focused test command and exact result | `pnpm ng test --watch=false` — 34 tests passing, 11 files, exit code 0 |
| Runtime harness command/scenario and exact result | N/A — unit tests cover all new code; no integration/runtime boundary exercised in this batch |
| Rollback boundary | Revert `body` type to `string`, restore mock data strings, remove `src/app/blocks/`, revert PostDetail template |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1 | — (install) | Config | N/A | N/A | ✅ Installed | ➖ Single | ➖ None needed |
| 1.2 | — (types only) | Types | N/A | ➖ Pure types | ✅ Created | ➖ No branching | ➖ None needed |
| 1.3 | — (registry) | Types | N/A | ➖ Pure const | ✅ Created | ➖ No branching | ➖ None needed |
| 1.4 | — (model) | Types | N/A | ➖ Type change | ✅ Modified | ➖ No branching | ➖ None needed |
| 2.1-2.2 | `heading-renderer.spec.ts` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 3 levels (1, 3, 6) | ✅ Clean |
| 2.3-2.4 | `paragraph-renderer.spec.ts` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 2 cases | ✅ Clean |
| 2.5-2.6 | `code-renderer.spec.ts` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 2 languages | ✅ Clean |
| 2.7-2.8 | `image-renderer.spec.ts` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 3 cases (with/without caption) | ✅ Clean |
| 3.1-3.2 | `block-renderer.spec.ts` | Integration | ✅ 32/34 | ✅ Written | ✅ Passed | ✅ 2 cases (all four + unknown) | ✅ Clean |
| 3.3-3.4 | `post-detail.spec.ts` | Integration | ✅ 6/6 | ✅ Updated | ✅ Passed | ➖ Existing coverage | ✅ Clean |
| 4.1 | `post-card.spec.ts` | Unit | N/A | ➖ Structural | ✅ Modified | ➖ Single | ➖ None needed |
| 4.2 | — (mock data) | Data | N/A | ➖ Structural | ✅ Migrated | ➖ Single | ➖ None needed |
| 4.3 | Full suite | All | ✅ 22/22 base | N/A | ✅ 34/34 pass | N/A | N/A |

### Test Summary
- **Total tests written**: 12 new + 12 existing updated = 24 tests
- **Total tests passing**: 34 (22 original + 12 new)
- **Layers used**: Unit (11), Integration (1 for block-renderer)
- **Approval tests** (refactoring): 0 — no refactoring tasks
- **Pure functions created**: 0 — all components with templates

### Deviations from Design
1. **Registry uses `Type<any>` instead of `Type<{ block: Block }>`** — The design specified `Type<{ block: Block }>` but Angular's component type inference with standalone components makes this impractical without deep generic plumbing. The Map still works correctly for component resolution.
2. **Mock data migration order** — Tasks 4.1 and 4.2 were completed early (before Phase 2) to unblock TypeScript compilation. The model change (`body: string` → `body: Block[]`) breaks compilation until all consumers are updated.

### Issues Found
None.

### Completed Tasks
- [x] 1.1 Install highlight.js
- [x] 1.2 Create types.ts
- [x] 1.3 Create registry.ts
- [x] 1.4 Update Post model
- [x] 2.1 RED: heading-renderer.spec.ts
- [x] 2.2 GREEN: heading-renderer.ts
- [x] 2.3 RED: paragraph-renderer.spec.ts
- [x] 2.4 GREEN: paragraph-renderer.ts
- [x] 2.5 RED: code-renderer.spec.ts
- [x] 2.6 GREEN: code-renderer.ts
- [x] 2.7 RED: image-renderer.spec.ts
- [x] 2.8 GREEN: image-renderer.ts
- [x] 3.1 RED: block-renderer.spec.ts
- [x] 3.2 GREEN: block-renderer.ts + .html + .css
- [x] 3.3 RED: Update post-detail.spec.ts
- [x] 3.4 GREEN: Wire PostDetail
- [x] 4.1 Update post-card.spec.ts
- [x] 4.2 Migrate mock data
- [x] 4.3 Full test suite

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/app/blocks/types.ts` | Created | Block union type, 4 interfaces, BlockType |
| `src/app/blocks/registry.ts` | Created | BLOCK_REGISTRY Record mapping type→component |
| `src/app/blocks/block-renderer.ts` | Created | Dispatch component with @for/@switch |
| `src/app/blocks/block-renderer.html` | Created | Template with @for/@switch dispatch |
| `src/app/blocks/block-renderer.css` | Created | Wrapper spacing (flex column, gap) |
| `src/app/blocks/block-renderer.spec.ts` | Created | Dispatch tests (all 4 types + unknown) |
| `src/app/blocks/renderers/heading-renderer.ts` | Created | h1-h6 renderer with @switch on level |
| `src/app/blocks/renderers/heading-renderer.spec.ts` | Created | Renders correct heading level (1, 3, 6) |
| `src/app/blocks/renderers/paragraph-renderer.ts` | Created | p tag renderer |
| `src/app/blocks/renderers/paragraph-renderer.spec.ts` | Created | Renders p with text |
| `src/app/blocks/renderers/code-renderer.ts` | Created | pre/code with highlight.js afterNextRender |
| `src/app/blocks/renderers/code-renderer.spec.ts` | Created | hljs + language class assertions |
| `src/app/blocks/renderers/image-renderer.ts` | Created | figure/img with optional figcaption |
| `src/app/blocks/renderers/image-renderer.spec.ts` | Created | img always, figcaption conditional |
| `src/app/models/post.model.ts` | Modified | body: string → body: Block[] |
| `src/app/services/post.service.ts` | Modified | 3 mock posts migrated to Block[] |
| `src/app/components/post-card/post-card.spec.ts` | Modified | mockPost.body → [] as Block[] |
| `src/app/pages/post-detail/post-detail.ts` | Modified | Imported BlockRendererComponent, added to imports |
| `src/app/pages/post-detail/post-detail.html` | Modified | Replaced {{ post.body }} with <app-block-renderer> |
| `src/app/pages/post-detail/post-detail.css` | Modified | Removed .post-detail__body-text styles |
| `src/app/pages/post-detail/post-detail.spec.ts` | Modified | Added app-block-renderer assertion |
| `src/styles.css` | Modified | Added @import highlight.js/github-dark.css |
| `package.json` | Modified | Added highlight.js dependency |

## Remaining Tasks
None — all tasks complete.
