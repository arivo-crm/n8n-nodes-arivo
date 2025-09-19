# Repository Guidelines

This guide keeps contributions to the Arivo n8n community node consistent and releasable.

## Project Structure & Module Organization
- `nodes/Arivo/*.ts` holds the node implementation, grouped by resource (e.g. `DealOperations.ts`).
- `nodes/Arivo/test` mirrors the source layout with Jest specs, fixtures, and helpers.
- `credentials/ArivoApi.credentials.ts` defines the API credential and has matching tests in `credentials/test`.
- `dist/` is generated output; never edit by hand. `gulpfile.js` packages icons into `dist/nodes/Arivo` during builds.

## Build, Test, and Development Commands
- `npm run dev` – incremental TypeScript compile while you iterate.
- `npm run build` – clean `dist/` then emit compiled nodes and icons.
- `npm run lint` / `npm run lintfix` – enforce n8n rules on nodes, credentials, and `package.json`.
- `npm run format` – apply the shared Prettier profile to source directories.
- `npm run test`, `npm run test:watch`, `npm run test:coverage` – execute Jest suites, optionally in watch mode or with coverage reports.
- `npm run prepublishOnly` – release gate that runs build plus lint in strict mode; mirror it before tagging a release.

## Coding Style & Naming Conventions
- TypeScript only; compile targets are defined in `tsconfig.json`.
- Prettier enforces tabs (width 2), single quotes, semicolons, trailing commas, and 100-column wraps.
- Follow n8n naming: node files end with `.node.ts`, trigger nodes append `Trigger`, credentials end with `.credentials.ts`, and icons are SVGs.
- Keep descriptions, display names, and option values sentence-cased to satisfy eslint-plugin-n8n rules.

## Testing Guidelines
- Jest is configured via `jest.config.js` with roots in `nodes` and `credentials` and helpers in `jest.setup.js`.
- Mirror new features with `*.test.ts` files alongside the matching module and prefer existing fixtures under `nodes/Arivo/test/fixtures`.
- Expect coverage reports in `coverage/`; keep high coverage for CRUD flows and webhook triggers.
- Run `npm run test` and `npm run lint` before opening a PR; watch mode is ideal while refining logic.

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative commit subjects (e.g. `Add pt-BR README`).
- Squash unrelated changes, describe user-facing effects, and reference issues or tickets when relevant.
- PRs should explain the scenario, note tests performed, and include screenshots for UI-affecting updates inside n8n.
- Confirm `dist/` is up to date or excluded when submitting; reviewers expect reproducible builds.
