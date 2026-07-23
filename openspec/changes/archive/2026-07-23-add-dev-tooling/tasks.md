# Tasks: Add Dev Tooling (ESLint + Playwright)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~100-120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | ESLint config + scripts | PR 1 | `pnpm lint` | `pnpm lint` on clean codebase | eslint.config.js + lint script + angular.json changes |
| 2 | Playwright config + smoke test | PR 1 | `pnpm e2e` | webServer via `pnpm start` | playwright.config.ts + e2e/ + .gitignore changes |

## Phase 1: ESLint Setup

- [x] 1.1 Run `ng add @angular-eslint/schematics` to scaffold `eslint.config.js`
- [x] 1.2 Customize `eslint.config.js`: set `prefer-standalone`, `prefer-signals`, `no-host-metadata-property` at ERROR level; add `eslint-config-prettier` as final plugin
- [x] 1.3 Update `package.json`: add `"lint": "eslint . --max-warnings 0"` script
- [x] 1.4 Verify: `pnpm lint` exits 0 with zero warnings

## Phase 2: Playwright Setup

- [x] 2.1 Install `@playwright/test` as devDependency: `pnpm add -D @playwright/test`
- [x] 2.2 Create `playwright.config.ts` with `webServer`, `chromium` project, `testDir: ./e2e`
- [x] 2.3 Install Chromium binary: `npx playwright install chromium`
- [x] 2.4 Create `e2e/home.spec.ts` — navigate to `/`, assert AppComponent renders
- [x] 2.5 Update `.gitignore`: add `playwright-report/` and `test-results/`
- [x] 2.6 Update `package.json`: add `"e2e": "playwright test"` and `"e2e:ui": "playwright test --ui"` scripts
- [x] 2.7 Verify: `pnpm e2e` exits 0 with smoke test passing
