# Block Renderer Specification

## Purpose

Define the structured block types, per-type renderer components, and dispatch component that together enable rendering rich post content (headings, paragraphs, code blocks with highlighting, images with captions) from a discriminated union array.

---

## Requirements

### Requirement: Block Type Definition

The system MUST define a `Block` discriminated union type and per-type interfaces in `src/app/blocks/types.ts`.

| Block Type | Discriminant `type` | Fields |
|------------|---------------------|--------|
| `HeadingBlock` | `heading` | `level: 1-6`, `text: string` |
| `ParagraphBlock` | `paragraph` | `text: string` |
| `CodeBlock` | `code` | `language: string`, `text: string` |
| `ImageBlock` | `image` | `src: string`, `alt: string`, `caption?: string` (optional) |

The `Block` union SHALL be exported as `type Block = HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock`.

#### Scenario: Block union accepts all four types

- GIVEN a variable typed as `Block`
- WHEN assigned a value with `type: 'heading'`, `type: 'paragraph'`, `type: 'code'`, or `type: 'image'`
- THEN TypeScript SHALL accept each assignment
- AND SHALL require the respective fields for each type

#### Scenario: Image caption is optional

- GIVEN an `ImageBlock`
- WHEN the `caption` field is omitted
- THEN TypeScript SHALL NOT raise a type error
- AND the boolean check `caption !== undefined` SHALL work at runtime

#### Scenario: Heading level is restricted to 1-6

- GIVEN a `HeadingBlock`
- WHEN `level` is assigned a value outside 1-6
- THEN TypeScript SHALL raise a type error at compile time

---

### Requirement: Per-Type Renderer Components

The system MUST provide four standalone renderer components in `src/app/blocks/renderers/`, each accepting the corresponding block type as an `@Input()`.

- `HeadingRenderer` — MUST render `<h1>` through `<h6>` based on `level`
- `ParagraphRenderer` — MUST render a `<p>` element with `text`
- `CodeRenderer` — MUST render a `<pre><code>` element, apply `language` as CSS class, and invoke `highlight.js` via `hljs.highlightElement()`
- `ImageRenderer` — MUST render an `<img>` with `src` and `alt`, and SHALL render `caption` as `<figcaption>` if present

All four renderers MUST be standalone with `@Input({ required: true })` for their block input.

#### Scenario: HeadingRenderer renders correct heading level

- GIVEN a `HeadingRenderer` with `block` set to `{ type: 'heading', level: 3, text: 'Hello' }`
- WHEN rendered
- THEN the DOM SHALL contain an `<h3>` element with text "Hello"

#### Scenario: CodeRenderer applies highlight.js

- GIVEN a `CodeRenderer` with `block` set to `{ type: 'code', language: 'typescript', text: 'const x = 1' }`
- WHEN rendered
- THEN the `<code>` element SHALL have class `hljs` AND `language-typescript`

#### Scenario: ImageRenderer shows caption conditionally

- GIVEN an `ImageRenderer` with a block that includes a `caption`
- WHEN rendered
- THEN the DOM SHALL contain an `<img>` AND a `<figcaption>` element
- AND GIVEN an `ImageRenderer` without `caption`
- WHEN rendered
- THEN the DOM SHALL contain an `<img>` but no `<figcaption>`

---

### Requirement: BlockRenderer Dispatch Component

The system MUST provide a `BlockRendererComponent` in `src/app/blocks/block-renderer.ts` that receives `Block[]` and dispatches each block to its renderer via `@switch`.

- MUST have `@Input({ required: true }) blocks: Block[]`
- MUST iterate with `@for` and dispatch via `@switch` on `block.type`
- The `@switch` SHALL handle `'heading'`, `'paragraph'`, `'code'`, `'image'`
- MUST include a `@switch` default case that renders nothing gracefully (no errors)

#### Scenario: BlockRenderer renders all four types

- GIVEN a `BlockRendererComponent` with an array containing one block of each type
- WHEN rendered
- THEN the DOM SHALL contain one `<h1-6>`, one `<p>`, one `<pre><code>`, and one `<img>` element

#### Scenario: Unknown block type renders nothing

- GIVEN a `BlockRendererComponent` with a block of `{ type: 'unknown' }`
- WHEN rendered
- THEN no extra DOM nodes SHALL appear for that block
- AND no console errors or runtime exceptions SHALL occur

---
> **REMOVED: Block Registry requirement** — The `registry.ts` file was originally planned as an exported `const BLOCK_REGISTRY` mapping block types to component classes. During implementation it was removed as dead code because the `@switch` dispatch pattern renders components directly without needing a lookup registry. The `@switch` in the template handles type → component dispatch natively and more simply.

---

### Requirement: Test Coverage

Every new unit MUST have a corresponding `.spec.ts` file with meaningful test coverage using Vitest with jsdom environment.

| Source file | Spec file | Minimum scenarios |
|-------------|-----------|-------------------|
| `src/app/blocks/types.ts` | — | Pure type, no runtime tests needed |
| ~~`src/app/blocks/registry.ts`~~ | — | **REMOVED** — dead code; `@switch` dispatch replaces registry pattern |
| `src/app/blocks/block-renderer.ts` | `src/app/blocks/block-renderer.spec.ts` | 2 |
| `src/app/blocks/renderers/heading-renderer.ts` | `src/app/blocks/renderers/heading-renderer.spec.ts` | 1 |
| `src/app/blocks/renderers/paragraph-renderer.ts` | `src/app/blocks/renderers/paragraph-renderer.spec.ts` | 1 |
| `src/app/blocks/renderers/code-renderer.ts` | `src/app/blocks/renderers/code-renderer.spec.ts` | 1 |
| `src/app/blocks/renderers/image-renderer.ts` | `src/app/blocks/renderers/image-renderer.spec.ts` | 2 |

#### Scenario: All block renderer specs pass

- GIVEN the project with Vitest configured for jsdom
- WHEN `pnpm test -- --run` is executed
- THEN all block renderer spec files SHALL execute
- AND the exit code SHALL be 0
