# Block Editor Specification

## Purpose

Visual block editor for composing/editing posts: metadata form, per-type editors, CDK drag-drop reordering, live preview. Routes `/admin/new` and `/admin/edit/:slug`.

## Requirements

### Requirement: Editor Routes

The system MUST register two lazy-loaded, client-only (no SSR) routes: `/admin/new` (create) and `/admin/edit/:slug` (edit). On edit, the editor SHALL load the post via `PostService.getPostBySlug()`.

- GIVEN navigation to `/admin/new`, WHEN the editor loads, THEN the metadata form SHALL be empty AND the block list SHALL contain one default paragraph block.
- GIVEN a post with slug `"hello-world"`, WHEN navigating to `/admin/edit/hello-world`, THEN the form SHALL be populated with the post's blocks AND each block form group SHALL have `id` set.
- GIVEN a non-existent slug, WHEN navigating to `/admin/edit/non-existent`, THEN the editor SHALL display "Post not found" AND SHALL NOT render the editor form.

### Requirement: Post Metadata Form

The editor MUST provide a ReactiveForms FormGroup with controls: `title` (required), `slug` (required, auto-generated from title), `excerpt` (required), `tags` (comma-separated string), `coverColor` (string). Slug auto-generates on blur unless manually edited.

- GIVEN empty slug, WHEN user types "My First Post" and blurs, THEN slug becomes `"my-first-post"`.
- GIVEN slug matching an existing post, WHEN user clicks Save, THEN "Slug already taken" error shown AND save blocked.

### Requirement: Block FormArray

Blocks MUST be a `FormArray` of FormGroups via `createBlockFormGroup(block: Block): FormGroup`. Every FormGroup SHALL include an `id` control (UUID).

| FormGroup | Controls |
|-----------|----------|
| Heading | `id`, `type`, `level` (1-6), `text` |
| Paragraph | `id`, `type`, `text` |
| Code | `id`, `type`, `language`, `text` |
| Image | `id`, `type`, `src`, `alt`, `caption` |

- GIVEN one existing block, WHEN user adds a "code" block, THEN FormArray SHALL have two FormGroups AND new block's `type` SHALL be `"code"`.
- GIVEN three blocks, WHEN user removes the second, THEN FormArray SHALL have two entries AND first/third remain in order.

### Requirement: Per-Type Block Editors

Four standalone editor components in `src/app/components/block-editor/`, each with `@Input({ required: true }) formGroup: FormGroup`:
- `HeadingBlockEditor` — level `<select>` 1-6, text `<input>`
- `ParagraphBlockEditor` — `<textarea>` for text
- `CodeBlockEditor` — language `<input>`, monospace `<textarea>`
- `ImageBlockEditor` — src `<input>`, alt `<input>`, caption `<input>`

- GIVEN heading FormGroup, WHEN rendered, THEN DOM SHALL contain level `<select>` and text `<input>`.
- GIVEN code FormGroup, WHEN rendered, THEN DOM SHALL contain language `<input>` and monospace `<textarea>`.

### Requirement: Drag-Drop Reordering

The editor MUST use `@angular/cdk/drag-drop` (`DragDropModule`). Block list SHALL use `cdkDropList` bound to FormArray; each block SHALL use `cdkDrag`.

- GIVEN three blocks [A, B, C], WHEN user drags C to position 0, THEN FormArray order SHALL become [C, A, B] AND preview SHALL update.

### Requirement: Live Preview

The editor SHALL display a side panel with `BlockRendererComponent` bound to the FormArray value, updating reactively on form change and reorder.

- GIVEN paragraph block with "Hello", WHEN user types "World", THEN preview SHALL display "World".
- GIVEN [Paragraph("A"), Paragraph("B")], WHEN B dragged above A, THEN preview SHALL show "B" then "A".

### Requirement: Save Action

"Save" button calls `PostService.addPost()` (create) or `PostService.updatePost()` (edit). On success, navigate to `/post/{slug}`.

- GIVEN valid form with blocks, WHEN Save clicked, THEN `PostService.addPost()` called AND router navigates to `/post/{slug}`.
- GIVEN edit mode with existing post, WHEN Save clicked, THEN `PostService.updatePost(slug, changes)` called AND router navigates to `/post/{slug}`.
