# Archive Report — visual-identity-system

**Archived at**: 2026-08-15
**Status**: **PARTIAL — "archived with note"** (intentional partial archive per explicit user decision)

## Summary

The "Multicolor Floating" visual identity change ships a neutral app shell (navbar + footer), a curated 6-theme catalog (`--post-*` role system, `.theme-<name>` classes in the global stylesheet), a required `Post.theme` field replacing `coverColor`, themed PostCard / PostDetail containers, CSS-only floating motion with `prefers-reduced-motion` degradation (including the `appTilt` reduced-motion branch), and a curated theme gallery for the editor. The change is **archived as `partial`** at the user's explicit request to advance closure and commit the leftover prior-session work "in order later"; the verified-green committed deliverable plus the known pending items are recorded below.

**Final-state authority note**: the facts below describe the change AT CLOSE. Where they differ from the intermediate `apply-progress.md` (which embeds a verify report written at `2e7b589`), the final-state facts and the committed-tree evidence outrank the intermediate claims.

## Final-State Facts (authoritative — outrank intermediate snapshots)

### Verified green in the committed tree (HEAD `2e7b589`)
- `pnpm ng test --watch=false` → **15 files / 59 tests passed (59/59)**.
- `pnpm build` → **exit 0**, SSR compile + **1 route prerendered**.
- Theme applied on post-card and post-detail (`theme-<name>` container classes).
- `appTilt` `prefers-reduced-motion` branch (mock `matchMedia` → no transform).
- Navbar / footer shell chrome + single editorial `h1` on home.
- `Post.theme` required; `coverColor` absent from `src/`.
- `git grep coverColor` in `src/` → only negative assertions (proof of removal).

### Known pending items (recorded at close)
1. **Spec post-listing — `addPost` / `deletePost` not in committed tree (CRITICAL in verify).** The committed `src/app/services/post.service.ts` exposes only `getPosts` / `getPostBySlug` / `updatePost`; `addPost`/`deletePost` exist only in the uncommitted working tree (prior session). Pre-existing gap (never present in committed history), not a regression introduced here.
2. **Spec block-editor — editor not in committed deliverable (WARNING in verify).** The theme gallery / `theme` FormControl / `save→theme` mapping live only in uncommitted working-tree files (`src/app/pages/editor/`, `src/app/editor/`, `src/app/utils/`). `git ls-tree HEAD` confirms the editor is absent from the committed tree.
3. **Task 4.3 (human browser pass)** — `pnpm dev` reduced-motion + chrome + gallery remains **unmarked** (human-gated; intentionally not marked by the archive worker).

### Test-count reconciliation
- `apply-progress.md` reported **118 tests / 23 files** (working tree, folding in untracked prior-session files).
- The authoritative **clean committed tree gives 59 tests / 15 files**.
- The 118 figure is not the final-state count; 59 is the committed-tree count at close.

## Specs Synced (Source of Truth)

