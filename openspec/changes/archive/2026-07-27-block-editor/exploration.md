## Exploration: Block Editor

### Current State

**Block system is already built** — the previous SDD cycle (`block-renderer-system`) replaced `Post.body: string` with `Block[]` discriminated union and implemented all four renderer components:

| File | Purpose |
|------|---------|
| `src/app/blocks/types.ts` | `BlockType`, `HeadingBlock`, `ParagraphBlock`, `CodeBlock`, `ImageBlock`, `Block` union |
| `src/app/blocks/block-renderer.ts` | Dispatch component — `@for` + `@switch` on `block.type` |
| `src/app/blocks/renderers/` | 4 standalone renderer components (`heading-renderer`, `paragraph-renderer`, `code-renderer`, `image-renderer`) |
| `src/app/models/post.model.ts` | `Post { id, title, slug, excerpt, createdAt, tags, coverColor, body: Block[] }` |

**PostService** (`src/app/services/post.service.ts`): In-memory `signal<Post[]>` with 3 mock posts. Only has `getPostBySlug()` — no `addPost()`, `updatePost()`, or `deletePost()`.

**Routing** (`src/app/app.routes.ts`): Two public routes — `''` (Home) and `post/:slug` (PostDetail). No admin/editor routes.

**Dependencies**: `@angular/forms` v22 is installed. `@angular/cdk` is **NOT** installed.

**ReactiveForms usage in project**: **None** — zero `FormGroup`/`FormArray`/`FormControl`/`ReactiveFormsModule` imports anywhere. This is greenfield.

**Testing patterns**: All 11 spec files use `TestBed.createComponent()`, `setInput()`, `detectChanges()`. No `HttpClientTestingModule` or routing harness complexity.

### Affected Areas

- `src/app/app.routes.ts` — add `/admin/new` and `/admin/edit/:slug` routes
- `src/app/services/post.service.ts` — add `addPost()`, `updatePost()`, `deletePost()`
- `src/app/services/post.service.spec.ts` — test new CRUD methods
- `src/app/blocks/types.ts` — possibly add `id` field to blocks for drag-drop tracking
- `src/app/blocks/block-renderer.ts` — minor: make `blocks` writable signal or accept form value
- `src/app/pages/editor/editor.ts` — **new**: main editor page component
- `src/app/pages/editor/editor.html` — **new**: editor template (metadata form + blocks editor + preview)
- `src/app/pages/editor/editor.spec.ts` — **new**: editor page tests
- `src/app/components/block-editor/` — **new**: block editor components directory
- `src/app/components/block-editor/editor-toolbar.ts` — **new**: add block toolbar
- `src/app/components/block-editor/editor-block.ts` — **new**: wrapper per block with drag handle + delete + edit mode
- `src/app/components/block-editor/editor-block.spec.ts` — **new**: tests
- `src/app/components/block-editor/editors/heading-editor.ts` — **new**: heading block editor
- `src/app/components/block-editor/editors/heading-editor.spec.ts` — **new**: tests
- `src/app/components/block-editor/editors/paragraph-editor.ts` — **new**: paragraph block editor
- `src/app/components/block-editor/editors/paragraph-editor.spec.ts` — **new**: tests
- `src/app/components/block-editor/editors/code-editor.ts` — **new**: code block editor
- `src/app/components/block-editor/editors/code-editor.spec.ts` — **new**: tests
- `src/app/components/block-editor/editors/image-editor.ts` — **new**: image block editor
- `src/app/components/block-editor/editors/image-editor.spec.ts` — **new**: tests
- `src/app/utils/block-form.ts` — **new**: `createBlockFormGroup()` factory, block-to-form sync utilities
- `src/app/utils/block-form.spec.ts` — **new**: form factory tests
- `package.json` — add `@angular/cdk` dependency

### Approaches

1. **Angular CDK DragDrop — full form model with live preview** — FormArray of FormGroups for blocks, CDK DragDropModule for reordering, BlockRendererComponent for live preview, per-type editor components
   - Pros: CDK drag-drop is well-tested, touch-friendly, accessible; FormArray maps naturally to Block[]; reuse existing BlockRendererComponent for preview; clean separation of concerns
   - Cons: CDK adds ~100KB to bundle; more boilerplate than a simple array; learning curve for the form model
   - Effort: High

