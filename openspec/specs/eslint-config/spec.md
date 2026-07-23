# eslint-config Specification

## Purpose

Define ESLint flat config rules and scripts that enforce Angular best practices — standalone components and Signals reactivity — while integrating with Prettier for formatting.

## Requirements

### Requirement: ESLint Flat Config

The system MUST generate `eslint.config.js` via `ng add @angular-eslint/schematics`, then customize it. The generated file SHALL be committed to version control. The config MUST set the following rules at ERROR level:

| Rule | Level | Purpose |
|------|-------|---------|
| `@angular-eslint/prefer-standalone` | error | Enforce standalone components |
| `@angular-eslint/prefer-signals` | error | Prefer Signals over BehaviorSubject |

> **Note:** `@angular-eslint/no-host-metadata-property` was a planned rule but does not exist in angular-eslint v22.1.0 (removed from the package). It was intentionally omitted from the config. Angular's recommended approach is to use Angular's built-in `host` property or `hostDirectives` instead.

The config MUST include `eslint-config-prettier` as the last plugin to disable formatting rules that conflict with `.prettierrc`.

#### Scenario: Compliant code passes lint

- GIVEN a codebase with all components using `standalone: true` and Signals for state
- WHEN `pnpm lint` is executed
- THEN the exit code MUST be 0
- AND no errors or warnings SHALL be reported

#### Scenario: Non-standalone component fails lint

- GIVEN a `@Component` decorated class without `standalone: true` or with `standalone: false`
- WHEN `pnpm lint` is executed
- THEN the exit code MUST be non-zero
- AND the output MUST include an `@angular-eslint/prefer-standalone` error

#### Scenario: Prettier integration prevents formatting conflicts

- GIVEN `eslint-config-prettier` is the last item in the `extends` array of the ESLint config
- WHEN ESLint processes a file with formatting that violates a Prettier rule (e.g., single vs double quotes)
- THEN ESLint MUST NOT report formatting-rule errors that Prettier handles
- AND Prettier's own formatting preferences remain defined in `.prettierrc` only

### Requirement: Lint Script

The `package.json` MUST contain a script `"lint": "eslint ."`. The script MUST fail (exit non-zero) when ESLint reports any errors. Warnings SHOULD also fail — equivalently, the ESLint config MAY set `"warnings": "error"` or use `--max-warnings 0`.

#### Scenario: `pnpm lint` fails on rule violation

- GIVEN a file with a `@angular-eslint/prefer-signals` violation
- WHEN `pnpm lint` is executed
- THEN the process SHALL exit with a non-zero code

#### Scenario: `pnpm lint` passes on clean codebase

- GIVEN the current codebase with zero ESLint violations
- WHEN `pnpm lint` is executed
- THEN the process SHALL exit with code 0
