# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`patterns/python/`**: Python project template and tooling patterns for Forge ecosystem use cases (AI/ML scripts, automation, MCP server extensions) — `pyproject.toml` with ruff + mypy + pytest, entry point template, and test template; mirrors `scripts/bootstrap/project.sh python` type
- **`patterns/shell/`**: Shell scripting conventions for all Forge bash scripts — `conventions/header.sh` (standard `set -euo pipefail`, colour helpers, `require_cmd`/`guard_cmd`) and `conventions/guard.sh` (`ensure_dir`, `safe_copy`, `require_env`, `make_tmpfile`); extracted from patterns in `scripts/security/` and `scripts/bootstrap/`
- **`patterns/code-quality/eslint/base.config.mjs`**: new composable ESLint 9 flat-config base for Node.js/TypeScript projects — uses `typescript-eslint` unified package with `strictTypeChecked` + `stylisticTypeChecked` presets, `projectService: true` for full type-aware linting, and `eslint-plugin-import` for cycle/duplicate detection
- **`patterns/code-quality/eslint/react.config.mjs`**: new React/Next.js ESLint layer — adds `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y` rules; composable on top of `base.config.mjs`
- **`patterns/code-quality/tsconfig/base.json`**: canonical Node.js/TypeScript tsconfig preset (`NodeNext` module resolution, full strict suite, `exactOptionalPropertyTypes`)
- **`patterns/code-quality/tsconfig/nextjs.json`**: Next.js/React tsconfig preset extending base (`Bundler` resolution, `jsx: preserve`, `noEmit`)
- **`patterns/code-quality/tsconfig/library.json`**: publishable library tsconfig preset extending base (`composite`, `declarationMap`, `importHelpers`)
- **`typescript-eslint`** unified meta-package added to devDependencies (re-exports `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`)
- **`eslint-plugin-import`** + **`eslint-import-resolver-typescript`** added to devDependencies
- **VS Code Extension stub** (`patterns/ide-extensions/vscode/`): Alpha scaffold for forge-patterns VS Code extension with command palette integration (`listPatterns`, `applyPattern`, `validateCompliance`), TypeScript entry point, and MCP context server integration docs
- **UIForge Context MCP Server v2** (`src/mcp-context-server/`): Centralized context store — the MCP server is now the absolute source of truth for all UIForge project contexts
- `mcp-context:build` and `mcp-context:start` npm scripts
- `@modelcontextprotocol/sdk` dependency
- `test:plugins`, `test:feature-toggles`, `test:integration`, `test:all` npm scripts
- **`patterns/shared-constants/`**: Centralised reusable constants from the Forge ecosystem — `network.ts`, `mcp-protocol.ts`, `environments.ts`, `ai-providers.ts`, `feature-flags.ts`, `storage.ts`, `index.ts` (barrel re-export)
- `test:shared-constants` npm script (44 tests, 0 failures)
- **`patterns/shell/linting/.shellcheckrc`**: strict shellcheck configuration — `shell=bash`, `enable=all`, disables only SC1091 and SC2034
- **`scripts/lint-shell.sh`**: unified shell linting runner — runs `shellcheck` and `shfmt` on all `.sh` files; `STRICT=1` mode for CI

### Removed

- **`patterns/cost/`**: Removed entirely — AWS free-tier tracking, budget alerts, and cost analysis scripts are out of scope for the current project focus
- **`patterns/terraform/`**: Removed entirely — Terraform/IaC infrastructure management is not needed at this stage
- **`patterns/localstack/`**: Removed entirely — LocalStack (AWS emulation) has no purpose without Terraform/AWS context
- **`patterns/go/`**: Removed — Go is not used in the Forge ecosystem
- **`patterns/java/`**: Removed — Java/Spring Boot is not used in the Forge ecosystem
- **`patterns/rust/`**: Removed — Rust is not used in the Forge ecosystem

### Changed

- **`patterns/cloud-native/README.md`**: Removed AWS Lambda handler section and all AWS-specific service references; retained Supabase Edge Function pattern, circuit breaker, health checks, and generic event-driven patterns
- **`patterns/config/patterns-config.yml`**: Removed `learning` block and `cost-optimization` feature flag
- **`src/mcp-context-server/context-store/forge-patterns.md`**: Removed all references to `cost/`, `terraform/`, `localstack/`, Kubernetes, and AWS
- **`eslint.config.mjs`** (root): migrated to `tseslint.config()` wrapper; upgraded from `recommended` to `strictTypeChecked` + `stylisticTypeChecked`
- **`.prettierrc.json`** (root): expanded to multi-line human-readable format; added `objectWrap: "collapse"` (Prettier 3.5+)
- **`patterns/code-quality/prettier/base.config.json`**: synced with root
- **`tsconfig.json`** (root): upgraded `module`/`moduleResolution` to `NodeNext`/`NodeNext`; added `composite: true`
- **`prettier`** bumped to `^3.5.0` in devDependencies

