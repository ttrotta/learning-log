# Design: Block Renderer System

## Technical Approach

Replace `Post.body: string` with `Block[]` — a discriminated union of `HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock`. A `BlockRendererComponent` iterates blocks via `@for` and dispatches to per-type standalone renderer components via `@switch`. Renderers use direct template output (no dynamic loading). highlight.js runs via `afterNextRender` in `CodeRenderer` for SSR safety. Three mock posts migrated in-place from Markdown strings to `Block[]`.

## Architecture Decisions

### Decision: Block type representation
| Option | Tradeoff | Decision |
|--------|----------|----------|
| Discriminated union with `type` field | Discriminant narrowing works natively in `@switch`; JSON-serializable without mapping | ✅ **Adopted** |
| Interface with `type: string` enum | Requires type guards; enums don't survive JSON serialization | ❌ Rejected |

### Decision: Dispatch mechanism
| Option | Tradeoff | Decision |
|--------|----------|----------|
| `@switch` in template | Simple, type-narrowing works, 0 runtime overhead for 4 types | ✅ **Adopted** |
| Dynamic component loading with `ViewContainerRef` | Extensible but overengineering for V1; harder to test | ❌ Rejected |

### Decision: Registry structure
| Option | Tradeoff | Decision |
|--------|----------|----------|
| Exported `const BLOCK_REGISTRY: Record<BlockType, Type<...>>` | Testable, no DI ceremony, importable | ✅ **Adopted** |
| Injectable service | Mockable but 0 benefit for 4 static types | ❌ Rejected |

### Decision: highlight.js integration
| Option | Tradeoff | Decision |
|--------|----------|----------|
| `afterNextRender` + `hljs.highlightElement()` | SSR-safe — runs only on browser; idiomatic Angular 17+ | ✅ **Adopted** |
| Directive-based approach | More reusable but overkill for single use-site | ❌ Rejected |
| `ngAfterViewInit` | Runs on SSR too — needs `isPlatformBrowser` guard | ❌ Rejected |

## Data Flow

```
PostService.posts (signal<Post[]>)
    ──[getPostBySlug()]──→ PostDetail.post (computed)
        ──[blocks]──→ BlockRendererComponent
            ──@for / @switch──→ HeadingRenderer
                              → ParagraphRenderer
                              → CodeRenderer ──[afterNextRender]──→ hljs.highlightElement()
                              → ImageRenderer
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/blocks/types.ts` | Create | Block union type, per-type interfaces, BlockType |
| `src/app/blocks/registry.ts` | Create | `BLOCK_REGISTRY` const Record mapping type→component |
| `src/app/blocks/block-renderer.ts` | Create | Switch-dispatch component, `blocks: Block[]` input |
| `src/app/blocks/block-renderer.spec.ts` | Create | Dispatch tests (all 4 types + unknown) |
| `src/app/blocks/block-renderer.css` | Create | Wrapper spacing |
| `src/app/blocks/renderers/heading-renderer.ts` | Create | `<h1>`–`<h6>` from `level` |
| `src/app/blocks/renderers/heading-renderer.spec.ts` | Create | Renders correct heading level |
| `src/app/blocks/renderers/paragraph-renderer.ts` | Create | `<p>` renderer |
| `src/app/blocks/renderers/paragraph-renderer.spec.ts` | Create | Renders `<p>` with text |
| `src/app/blocks/renderers/code-renderer.ts` | Create | `<pre><code>` + highlight.js in `afterNextRender` |
| `src/app/blocks/renderers/code-renderer.spec.ts` | Create | Language class, hljs class applied |
| `src/app/blocks/renderers/image-renderer.ts` | Create | `<figure>` with `<img>` + optional `<figcaption>` |
| `src/app/blocks/renderers/image-renderer.spec.ts` | Create | Caption conditional rendering |
| `src/app/models/post.model.ts` | Modify | `body: string` → `body: Block[]`; import Block from types |
| `src/app/services/post.service.ts` | Modify | 3 mock posts migrated from Markdown strings to `Block[]` |
| `src/app/pages/post-detail/post-detail.ts` | Modify | Import `BlockRendererComponent`, add to `imports` |
| `src/app/pages/post-detail/post-detail.html` | Modify | Replace `{{ post.body }}` with `<app-block-renderer [blocks]="post.body" />` |
| `src/app/pages/post-detail/post-detail.css` | Modify | Remove `.post-detail__body-text`, repurpose `.post-detail__body` as wrapper |
| `src/app/pages/post-detail/post-detail.spec.ts` | Modify | Assert rendered block content, not raw string |
| `src/app/components/post-card/post-card.spec.ts` | Modify | `mockPost.body` → empty `Block[]` |
| `package.json` | Modify | Add `"highlight.js": "^11.11.0"` to dependencies |
| `src/styles.css` | Modify | Add `@import 'highlight.js/styles/github-dark.css'` |

## Interfaces / Contracts

```typescript
// src/app/blocks/types.ts
export type BlockType = 'heading' | 'paragraph' | 'code' | 'image';
export interface HeadingBlock { type: 'heading'; level: 1|2|3|4|5|6; text: string; }
export interface ParagraphBlock { type: 'paragraph'; text: string; }
export interface CodeBlock { type: 'code'; language: string; text: string; }
export interface ImageBlock { type: 'image'; src: string; alt: string; caption?: string; }
export type Block = HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock;
```

```typescript
// src/app/blocks/registry.ts — maps BlockType → component class for tests/future
export const BLOCK_REGISTRY: Record<BlockType, Type<{ block: Block }>> = { ... };
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | HeadingRenderer — renders `<h1>`–`<h6>` for all levels | TestBed create, verify tag name |
| Unit | ParagraphRenderer — renders `<p>` with text | TestBed create, verify textContent |
| Unit | CodeRenderer — renders `<code>` with language class and hljs class | TestBed create, verify classList |
| Unit | ImageRenderer — renders `<img>` + optional `<figcaption>` | TestBed create, verify cond. elements |
| Integration | BlockRendererComponent — each type dispatches correctly | TestBed create with mixed `Block[]` |
| Integration | BlockRendererComponent — unknown block type renders nothing | Verify no extra DOM + no console error |
| Integration | PostDetail — `<app-block-renderer>` present for valid slug | Update existing spec to check rendered block content |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

Mock data migration (3 posts from string → Block[]), done in-place with this change. Post #3's body becomes a self-referential Block[] example matching its own JSON block description. Rollback: revert `body` type, restore previous mock data strings, remove `src/app/blocks/`, revert template.

## Open Questions

- [ ] **Spec naming clarification**: specs use `HeadingRenderer` etc. but files currently follow `post-card.ts` pattern (hyphenated, no `Renderer` suffix). Keeping spec names for classes; file names follow existing kebab-case convention (`heading-renderer.ts`).
