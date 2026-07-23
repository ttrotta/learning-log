## Exploration: Add Dev Tooling (ESLint + Playwright)

### Current State

**ESLint:**
- No linter configured. Project has Prettier 3.9.5 for formatting only (`.prettierrc` with `singleQuote: true`, `printWidth: 100`, Angular HTML parser).
- `openspec/config.yaml` explicitly lists `linter: null`.
- Angular 22.0.6 with `@angular/build:application` (Vite-based). TypeScript 6.0. Standalone components, Signals.
- No `.eslintrc*` or `eslint.config.*` files exist anywhere.

**E2E (Playwright):**
- Only Vitest 4.1.10 for unit tests via `@angular/build:unit-test`. Angular test builder uses Vitest under the hood.
- No E2E tooling. `openspec/config.yaml` lists `e2e: null`.
- No Playwright/Cypress config files exist.
- SSR is enabled (`@angular/ssr` + Express 5), which means E2E tests would interact with the SSR-rendered app.

### Affected Areas

- `/package.json` — add `eslint`, `@angular-eslint/*`, `typescript-eslint`, `eslint-plugin-prettier` as devDependencies; add `@playwright/test` as devDependency.
- `/angular.json` — no changes needed for ESLint (flat config); optional Playwright builder config consideration.
- `/eslint.config.js` — new file (flat config, required by angular-eslint v22).
- `/playwright.config.ts` — new file for Playwright configuration.
- `/e2e/` — new directory for Playwright test specs.
- `/.prettierrc` — may need to add eslint-config-prettier alignment check.
- `/.gitignore` — add `playwright-report/`, `test-results/` if needed.
- `/pnpm-workspace.yaml` — no changes expected (already configured for parcel, esbuild, lmdb, msgpackr).
- CI config — if present, add lint + e2e steps (not currently visible in repo).

### Approaches

#### ESLint

**Approach 1: `ng add @angular-eslint/schematics` (automatic setup)**
- Run `pnpm add -D @angular-eslint/schematics` then `ng g @angular-eslint/schematics:add-eslint-to-project`
- Generates flat config (`eslint.config.js`) with recommended Angular/TS settings
- Sets up scripts, configures the builder, installs all peer dependencies
- Pros: Zero manual config, follows Angular team's recommended setup, handles complex flat config wiring, sets up component selectors matching project prefix
- Cons: Less educational (user wants to learn Angular — manual setup is more instructive), may generate more config than needed, alpha channel for v22 (22.1.0 is stable but schematics may trail)
- Effort: Low

**Approach 2: Manual flat config setup**
- Install packages manually: `pnpm add -D eslint @angular-eslint/eslint-plugin @angular-eslint/template-parser @angular-eslint/eslint-plugin-template typescript-eslint eslint-plugin-prettier`
- Create `eslint.config.js` from scratch using `tseslint.config()` with `angular.configs.tsRecommended`, `angular.configs.templateRecommended`, `angular.configs.templateAccessibility`
- Configure rules: `@angular-eslint/prefer-standalone`, `@angular-eslint/prefer-signals`, component/directive selectors matching `app` prefix
- Pros: Full understanding of config, only includes exactly what's needed, educational value for learning Angular ESLint internals
- Cons: More manual work, easy to miss config details, no schema validation from Angular CLI
- Effort: Medium

**Approach 3: ng add + customize (recommended)**
- Run `ng add @angular-eslint/schematics` to get the baseline flat config
- Then customize rules for Signals, standalone components, and Prettier integration
- Pros: Best of both worlds — correct baseline from Angular team + tailored rules. Schematics handles the complex flat config scaffolding (processor, parser, inline template extraction). Then override selectors, add `prefer-signals`, `prefer-standalone`, and integrate Prettier.
- Cons: Slightly more steps but still straightforward
- Effort: Low-Medium

#### Playwright

**Approach A: Standalone `@playwright/test` with webServer**
- Install `@playwright/test` and browsers: `pnpm add -D @playwright/test && pnpm exec playwright install`
- Create `playwright.config.ts` with `webServer: { command: 'pnpm start', url: 'http://localhost:4200', reuseExistingServer: !process.env.CI }`
- Create `e2e/` directory with spec files
- Add `"e2e": "playwright test"` and `"e2e:ui": "playwright test --ui"` scripts
- Pros: Standard Playwright setup, framework-agnostic, full flexibility, well-documented, separate from Vitest
- Cons: No Angular-specific integration (no component testing out of the box), requires `ng serve` running, SSR app may need special handling
- Effort: Low