| Domain | Action | Details |
|--------|--------|---------|
| post-listing | Updated | MODIFIED 5 requirements: Post Model Definition (`coverColor`→`theme`), Post Service (distinct themes, `updatePost` partial-merge), PostCard (theme class + tinted-at-rest + float loop), Tilt Directive (reduced-motion), Home Page Integration (editorial `h1`, rainbow-at-rest). |
| post-detail | Updated | MODIFIED PostDetail Component: themed `.theme-<name>` container, `--post-bg`/`--post-ink`/`--post-accent` roles, no hardcoded white. |
| block-editor | **Deferred (NOT merged)** | Delta left in the archived change folder. Editor deliverable is pending/uncommitted → per the "migrate only non-pending sections" instruction, the MODIFIED Post Metadata Form (theme gallery) is NOT yet promoted to the permanent `openspec/specs/block-editor/spec.md`. It must be merged when the editor work is committed. |
| visual-identity-system | Retained (new permanent domain spec) | `openspec/specs/visual-identity-system/spec.md` is a NEW capability domain spec (shell chrome, theme catalog, fallback, legibility floor, code theming, motion, gallery, page structure). **Decision: do NOT migrate it into post-listing/post-detail/block-editor** — its domain-specific effects are already reflected there via the merged deltas, and folding it in would duplicate requirements and blur the capability boundary. It stands as the permanent spec for the new domain. Its "Curated Theme Gallery" requirement corresponds to the pending editor work (see pending #2). |

### Migration decision rationale (task #2)
The new spec is a coherent, cross-cutting capability spec with no natural single home in the three existing domain specs; the change's own MODIFIED deltas already carry the per-domain effects into post-listing / post-detail. Keeping `visual-identity-system/spec.md` as its own permanent domain is correct OpenSpec behavior and satisfies "if the change is already reflected in the domain specs, sync". No new requirements were invented.

## Pending Items & Resolution Plan

| # | Pending item | Where it lives | Resolution |
|---|--------------|----------------|------------|
| 1 | `addPost`/`deletePost` in `post.service.ts` not committed (CRITICAL) | Working tree (uncommitted, prior session) | User commits the leftover prior-session work (block-editor archive + prior-session restos) **in order later**; then re-verify. |
| 2 | Editor (theme gallery) not in committed deliverable (WARNING) | Working tree: `src/app/pages/editor/`, `src/app/editor/`, `src/app/utils/` | Same deferred-commit path as #1; after commit, merge the deferred `block-editor` delta into `openspec/specs/block-editor/spec.md` (this archive report is the note to do so). |
| 3 | Task 4.3 human browser pass unmarked | `tasks.md` (in this archive) | Human runs `pnpm dev` (reduced-motion + chrome + gallery) and marks 4.3. |

**Commit ordering for follow-up**: (a) block-editor archive + prior-session restos, (b) merge the `block-editor` delta into the permanent block-editor spec, (c) re-verify committed tree (expect `~59` + editor/service CRUD tests), (d) mark task 4.3 after the human browser pass.

## Artifacts

| Artifact | Location |
|----------|----------|
| Proposal | `openspec/changes/archive/2026-08-15-visual-identity-system/proposal.md` |
| Exploration | `openspec/changes/archive/2026-08-15-visual-identity-system/exploration.md` |
| Spec deltas | `openspec/changes/archive/2026-08-15-visual-identity-system/specs/{post-listing,post-detail,block-editor}/spec.md` |
| Design | `openspec/changes/archive/2026-08-15-visual-identity-system/design.md` |
| Tasks | `openspec/changes/archive/2026-08-15-visual-identity-system/tasks.md` |
| Apply-Progress (+ embedded verify report) | `openspec/changes/archive/2026-08-15-visual-identity-system/apply-progress.md` |
| Main specs updated | `openspec/specs/post-listing/spec.md`, `openspec/specs/post-detail/spec.md` |
| New permanent spec | `openspec/specs/visual-identity-system/spec.md` |

## Task Completion

All implementation tasks 1.1–3.8 and 4.1–4.2 are `[x]` in the archived `tasks.md`. Task **4.3 remains `[ ]`** (human browser pass) — intentionally not marked per protocol and per the user's explicit instruction; it is recorded as pending #3 above.

## Key Decisions

1. **Archive as `partial` / "archived with note"** per explicit user decision — advance closure now; commit leftover prior-session work "in order later".
2. **Do NOT migrate `visual-identity-system/spec.md` into the domain specs** — new capability domain; domain effects already reflected via merged deltas.
3. **Defer the `block-editor` delta merge** — editor deliverable pending/uncommitted; merge when committed.
4. **Post-listing / post-detail deltas merged now** — those changes are committed and verified green in the committed tree.
5. **Mechanical archive move** with snapshot + `diff -r` readback (empty diff = byte-identical).

## Risks

- The permanent `openspec/specs/post-listing/spec.md` retains `addPost`/`deletePost` scenarios whose code is not yet in the committed tree. This pre-dates the change (scenarios were already present) and is tracked as pending #1.
- The permanent `openspec/specs/block-editor/spec.md` still describes the old `coverColor` metadata form until the deferred delta merge (pending #2) is performed.
- If the deferred commits and re-verify are not done, the archived note remains the only record of the gap. The resolution plan above is the committed path.

## Verdict

⚠️ **CHANGE ARCHIVED AS PARTIAL (with note)** — committed deliverable verified green (59/59 tests, build exit 0); three documented pending items (uncommitted `addPost`/`deletePost`, uncommitted editor gallery, unmarked human task 4.3) to be resolved via deferred prior-session commits + re-verify, per explicit user decision.
