# Proposal: Block Renderer System

## Intent

Replace the raw `body: string` field (rendered as unformatted text) with a structured `Block[]` array and a per-type block renderer system. This unblocks the JSON block editor and gives the detail page proper typography for headings, code highlighting, and images.

## Scope

### In Scope
- Add `Block` union type and per-type interfaces (`heading`, `paragraph`, `code`, `image`)
- Switch `Post.body` from `string` to `Block[]`; migrate 3 mock posts
- Build 4 standalone block renderer components with `@switch` dispatch
- Wire `BlockRendererComponent` into PostDetail; remove raw body rendering
- Add `highlight.js` syntax highlighting for code blocks
- Update PostDetail and PostCard test specs for new body shape

### Out of Scope
- Rich text (inline bold/italic/code) in paragraphs — V2
- Dynamic component loading — switch dispatch is sufficient for 4 types
- Block editor authoring UI — separate change

## Capabilities

### New Capabilities
- `block-renderer`: Block union types, registry, per-type renderer components, and switch-dispatch `BlockRendererComponent` for rendering structured post content.

### Modified Capabilities
- `post-listing`: `Post.body` field type changes from `string` to `Block[]`. Existing mock post data migrates from Markdown strings to `Block[]` arrays.
- `post-detail`: Body section renders via `<app-block-renderer>` instead of raw text interpolation. Hero and not-found states unchanged.

## Approach

Per-type standalone components dispatched via `@switch` in `block-renderer.ts`. Block types and registry live in `src/app/blocks/`. Exported const `BLOCK_REGISTRY` map (no DI service). Mock data migrated in place. Syntax highlighting via `highlight.js` (already installed). Single PR with `size:exception` (~430 lines).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/models/post.model.ts` | Modified | `body: string` → `body: Block[]` |
| `src/app/services/post.service.ts` | Modified | 3 mock posts migrated to `Block[]` |
| `src/app/blocks/types.ts` | New | `Block` union type, per-type interfaces |
| `src/app/blocks/registry.ts` | New | Exported `BLOCK_REGISTRY` const map |
| `src/app/blocks/block-renderer.ts` | New | Switch-dispatch component |
| `src/app/blocks/renderers/` | New | 4 per-type renderer components + specs |
| `src/app/pages/post-detail/` | Modified | Template swaps `{{ body }}` for `<app-block-renderer>` |
| `src/app/components/post-card/post-card.spec.ts` | Modified | `mockPost.body` → `Block[]` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PostDetail spec body assertions need rework | High | Target rendered block content, not raw string |
| Syntax highlight CSS theming | Low | Use highlight.js CSS theme, no build config needed |
| ~430 lines exceeds 400-line PR budget | Medium | Accepted via `size:exception` — single PR |

## Rollback Plan

Revert `body` type to `string`, restore previous mock data strings, remove `src/app/blocks/` directory, revert PostDetail template to `{{ post.body }}`.

## Dependencies

- `highlight.js` (already in `package.json` as dependency)
- Angular `@switch` control flow (available natively in Angular 22)

## Success Criteria

- [ ] All 4 block types render correctly in PostDetail (heading, paragraph, code with highlight, image with caption)
- [ ] All existing tests pass with zero modifications beyond updated mock data shape
- [ ] Code blocks display syntax-highlighted output for known languages (js, ts, html, css)
- [ ] Unknown slug still shows "Post not found" (not-found behavior unchanged)
