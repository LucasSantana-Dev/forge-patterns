## [Unreleased]

### Added
- **Limit-aware bootstrap templates** — Added workflow templates for `node`,
  `nextjs`, and `python` projects under
  `scripts/bootstrap/templates/workflows/limit-aware/`, including:
  - PR CI templates with baseline required checks and conditional heavy jobs
  - Nightly security workflows that always run heavy scans
- **Actions org setup helper** — Added `scripts/bootstrap/actions-org-setup.sh`
  to validate org/repo Actions endpoints, query billing usage, and upsert:
  - `ACTIONS_MONTHLY_CAP_MINUTES`
  - `ACTIONS_WARN_PCT`
  - `ACTIONS_DEGRADE_PCT`
- **Actions limits documentation** — Added
  `docs/guides/actions-limits-strategy.md` and refreshed
  `docs/guides/organization-setup.md` for the `.github` canonical workflow
  source.

### Fixed
- **IDP init import side effects** — Package root imports no longer trigger `forge-init` writes.
  `initProject` now lives in side-effect-free `patterns/idp/init/project.ts`, CLI execution in
  `patterns/idp/init/cli.ts` is entrypoint-guarded, and IDP barrel exports avoid CLI module
  loading at import time.

### Changed
- **Bootstrap contract (new projects)** — `scripts/bootstrap/project.sh` now
  defaults to `--ci-profile=limit-aware`, requires `--org` and
  `--actions-cap-minutes` for that profile, and generates limit-aware CI
  workflows from templates.
- **Bootstrap path resolution** — Project bootstrapping now resolves source
  files from repository-root absolute paths, avoiding relative path failures
  during project generation.
- **TypeScript ESLint alignment** — Synchronized `@typescript-eslint/eslint-plugin`,
  `@typescript-eslint/parser`, and `typescript-eslint` to `8.57.0` to keep peer
  dependencies compatible in CI installs.
- **Tenant isolation baseline** — Added platform-level `TenantProfile` contract export with
  runtime validators and CI guardrail `check:tenant-decoupling` to block tenant-specific
  hardcodes in platform paths (with `rg` and `grep` fallback support in CI/local runs).
- **Owner hardcode sanitization** — Replaced personal-owner links in active scripts/context docs
  with Forge-Space organization references.
- **Contributor guidance** — Added `AGENTS.md` operations guide and linked it from README contributing docs.
- **Security validation** — `validate-no-secrets.sh` now excludes metadata/system folders
  (`.forge`, `.serena`, `.agents`) and uses targeted key patterns to prevent
  policy-text false positives.
- **Phase 0 test-autogen rollout (warn-only)** — Added local hooks and CI parity check:
  - `.husky/pre-commit` → `forge-ai-init test-autogen --staged --write --json --tenant "$FORGE_TENANT_ID" --tenant-profile-ref "$FORGE_TENANT_PROFILE_REF"` when tenant context is set (non-blocking)
  - `.husky/pre-push` → `forge-ai-init test-autogen --check --json --tenant "$FORGE_TENANT_ID" --tenant-profile-ref "$FORGE_TENANT_PROFILE_REF"` when tenant context is set (non-blocking)
  - CI job `test-autogen-warn` on pull requests with explicit tenant context (`acme-sandbox`) and comment + annotations.
  - CI checkout for external tenant profile repo is now best-effort; parity check auto-skips when profile path is unavailable.
- **Sonar/security hardening** — Removed hotspot patterns flagged on `main` by hardening
  workflow references, Docker templates, CLI/test command execution, and ID generation.
- **Migration assessor tests** — Refactored temporary-project test setup to reduce duplicated
  blocks and keep new-code duplication under quality-gate thresholds.
- **CI tenant-decoupling hardening** — `Tenant Decoupling` workflow now ensures `ripgrep` exists
  on the runner and validator script now falls back to `grep` when `rg` is unavailable.
- **Cross-repo profile checkout token** — `test-autogen-warn` now uses
  `FORGE_TENANT_PROFILES_READ_TOKEN` (fallback `GITHUB_TOKEN`) for private tenant-profile checkout.
- **Security scan noise reduction** — Secret validation patterns were tightened to remove generic
  `key` false positives, and hardcoded URL scanning now excludes lockfiles/tests and scans only
  platform paths.
