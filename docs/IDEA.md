# Project Vision & Architectural Decisions (docs/IDEA.md)

## Project Overview

**Name:** Learning Loop
**Purpose:** An interactive, highly creative platform to write and store personalized technical blogs. The goal is to break away from standard, uniform blog layouts and provide a unique visual and reading experience for each post.

## Technical Decisions

### 1. Package Manager: pnpm

- **Decision:** Strict use of `pnpm` for dependency management.
- **Rationale:** Faster installations, stricter dependency resolution, and efficient disk space usage compared to standard `npm`. This must be documented in `README.md` and enforced via `AGENTS.md`.

### 2. Core Framework: Native Angular (SPA)

- **Decision:** Pure Client-Side Angular.
- **Rationale:** Focuses the project on mastering Angular's core (Directives, Component architecture, Reactive Forms) while enabling highly dynamic, interactive client-side rendering.

### 3. UI/UX & Aesthetics

- **Decision:** "Multicolor Floating" Aesthetic with CSS-based 3D Effects.
- **Rationale:**
  - The UI will feature elements "floating" in a vibrant, multi-colored space.
  - **3D Tilt Effect:** Inspired by modern landing pages, interactive elements will use vanilla CSS transforms (`rotateX`, `rotateY`, `perspective`) and dynamic radial gradients to simulate 3D volume and lighting reacting to mouse movement, implemented via an Angular Custom Directive, avoiding heavy libraries like Three.js.
  - A unique, non-traditional typography will be selected to reinforce the creative identity.

### 4. Content Creation: Custom Block Editor

- **Decision:** Transition from static Markdown to a dynamic, customizable editor.
- **Rationale:** To ensure each blog post can be visually unique, the platform will feature an editor that saves content as structured data (e.g., JSON blocks). This allows individual posts to have distinct layouts, colors, and interactive elements, rather than forcing all content into a single, uniform template.
