# Tasks: Block Editor

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~850-1050 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 Foundation → PR2 Editor UI |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Types, form factory, PostService CRUD, CDK install | PR 1 | `npx vitest run -- src/app/utils/block-form.spec.ts src/app/services/post.service.spec.ts` | N/A (infra only, no route) | Revert types.ts, block-form.ts, post.service.ts; `pnpm remove @angular/cdk` |
| 2 | Editor page, per-type editors, toolbar, drag-drop, preview | PR 2 | `npx vitest run -- src/app/pages/editor/ src/app/editor/` | Navigate to `/admin/new` in browser | Revert editor page, editor components, app.routes.ts |

## PR 1: Foundation

- [x] **1.1** Add `id: string` to all Block interfaces in `types.ts`; add `id` to seed data in `post.service.ts`
- [x] **1.2** Change `block-renderer.html` `@for` tracking from `$index` to `block.id`
- [x] **1.3** Install `@angular/cdk` via `pnpm add @angular/cdk`
- [x] **1.4** Create `browserGuard` factory (`isPlatformBrowser` check) inline in `app.routes.ts`
- [x] **1.5 (RED)** Write `block-form.spec.ts`: create FormGroup per block type, disabled `id` control, value extraction
- [x] **1.6 (GREEN)** Create `block-form.ts` with `createBlockFormGroup(block: Block): FormGroup` — discriminated `@switch`
- [x] **1.7 (RED)** Write `post.service.spec.ts` tests: `addPost` preserves existing, `updatePost` replaces slug, `deletePost` removes, slug uniqueness
- [x] **1.8 (GREEN)** Add `addPost()`, `updatePost()`, `deletePost()` to `PostService` with signal-based state

## PR 2: Editor UI

- [x] **2.1 (RED)** Write editor page spec: empty state, load existing post populates form, post-not-found shows error
- [x] **2.2 (GREEN)** Create editor page shell (`pages/editor/editor.ts`, .html, .css) — metadata FormGroup, block FormArray, split-pane layout
- [x] **2.3** Add lazy routes `/admin/new` and `/admin/edit/:slug` with `browserGuard` to `app.routes.ts` (done in PR1 task 1.4)
- [x] **2.4** Create `HeadingBlockEditor` (level select 1-6 + text input, `readonly formGroup = input.required<FormGroup>()`)
- [x] **2.5** Create `ParagraphBlockEditor` (textarea for text)
- [x] **2.6** Create `CodeBlockEditor` (language input + monospace textarea)
- [x] **2.7** Create `ImageBlockEditor` (src, alt, caption inputs)
- [x] **2.8 (RED)** Write per-type editor tests: assert correct controls render per type, form bindings propagate
- [x] **2.9** Create `EditorBlockComponent` — drag handle, type badge, delete button, wraps per-type editor
- [x] **2.10** Create `ToolbarComponent` — add buttons per block type, emit `BlockType` output
- [x] **2.11 (RED)** Write toolbar tests: each button emits correct `BlockType`
- [x] **2.12** Wire `cdkDropList` + `cdkDrag` to FormArray; implement `drop()` handler via `FormArray.move()`
- [x] **2.13** Wire live preview panel — `BlockRendererComponent` bound to `formArray.getRawValue()`
- [x] **2.14** Implement save: validate slug uniqueness, call `addPost`/`updatePost`, navigate to `/post/{slug}`
- [x] **2.15** Write integration tests: add/remove/reorder blocks, save flow, preview syncs with form edits
