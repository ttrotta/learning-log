# Design: Block Editor

## Technical Approach

Visual block editor with ReactiveForms for the form model, CDK DragDrop for reordering, per-type editor components for input, and the existing BlockRendererComponent for live preview. Two-PR delivery to protect the review budget: PR1 ships the infrastructure (types, form model, CDK install, PostService CRUD), PR2 ships the editor page and all UI components.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Block ID | `id: string` via `crypto.randomUUID()` | Counter, nanoid | UUID guarantees no collisions on client-only generation; zero dependencies; native Web API |
| Form model | `FormArray<FormGroup>` + factory fn | Template-driven | ReactiveForms give programmatic control over dynamic lists; essential for drag-drop reorder and per-block validation |
| Live preview | Reuse `BlockRendererComponent` with `getRawValue()` | Separate render pass | Zero new rendering logic; `getRawValue()` produces plain `Block[]` from form state; component is already tested |
| Client-only admin | `canActivate` guard checking `isPlatformBrowser` | Separate build entry | Lightweight, follows Angular docs; one guard function, lazy-loaded routes, no build overhead |
| Drag-drop | `@angular/cdk` DragDropModule | Native HTML5 drag, dnd-kit | CDK is Angular-idiomatic; built-in accessibility, keyboard nav, and touch support; works seamlessly with `FormArray` indices |
| Delivery | 2 PRs (infra + UI) | Single PR | ~400-line budget guard; PR1 is type-safe infra with tests; PR2 is page layout and component wiring |
| Editor location | `src/app/pages/editor/` for page; `src/app/editor/` for sub-components | Single flat folder | Follows existing page pattern (`post-detail/`, `home/`); sub-components colocated near their consumer |

## Data Flow

```
User action ──→ EditorPage (orchestrator)
                     │
          ┌──────────┼──────────┐
          │          │          │
     Toolbar    Block list    Preview panel
     (add)     (FormArray)    (BlockRenderer)
          │          │              ▲
          └──────────┼──────────────┘
                     │
             PostService
             (signal<Post[]>)
```

1. User clicks "Add Heading" → `ToolbarComponent` emits block type → `EditorPage` calls `addBlock(type)` → pushes a new `FormGroup` (via `createBlockFormGroup()`) into the `FormArray`
2. User edits a field → `FormControl` valueChanges updates the form model → preview reads `formArray.getRawValue()` and passes to `BlockRendererComponent` — it re-renders reactively
3. User drags a block → `cdkDropListDropped` event fires → `EditorPage` reorders `FormArray` entries via `move()` utility
4. User saves → `EditorPage` reads `formGroup.getRawValue()` for metadata + blocks, calls `PostService.addPost()` / `updatePost()`

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/blocks/types.ts` | Modify | Add `id: string` to `HeadingBlock`, `ParagraphBlock`, `CodeBlock`, `ImageBlock` |
| `src/app/blocks/block-renderer.html` | Modify | Change `@for` tracking from `$index` to `block.id` |
| `src/app/utils/block-form.ts` | Create | `createBlockFormGroup(block: Block): FormGroup` — factory with discriminated `@switch` |
| `src/app/utils/block-form.spec.ts` | Create | Tests for form group creation per type, value extraction, type safety |
| `src/app/services/post.service.ts` | Modify | Add `addPost()`, `updatePost()`, `deletePost()` methods |
| `src/app/services/post.service.spec.ts` | Modify | Tests for new CRUD methods |
| `src/app/app.routes.ts` | Modify | Add `/admin/new` and `/admin/edit/:slug` lazy routes with `browserGuard` |
| `src/app/pages/editor/editor.ts` | Create | Page component — metadata form + block list + preview panel |
| `src/app/pages/editor/editor.html` | Create | Two-column layout (editor left, preview right) |
| `src/app/pages/editor/editor.css` | Create | Split-pane styles |
| `src/app/pages/editor/editor.spec.ts` | Create | Integration tests for the page |
| `src/app/editor/editor-block.ts` | Create | Wrapper: drag handle, type badge, edit/delete controls |
| `src/app/editor/heading-editor.ts` | Create | Select for level (1-6) + textarea for heading text |
| `src/app/editor/paragraph-editor.ts` | Create | Textarea for paragraph text |
| `src/app/editor/code-editor.ts` | Create | Input for language + textarea for code |
| `src/app/editor/image-editor.ts` | Create | Inputs for src, alt, caption |
| `src/app/editor/toolbar.ts` | Create | Buttons to add each block type |
| `package.json` | Modify | Add `@angular/cdk` dependency |

## Interfaces / Contracts

### Updated Block types (PR1)

```typescript
// types.ts — each block gains id
export interface HeadingBlock {
  id: string;            // new
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}
// Same for ParagraphBlock, CodeBlock, ImageBlock
```

### Form factory (PR1)

```typescript
// block-form.ts
export function createBlockFormGroup(block: Block): FormGroup {
  const base = { id: new FormControl({ value: block.id, disabled: true }) };
  switch (block.type) {
    case 'heading':
      return new FormGroup({
        ...base,
        type: new FormControl('heading', { nonNullable: true }),
        level: new FormControl(block.level, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    // ... same pattern for paragraph, code, image
  }
}
```

### PostService CRUD contract (PR1)

```typescript
// PostService additions
addPost(post: Post): void       // pushes to signal, validates slug uniqueness
updatePost(slug: string, post: Post): void  // replaces by slug
deletePost(slug: string): void  // filters out by slug
```

### Client-only guard (PR1)

```typescript
// Can be inline in routes or a standalone function
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const browserGuard = () => isPlatformBrowser(inject(PLATFORM_ID));
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | `createBlockFormGroup()` for all 4 block types | Assert correct FormGroup shape per type, value extraction matches, disabled `id` control |
| Unit | `PostService` CRUD | Add preserves existing posts, update replaces correct slug, delete removes, slug uniqueness check |
| Unit | `browserGuard` | Mock `PLATFORM_ID` — server returns false, browser returns true |
| Integration | `EditorBlockComponent` per type | Create component with `FormGroup` input, assert form controls render and propagate changes |
| Integration | `ToolbarComponent` | Click each add button, assert output event with correct `BlockType` |
| Integration | Editor page | Load with empty/new state, load with existing blocks, verify preview renders, verify save calls service |

## Threat Matrix

N/A — no routing to shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. The `id` field on Block interfaces is additive — existing code compiles as long as objects created inline (like the hardcoded seed data) are updated to include `id`. All seed data in `post.service.ts` needs `id` values added. PR1 handles this.

## Open Questions

- [ ] Should `id` generation be inside `createBlockFormGroup()` or passed in from the caller? Passed-in is more testable; factory-with-default is more ergonomic.
- [ ] Slug uniqueness: validate on save only, or also debounced during typing?
