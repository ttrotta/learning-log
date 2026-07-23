# e2e-playwright Specification

## Purpose

Define Playwright-based E2E testing configuration, scripts, and one smoke test that verifies the SSR-rendered homepage loads correctly in Chromium.

## Requirements

### Requirement: Playwright Configuration

The system MUST install `@playwright/test` and create `playwright.config.ts` with the following properties:

| Property | Value |
|----------|-------|
| `webServer.command` | `pnpm start` |
| `webServer.url` | `http://localhost:4200` |
| `webServer.reuseExistingServer` | `true` |
| `projects` | Single project: `chromium` with `Desktop Chrome` device |
| `testDir` | `./e2e` |

Only Chromium MUST be configured. Firefox and Safari targets SHOULD NOT be added.

#### Scenario: Playwright config targets Chromium only

- GIVEN `playwright.config.ts` is loaded by `@playwright/test`
- WHEN `npx playwright test --list` is executed
- THEN only the `chromium` project SHALL be listed
- AND Firefox/Safari projects MUST NOT appear

#### Scenario: webServer starts dev server before tests

- GIVEN the Playwright config specifies `webServer.command: 'pnpm start'` and `webServer.url: 'http://localhost:4200'`
- WHEN `pnpm e2e` is executed
- THEN Playwright SHALL start the dev server
- AND SHALL wait for `http://localhost:4200` to respond before running tests
- AND SHALL stop the server after tests complete

### Requirement: Smoke Test

A test file at `e2e/home.spec.ts` MUST contain one test that navigates to `/` and verifies the application renders. The test MUST use Playwright's auto-waiting mechanism (`page.waitForSelector`, `page.getByText`, or `page.locator`) rather than arbitrary `setTimeout` or `page.waitForTimeout` calls.

#### Scenario: Homepage renders AppComponent content

- GIVEN the dev server is running
- WHEN the test navigates to `http://localhost:4200`
- THEN the test SHALL wait for a known selector (e.g., the app root or a heading)
- AND SHALL assert that the element is visible and contains expected text

#### Scenario: No arbitrary timeouts used

- GIVEN the smoke test file
- WHEN the file is scanned for `setTimeout`, `page.waitForTimeout`, or `page.waitFor(`
- THEN no such calls SHALL be found
- AND all waiting logic SHALL use Playwright's built-in auto-waiting locators or `waitForSelector`

### Requirement: Test Scripts

The `package.json` MUST contain two scripts:

| Script | Command | Behavior |
|--------|---------|----------|
| `e2e` | `playwright test` | Headless run, exits after completion |
| `e2e:ui` | `playwright test --ui` | Opens Playwright UI mode, stays open |

#### Scenario: `pnpm e2e` runs smoke test and exits cleanly

- GIVEN the dev server is not running
- WHEN `pnpm e2e` is executed
- THEN Playwright SHALL start the dev server via `webServer`
- AND run the smoke test in `e2e/home.spec.ts`
- AND exit with code 0 on success
- AND SHALL stop the dev server after completion

#### Scenario: `pnpm e2e:ui` opens Playwright UI mode

- GIVEN `@playwright/test` is installed
- WHEN `pnpm e2e:ui` is executed
- THEN Playwright SHALL start its UI mode on a local port
- AND SHALL NOT exit immediately (stays open until manually closed)
