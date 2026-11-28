---
name: e2e
description: Write, run or debug end-to-end tests (Playwright for the consumer web app, Maestro for the dashboard), or drive a running app to check a change.
---

# End-to-end tests

Suites run against the e2e stack: the API, fake Paystack, web, admin and dashboard Metro, on the `habiti_e2e` database and Redis DB 1. The root `.env.e2e` configures every app in it, with machine-specific overrides in `.env.e2e.local`. Change a port in `.env.e2e` and nowhere else: scripts read the ports through `e2e/ports.ts`. `bun stack --e2e` runs it in Rex; `bun stack status --e2e` and `bun stack logs <service> --e2e` read it.

## State

Each test builds fresh rows with a **scenario** from `scenarios` in `api/src/test/factories.ts`, then acts and asserts through the UI. Tests share one database and run in parallel, so they never depend on seeded rows or on each other.

- Needs state no scenario gives? Add a scenario there, built from the factory functions, so money moves through the ledger. Add its type to `Scenarios` in `apps/web/e2e/fixtures.ts`.
- Playwright: `scenario('name')`, `outbox()` and `verificationCode(email)` from `apps/web/e2e/fixtures.ts`. `signIn` reads the code for you.
- Maestro: put `# scenario: name` on a flow's first line. `apps/dashboard/e2e/run.ts` passes the result as variables: `merchant.email` → `${MERCHANT_EMAIL}`, `products[0].name` → `${PRODUCTS_0_NAME}`. To type a sign-in code, use the `verification-code.js` script the way `subflows/verify.yaml` does. The runner serves the codes and passes `${CODES_URL}` and `${DEV_CLIENT_LINK}` to every flow (`maestro.ts`), so flows run through `bun run e2e`, not bare `maestro test`.
- `bun run --cwd api e2e scenario <name>`, `e2e outbox` and `e2e otp <email>` do the same from a shell, printing JSON on the `E2E_RESULT ` line.

Fake Paystack behaviour to build on: new cards pay on its hosted checkout page (a popup on web) with Pay and Decline buttons; saved cards whose code contains `decline` are declined; account `0000000000` fails to resolve; payouts to accounts starting `999` fail. Push notifications land in the outbox instead of Expo.

## Locators

Target what a person perceives: role and accessible name on web (`getByRole`, `getByLabel`), visible or accessibility text in Maestro. When an element has no good name, give it one in the app (`aria-label`, `accessibilityLabel`, a labelled `<section>` or `<li>`) rather than reaching for a test ID. That fixes the screen reader experience at the same time.

To see what is on screen:

- Web: `await page.locator('body').ariaSnapshot()` in a scratch script, or the `error-context.md` Playwright writes on failure.
- Dashboard: `maestro hierarchy`, filtered to `accessibilityText`, `text` and `hintText`.

## Dashboard gotchas

- Maestro text matching is a case-insensitive full-string regex. `tapOn: Confirm details` also matches a "Confirm Details" title: disambiguate with `below:` or `index:`. Rows read as their merged text, e.g. `Ada Obi, Pending · 1m ago, ₦25,000.00`, so match with `.*`.
- Launch through `subflows/launch.yaml`. Its `__expo_disable_*` link params hide the dev client's onboarding, its floating tools button (which covers header buttons such as Save) and the dev menu.
- Native alerts do not appear in `maestro hierarchy`, but `tapOn` reaches their buttons.
- A field under the keyboard: tap the keyboard toolbar's `Next`. `hideKeyboard` fails on these inputs.
- The system photo picker runs out of process. `addMedia` puts the newest photo in the first cell; tap it by `point`.
- Wait for transitions with `extendedWaitUntil` or `waitForAnimationToEnd` before tapping, or add `retryTapIfNoChange`.
- Saving app code fast-refreshes the app back to its first tab.
- `console.log` from the app does not reach the Metro tab. Assert on the screen, or read the API's logs.
- Native code changed? Rebuild the dev client with `bun run --cwd apps/dashboard e2e:build`.

## Running and debugging

- One web spec: `cd apps/web && bunx playwright test e2e/cart.spec.ts`. Flakiness: add `--repeat-each=3`.
- One dashboard flow: `bun run --cwd apps/dashboard e2e <word in file name>`.
- Failures leave traces, screenshots and Maestro logs in `.e2e-artifacts/`.
- A failure is a finding until shown otherwise. Read the screenshot and the API logs (`bun stack logs api --e2e`) before changing the test. Fix app bugs in the app, then keep the test strict.
