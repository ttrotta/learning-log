# Proposal: Add Dev Tooling (ESLint + Playwright)

## Intent

Add linting and E2E testing to catch code quality issues and verify cross-page user flows before shipping. Currently the project has no linting and no E2E coverage — ESLint will enforce Angular best practices (standalone components, Signals), and Playwright will validate that the SSR-rendered app loads correctly.

## Scope

### In Scope
- ESLint flat config via `ng add @angular-eslint/schematics` + customization
- Strict Angular rules: `prefer-standalone`, `prefer-signals`, `no-host-metadata-property`
- Prettier integration via `eslint-config-prettier`
- Playwright standalone setup with `webServer`
- Chromium-only browser target
- One smoke test: homepage loads
- `package.json` scripts: `lint`, `e2e`, `e2e:ui`

### Out of Scope
- CI pipeline configuration
- Safari/Firefox browser targets
- Component-level Playwright tests (ct-angular)
- Additional tests beyond the single smoke test
- VSCode extension or editor config changes

## Capabilities

### New Capabilities
- `eslint-config`: ESLint flat config with strict Angular rules and Prettier integration
- `e2e-playwright`: E2E testing via Playwright, Chromium-only, with webServer

### Modified Capabilities
None — no existing specs change behavior.

## Approach

**ESLint:** Run `ng add @angular-eslint/schematics` to scaffold flat config, then customize: enable `prefer-signals`, `prefer-standalone`, `no-host-metadata-property` at error level. Add `eslint-config-prettier` to disable formatting rules that conflict with `.prettierrc`.

**Playwright:** Install `@playwright/test`, create `playwright.config.ts` with `webServer: { command: 'pnpm start', url: 'http://localhost:4200' }` and `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]`. Add one smoke test in `e2e/` verifying the homepage renders.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add devDeps + scripts (`lint`, `e2e`, `e2e:ui`) |
| `eslint.config.js` | New | Flat ESLint config (generated + customized) |
| `playwright.config.ts` | New | Chromium-only Playwright config |
| `e2e/home.spec.ts` | New | Smoke test: homepage loads |
| `.gitignore` | Modified | Add `playwright-report/`, `test-results/` |
| `angular.json` | Modified | May add `lint` builder target |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| angular-eslint v22 flat config edge cases | Medium | Test generated config immediately after scaffolding |
| ESLint/Prettier rule conflicts | Low | `eslint-config-prettier` disables conflicting rules |
| typescript-eslint v8 + TypeScript 6.0 compat | Low | Pin latest typescript-eslint; verify after install |
| SSR hydration + Playwright auto-wait | Low | Use `waitForSelector` on stable content |
| Vitest picks up `e2e/` files | Low | tsconfig.spec.json scoped to `src/` |

## Rollback Plan

Git revert: `git revert HEAD` after verifying the commit is self-contained. Before commit, `git checkout -- <file>` restores originals. No data or schema migrations involved.

## Dependencies

- `@angular-eslint/schematics` v22.1.0+ (stable)
- `@playwright/test` latest (maintained by Microsoft)
- Pre-existing: Angular 22, TypeScript 6.0, Prettier 3.9.5

## Success Criteria

- [ ] `pnpm lint` passes with zero errors on current codebase
- [ ] `pnpm e2e` passes — smoke test confirms homepage renders
- [ ] ESLint catches intentional violations (e.g., non-standalone component)
- [ ] Playwright HTML report accessible via `playwright-report/`
