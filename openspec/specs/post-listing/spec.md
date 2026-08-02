# Post Listing Specification

## Purpose

Define the post model, signal-based mock data service, PostCard presentational component, 3D tilt directive, and home page integration that together form the homepage post listing — establishing the "multicolor floating" visual identity and the core component architecture of the application.

---

## Requirements

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

---

### Requirement: Post Service with Mock Data

The system MUST provide a `PostService` in `src/app/services/post.service.ts` that provides mock post data via Angular's Signal API.

**Structure and contract:**

- The service MUST be decorated with `@Injectable({ providedIn: 'root' })`
- The service MUST use the `inject()` DI function (NOT constructor DI) — if any dependencies are injected
- The service MUST expose a public method or property that returns `Signal<Post[]>`
- The service MUST expose a `getPostBySlug(slug: string): Post | undefined` method for single-post lookup by slug
- The signal MUST contain at least 3 mock posts
- Each mock post MUST have all `Post` fields populated with realistic, non-empty data (including `body`)
- The mock posts MUST each have a distinct `id`, `title`, `slug`, and `coverColor`
- The `coverColor` values MUST be distinct across all mock posts (to enable the multicolor floating aesthetic)
- The `createdAt` field MUST be a genuine `Date` object (not a string)

#### Scenario: PostService is injectable

- GIVEN an Angular application configured with `@angular/core/testing` `TestBed`
- WHEN `TestBed.inject(PostService)` is called
- THEN a `PostService` instance SHALL be returned without errors

#### Scenario: PostService returns Signal with mock data

- GIVEN a `PostService` instance
- WHEN `getPosts()` (or the equivalent signal accessor) is called
- THEN the returned signal SHALL have a value
- AND the value SHALL be an array of at least 3 `Post` objects
- AND each post SHALL have all required fields populated with non-empty values
- AND each post's `createdAt` SHALL be an instance of `Date`

#### Scenario: Mock posts have distinct cover colors

- GIVEN the array of mock posts from `PostService`
- WHEN the `coverColor` values are collected
- THEN all values SHALL be distinct (no two posts share the same cover color)

#### Scenario: getPostBySlug returns matching post with body

- GIVEN a `PostService` instance
- WHEN `getPostBySlug('getting-started-angular-signals')`
- THEN a Post with matching slug SHALL return with non-empty `body`

#### Scenario: getPostBySlug returns undefined for unknown slug

- GIVEN a `PostService` instance
- WHEN `getPostBySlug('non-existent-slug')`
- THEN `undefined` SHALL be returned

---

### Requirement: PostCard Component

The system MUST provide a `PostCard` standalone component in `src/app/components/post-card/post-card.ts` that renders an individual post with the multicolor floating aesthetic.

**Structure and contract:**

- MUST be a standalone component (no `NgModule` dependency)
- MUST have an `@Input({ required: true }) post: Post` property
- MUST apply the `appTilt` directive to the root element for 3D hover effect
- The component template MUST render:
  - A cover area with the `post.coverColor` as background color
  - The `post.title` as a heading
  - The `post.excerpt` as a paragraph
  - Each `post.tag` rendered as a badge/chip element
  - The `post.createdAt` formatted as a readable date (e.g., "Jul 24, 2026")
- The component root element MUST use `routerLink` to navigate to `/post/{post.slug}` on click

#### Scenario: PostCard renders all post fields

- GIVEN a `PostCard` component with a `post` input set to a valid `Post` object
- WHEN the component is rendered
- THEN the DOM SHALL contain an element with the `post.coverColor` as its background color
- AND SHALL contain the post title as text content
- AND SHALL contain the post excerpt as text content
- AND SHALL contain each tag as distinct visible elements
- AND SHALL contain a formatted date string (not the raw `Date` toString)

#### Scenario: PostCard requires post input

- GIVEN a `PostCard` component
- WHEN it is instantiated without providing a `post` input
- THEN Angular SHALL throw an error at runtime because `post` is `{ required: true }`

#### Scenario: PostCard applies tilt directive

- GIVEN a rendered `PostCard` with post data
- WHEN the component root element is inspected
- THEN it SHALL have the `appTilt` directive attribute present

#### Scenario: PostCard navigates on click

- GIVEN a rendered `PostCard` with a valid post whose slug is `"my-first-post"`
- WHEN the component root element is clicked
- THEN the router SHALL navigate to `/post/my-first-post`

---

### Requirement: Tilt Directive

The system MUST provide a `TiltDirective` in `src/app/directives/tilt.directive.ts` with selector `[appTilt]` that applies a CSS 3D perspective transform based on mouse position within the host element.

**Structure and contract:**

- MUST be a standalone directive with selector `[appTilt]`
- MUST use `Renderer2` for DOM manipulation (NOT native DOM APIs like `element.style` or `el.style`)
- MUST listen to `mousemove` event on the host element
- SHALL calculate `rotateX` and `rotateY` values proportional to the mouse position relative to the element center
- SHALL apply `transform: perspective(...) rotateX(...) rotateY(...)` to the host element
- SHALL gracefully degrade: if no mouse events fire (e.g., touch device, programmatic render), no transform is applied and no errors are thrown
- MUST clean up event listeners on destroy (`ngOnDestroy` or equivalent)

#### Scenario: Tilt directive applies transform on mousemove

- GIVEN an element with the `appTilt` directive
- WHEN a `mousemove` event is dispatched at coordinates `(x: 100, y: 100)` relative to the element
- THEN the element's style SHALL have a `transform` property containing `perspective(`, `rotateX(`, and `rotateY(`
- AND the values SHALL be non-zero and reflect the mouse position

