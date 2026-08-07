# Delta for post-listing

## MODIFIED Requirements

### Requirement: Post Service with Mock Data

The system MUST provide a `PostService` in `src/app/services/post.service.ts` that provides mock post data via Angular's Signal API, and exposes CRUD methods for the post lifecycle.

**Structure and contract:**

- The service MUST be decorated with `@Injectable({ providedIn: 'root' })`
- The service MUST expose a public method or property that returns `Signal<Post[]>`
- The service MUST expose a `getPostBySlug(slug: string): Post | undefined` method
- The service MUST expose `addPost(post: Post): void` — appends a new Post to the signal array
- The service MUST expose `updatePost(slug: string, changes: Partial<Post>): void` — merges changes onto the matching post
- The service MUST expose `deletePost(slug: string): void` — removes the matching post from the signal array
- The signal MUST contain at least 3 mock posts, each with distinct `id`, `title`, `slug`, and `coverColor`
(Previously: No CRUD methods — service was read-only.)

#### Scenario: addPost appends to signal

- GIVEN a `PostService` instance with 3 mock posts
- WHEN `addPost(newPost)` is called with a valid Post
- THEN the signal's value SHALL have 4 posts
- AND the last element SHALL be `newPost`

#### Scenario: updatePost merges changes

- GIVEN a `PostService` instance with a post having slug `"hello"`
- WHEN `updatePost("hello", { title: "Updated Title" })` is called
- THEN the post matching slug `"hello"` SHALL have `title` equal to `"Updated Title"`
- AND other fields of that post SHALL remain unchanged

#### Scenario: updatePost does nothing on unknown slug

- GIVEN a `PostService` instance
- WHEN `updatePost("non-existent", { title: "Nope" })` is called
- THEN the signal's value SHALL remain unchanged
- AND no error SHALL be thrown

#### Scenario: deletePost removes post by slug

- GIVEN a `PostService` instance with 3 posts
- WHEN `deletePost("hello")` is called for an existing slug
- THEN the signal's value SHALL have 2 posts
- AND none SHALL have slug `"hello"`

#### Scenario: deletePost does nothing on unknown slug

- GIVEN a `PostService` instance
- WHEN `deletePost("non-existent")` is called
- THEN the signal's value SHALL remain unchanged
- AND no error SHALL be thrown

#### Scenario: PostService is injectable (unchanged)

- GIVEN an Angular application configured with `@angular/core/testing` `TestBed`
- WHEN `TestBed.inject(PostService)` is called
- THEN a `PostService` instance SHALL be returned without errors

#### Scenario: PostService returns Signal with mock data (unchanged)

- GIVEN a `PostService` instance
- WHEN the signal accessor is called
- THEN the returned signal SHALL have a value
- AND the value SHALL be an array of at least 3 `Post` objects
- AND each post SHALL have all required fields populated with non-empty values

#### Scenario: getPostBySlug returns matching post (unchanged)

- GIVEN a `PostService` instance
- WHEN `getPostBySlug('getting-started-angular-signals')`
- THEN a Post with matching slug SHALL return with non-empty `body`

#### Scenario: getPostBySlug returns undefined for unknown slug (unchanged)

- GIVEN a `PostService` instance
- WHEN `getPostBySlug('non-existent-slug')`
- THEN `undefined` SHALL be returned
