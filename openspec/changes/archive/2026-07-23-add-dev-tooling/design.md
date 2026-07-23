# Design: Add Dev Tooling (ESLint + Playwright)

## Technical Approach

Two independent tooling capabilities layered on the existing project:

1. **ESLint** — scaffolded via `ng add @angular-eslint/schematics` (generates flat config with TypeScript parser, Angular processor, and typescript-eslint plugin), then customized with two strict Angular rules at error level and `eslint-config-prettier` as the final plugin. Prettier handles all formatting; ESLint handles only semantic and best-practice rules.

2. **Playwright** — installed as a standalone devDependency (no `ng add`). Config declares a `webServer` that runs `pnpm start` (Angular dev server with SSR), a single `chromium` project targeting Desktop Chrome, and `testDir: ./e2e`. A single smoke test verifies the SSR-rendered homepage loads.

References proposal intent, specs `eslint-config` and `e2e-playwright`.

## Architecture Decisions

### Decision: ESLint config generation method

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `ng add @angular-eslint/schematics` | Generates correct flat config with Angular-aware TypeScript parser setup; integrates with Angular CLI's lint builder if desired | **Chosen** — safest path for Angular 22 flat config |
| Manual `eslint.config.js` | Full control but risk of wrong parser/plugin versioning for Angular 22 flat config | Rejected — higher maintenance risk |

### Decision: ESLint + Prettier boundary

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `eslint-config-prettier` as last plugin | ESLint disables all formatting rules; Prettier owns formatting entirely | **Chosen** — clean separation, no rule conflicts |
| `eslint-plugin-prettier` | Runs Prettier as an ESLint rule; slower, can produce double-reporting | Rejected — violates single-responsibility |

### Decision: Playwright vs ng add

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Standalone `@playwright/test` | Simple config, no schematics dependency, explicit control | **Chosen** — Angular CLI has no official Playwright schematic |
| `ct-angular` (component testing) | In-scope only for E2E smoke test; ct-angular is documented as experimental | Rejected — out of scope per proposal |

### Decision: webServer strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `webServer` in Playwright config | Playwright manages dev server lifecycle automatically (start before tests, stop after) | **Chosen** — matches spec requirement |
| Manual ` concurrently` script | More flexible but duplicates lifecycle management | Rejected — Playwright handles it natively |

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│ ESLint flow (pre-commit awareness, not enforced yet) │
│                                                       │
│  src/**/*.ts ──→ eslint.config.js ──→ ESLint rules   │
│                         │                             │
│                    eslint-config-prettier              │
│                         │                             │
│                    .prettierrc (formatting only)       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Playwright E2E flow                                  │
│                                                       │
│  pnpm e2e                                             │
│    ↓                                                  │
│  Playwright starts webServer (pnpm start)             │
│    ↓                                                  │
│  SSR Angular app @ http://localhost:4200              │
│    ↓                                                  │
│  Playwright runs e2e/home.spec.ts in Chromium         │
│    ↓                                                  │
│  webServer shutdown on completion                     │
└─────────────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `eslint.config.js` | Create | Flat config via `ng add @angular-eslint/schematics` + customization |
| `package.json` | Modify | Add `lint`, `e2e`, `e2e:ui` scripts + `@playwright/test` devDep |
| `playwright.config.ts` | Create | webServer config, chromium-only project, testDir: ./e2e |
| `e2e/home.spec.ts` | Create | Smoke test: navigate to `/`, assert content visible |
| `.gitignore` | Modify | Add `playwright-report/`, `test-results/` |
| `angular.json` | Modify | May add `lint` builder target from `ng add` |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Static analysis | ESLint rules fire correctly | Manual verification: `pnpm lint` exits 0 on clean code, non-zero on violations (non-standalone) |
| E2E | Playwright smoke test | `pnpm e2e` — headless Chromium, webServer auto-starts SSR dev server, verifies homepage renders |
| Formatting | No ESLint/Prettier conflict | `pnpm lint` on a file with intentional formatting diff — ESLint must not report formatting errors |
| Config | Playwright project list | `npx playwright test --list` shows only chromium |

## Threat Matrix

N/A — no routing, shell subprocess, VCS/PR automation, executable-file classification, or process-integration boundary changed. Dev tooling configuration only.

## Migration / Rollout

No migration required. ESLint and Playwright are additive — they do not change existing build, test, or runtime behavior. Rollback via `git revert` of the single self-contained commit, or pre-commit `git checkout`.

## Open Questions

None resolved — `ng add @angular-eslint/schematics` on Angular 22 correctly produces flat config (`eslint.config.js`).
