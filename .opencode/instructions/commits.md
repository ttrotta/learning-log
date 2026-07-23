# Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) with the following types:

| Type     | When to use                                           | Example                                        |
|----------|-------------------------------------------------------|------------------------------------------------|
| `feat`   | A new feature or capability for the user              | `feat(eslint): add Angular strict lint rules`  |
| `fix`    | A bug fix or test correction                          | `fix(test): align spec with router template`   |
| `docs`   | Documentation, specs, or OpenSpec artifacts           | `docs(spec): add eslint-config domain spec`    |
| `refactor` | Code change with no behavior difference             | `refactor(auth): extract validation function`  |
| `style`  | Formatting only (prettier, whitespace)                | `style: apply prettier to all files`           |
| `chore`  | Tooling, config, dependency changes                  | `chore: add playwright as dev dependency`      |
| `perf`   | Performance improvement                               | `perf: lazy-load home route`                   |
| `test`   | Adding or updating tests (when standalone)            | `test: add e2e smoke test for homepage`        |

## Rules

- Scope is optional but encouraged: `feat(scope): message`
- Message is imperative, present tense: "add", not "added" or "adds"
- No AI attribution, no `Co-Authored-By` lines
- One commit = one work unit: tests and docs stay with the code they belong to
- Each commit must leave the project in a working state