- **Scanner regression coverage** — Added tests for secret-scan false-positive regression and
  tenant-decoupling fallback behavior.

## [1.10.1] - 2026-03-08

### Fixed
- **Package entry point**: Fixed `main`/`types` pointing to `dist/index.js` instead of `dist/src/index.js` (tsc `rootDir: "./"` outputs to `dist/src/`)
- **Barrel re-exports**: `src/index.ts` now re-exports all IDP patterns (migration, scorecards, policy-engine, feature-toggles)
- **`exports` map**: Added package.json `exports` field for proper ESM/CJS resolution
- Consumers can now `import { assessProject } from '@forgespace/core'` without bundler workarounds

## [1.10.0] - 2026-03-08

### Added
- **Migration assessment module** (`patterns/idp/migration/`) — legacy codebase health assessment
  - 5 specialized collectors: dependencies, architecture, security, quality, migration readiness
  - Health score (0-100) with A-F grading per category and overall
  - Migration readiness classification: ready / needs-work / high-risk
  - Auto-detected migration strategy: strangler-fig, branch-by-abstraction, parallel-run
  - Legacy package detection (jQuery, Moment, Backbone, AngularJS, etc.)
  - God file detection (>500/1000 lines), function sprawl (>20), high coupling (>15 imports)
  - Security scanning: hardcoded secrets, AWS keys, eval/innerHTML/SQL injection, CORS
  - Code quality: empty catch blocks, TODO accumulation, test coverage ratio
  - Global state pollution detection (window/global/globalThis assignments)
- **`forge-audit` CLI** — new binary for running migration assessments
  - `forge-audit --dir <path>` — assess any project directory
  - `forge-audit --json` — machine-readable JSON output
  - `forge-audit --threshold <n>` — exit 1 if score below threshold
  - Colored terminal output with severity indicators
- 21 new migration assessment tests (450 total across 22 suites)

## [1.9.0] - 2026-03-08

### Added
- **AI-specific post-gen scoring checks** — 5 new check categories for `scoreGeneratedCode()`:
  - `architecture`: file size (>300 lines), function count (>10), prop count (>10)
  - `error-handling`: empty catch blocks, console-only catch, unhandled promise chains
  - `scalability`: N+1 query detection, missing pagination on list rendering
  - `hardcoded-values`: production URLs, hardcoded secrets
  - `engineering`: @ts-ignore/@ts-nocheck, synchronous I/O, array index as React key
- 17 new post-gen scorer tests (429 total across 20 suites)

## [1.8.0] - 2026-03-07