### Fixed

- Removed reference to deleted `scripts/prevent-duplicates.sh` from `pre-commit` script
- README.md markdown lint warnings (MD031, MD012, MD032)
- ESLint errors in cross-project integration, feature toggle validation, performance benchmark, advanced feature toggles, and AI code analyzer
- Hardcoded secrets in Kubernetes manifest replaced with secure placeholders
- GitHub Pages deployment updated to actions v4 with proper permissions

## [1.2.0] - 2026-02-17

### Added

- **`patterns/go/`**: Go project templates (cli-app with Cobra/Viper, web-service with net/http + slog)
- **`patterns/java/`**: Java Spring Boot 3.2 web service template
- **`patterns/rust/`**: Rust Axum web service template
- **`docs/guides/IDE_EXTENSION_GUIDE.md`**: VS Code extensions + settings, JetBrains plugins, Windsurf workflows, `.editorconfig`

> **Note**: `patterns/go/`, `patterns/java/`, and `patterns/rust/` were added in v1.2.0 and immediately removed in the next unreleased cycle after determining they are not used in the Forge ecosystem.

## [1.1.0] - 2026-02-10

### Added

- **Plugin System** (`patterns/plugin-system/`): Full plugin architecture with `plugin-manager.js`, hook system, hot reload, dependency management, and configuration
- **Analytics Plugin** (`patterns/plugin-system/plugins/analytics-plugin.js`): Production-ready analytics plugin with event tracking and batch processing
- **Plugin Examples** (`patterns/plugin-system/examples/`): `analytics-plugin.js`, `feature-enhancer-plugin.js`, `plugin-demo.js` demonstrating plugin capabilities
- **AI/ML Patterns** (`patterns/ai/ml-integration/README.md`): Model serving, inference optimization, feature store, and monitoring patterns
- **AI Workflow Patterns** (`patterns/ai/workflows/README.md`): Training pipelines, evaluation gates, deployment workflows, and data validation
- **Cloud-Native Patterns** (`patterns/cloud-native/README.md`): Serverless, microservices, and event-driven architecture patterns
- **Forge Patterns CLI** (`scripts/forge-patterns-cli.js`): Pattern discovery, application, and validation
- **CONTRIBUTING.md**: Full contribution guidelines with BR-001 to BR-005 requirements
- **Plugin System Validation** (`test/plugin-system-validation.js`): Comprehensive test suite

### Changed

- **`package.json`**: Added `patterns`, `patterns:list`, `patterns:search`, `patterns:validate` npm scripts
- **`README.md`**: Updated to reflect Phase 1 progress and new pattern categories

## [1.0.0] - 2026-01-15

### Added

- **Core Pattern Library**: Initial release with code-quality, docker, security, config, coverage, git, and shared-infrastructure patterns
- **Logger Pattern** (`patterns/shared-infrastructure/logger/`): Structured logging with TypeScript, multiple transports, and log rotation
- **Feature Toggle Pattern** (`patterns/feature-toggles/`): Centralized feature toggle management with Unleash integration
- **Docker Patterns** (`patterns/docker/`): Optimized Dockerfile templates with sleep architecture for resource efficiency
- **Security Framework**: Gitleaks configuration, secret scanning scripts, placeholder validation
- **MCP Gateway Patterns** (`patterns/mcp-gateway/`): Routing, authentication, performance, and security patterns
- **MCP Server Patterns** (`patterns/mcp-servers/`): AI provider integration, UI generation, and streaming templates
- **Integration Scripts** (`scripts/integrate*.sh`): Automated pattern integration for mcp-gateway, uiforge-mcp, and uiforge-webapp
- **Bootstrap Script** (`scripts/bootstrap/project.sh`): Project scaffolding for Node.js, Python, and Next.js project types
- **Architecture Decision Records** (`docs/architecture-decisions/`): ADR-001 through ADR-007 documenting key design decisions

[Unreleased]: https://github.com/LucasSantana-Dev/forge-patterns/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/LucasSantana-Dev/forge-patterns/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/LucasSantana-Dev/forge-patterns/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/LucasSantana-Dev/forge-patterns/releases/tag/v1.0.0
