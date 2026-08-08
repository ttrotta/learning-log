# Visual Identity System Specification

## Purpose

Per-post visual identity: a neutral app shell, a curated 6-theme catalog applied via CSS custom properties on `.theme-<name>` containers, and CSS-only floating motion. The rainbow home grid and themed detail page ship this identity; legibility is the floor.

## Requirements

### Requirement: App Shell Chrome

The system MUST render a neutral navbar (brand + nav links) and footer (meta/links) in the `App` template, wrapping `router-outlet` on every route. Shell chrome MUST be neutral and MUST NOT carry any post theme class. The navbar MUST be sticky; on narrow viewports the nav SHALL collapse behind an accessible, keyboard-operable toggle. Chrome SHALL be static markup with no route changes and no runtime-JS-only content, so it renders identically under SSR/prerender and client.

#### Scenario: Chrome renders on every route

- GIVEN the app renders any route
- WHEN the DOM is inspected
- THEN a navbar with brand and nav links SHALL exist
- AND a footer SHALL exist
- AND neither SHALL have any `.theme-*` class

#### Scenario: Chrome is SSR-safe

- GIVEN prerendered home HTML
- WHEN the static markup is inspected
- THEN navbar and footer SHALL be present without hydration-dependent nodes

### Requirement: Theme Catalog and Role Contract

The system MUST ship exactly 6 themes (Solaris, Abyss, Neon, Meadow, Candy, Paper). Each theme MUST define `--post-bg`, `--post-surface`, `--post-ink`, `--post-accent`, `--post-font-display`, `--post-font-body` on its `.theme-<name>` class in the global stylesheet `src/styles.css`. The catalog MUST be global-only, never a component stylesheet, keeping components under the 4kB `anyComponentStyle` budget. Descendants SHALL consume roles via `var()` inheritance. The theme class on the container SHALL be the test observable, not computed `var()` values.

#### Scenario: Catalog defines all roles for all themes

- GIVEN `src/styles.css`
- WHEN inspected
- THEN each of the 6 `.theme-*` classes SHALL declare the 6 `--post-*` custom properties

#### Scenario: Catalog is global, not component-scoped

- GIVEN the theme catalog source
- WHEN file placement is inspected
- THEN catalog and keyframes SHALL live in a global stylesheet
- AND SHALL NOT be duplicated in any component `styles`/`styleUrl`

### Requirement: Default Theme Fallback

The system MUST render any post lacking a valid theme with the default theme (Paper). The resolver SHALL map missing or unknown theme values to `theme-paper`, so legacy and malformed posts render fully styled.

#### Scenario: Post without theme renders styled

- GIVEN a post with no `theme` or an unknown theme value
- WHEN its card and detail containers render
- THEN each container SHALL have class `theme-paper`
- AND content SHALL render without styling gaps

### Requirement: Legibility Floor

Every theme MUST keep body-ink contrast against its background legible (WCAG-comparable). Themed text SHALL use `--post-ink`, not hardcoded white, so light themes never show white-on-light text. A theme that fails contrast SHALL NOT be accepted.

#### Scenario: Detail hero uses theme ink

- GIVEN a themed post-detail hero
- WHEN its text color is determined
- THEN text SHALL use `--post-ink` for its theme
- AND SHALL remain legible against `--post-bg` in every theme

### Requirement: Code Block Theming

The global catalog MUST add `.theme-<name> code.hljs` overrides: the code island SHALL use `--post-surface`/`--post-ink`, light themes SHALL get light-appropriate token colors, and dark themes (Neon, Abyss) SHALL keep `github-dark` tokens. Block renderer files SHALL NOT be modified, and no `::ng-deep` SHALL be used.

#### Scenario: Light theme code block is legible

- GIVEN a code block inside a light-theme container
- WHEN rendered
- THEN `.theme-* code.hljs` SHALL apply light-appropriate tokens
- AND the island SHALL use `--post-surface`/`--post-ink`

#### Scenario: Dark theme keeps github-dark

- GIVEN a code block inside a Neon or Abyss container
- WHEN rendered
- THEN `github-dark` token styling SHALL remain in force

### Requirement: Floating Motion

The system MUST provide ambient background blobs (slow drift), card levitation (float loop), and CSS tilt on hover, implemented with `@keyframes` plus the existing `appTilt` directive. Motion MUST be CSS-only so it cannot cause SSR hydration mismatch. Under `prefers-reduced-motion: reduce`, blobs and float loops SHALL become static and tilt SHALL degrade to a simple hover response without transform animation.

#### Scenario: Ambient motion is applied

- GIVEN motion enabled
- WHEN a themed page renders
- THEN blob and float `@keyframes` SHALL apply to the ambient and card elements

#### Scenario: Reduced motion is respected

- GIVEN `prefers-reduced-motion: reduce`
- WHEN a themed page renders and a card is hovered
- THEN blobs and cards SHALL be static
- AND tilt SHALL NOT apply a transform animation

### Requirement: Curated Theme Gallery

The system MUST expose a catalog module and an editor gallery presenting exactly the 6 curated themes. The gallery SHALL replace the free-form color input as the single theme selection surface; no free-form color picking SHALL remain.

#### Scenario: Gallery lists the six themes

- GIVEN the editor's theme picker
- WHEN rendered
- THEN the gallery SHALL show the 6 themes by name
- AND selecting one SHALL set the post's `theme`

### Requirement: Page Structure and Accessibility

Every page SHALL contain exactly one `h1`. The navbar SHALL own the brand as a link (not an `h1`); the home `h1` SHALL be an editorial page heading; the detail hero title SHALL be the detail page's sole `h1`. Keyboard operability and reduced-motion behavior SHALL be maintained.

#### Scenario: Home has exactly one h1

- GIVEN the home page rendered
- WHEN headings are collected
- THEN exactly one `h1` SHALL exist
- AND it SHALL be the editorial heading, not the navbar brand

#### Scenario: Detail has exactly one h1

- GIVEN a rendered post-detail
- WHEN headings are collected
- THEN exactly one `h1` SHALL exist (the hero title)
