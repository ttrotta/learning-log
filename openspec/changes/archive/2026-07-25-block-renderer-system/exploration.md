## Exploration: Block Renderer System

### Current State

**Post Model** (`src/app/models/post.model.ts`): `Post` interface has `body: string` — raw Markdown stored as a single string. No structured content.

**PostService** (`src/app/services/post.service.ts`): Three mock posts with Markdown body strings. Post #3 ("Building a Custom Block Editor") already describes the JSON block format concept in its content — the mock data is philosophically meta but structurally still `body: string`.

**PostDetail** (`src/app/pages/post-detail/post-detail.ts`): Reads `post()` via `computed()` from `PostService.getPostBySlug()`. Template renders `{{ post.body }}` inside a single `<p>` with `white-space: pre-wrap` — raw Markdown displayed as plain text, no parsing or styling.

**PostDetail CSS** (`src/app/pages/post-detail/post-detail.css`): Single `.post-detail__body-text` class styling the raw body text.

**PostCard** (`src/app/components/post-card/`): Does NOT render `post.body` — only uses `excerpt` for card content. The `mockPost` in its spec file includes `body: 'Test body content.'` for type compatibility only.

**Existing Patterns**: Standalone components (Angular 22 default), `inject()` for DI, `input.required<T>()` for inputs, `Signal<T>` for reactive state, `computed()` for derived values, `@if/@for` native control flow. Tilt directive is a standalone directive with `ElementRef` + `Renderer2`.

### Affected Areas

