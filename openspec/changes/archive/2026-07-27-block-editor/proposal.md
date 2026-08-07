# Proposal: Block Editor

## Intent

Post creation is impossible without an editor. The block system (types, renderers) is built but there's no UI to compose or edit block content. This change delivers a visual block editor so the author can create and edit posts with structured blocks.

## Scope

### In Scope
- Editor page at `/admin/new` (create) and `/admin/edit/:slug` (edit)
- ReactiveForms model for post metadata + FormArray of FormGroups per block
- Per-type editor components (heading, paragraph, code, image)
- Live preview panel via existing BlockRendererComponent
- CDK DragDrop reordering of blocks
- CRUD methods on PostService (addPost, updatePost, deletePost)
- `id: string` field added to all Block interfaces
- Client-only routes (no SSR for admin)

### Out of Scope
- LocalStorage persistence (V2)
- File upload for images (URL-only V1)
- Rich text / Markdown input mode
- Drag-to-reorder inside same block (e.g., image position within text)

## Capabilities

### New Capabilities
- `block-editor`: Visual block editor with metadata form, per-type block editors, drag-drop reordering, and live preview.

### Modified Capabilities
- `block-renderer`: Block types get `id: string` field for CDK drag-drop tracking.
- `post-listing`: PostService gets `addPost()`, `updatePost()`, `deletePost()` for CRUD lifecycle.

## Approach

Angular CDK DragDrop + ReactiveForms + per-type editor components + live preview via existing BlockRendererComponent. A `createBlockFormGroup()` factory handles the Block discriminated union → FormGroup conversion. Editor page is lazy-loaded and client-only (no SSR). Deliver in two PRs: (1) form model, types with `id`, CDK install; (2) editor page UI and integration.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/blocks/types.ts` | Modified | Add `id: string` to every Block interface |
| `src/app/services/post.service.ts` | Modified | Add addPost, updatePost, deletePost methods |
| `src/app/services/post.service.spec.ts` | Modified | Tests for new CRUD methods |
| `src/app/app.routes.ts` | Modified | Add `/admin/new` and `/admin/edit/:slug` lazy routes |
| `src/app/pages/editor/editor.ts` | New | Main editor page component |
| `src/app/components/block-editor/` | New | Editor components directory (toolbar, block wrapper, per-type editors) |
| `src/app/utils/block-form.ts` | New | createBlockFormGroup() factory |
| `package.json` | Modified | Add `@angular/cdk` dependency |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| FormArray type safety with discriminated unions | Med | Typed getters and casting utilities in block-form.ts |
| CDK adds ~80-100KB to bundle | Med | Lazy-load editor route |
| SSR breakage on admin routes | Low | Client-only routes — check `isPlatformBrowser` |

## Rollback Plan

Remove admin routes from `app.routes.ts`, revert `types.ts` `id` field, revert PostService CRUD, `pnpm remove @angular/cdk`, delete new files. Each PR independently revertible.

## Dependencies

- `@angular/cdk` (DragDropModule) — install via `pnpm add @angular/cdk`

## Success Criteria

- [ ] Editor creates valid Block[] saved via PostService
- [ ] Editor loads existing post and renders its blocks as editable form
- [ ] Blocks reorderable via drag-drop
- [ ] Live preview matches saved post rendering
- [ ] Slug uniqueness validated before save
- [ ] All existing specs pass with modified types