#### Scenario: Tilt directive gracefully degrades without mouse

- GIVEN an element with the `appTilt` directive
- WHEN no `mousemove` events fire on the element
- THEN no `transform` style SHALL be applied to the element
- AND no console errors or runtime exceptions SHALL occur

#### Scenario: Tilt directive uses Renderer2

- GIVEN the `TiltDirective` source code
- WHEN the file is inspected
- THEN all style/class/DOM mutations SHALL go through `Renderer2` methods (`setStyle`, `removeStyle`, `listen`, etc.)
- AND SHALL NOT use `element.style`, `el.classList`, `document.querySelector`, or `nativeElement.style` directly

#### Scenario: Tilt directive cleans up on destroy

- GIVEN an element with the `appTilt` directive
- WHEN the component hosting the directive is destroyed
- THEN the `mousemove` event listener SHALL be removed
- AND no transform style SHALL persist on the element

---

### Requirement: Home Page Integration

The system MUST update the existing `Home` page component (`src/app/pages/home/home.ts`) to display the post listing.

**Structure and contract:**

- The `Home` component MUST import and inject `PostService` using `inject()`
- The `Home` component MUST call the service to obtain a `Signal<Post[]>`
- The template MUST iterate over the posts using `@for` and render a `PostCard` for each
- The page MUST apply a multicolor floating layout (CSS grid or flexbox with visual spacing)
- The page MUST handle the empty state: if the posts array is empty, display a user-friendly message (e.g., "No posts yet") instead of an empty container

#### Scenario: Home page renders PostCard for each post

- GIVEN the `Home` component with `PostService` returning 3 mock posts
- WHEN the component is rendered
- THEN exactly 3 `PostCard` elements SHALL appear in the DOM
- AND each card SHALL display unique title and cover color

#### Scenario: Home page shows empty state

- GIVEN the `Home` component with `PostService` returning an empty array
- WHEN the component is rendered
- THEN no `PostCard` elements SHALL appear in the DOM
- AND a text message indicating no posts SHALL be visible (e.g., "No posts yet")

#### Scenario: Home page imports PostService via inject()

- GIVEN the `Home` component source
- WHEN the file is inspected
- THEN the service SHALL be injected via `inject(PostService)` inside the component class body
- AND SHALL NOT use constructor-based DI

---

### Requirement: Test Coverage

Every new unit (model — though trivial —, service, component, directive, and updated page) MUST have a corresponding `.spec.ts` file with meaningful test coverage using **Vitest** with **jsdom** environment.

The model file (`post.model.ts`) does not need a spec since it is a pure type definition with no runtime behavior.

#### Files with spec requirements

| Source file | Spec file | Minimum scenarios |
|-------------|-----------|-------------------|
| `src/app/services/post.service.ts` | `src/app/services/post.service.spec.ts` | 5 |
| `src/app/components/post-card/post-card.ts` | `src/app/components/post-card/post-card.spec.ts` | 4 |
| `src/app/directives/tilt.directive.ts` | `src/app/directives/tilt.directive.spec.ts` | 4 |
| `src/app/pages/home/home.ts` | `src/app/pages/home/home.spec.ts` | 2 (updated) |
| `src/app/pages/post-detail/post-detail.ts` | `src/app/pages/post-detail/post-detail.spec.ts` | 3 |

#### Scenario: All specs pass with Vitest

- GIVEN the project with Vitest configured for jsdom
- WHEN `pnpm test -- --run` is executed
- THEN all spec files SHALL execute
- AND the exit code SHALL be 0
- AND no tests SHALL be skipped or timed out

#### Scenario: Specs cover edge cases

- GIVEN the test files for `PostCard`, `TiltDirective`, and `Home`
- WHEN each test file is inspected
- THEN each file SHALL contain at least one test covering a non-happy-path scenario (e.g., missing data, no mouse events, empty array)

---

### Requirement: Directory and File Structure

All new files MUST follow the project's established directory conventions:

```
src/app/
├── models/
│   └── post.model.ts              (NEW — Post interface; MODIFIED — added body field)
├── services/
│   ├── post.service.ts            (NEW — PostService with getPosts and getPostBySlug)
│   └── post.service.spec.ts       (NEW — service tests)
├── components/
│   └── post-card/
│       ├── post-card.ts           (NEW — PostCard component)
│       ├── post-card.html         (NEW — PostCard template)
│       ├── post-card.css          (NEW — PostCard styles)
│       └── post-card.spec.ts      (NEW — PostCard tests)
├── directives/
│   ├── tilt.directive.ts         (NEW — TiltDirective)
│   └── tilt.directive.spec.ts    (NEW — TiltDirective tests)
└── pages/
    ├── home/
    │   ├── home.ts               (MODIFIED — wire PostService + PostCard)
    │   ├── home.html             (MODIFIED — template with @for + PostCard)
    │   ├── home.css              (MODIFIED — multicolor floating layout)
    │   └── home.spec.ts          (MODIFIED — updated tests)
    └── post-detail/
        ├── post-detail.ts         (NEW — standalone component with input.required('slug') + computed lookup)
        ├── post-detail.html       (NEW — hero header + body + @if not-found)
        ├── post-detail.css        (NEW — hero styling, readable body typography)
        └── post-detail.spec.ts    (NEW — component and route navigation tests)
```

#### Scenario: All new and modified files exist

- GIVEN the `src/app/` directory tree
- WHEN each file is checked
- THEN NEW files SHALL exist with non-whitespace content
- AND MODIFIED files SHALL contain additions
