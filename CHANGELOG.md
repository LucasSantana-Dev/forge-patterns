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