**Approach B: Playwright Component Testing (ct) with Angular**
- Use `@playwright/experimental-ct-angular` package
- Configure `ctViteConfig` in Playwright config
- Pros: Component-level testing within Playwright, faster than full E2E for component tests, no server needed
- Cons: Experimental package, Angular Vite integration may not be well-supported (Angular uses `@angular/build` not raw Vite), SSR not supported in ct mode, conflicts with the existing Vitest-based unit testing strategy. Not recommended for Angular 22 based on limited community support.
- Effort: High (may not work)

**Approach C: `@playwright/test` + `e2e/` folder + shared CI (recommended)**
- Same as Approach A, but with explicit separation: unit tests via Vitest (`src/**/*.spec.ts`), E2E via Playwright (`e2e/**/*.spec.ts`)
- Add Vitest exclusion for `e2e/` path (not needed — tsconfig.spec.json only includes `src/**/*.spec.ts`)
- Add a `test:e2e` script and document the workflow in CI
- Pros: Clean separation of concerns, each tool does what it does best, no tooling conflicts, Vitest handles unit/integration, Playwright handles E2E
- Cons: Requires running dev server for E2E
- Effort: Low

### Recommendation

**ESLint: Approach 3 (ng add + customize)**

Use `ng add @angular-eslint/schematics` to scaffold the baseline flat config, then customize. This is the pragmatic choice: the Angular team maintains the schematics to handle the evolving flat config format (ESLint v9/v10, typescript-eslint v8), and the schematics correctly wire up the template processor and parser. After scaffolding:
- Change `component-selector` prefix to `app` (already matches, but verify)
- Add `@angular-eslint/prefer-signals: 'error'` (project uses Signals)
- Add `@angular-eslint/prefer-standalone: 'error'` (all components are standalone)
- Add `@angular-eslint/no-host-metadata-property: 'error'` (best practice)
- Integrate `eslint-plugin-prettier` for formatting consistency
- Add `"lint": "ng lint"` or `"lint": "eslint ."` script

Chosen because: (a) the flat config wiring is non-trivial and error-prone to do manually, (b) the schematics produce a known-good baseline that accounts for Angular-specific build tooling, (c) the project's educational goal is best served by customizing an existing config rather than debugging a hand-rolled one.

**Playwright: Approach C (standalone `@playwright/test` + `e2e/` folder)**

Use standard `@playwright/test` with `webServer` pointing to `pnpm start` (port 4200). Tests live in `e2e/`. Vitest continues to own `src/**/*.spec.ts`. Playwright component testing (ct) is not recommended for Angular because:
- Angular uses `@angular/build` which wraps Vite — ct's `ctViteConfig` may not be compatible
- SSR is enabled and ct mode doesn't support SSR
- The experimental package has unclear Angular 22 support

For this project's scope (a learning log app), a simple E2E test checking core user flows (navigation, content rendering) is sufficient. The separation keeps the toolchain clean and each tool in its lane.

### Risks

- **angular-eslint v22 is fresh** — v22.1.0 is the first stable release for Angular 22. The schematics may have edge cases with the flat config format, especially around inline template processing. Test the generated config immediately.
- **ESLint + Prettier conflict** — `eslint-plugin-prettier` (or `eslint-config-prettier`) is essential to avoid conflicting rules. Our `.prettierrc` uses `singleQuote: true` and `printWidth: 100` — ESLint rules like `@typescript-eslint/quotes` could conflict if not disabled via eslint-config-prettier.
- **TypeScript 6.0 + typescript-eslint** — typescript-eslint v8.65.0 is the latest stable. Verify it supports TypeScript 6.0 syntax features. Run a quick lint after install to catch compatibility issues.
- **SSR in E2E** — The app runs with SSR (Express 5 server). Playwright's `webServer` will start `ng serve` which serves the app, but SSR rendering means the initial HTML is server-rendered. E2E tests should work transparently since Playwright interacts with the DOM regardless of SSR, but hydration timing could matter. Use `waitFor` / `waitForSelector` appropriately.
- **Vitest 4.x + jsdom 28** — existing unit tests use Vitest 4.1.10. Playwright does not impact Vitest, but ensure Vitest config doesn't accidentally pick up `e2e/` files. Already safe — `tsconfig.spec.json` only includes `src/**/*.spec.ts`.
- **No CI config in repo** — if lint + E2E are added, CI pipeline will need `lint` and `e2e` steps. Currently no CI config is visible. This should be documented but not blocked — CI config is typically in a separate PR.

### Ready for Proposal

Yes. Both additions are well-understood, low-risk, and have clear implementation paths. The proposal should cover:
1. Exact dependencies to install
2. The two-step ESLint setup (scaffold + customize)
3. Playwright config structure and test directory
4. Scripts to add to `package.json`
5. Verification steps (lint passes, E2E passes)
