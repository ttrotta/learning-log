# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Author:** the project owner. Publishes learning-log posts about what they are learning and building. Authoring happens through the block editor.

**Readers:** the audience. Read the published posts; reading experience matters as much as authoring. The author is the only publisher today; readers are not expected to contribute content.

## Product Purpose

A visual learning log: a living record of what the author is learning, where each post carries its own visual identity that reflects its topic. The product exists to make learning visible and worth reading.

## Positioning

Each post is a self-themed artifact: palette and typography are chosen per post, so the visual identity of a post mirrors the subject it documents. The mechanism a neighboring blog could not truthfully copy is the per-post visual identity system, not the act of publishing.

## Operating Context

- Angular 22 SPA with SSR (Express 5), standalone components, Signals-first state.
- Posts are JSON block documents (heading, paragraph, code, image), rendered by a block renderer and authored in a visual block editor with drag-and-drop.
- CSS is component-scoped (no Tailwind); 3D tilt effects are CSS-based custom directives (no heavy 3D libraries).
- Package manager is `pnpm`; tests run with Vitest through the Angular builder (`pnpm ng test --watch=false`).
- Project goal: the author is learning and mastering native Angular; technical artifacts default to English.

## Capabilities and Constraints

- Home page lists posts as cards; post detail renders the block content; admin routes (`/admin/new`, `/admin/edit/:slug`) are client-only (no SSR prerender).
- Modern Angular inputs (`input.required<T>()`) are the established convention; `@Input()` decorators are not used.
- Strict TDD is active for implementation work.
- Visual identity system (Change 5): multicolor floating aesthetic, per-post themes (palette + typography), CSS custom properties per post, animations and floating effects. Decided facts only; detailed direction is owned by the design session, not this file.

## Brand Commitments

- Product name: Learning Log (Learning Loop as the working project identity).
- Binding visual constraint volunteered by the owner: **multicolor floating** aesthetic, with per-post themes driven by CSS custom properties. Recorded here as a constraint; not yet expanded into a direction.

## Evidence on Hand

- Existing seed posts and archived SDD changes under `openspec/changes/archive/` (build-homepage, post-detail-page, block-renderer-system, block-editor).
- No real images, testimonials, or press exist; future work must not fabricate them.

## Product Principles

1. Per-post visual identity is the product's signature: the topic of a post shapes its palette and typography.
2. Reading experience matters as much as authoring: a post should be as pleasant to read as it is to write.
3. The functional product is stable: blocks, editor, SSR, routes, and existing content are preserved; the change is the visual system.
4. The project remains a vehicle for learning native Angular: keep idioms modern (signals, standalone, inputs) and explain the why.
5. Playful aesthetics serve, never obstruct, comprehension.

## Accessibility & Inclusion

No product-specific requirement established yet. Legibility under the multicolor aesthetic is an explicit design consideration for the visual identity session.