2. **Signal-based model (no Forms) — pure signals + drag events** — use `signal<Block[]>()` directly, no FormArray, implement drag-drop with HTML5 native DnD or pointer events
   - Pros: Lightweight (no Forms dependency beyond what's needed), no CDK, simpler mental model
   - Cons: No reactive form validation; manual dirty tracking; native HTML5 DnD is inconsistent; more bespoke code for drag-drop
   - Effort: Medium

3. **Mixed: form for metadata, signals for blocks** — use ReactiveForms for post metadata (title, slug, etc.) and `signal<Block[]>` for blocks, with native HTML5 DnD
   - Pros: Form validation for metadata fields; simpler block management; no CDK
   - Cons: Two state management approaches in one page; metadata is a FormGroup but blocks are signals — inconsistent; HTML5 DnD has poor mobile support
   - Effort: Medium

### Recommendation

**Approach 1** — Angular CDK DragDrop + ReactiveForms + per-type editors + live preview.

Rationale:
- **This is a LEARNING project** and the user wants to learn Angular properly. Forms + CDK are core Angular skills they should practice.
- The existing `BlockRendererComponent` makes live preview essentially free — pass the form's raw value to `[blocks]`.
- CDK DragDrop is the idiomatic Angular solution. Not using it would be skipping a key framework capability.
- A `FormArray<FormGroup>` over `Block[]` is the correct reactive forms pattern. The factory function `createBlockFormGroup()` handles the discriminated union.
- Per-type editor components mirror the existing renderer pattern — clean and extensible.

Key design decisions:

```
EditorPage
├── Metadata form (title, slug, excerpt, tags, coverColor)
├── Block editor area
│   ├── Toolbar — add block buttons
│   └── cdkDropList of cdkDrag items
│       └── EditorBlockComponent (per block wrapper)
│           ├── Drag handle
│           ├── Type selector (change block type)
│           ├── Per-type editor component (heading-editor, etc.)
│           ├── Delete button
│           └── Move up/down buttons
└── Live preview panel (sidenav or below)
    └── BlockRendererComponent [blocks]="blocksFormArray.value"
```

**Form model**:
```typescript
// src/app/utils/block-form.ts
function createBlockFormGroup(block: Block): FormGroup {
  switch (block.type) {
    case 'heading':
      return new FormGroup({
        type: new FormControl('heading' as const, { nonNullable: true }),
        level: new FormControl(block.level, { nonNullable: true, validators: [Validators.min(1), Validators.max(6)] }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'paragraph':
      return new FormGroup({
        type: new FormControl('paragraph' as const, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'code':
      return new FormGroup({
        type: new FormControl('code' as const, { nonNullable: true }),
        language: new FormControl(block.language, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'image':
      return new FormGroup({
        type: new FormControl('image' as const, { nonNullable: true }),
        src: new FormControl(block.src, { nonNullable: true }),
        alt: new FormControl(block.alt, { nonNullable: true }),
        caption: new FormControl(block.caption ?? '', { nonNullable: true }),
      });
  }
}
```

**Live preview**: Use `blocksFormArray.value` as input to `BlockRendererComponent`. Convert via a `computed()` or `toSignal()`:
```typescript
readonly previewBlocks = computed(() => 
  this.blocksFormArray.value as Block[]
);
```

But wait — `FormArray.value` is typed as `any[]`. Need a typed helper. A `computed()` that reads `this.blocksFormArray.getRawValue()` works but doesn't react to FormArray changes. Better: use `toSignal(this.blocksFormArray.valueChanges)` or just pass `this.blocksFormArray.getRawValue()` — but since BlockRendererComponent uses `@for` with `$index` tracking, any change to the form array will re-render.

**New post flow**:
1. Navigate to `/admin/new`
2. Pre-fill form with empty post: title '', slug '', excerpt '', tags [], coverColor '#4ECDC4', body [paragraph { text: '' }]
3. On save: `postService.addPost(post)` — generates UUID id, sets createdAt, adds to signal
4. Navigate to `/post/{slug}` after save

**Edit post flow**:
1. Navigate to `/admin/edit/:slug`
2. Load post from `PostService.getPostBySlug(slug)`, patch form
3. On save: `postService.updatePost(slug, updatedPost)`
4. Navigate to `/post/{slug}` after save

**Delete**: Button in editor to delete post. `postService.deletePost(slug)`.

**Saving strategy (no backend)**:
- V1: In-memory only (PostService signal). Survives only until refresh.
- V2: localStorage persistence — serialize signal on save, hydrate on init. Can be added later with minimal refactor.
- V3: Backend API. Also straightforward since PostService is the single source of truth.

**Block ID for drag-drop tracking**: CDK's `cdkDropList` works with `trackBy` on identity. Adding a `uuid` string field to each `Block` interface in `types.ts` is recommended so CDK can track blocks by ID rather than array index.

### Risks

- **FormArray type safety**: `FormArray` doesn't natively support discriminated unions. The `getRawValue()` returns `any[]`. Need typed getter utilities and careful casting.
- **CDK bundle size**: `@angular/cdk/drag-drop` adds ~80-100KB. Consider lazy-loading the editor route to avoid impacting public pages.
- **SSR compatibility**: The editor page should be client-only (no SSR for admin). Can use `canActivate` guard or check `isPlatformBrowser`. CDK drag-drop needs browser APIs.
- **Live preview performance**: If FormArray has many blocks, converting to preview on every `valueChanges` event could be expensive. Consider `debounceTime` or explicit "preview" button.
- **Form ↔ Block[] sync**: When loading existing posts, need to convert `Block[]` to `FormGroup[]`. When saving, need `FormGroup[]` back to `Block[]`. Need to handle field mappings carefully (dates, optional fields).
- **Slug uniqueness**: `PostService.getPostBySlug()` currently returns `Post | undefined`. When creating new posts, need to validate slug uniqueness before saving.
- **Image upload**: For now, image blocks use a URL string input. No file upload. This is a V1 limitation.

### Ready for Proposal

Yes — scope is well-defined, the existing block infrastructure provides a solid foundation, and the form model approach is clear. The orchestrator should confirm:

1. **Route paths**: `/admin/new` and `/admin/edit/:slug` — or does the user prefer a different prefix?
2. **Block ID for CDK tracking**: Add `id: string` to every Block interface for CDK drag-drop tracking?
3. **Local storage V2**: On the roadmap immediately, or defer?
4. **Live preview layout**: Side panel (desktop) vs. toggle (mobile) vs. below the editor?
5. **Review workload**: Estimated 500-700 lines across all new files. Recommend chained PRs.
