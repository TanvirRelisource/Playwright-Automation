## Copilot instructions — Playwright_Automation

Purpose: give an AI coding agent the minimal, actionable knowledge to be productive in this repository.

- Project type: Playwright tests written in TypeScript. Tests live under `./tests`. Playwright config is `playwright.config.ts` (testDir: `./tests`, reporter: `html`, fullyParallel: true).

- Big picture architecture:
  - `framework/src/` contains the test automation framework code, organized by responsibility:
    - `data/` — static and runtime test data (e.g. `employees.ts`, `users.ts`, `runtimeStore.ts`).
    - `locators/` — locator factories that take a `Page` and return locators (pattern: `const loc = pimLocators(page)`), e.g. `framework/src/locators/pim.ts` and `framework/src/locators/login.ts`.
    - `pages/` — small page objects that wrap navigation and high-level page actions (e.g. `framework/src/pages/PIMPage.ts`, `framework/src/pages/loginPage.ts`). Use these to navigate or group related steps.
    - `flows/` — reusable sequences of actions that implement domain flows (e.g. `framework/src/flows/employee.ts`, `framework/src/flows/auth.ts`). Flows accept a `Page` and typed input objects (see `EmployeeName`, `JobUpdate`, `ContactUpdate`).
  - `tests/` contains test suites that compose flows/pages/data to implement assertions.

- Key patterns and conventions (use these exactly):
  - Locator factories: functions named `*Locators(page: Page)` that return a map of `Locator`s and small helper functions (see `pimLocators` in `framework/src/locators/pim.ts`). Always call the factory at top of a flow/page: `const loc = pimLocators(page)`.
  - Page objects: small helpers exposing navigation/assertion methods. Example: `PIMPage.openPIM()` calls the `pimLocators` and asserts URLs.
  - Flows: pure async functions exported from `framework/src/flows/*` that receive `page: Page` and domain objects. Example exports: `createEmployeeFlow(page, name)`, `updateJobFlow(page, update)`, `loginFlow(page, creds)`.
  - Data files define typed fixtures and constants used by tests. Use these to drive flows (see `framework/src/data/employees.ts` and `users.ts`).

- Test/CI commands (no npm scripts are defined in package.json):
  - Local run: `npx playwright test` (run all tests)
  - Target a project: `npx playwright test --project=chromium`
  - Install browsers (first time or CI): `npx playwright install --with-deps`
  - Open last HTML report: `npx playwright show-report` (or open `playwright-report/index.html`)
  - CI is configured in `.github/workflows/playwright.yml` and uses `npm ci`, `npx playwright install --with-deps`, then `npx playwright test`.

- Playwright config notes to respect:
  - `playwright.config.ts` sets `testDir: './tests'`, `reporter: 'html'`, `fullyParallel: true`, and `retries: 0` (explicit). Do not assume additional retries/workers unless changing config.

- Examples to reference when editing or adding tests/flows:
  - To create an employee from a test: import `createEmployeeFlow` from `framework/src/flows/employee` and call it with a `Page` and `EmployeeName` from `framework/src/data/employees.ts`.
  - To log in: import `loginFlow` from `framework/src/flows/auth` or use `LoginPage` in `framework/src/pages/loginPage.ts`.
  - To locate elements in PIM pages, use `pimLocators(page)` from `framework/src/locators/pim.ts`.

- Integration points & external dependencies:
  - Tests depend on `@playwright/test` (listed in devDependencies). The GitHub Action installs browsers and runs `npx playwright test`.
  - No external services or environment variables are referenced in code by default; `playwright.config.ts` contains commented dotenv hints if you need per-environment base URLs.

- Small, non-aspirational guidance for edits from AI:
  - Preserve explicit assertions in page/flow helpers (e.g. `await expect(page).toHaveURL(...)` in `PIMPage`); these are used to ensure navigation stability.
  - Use existing locator factories — avoid inlining selectors in tests. Prefer `loginLocators(page)` and `pimLocators(page)`.
  - When adding scripts, update `package.json` scripts so maintainers can run `npm run test` (current repo does not define scripts; do not assume they exist).

If anything above is incorrect or a workflow is missing (for example custom start servers or credentials), tell me which part is unclear and I will update this file.
