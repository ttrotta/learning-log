# Delta for post-listing

## MODIFIED Requirements

### Requirement: Post Model Definition

The `Post` interface at `src/app/models/post.model.ts` MUST include a `body: string` field for full article content. The field table now has:

| `body` | `string` | Full article content in JSON block editor format |

All existing fields (`id`, `title`, `slug`, `excerpt`, `createdAt`, `tags`, `coverColor`) remain unchanged. The interface stays a named export with zero logic.
(Previously: Post had no `body` field; field table had 7 rows)

#### Existing scenarios remain valid
- Post interface export test
- Pure type definition test

#### New scenario: body field compiles
- GIVEN the `Post` interface
- WHEN creating a `Post` with a non-empty `body` string
- THEN TypeScript accepts the object and `body` is required (not optional)

---

### Requirement: Post Service with Mock Data

`PostService` gains `getPostBySlug(slug: string): Post | undefined`. All mock posts MUST include a realistic `body` string. Existing contract unchanged (`@Injectable`, `inject()` DI, `Signal<Post[]>`, distinct coverColors, Date createdAt).
(Previously: Only `getPosts()`, no `body` in mocks)

#### Existing scenarios remain valid
- Injectable via TestBed
- Returns Signal with ≥3 populated posts
- Distinct cover colors

#### New scenario: getPostBySlug returns matching post
- GIVEN a `PostService` instance
- WHEN `getPostBySlug('getting-started-angular-signals')`
- THEN a Post with matching slug SHALL return with non-empty `body`

#### New scenario: getPostBySlug returns undefined for unknown slug
- GIVEN a `PostService` instance
- WHEN `getPostBySlug('non-existent-slug')`
- THEN `undefined` SHALL be returned

---

### Requirement: Test Coverage

`post.service.spec.ts` minimum scenarios raised to 5. New `post-detail.spec.ts` added with min 3 scenarios.
(Previously: post.service.spec.ts min was 3, no post-detail spec)

#### Scenario: All tests pass
- GIVEN the project with Vitest + jsdom
- WHEN `pnpm test -- --run`
- THEN exit code SHALL be 0

---

### Requirement: Directory and File Structure

**Modified**: post.model.ts, post.service.ts, post.service.spec.ts, app.routes.ts
**New**: pages/post-detail/{post-detail.ts, post-detail.html, post-detail.css, post-detail.spec.ts}

#### Scenario: New and modified files exist
- GIVEN the `src/app/` tree
- WHEN each file is checked
- THEN NEW files exist with non-whitespace content, MODIFIED files contain additions
