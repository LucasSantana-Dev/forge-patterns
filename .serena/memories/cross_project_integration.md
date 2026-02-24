# Cross-Project Integration

## Purpose
Guides editing of integration scripts and shared constants that flow to all downstream repos.

## Key Files
- `scripts/integrate.js` — CLI tool for pushing patterns to downstream projects
- `patterns/shared-constants/` — 11 TypeScript modules (network, ports, security, performance, docker, etc.)
- `test/` — validation test suites including `npm run test:integration`

## Architecture
Dependency graph: `forge-patterns → mcp-gateway, uiforge-mcp, uiforge-webapp`

Integration CLI (`scripts/integrate.js`):
- `npm run integrate:mcp-gateway` — push patterns + configs to mcp-gateway
- `npm run integrate:uiforge-mcp` — push patterns + configs to uiforge-mcp
- `npm run integrate:uiforge-webapp` — push patterns + configs to uiforge-webapp

Per-project config in `PROJECT_CONFIGS`:
- Defines which patterns, config files, dependencies, and scripts to push
- Creates integration examples and documentation in target repos
- Backs up existing config files before overwriting

Integration includes:
- Pattern directories copied to target's `patterns/`
- Config files (.eslintrc.js, .prettierrc.json, tsconfig.json)
- `forge-features` CLI tool installed to `scripts/forge-features`
- package.json updated with dev dependencies and lint/format scripts

Validation: `forge-patterns validate <dir>` checks patterns dir, config files, and dependencies exist.

## Critical Constraints
- forge-patterns is upstream of ALL other repos — changes here cascade
- `npm run test:integration` must pass before pushing changes downstream
- Existing config files are backed up before overwriting
