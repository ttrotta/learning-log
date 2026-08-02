# Archive Report: block-renderer-system

**Archived**: 2026-07-25
**Archive path**: openspec/changes/archive/2026-07-25-block-renderer-system/
**Mode**: Strict TDD — 19/19 tasks complete
**Verdict**: PASS (build, tests, lint all clean)

## Summary

The block-renderer-system change replaced `Post.body: string` with `Block[]` — a discriminated union of `HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock`. Added 4 per-type standalone renderer components, a `BlockRendererComponent` with `@for`/`@switch` dispatch, and `highlight.js` syntax highlighting for code blocks. Mock post data migrated from Markdown strings to structured `Block[]` arrays.

## Artifacts Archived

| Artifact | Path/ID | Status |
|----------|---------|--------|
| Exploration | openspec/changes/archive/2026-07-25-block-renderer-system/exploration.md | ✅ |
| Proposal | openspec/changes/archive/2026-07-25-block-renderer-system/proposal.md (obs #38) | ✅ |
| Spec | obs #39 (sdd/block-renderer-system/spec) + openspec/specs/block-renderer/spec.md | ✅ |
| Design | openspec/changes/archive/2026-07-25-block-renderer-system/design.md (obs #40) | ✅ |
| Tasks | openspec/changes/archive/2026-07-25-block-renderer-system/tasks.md (obs #41) | ✅ — 19/19 complete |
| Apply Progress | openspec/changes/archive/2026-07-25-block-renderer-system/apply-progress.md (obs #42) | ✅ |
| Verify Report | openspec/changes/archive/2026-07-25-block-renderer-system/verify-report.md (obs #44) | ✅ |
| Archive Report | This file + Engram sdd/block-renderer-system/archive-report | ✅ |

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| post-listing | Updated | `body` field type: `string` → `Block[]`; scenario updated from "required string" to "Block[] array" with compile-time type error for string assignment |
| post-detail | Updated | Body section: raw `{{ post.body }}` → `<app-block-renderer [blocks]="post.body">`; added delegation scenario |
| block-renderer | Registry removed | Block Registry requirement removed (registry.ts deleted as dead code — `@switch` dispatch replaces registry pattern) |

## Registry Removal

The `registry.ts` file was removed during implementation because the `@switch` dispatch in the `BlockRendererComponent` template renders components directly without needing an intermediate registry lookup. The spec's "Block Registry" requirement was:

- **Removed from**: `openspec/specs/block-renderer/spec.md` and Engram `sdd/block-renderer-system/spec` (obs #39)
- **Reason**: Dead code — `@switch` handles type→component dispatch natively
- **Build impact**: The original `registry.ts` had a type error (`Type<{ block: Block }>` incompatible with `InputSignal<SpecificBlock>`) that caused a build failure. Removing the file resolved the error and the build now passes.

## Tasks Completion

All 19 tasks are marked `[x]` in the archived `tasks.md`:
- Phase 1 (Foundation): 4/4 tasks ✅
- Phase 2 (Per-Type Renderers): 8/8 tasks ✅
- Phase 3 (Dispatch + Wiring): 4/4 tasks ✅
- Phase 4 (Migration + Verification): 3/3 tasks ✅

## Test Results

- **Tests**: 34/34 pass (11 files, 0 failed, 0 skipped)
- **Build**: ✅ OK (registry.ts removed, type error resolved)
- **Lint**: ✅ Clean

## Design Decisions Followed

| Decision | Status |
|----------|--------|
| Discriminated union Block type | ✅ Followed |
| `@switch` dispatch in BlockRenderer | ✅ Followed |
| highlight.js via `afterNextRender` | ✅ Followed |
| Post model `body: Block[]` | ✅ Followed |
| Mock data migrated | ✅ Followed |
| Exported const registry (not DI) | ❌ Removed — dead code, `@switch` dispatch replaces it |

## Engram Observation IDs

| Artifact | Observation ID |
|----------|---------------|
| Proposal | #38 |
| Spec (updated) | #39 |
| Design | #40 |
| Tasks | #41 |
| Apply Progress | #42 |
| Verify Report | #44 |
| Archive Report | (current save) |
