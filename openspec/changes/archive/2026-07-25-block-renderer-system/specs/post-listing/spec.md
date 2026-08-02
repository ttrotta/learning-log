# Delta for Post Listing

## MODIFIED Requirements

### Requirement: Post Model Definition

The system MUST define a TypeScript `Post` interface in `src/app/models/post.model.ts` with the following required fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the post |
| `title` | `string` | Post headline |
| `slug` | `string` | URL-safe identifier derived from the title |
| `excerpt` | `string` | Short summary or teaser text |
| `createdAt` | `Date` | Publication date (proper `Date` object, not ISO string) |
| `tags` | `string[]` | Categorization tags (at least 1, non-empty) |
| `coverColor` | `string` | CSS-compatible color value (e.g., hex, rgb, hsl) |
| `body` | `Block[]` | Structured content blocks (heading, paragraph, code, image) |

The interface MUST be exported as a named export. The model file MUST NOT contain any class, service, component, or logic — it is a pure type definition. The `Block` type MUST be imported from `src/app/blocks/types.ts`.
(Previously: `body` was `string` — replaced with `Block[]` for structured block content)

#### Scenario: Post interface is exported correctly

- GIVEN `src/app/models/post.model.ts`
- WHEN the file is imported via `import { Post } from '../../models/post.model'`
- THEN `Post` SHALL be a TypeScript interface with all required fields listed above
- AND each field SHALL have the correct type

#### Scenario: Post model is a pure type definition

- GIVEN `src/app/models/post.model.ts`
- WHEN the file is compiled with `tsc` (or Angular compiler)
- THEN it SHALL produce zero runtime JavaScript output (TypeScript interface-only file)
- AND SHALL contain no class declarations, function bodies, or default values

#### Scenario: body field compiles as Block[] array

- GIVEN the `Post` interface
- WHEN creating a `Post` with a non-empty `body` array of valid `Block` objects
- THEN TypeScript accepts the object and `body` is required (not optional)
- AND assigning a `string` to `body` SHALL produce a compile-time type error