### Added
- **`forge-init --template` flag** — Framework-specific governance scaffolding (closes #85)
  - Templates: `react`, `nextjs`, `node` — each adds framework-specific policy rules and scorecard weights
  - `react`: accessibility checks, component test coverage (70% threshold)
  - `nextjs`: react rules + bundle size limit (300 KB), server component hygiene (40% client ratio)
  - `node`: dependency audit (high/critical block), unused deps, API input validation
  - Scorecard weights tuned per template (e.g., node: security 35%, nextjs: performance 30%)
  - Templates extend base scaffold — security/quality/compliance policies always included
  - 9 new tests (412 total across 20 suites)

## [1.7.1] - 2026-03-07

### Added
- **Scorecard grade output** — `forge-scorecard` now shows A-F grades in both summary and JSON output (closes #90)
  - `--json` flag shorthand for `--output json`
  - JSON includes `grade` field at top level and per-category
  - Summary output shows grade next to each score
- **Feature toggles `--dry-run`** — All mutating commands (create, enable, disable, remove) support `--dry-run` (closes #91)
  - Shows `[dry-run] Would <action>` without making changes
  - 5 new CLI tests + 3 new scorecard CLI tests

## [1.7.0] - 2026-03-07

### Added
- **Dependency Collector** — `DependencyCollector` scorecard collector for supply chain health
  - Scores dependency freshness (40%), major version gaps (25%), vulnerabilities (20%), lockfile presence (15%)
  - Registered in `forge-scorecard` CLI and exported from scorecards barrel
  - Aggregator generates recommendations for outdated deps and vulnerabilities
  - 10 new tests (396 total across 19 suites)

---

## [1.6.0] - 2026-03-07

### Added
- **Feature Toggles CLI** — `forge-features` bin for managing file-based feature toggles (`.forge/features.json`)
  - Commands: `list`, `get`, `create`, `enable`, `disable`, `remove`, `check`
  - 4 namespaces: `global`, `mcp-gateway`, `uiforge-mcp`, `uiforge-webapp`
  - Filtering by namespace/enabled state, `--json` output, strategy support
- **Post-Generation Scorer** — `scoreGeneratedCode()` for inline code quality grading
  - Anti-pattern detection (console, TODO/FIXME, inline styles, !important)
  - Structure checks (exports, line length, error handling)
  - TypeScript checks (type annotations, no `any`)
  - React-specific checks (accessibility, list keys, unsafe HTML)
  - A-F grading with configurable min score threshold
- 36 new tests (18 feature toggles + 18 post-gen scorer)

---

## [1.5.0] - 2026-03-06

### Added
- **Scorecard CLI** — `forge-scorecard` bin for project quality evaluation from terminal/CI
- **Policy Engine CLI** — `forge-policy` bin for governance policy evaluation from terminal/CI
- **Scorecard Integration Guide** — `docs/guides/scorecard-integration.md`
- **Policy Engine Integration Guide** — `docs/guides/policy-engine-integration.md`
- 10 new CLI tests (5 scorecard + 5 policy engine)

### Fixed
- **Scorecard aggregator** — `ScorecardWeights` cast for strict TypeScript compilation

### Changed
- **tsconfig** — Include `patterns/idp/**/*.ts` in compilation for IDP CLI builds

---

## [1.4.0] - 2026-03-06

### Added
- **IDP Policy Engine** — JSON-defined rules with 8 condition operators (eq, ne, gt, gte, lt, lte, contains, matches), nested field resolution, AND logic evaluation
- **Policy loader** — Load policies from JSON files or directories
- **Built-in policies** — Security (secrets, injection, auth), quality (lint, tests, coverage), compliance (RLS, audit, correlation IDs)
- **Scorecard collectors** — Abstract `BaseCollector` with TTL caching, 4 concrete collectors: security, quality, performance, compliance
- **Scorecard aggregator** — Weighted aggregation (30/30/20/20), automatic recommendation generation from violations
- 99 new tests (53 policy engine + 46 scorecard) with >90% coverage

---

## [1.3.4] - 2026-03-02

### Changed
- **VSCode Extension**: Migrate scaffolding to `vscode.workspace.fs` for virtual workspace support (WSL, Codespaces, remote SSH)
- **VSCode Extension**: Use `pathUtils.assertWithinBase` for target path validation
- **VSCode Extension**: Add `.vscodeignore` to slim published VSIX (~12 KB vs ~82 KB)
- **VSCode Extension**: Add `repository` field to package.json for vsce packaging

### Fixed
- **VSCode Extension**: `safeJoin` now rejects absolute path segments and validates result with `assertWithinBase`
- **VSCode Extension**: `assertWithinBase` no longer over-rejects valid names like `..cache` (use `rel === '..' || rel.startsWith('..' + sep)`)
- **VSCode Extension**: Replace `fs.readFileSync` with `vscode.workspace.fs.readFile` to avoid blocking extension host
- **VSCode Extension**: Narrow scaffolding catch blocks to only treat `FileNotFound`/`ENOENT` as "not exists"; rethrow other errors
- **VSCode Extension**: Refactor `scaffoldPattern` into smaller helpers (`destExists`, `ensureDestDirectory`, `readSourceFile`)
- **VSCode Extension**: Use `jest.requireActual` in tests to satisfy `@typescript-eslint/no-require-imports`
- **VSCode Extension**: Add `out` directory to discovery skip test; add `safeJoin` test for absolute segments

### Added
- **VSCode Extension**: README usage instructions, commands, configuration, and development workflow

---

## [1.3.3] - 2026-03-01

### Fixed
- **CI**: Add missing `NODE_AUTH_TOKEN` to npm publish workflow (fixes E404 on scoped package publish)

---

## [1.3.2] - 2026-02-28

### Fixed
- **Minimatch ReDoS**: Resolve GHSA-7r86-cg39-jmmj vulnerability via npm audit fix
- **ESLint errors**: Fix scaffolding test lint violations
- **README**: Update project names and links to current ecosystem state

### Changed
- **CI**: Standardize GitHub Actions versions across all workflows (checkout@v4, github-script@v8, codecov@v5, build-push@v6, trufflehog@v3.93.4)

### Added
- **LICENSE**: MIT license file
- **CLAUDE.md**: Project-level Claude Code instructions

---

## [1.3.1] - 2026-02-25

### Security
- **VSCode Extension Hardening**: Path traversal protection, symlink skipping, malformed JSON reporting, improved error handling across discovery, scaffolding, and validation modules
- 38 tests across 3 suites (was 33)

---

## [1.3.0] - 2026-02-25

### Features
- **VSCode Extension**: Implemented pattern discovery, scaffolding, and compliance validation
  - Dynamic pattern scanning from local forge-patterns clone via `forgePatterns.repoPath` setting
  - One-click pattern application with dry-run preview and conflict detection
  - Workspace compliance validation (ESLint, Prettier, TypeScript strict, secrets scanning)
  - VSCode Diagnostics integration — results appear in Problems panel
  - 33 tests across 3 suites (discovery, scaffolding, validation)

### Changed
- Root Jest config now excludes `patterns/ide-extensions/` (extension has own Jest config)

---

## [1.2.1] - 2026-02-20

### Features
- Automated release workflow implementation
- Enhanced dependency management
- Improved quality gates and validation
- **Trunk-Based Development Workflow**: Standardized CI/CD workflow across all Forge projects

### Fixes
- Fixed version bumping issues
- Resolved build validation problems
- Fixed package.json JSON syntax errors
- Resolved merge conflicts during release process

### Documentation
- Updated release procedures
- Added automation documentation
- **Development Workflow Rule**: Established Feature → Release → Main → Deploy pattern as mandatory across ecosystem

---

# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [1.2.0] - 2026-02-20

### 🎯 Comprehensive Project Update

- **✅ Security Hardening**: Critical vulnerability fixes and enhanced security validation
- **✅ CI/CD Enhancement**: Fixed workflow configurations and action versions
- **✅ Dependency Updates**: Updated Husky and improved security scripts
- **✅ Configuration Validation**: Enhanced validation scripts with proper exclusions
- **✅ Ecosystem Integration**: Improved shared workflows and patterns

**Security Improvements**:
- **Path Traversal Fix**: Critical CWE-23 vulnerability fix with input sanitization
- **Input Validation**: Added explicit `validateProjectSlug()` calls at entry points
- **Static Analysis**: Sanitization visible to static analysis at boundary points
- **Vulnerability Resolution**: Fixed 4 High-severity findings (score 900) from Snyk Code Analysis

**CI/CD Enhancements**:
- **Dependabot Configuration**: Fixed invalid `reviewers` property across ecosystem blocks
- **Workflow Fixes**: Corrected 2-space indentation inside `jobs:` block
- **Action Updates**: Upgraded CodeQL from v3 to v4, fixed Gitleaks action inputs
- **Error Handling**: Added `continue-on-error` to Snyk step for better resilience

**Security Scripts Enhancement**:
- **Validate No Secrets**: Excluded `dist/`, `package-lock.json`, `node_modules` directories
- **False Positive Filters**: Added filters for `author`, `authentication`, `Object.entries`, `private` keywords
- **Validate Placeholders**: Added `--exclude-dir` for `node_modules`, `.git`, `dist`, `docs/`, `patterns/`, `.windsurf/`
- **Prevention**: Prevents false positives from example code and vendored packages

**Dependency Updates**:
- **Husky**: Bumped from 8.0.3 to 9.1.7 in devDependencies
- **Security**: Updated all security-related dependencies
- **Performance**: Improved performance with latest dependency versions

## [Unreleased]

## [1.1.2] - 2026-02-18

### Added

- **`husky`**: bumped from 8.0.3 to 9.1.7 in devDependencies

## [1.1.1] - 2026-02-18

### Security

- **Path Traversal fix (CWE-23)**: Added explicit `validateProjectSlug()` calls at entry points in `src/mcp-context-server/tools.ts` and `src/mcp-context-server/resources.ts` — sanitization is now visible to static analysis at the boundary where untrusted input enters, before it reaches `readFileSync`/`writeFileSync`. Resolves 4 High-severity findings (score 900) reported by Snyk Code Analysis.

### Fixed

- **`.github/dependabot.yml`**: Removed invalid `reviewers` property from all 3 ecosystem blocks (`npm`, `pip`, `github-actions`) — not supported in Dependabot v2 schema.
- **`.github/workflows/ci.yml`**: Restored `workflow-summary` job to correct 2-space indentation inside the `jobs:` block.
- **`.github/workflows/security-scan.yml`**: Fixed invalid Gitleaks action inputs, added `continue-on-error` to Snyk step, upgraded CodeQL from v3 to v4.
- **`scripts/security/validate-no-secrets.sh`**: Excluded `dist/`, `package-lock.json`, `node_modules`; added false-positive filters for `author`, `authentication`, `Object.entries`, and `private` keyword patterns.
- **`scripts/security/validate-placeholders.sh`**: Added `--exclude-dir` for `node_modules`, `.git`, `dist`, `docs/`, `patterns/`, `.windsurf/`; prevents false positives from example code and vendored packages.
- **`patterns/feature-toggles/README.md`**: Fixed MD022/MD025/MD031/MD032/MD040 markdownlint violations — blank lines around headings/fences/lists, removed duplicate H1, added language tag to bare fence block.
- **`CHANGELOG.md`**: Added `<!-- markdownlint-disable MD024 -->` to suppress intentional duplicate section headings across version entries.

## [1.1.0] - 2026-02-18

### Added

- **`patterns/python/`**: Python project template and tooling patterns — `pyproject.toml` with ruff + mypy + pytest, entry point and test templates
- **`patterns/shell/`**: Shell scripting conventions — `conventions/header.sh` and `conventions/guard.sh` with standard `set -euo pipefail` helpers
- **`patterns/code-quality/eslint/base.config.mjs`**: composable ESLint 9 flat-config base for Node.js/TypeScript projects
- **`patterns/code-quality/eslint/react.config.mjs`**: React/Next.js ESLint layer composable on top of base config
- **`patterns/code-quality/tsconfig/base.json`**, **`nextjs.json`**, **`library.json`**: canonical TSConfig presets
- **`typescript-eslint`**, **`eslint-plugin-import`**, **`eslint-import-resolver-typescript`** added to devDependencies
- **VS Code Extension stub** (`patterns/ide-extensions/vscode/`): Alpha scaffold with command palette integration and MCP context server integration docs
- **Forge Space Context MCP Server v2** (`src/mcp-context-server/`): Centralized context store as the absolute source of truth for all Forge Space project contexts
- **`patterns/shared-constants/`**: Centralised reusable constants — `network.ts`, `mcp-protocol.ts`, `environments.ts`, `ai-providers.ts`, `feature-flags.ts`, `storage.ts`, `index.ts`
- **`.shellcheckrc`** (root): project-level shellcheck config

### Removed

- **`patterns/cost/`**, **`patterns/terraform/`**, **`patterns/localstack/`**: Removed — out of scope for current project focus
- **`patterns/go/`**, **`patterns/java/`**, **`patterns/rust/`**: Removed — not used in the Forge ecosystem

### Changed

- **Node.js minimum version**: bumped from `>=20.11.0` to `>=22.0.0`; CI node-version updated to 24
- **`eslint.config.mjs`** (root): migrated to `tseslint.config()` wrapper with `strictTypeChecked` + `stylisticTypeChecked`
- **`.prettierrc.json`** (root): expanded with `objectWrap: "collapse"` (Prettier 3.5+), `$schema`
- **`tsconfig.json`** (root): upgraded to `NodeNext`/`NodeNext` module resolution, added `composite: true`

### Fixed

- **`src/mcp-context-server/store.ts`**: `STORE_DIR` now uses `import.meta.url` to anchor path resolution
- **`.github/workflows/branch-protection.yml`**: `actions/checkout@v6` → `@v4`; commit message check rewritten
- ESLint errors in cross-project integration, feature toggle validation, performance benchmark, and AI code analyzer

## [1.0.0] - 2026-02-18

### Added

- Initial release with core patterns: MCP Gateway, MCP Servers, Shared Infrastructure, Code Quality, Docker, Cost, Config, Feature Toggles, Plugin System
- Security scanning with Gitleaks and custom scripts
- CI/CD pipeline with GitHub Actions
- Bootstrap script for new projects
