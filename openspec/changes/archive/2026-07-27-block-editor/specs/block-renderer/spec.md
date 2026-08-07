# Delta for block-renderer

## MODIFIED Requirements

### Requirement: Block Type Definition

The system MUST define a `Block` discriminated union type and per-type interfaces in `src/app/blocks/types.ts`. Every block interface SHALL include an `id: string` field for CDK drag-drop tracking.

| Block Type | Discriminant `type` | Fields |
|------------|---------------------|--------|
| `HeadingBlock` | `heading` | `id: string`, `level: 1-6`, `text: string` |
| `ParagraphBlock` | `paragraph` | `id: string`, `text: string` |
| `CodeBlock` | `code` | `id: string`, `language: string`, `text: string` |
| `ImageBlock` | `image` | `id: string`, `src: string`, `alt: string`, `caption?: string` (optional) |

The `Block` union SHALL be exported as `type Block = HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock`.
(Previously: Block interfaces did not include `id`.)

#### Scenario: Block union accepts all four types

- GIVEN a variable typed as `Block`
- WHEN assigned a value with `type: 'heading'`, `type: 'paragraph'`, `type: 'code'`, or `type: 'image'`
- THEN TypeScript SHALL accept each assignment
- AND SHALL require the respective fields for each type including `id`

#### Scenario: Image caption is optional

- GIVEN an `ImageBlock`
- WHEN the `caption` field is omitted
- THEN TypeScript SHALL NOT raise a type error
- AND the boolean check `caption !== undefined` SHALL work at runtime

#### Scenario: Heading level is restricted to 1-6

- GIVEN a `HeadingBlock`
- WHEN `level` is assigned a value outside 1-6
- THEN TypeScript SHALL raise a type error at compile time

#### Scenario: Each block has a unique id

- GIVEN a `Block[]` array initialized for editing
- WHEN each block's `id` is inspected
- THEN every `id` SHALL be a non-empty string
- AND all `id` values in the array SHALL be unique

### Requirement: Per-Type Renderer Components

(Unchanged — renderer components accept whatever block type they receive; adding `id` does not affect rendering behavior.)

### Requirement: BlockRenderer Dispatch Component

(Unchanged — the dispatcher iterates over `Block[]` regardless of additional fields; adding `id` does not affect dispatch logic.)

### Requirement: Test Coverage

The spec for `src/app/blocks/types.ts` — while a pure type — SHALL verify at compile time that `id` is required in every member of the `Block` union.

#### Scenario: id is required in all block types

- GIVEN a `Block` variable assignment
- WHEN `id` is omitted from any block constructor
- THEN TypeScript SHALL raise a compile-time type error