- `src/app/models/post.model.ts` — add `Block` union type, change `body: string` to `body: Block[]`
- `src/app/services/post.service.ts` — convert 3 mock posts' body from Markdown strings to `Block[]` arrays
- `src/app/pages/post-detail/post-detail.html` — replace `{{ post.body }}` with `<app-block-renderer>`
- `src/app/pages/post-detail/post-detail.ts` — import `BlockRendererComponent`
- `src/app/pages/post-detail/post-detail.css` — remove `.post-detail__body-text` (or repurpose as wrapper)
- `src/app/pages/post-detail/post-detail.spec.ts` — update body content checks from raw string matches to rendered block content
- `src/app/components/post-card/post-card.spec.ts` — update `mockPost.body` to `Block[]` (empty array is fine since PostCard doesn't render body)
- `src/app/blocks/types.ts` — **new**: `Block` union type, `BlockType`, individual block interfaces
- `src/app/blocks/registry.ts` — **new**: type-to-component mapping
- `src/app/blocks/block-renderer.ts` — **new**: switch component that delegates to the right renderer
- `src/app/blocks/block-renderer.spec.ts` — **new**: tests for dispatch logic
- `src/app/blocks/renderers/heading-block.ts` — **new**: heading renderer
- `src/app/blocks/renderers/heading-block.spec.ts` — **new**: heading renderer tests
- `src/app/blocks/renderers/paragraph-block.ts` — **new**: paragraph renderer
- `src/app/blocks/renderers/paragraph-block.spec.ts` — **new**: paragraph renderer tests
- `src/app/blocks/renderers/code-block.ts` — **new**: code renderer with syntax highlight
- `src/app/blocks/renderers/code-block.spec.ts` — **new**: code renderer tests
- `src/app/blocks/renderers/image-block.ts` — **new**: image renderer
- `src/app/blocks/renderers/image-block.spec.ts` — **new**: image renderer tests

### Block Type Analysis

From the mock data (post #3 describes the format explicitly) and the proposal:

| BlockType | Fields | Notes |
|-----------|--------|-------|
| `heading` | `level: 1-6`, `text: string` | `<h1>` through `<h6>` |
| `paragraph` | `text: string` | `<p>` — rich text (inline bold/italic/code) could be future |
| `code` | `language: string`, `text: string` | `<pre><code>` with language class |
| `image` | `src: string`, `alt: string`, `caption?: string` | `<figure>` with `<figcaption>` |

**Non-obvious discovery**: Post #3's body IS the problem — it literally describes the JSON block structure we need to implement. This means the mock data conversion is especially interesting: post #3's body should become an actual Block[] example that mirrors its own description.

No additional block types needed for V1. `pullquote`, `embed`, `video`, `list` can be added later.

### BlockRegistry: Map vs Injectable Service

1. **Simple Map (in block-renderer.ts)** — keeps it local
   - Pros: Zero DI overhead, trivial to read, easy to test
   - Cons: Can't be extended at runtime, harder to mock in tests
   - Effort: Low

2. **Injectable BlockRegistryService** — injected into block-renderer
   - Pros: Can be extended dynamically, mockable via DI, clearer separation
   - Cons: Overengineering for 4 fixed types, more boilerplate
   - Effort: Low

3. **BlockRegistry type with map + register function (exported)** — hybrid
   - Pros: Centralized, testable, no DI ceremony, can export for tests
   - Cons: Impure singleton (module-level state)
   - Effort: Low

**Recommendation**: Approach 1 (simple const map) for V1. 4 types don't justify a service. Export the map for testing.

### Approaches

1. **All-in-one block-renderer** — single component with `@switch` on `block.type`
   - Pros: Simplest, no registry needed, fewer files
   - Cons: One component does everything, harder to extend, violates single responsibility
   - Effort: Low

2. **Per-type components with registry dispatch** — each type gets its own component, `block-renderer` dispatches via `@switch` or registry lookup
   - Pros: Clean separation, easy to add types, follows the proposed structure
   - Cons: More files, more boilerplate
   - Effort: Medium

3. **Renderer components with dynamic component loading** — use `ViewContainerRef.createComponent()` with registry
   - Pros: Truly extensible, zero switch statements, pluggable
   - Cons: Overengineering for V1, dynamic component creation complexity, harder to test
   - Effort: High

**Recommendation**: **Approach 2** — per-type components with switch dispatch. It matches the proposed structure, keeps things simple for V1, but leaves room to grow into Approach 3 later. The `@switch` in `block-renderer.ts` is fine for 4 types.

### Post Body Migration Strategy

Two options:

1. **Convert in place** — change `Post.body` type to `Block[]`, convert all mock data at once
   - Pros: No migration layer, clean state from the start
   - Cons: Everything breaks until all mock data is migrated
   - Effort: Low

2. **Dual-format with migration** — keep `body: string | Block[]`, convert gradually
   - Pros: Incremental migration, can co-exist during development
   - Cons: Messy type, runtime type checks everywhere, tech debt
   - Effort: Medium

**Recommendation**: **Option 1** — convert in place. This is a personal project with 3 mock posts. Go clean.

### Test Strategy

**Per-renderer tests** (vitest + jsdom):
- heading-block: renders correct `<h1>`–`<h6>` tag, displays text
- paragraph-block: renders `<p>` with text
- code-block: renders `<pre><code>` with language class, applies syntax highlight
- image-block: renders `<img>` with src/alt, optional caption as `<figcaption>`
- block-renderer: each block type dispatches to correct rendered output
- block-renderer: unknown block type throws or silently ignores

**Existing test updates**:
- PostDetail spec: replace `expect(el.textContent).toContain('Why Signals?')` with checks that the block-renderer component rendered
- PostCard spec: update `mockPost` body type to `Block[]` (empty array)

### Effort Estimate

| Component | Lines (impl) | Lines (test) | Total |
|-----------|:-----------:|:-----------:|:----:|
| types.ts | 20 | — | 20 |
| registry.ts | 15 | — | 15 |
| block-renderer.ts | 25 | 40 | 65 |
| heading-block.ts | 20 | 30 | 50 |
| paragraph-block.ts | 15 | 25 | 40 |
| code-block.ts | 30 | 35 | 65 |
| image-block.ts | 20 | 30 | 50 |
| Post model update | 10 | — | 10 |
| Mock data migration (3 posts) | 80 | — | 80 |
| PostDetail update | 15 | 15 | 30 |
| PostCard spec update | 5 | — | 5 |
| **TOTAL** | **255** | **175** | **~430** |

**Review budget**: ~430 lines is borderline over the 400-line default PR budget. Recommend chained PRs or delivering as a stacked PR (#1: types + model + mock data migration, #2: renderers + integration).

### Recommendation

Build the block renderer system with **Approach 2** (per-type standalone components dispatched via `@switch` in `block-renderer.ts`). Convert mock data in place. Use a simple exported `BLOCK_REGISTRY` const map for type-to-component lookup.

**Key decisions**:
- `BlockType`: `'heading' | 'paragraph' | 'code' | 'image'` — union, not enum (fits JSON serialization)
- `Block`: discriminated union with `type` discriminant — native TypeScript, no enum
- `heading` has `level: 1 | 2 | 3 | 4 | 5 | 6` literal union
- `image` has optional `caption?: string`
- `code` renderer uses `<pre><code>` with language class — syntax highlight via CSS, no JS library
- `paragraph` is plain text — rich text parsing is a future concern
- Registry is a const `Map<BlockType, ComponentType>` exported from registry.ts
- Dispatch uses `@switch` in template (Angular 17+ native control flow)

### Risks

- **Test fragility on PostDetail spec**: Current tests check `textContent` for words that appear in raw body strings. With block rendering, those words still render, but the DOM structure changes. Tests need to verify rendered content through the block components.
- **PostCard spec type breakage**: `mockPost.body` changes type. PostCard doesn't use `body` so empty array works, but ALL files creating mock `Post` objects must be updated.
- **Syntax highlighting complexity**: Pure CSS syntax highlighting is limited. Without a library like `highlight.js` or `prism.js`, code blocks will be unstyled. Need to decide: CSS-only (limited) or add a dependency (heavier).
- **Body migration effort**: Converting 3 mock posts from Markdown to Block[] is manual and error-prone. The conversion needs accurate parsing of the existing Markdown to produce equivalent block content.
- **400-line review budget**: At ~430 lines this is borderline. The mock data migration alone is ~80 lines of noise. Consider chaining: PR #1 (types + model + mock data), PR #2 (all renderers + integration).

### Ready for Proposal

Yes — scope is well-defined, the architecture is clear, and the risks are manageable. The orchestrator should confirm:
1. **Syntax highlighting approach** — CSS-only or `highlight.js` dependency?
2. **Paragraph rich text** — plain text or add inline formatting (bold, italic, code) for V1?
3. **Delivery strategy** — single PR or chained PRs given the ~430 line estimate?
