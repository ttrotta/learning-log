# Tasks: Block Renderer System

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~430 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (size:exception accepted) |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Foundation + types + model | PR 1 | `pnpm ng test --watch=false --include='**/post.model.spec.ts'` | N/A — pure types, no runtime behavior | Revert `body` type, remove `src/app/blocks/` |
| 2 | 4 per-type renderers (RED→GREEN) | PR 1 | `pnpm ng test --watch=false --include='**/renderers/*.spec.ts'` | N/A — unit-tested in isolation | Remove `src/app/blocks/renderers/` |
| 3 | BlockRenderer dispatch + PostDetail wiring | PR 1 | `pnpm ng test --watch=false --include='**/block-renderer.spec.ts'` | `ng serve` + visit `/post/getting-started-angular-signals` | Revert PostDetail template to `{{ post.body }}` |
| 4 | Mock migration + final verification | PR 1 | `pnpm ng test --watch=false` | `ng serve` + visit all 3 post URLs | Revert `post.service.ts` mock data |

## Phase 1: Foundation

- [x] 1.1 Install highlight.js: `pnpm add highlight.js`; add `@import 'highlight.js/styles/github-dark.css'` to `src/styles.css`
- [x] 1.2 Create `src/app/blocks/types.ts` — `BlockType`, `HeadingBlock`, `ParagraphBlock`, `CodeBlock`, `ImageBlock`, `Block` union
- [x] 1.3 Create `src/app/blocks/registry.ts` — `BLOCK_REGISTRY: Record<BlockType, Type<...>>` with all 4 renderer imports
- [x] 1.4 Modify `src/app/models/post.model.ts` — import `Block`, change `body: string` → `body: Block[]`

## Phase 2: Per-Type Renderers (RED → GREEN each)

- [x] 2.1 RED: Write `src/app/blocks/renderers/heading-renderer.spec.ts` — renders correct `<h1>`–`<h6>` with text
- [x] 2.2 GREEN: Create `src/app/blocks/renderers/heading-renderer.ts` — standalone, `@Input({ required: true }) block: HeadingBlock`, `<h1>`–`<h6>` output
- [x] 2.3 RED: Write `src/app/blocks/renderers/paragraph-renderer.spec.ts` — renders `<p>` with text
- [x] 2.4 GREEN: Create `src/app/blocks/renderers/paragraph-renderer.ts` — standalone, `<p>` output
- [x] 2.5 RED: Write `src/app/blocks/renderers/code-renderer.spec.ts` — `<code>` has `hljs` + `language-*` class
- [x] 2.6 GREEN: Create `src/app/blocks/renderers/code-renderer.ts` — standalone, `<pre><code>`, `afterNextRender` + `hljs.highlightElement()`
- [x] 2.7 RED: Write `src/app/blocks/renderers/image-renderer.spec.ts` — `<img>` always, `<figcaption>` only when `caption` present
- [x] 2.8 GREEN: Create `src/app/blocks/renderers/image-renderer.ts` — standalone, `<figure>`, optional `<figcaption>`

## Phase 3: Dispatch + PostDetail Wiring

- [x] 3.1 RED: Write `src/app/blocks/block-renderer.spec.ts` — all 4 types dispatch correctly + unknown type renders nothing
- [x] 3.2 GREEN: Create `src/app/blocks/block-renderer.ts` + `block-renderer.css` — `@Input({ required: true }) blocks: Block[]`, `@for`/`@switch` dispatch
- [x] 3.3 RED: Update `src/app/pages/post-detail/post-detail.spec.ts` — assert rendered block output, drop raw-string assertions
- [x] 3.4 GREEN: Wire PostDetail — import `BlockRendererComponent`, add to `imports`, swap `{{ post.body }}` for `<app-block-renderer>`, update CSS

## Phase 4: Migration + Final Verification

- [x] 4.1 Modify `src/app/components/post-card/post-card.spec.ts` — import `Block`, change `mockPost.body` to `[] as Block[]`
- [x] 4.2 Migrate 3 mock posts in `src/app/services/post.service.ts` — convert Markdown strings to `Block[]` arrays (headings, paragraphs, code, images)
- [x] 4.3 Run `pnpm ng test --watch=false` — all existing + new tests pass with exit code 0
