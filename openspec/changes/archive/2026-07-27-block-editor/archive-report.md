# Archive Report — block-editor

**Archived at**: 2026-07-27T05:36:00Z

## Summary

Visual block editor delivered across two chained PRs (23 tasks total). The change adds a full post editor at `/admin/new` and `/admin/edit/:slug` with: ReactiveForms-based metadata form and block FormArray, four per-type editor components (heading, paragraph, code, image), CDK DragDrop reordering, live preview via existing BlockRendererComponent, and PostService CRUD methods. Built with strict TDD — 90 tests passing across 19 test files. Production build passes.

## Artifacts

| Artifact | Location | Size / Verdict |
|----------|----------|----------------|
| Proposal | `openspec/changes/archive/2026-07-27-block-editor/proposal.md` (Engram #47) | ✅ 74 lines |
| Spec | `openspec/changes/archive/2026-07-27-block-editor/specs/` (Engram #49) | ✅ 2 delta specs (block-renderer, post-listing) + full block-editor spec |
| Design | `openspec/changes/archive/2026-07-27-block-editor/design.md` (Engram #48) | ✅ 138 lines |
| Tasks | `openspec/changes/archive/2026-07-27-block-editor/tasks.md` (Engram #50) | ✅ 53 lines, 23/23 [x] |
| Apply-Progress | Engram #51 | ✅ 15/15 listed (all 23 actually complete) |
| Verify Report | Not persisted (orchestrator confirms PASS) | ⚠️ See note |
| Init Context | Engram #2 | Project: learning-log, Angular 22, Signals, Tailwind CSS 4.1, Vitest |

> **Note on verify-report**: The verify report was not persisted to either Engram or OpenSpec. The orchestrator explicitly verified all acceptance criteria pass with 90 tests and a successful production build. The archive proceeds based on this provenance.

## Tasks Completion

All 23 tasks are marked [x] in both `tasks.md` and `apply-progress`:

- **PR 1: Foundation** — 8/8 tasks (types with `id`, `createBlockFormGroup()`, PostService CRUD, CDK install, browserGuard)
- **PR 2: Editor UI** — 15/15 tasks (editor page, 4 per-type editors, editor-block wrapper, toolbar, CDK drag-drop, live preview, save action, integration tests)

## Files Changed (Source)

| File | Action |
|------|--------|
| `src/app/blocks/types.ts` | Modified |
| `src/app/blocks/block-renderer.html` | Modified |
| `src/app/utils/block-form.ts` | Created |
| `src/app/utils/block-form.spec.ts` | Created |
| `src/app/services/post.service.ts` | Modified |
| `src/app/services/post.service.spec.ts` | Modified |
| `src/app/app.routes.ts` | Modified |
| `package.json` | Modified |
| `pnpm-lock.yaml` | Modified |
| `src/app/pages/editor/editor.ts` | Created |
| `src/app/pages/editor/editor.html` | Created |
| `src/app/pages/editor/editor.css` | Created |
| `src/app/pages/editor/editor.spec.ts` | Created |
| `src/app/editor/heading-editor.ts` | Created |
| `src/app/editor/heading-editor.spec.ts` | Created |
| `src/app/editor/paragraph-editor.ts` | Created |
| `src/app/editor/paragraph-editor.spec.ts` | Created |
| `src/app/editor/code-editor.ts` | Created |
| `src/app/editor/code-editor.spec.ts` | Created |
| `src/app/editor/image-editor.ts` | Created |
| `src/app/editor/image-editor.spec.ts` | Created |
| `src/app/editor/editor-block.ts` | Created |
| `src/app/editor/editor-block.spec.ts` | Created |
| `src/app/editor/toolbar.ts` | Created |
| `src/app/editor/toolbar.spec.ts` | Created |

## Specs Synced (Merged into Source of Truth)

| Domain | Action | Details |
|--------|--------|---------|
| block-editor | Created (NEW) | Full spec at `openspec/specs/block-editor/spec.md` (7 requirements, 13 scenarios) |
| block-renderer | Updated | MODIFIED: Block Type Definition — `id: string` added to all interfaces; 2 new scenarios (unique id, id required at compile time) |
| post-listing | Updated | MODIFIED: Post Service with Mock Data — added `addPost()`, `updatePost()`, `deletePost()`; 4 new CRUD scenarios |

## Key Decisions

1. **Two-PR delivery** via auto-chain strategy to protect the 400-line review budget (~850-1050 estimated lines). PR1: foundation (types, form model, CDK, CRUD); PR2: editor UI.
2. **`id: string` on every Block interface** via `crypto.randomUUID()` for CDK drag-drop tracking. Native Web API, zero dependencies, no collision risk.
3. **ReactiveForms `FormArray<FormGroup>`** with `createBlockFormGroup()` factory for the block model — programmatic control over dynamic lists essential for drag-drop reorder.
4. **Live preview via existing `BlockRendererComponent`** with `getRawValue()` — zero new rendering logic, already tested.
5. **Client-only admin routes** with `isPlatformBrowser` guard — lightweight, no SSR for admin.
6. **`@angular/cdk` DragDropModule** for reordering — Angular-idiomatic, accessible, touch-friendly.
7. **Editor components at `src/app/editor/`** (not `src/app/components/block-editor/` as initially proposed) — per user instruction and design update.
8. **`input.required<FormGroup>()`** signal-based inputs (not `@Input()` decorator) — per user correction during implementation.
9. **Preview blocks as a getter** (not `computed()`) because `FormArray.getRawValue()` is not signal-based and `computed()` would never re-evaluate.

## Deviations from Design

- `openspec/specs/block-editor/spec.md` references editor components at `src/app/components/block-editor/` — actual location is `src/app/editor/` per user correction.
- The apply-progress status header says "15/15 tasks complete" and "PR2: 7/7" — both stale numbers. The actual task listing is complete at 23/23 (PR1: 8/8, PR2: 15/15).

## Open Items

None.

## Verdict

✅ **CHANGE COMPLETE** — All 23 tasks, 19 test files, 90 tests passing, production build passes, acceptance criteria covered.
