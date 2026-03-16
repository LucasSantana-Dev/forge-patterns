# Forge Space Core — Project Context

> **Quick Reference**: Shared configuration, architectural patterns, and MCP context server for the Forge Space ecosystem. Published as `@forgespace/core`.

## Table of Contents

- [Executive Summary](#executive-summary)
- [Key Metrics](#key-metrics)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [IDP Module (forge-audit, forge-scorecard, forge-features, forge-init)](#idp-module)
- [Pattern Categories](#pattern-categories)
- [Business Rules](#business-rules)
- [File Structure](#file-structure)
- [Development Commands](#development-commands)
- [Ecosystem Integration](#ecosystem-integration)

---

## Executive Summary

Forge Space Core (`@forgespace/core`) is the shared foundation for the Forge Space open developer workspace. It provides reusable patterns, architectural standards, an Internal Developer Platform (IDP) CLI suite, an MCP context server, and security/quality validation tooling.

**Current state (March 2026, v1.13.0)**:

- 652 tests, 27 suites, 100% coverage (statements, branches, functions, lines)
- 23 pattern categories fully documented
- IDP CLI suite: forge-audit, forge-scorecard, forge-features, forge-init
- MCP Context Server for IDE integration
- Zero-secrets policy with automated scanning
- Jest 30, ESLint 10, Commander 14

## Key Metrics

| Metric | Value |
|--------|-------|
| Package version | 1.13.0 |
| Tests | 652 passing (27 suites) |
| Test coverage | 100% (all metrics) |
| Pattern categories | 23 |
| Security vulnerabilities | 0 |
| Open PRs | 0 (as of 2026-03-16) |
| Node.js requirement | >=22.0.0 |

## Architecture Overview

```text
forge-patterns/
├── src/
│   ├── index.ts                   # Public API barrel
│   ├── cli.ts                     # forge-patterns CLI
│   ├── mcp-context-server/        # MCP server for pattern/context serving
│   │   ├── context-store/         # Markdown context files served to IDEs
│   │   ├── resources.ts           # MCP resource definitions
│   │   ├── store.ts               # Context loading and caching
│   │   ├── tools.ts               # MCP tool definitions
│   │   └── validation.ts          # Input validation
│   ├── ide-extensions/            # VSCode extension
│   └── security/                  # Path traversal + symlink protection
├── patterns/                      # 23 pattern libraries
│   ├── idp/                       # Internal Developer Platform
│   │   ├── __tests__/             # IDP test suites
│   │   ├── feature-toggles/       # forge-features CLI + store
│   │   ├── init/                  # forge-init CLI + templates
│   │   ├── migration/             # forge-audit migration assessment
│   │   ├── policy-engine/         # Policy evaluation engine
│   │   ├── scorecards/            # forge-scorecard CLI + collectors
│   │   └── security-spoke/        # Security spoke contract + rules
│   ├── shared-constants/          # Centralised constants (MCP, network, AI)
│   ├── shared-infrastructure/     # Logger (structured logging, transports)
│   ├── feature-toggles/           # Feature flag library patterns
│   ├── ai-tools/                  # AI code analysis patterns
│   ├── docker/                    # Dockerfile templates (node, python)
│   ├── monitoring/                # Shared logger observability
│   ├── plugin-system/             # Plugin manager + examples
│   └── [16 more categories]       # ai, cloud-native, code-quality, config,
│                                  # coverage, git, ide-extensions, java,
│                                  # localstack, mcp-gateway, mcp-servers,
│                                  # python, security, shell, testing
├── scripts/                       # Automation scripts
│   ├── bootstrap/                 # Project bootstrap + workflow templates
│   ├── funding/                   # NLnet funding ops automation
│   └── security/                  # Secret scanning + tenant decoupling
├── ops/
│   └── funding/nlnet/             # NLnet NGI Zero Commons Fund ops
├── test/                          # Integration + validation tests
├── .github/workflows/             # CI/CD (ci.yml, security, release)
└── .forge/                        # IDP configuration (features, policies, scorecard)
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (ES2022) |
| Runtime | Node.js >=22.0.0 |
| Package manager | npm >=9.0.0 |
| Build | tsc (not tsup) |
| Testing | Jest 30 |
| Linting | ESLint 10 + @typescript-eslint |
| Formatting | Prettier |
| CLI framework | Commander 14 |
| Security scanning | TruffleHog, Gitleaks, custom scripts |

## IDP Module

### forge-audit CLI

Runs a full IDP audit on a project directory. Assesses 6 categories:

```bash
npx forge-audit --dir <path> [--json] [--threshold <0-100>]
```

Categories: `dependencies`, `architecture`, `security`, `quality`, `migration-readiness`, `ai-governance`

Output: A-F grade per category + overall score. `--json` returns structured JSON.

### forge-scorecard CLI

Generates a quality scorecard for the current project:

```bash
npx forge-scorecard [--project-dir <path>] [--json] [--output json] [--threshold <n>]
```

Output format: `Scorecard: 84/100 (B)` with per-category grades.
Grade scale: A≥90, B≥80, C≥70, D≥60, F<60.
`--json` and `--output json` are equivalent aliases.

### forge-features CLI

Manages feature toggles stored in `.forge/features.json`:

```bash
npx forge-features <command> [options]
# Commands: create, enable, disable, remove, get, list
# Key flags: --namespace <ns>, --enabled, --json, --dry-run
```

`--dry-run` shows what would happen without making changes (available for create/enable/disable/remove).

### forge-init CLI

Initialises a new IDP project scaffold:

```bash
npx forge-init [--project-dir <path>] [--template <name>] [--dry-run]
# Templates: react, nextjs, node
```

Creates: `.forge/policies/`, `.forge/scorecard.json`, `.forge/features.json`, `.github/workflows/` (CI workflow).
`--template` applies framework-specific scorecard weights and policy files.
`--dry-run` previews scaffold without writing files.

## Pattern Categories

23 categories in `patterns/`:

| Category | Description |
|----------|-------------|
| `ai` | AI/ML patterns and templates |
| `ai-tools` | AI code analysis (`code-analyzer.js`) |
| `cloud-native` | Serverless, microservices, event-driven |
| `code-quality` | ESLint, Prettier, testing configs |
| `config` | Centralised configuration management |
| `coverage` | Jest coverage templates + standards |
| `docker` | Dockerfile templates (Node, Python) |
| `feature-toggles` | Feature flag library (nodejs, advanced) |
| `git` | Pre-commit hooks, Git workflow patterns |
| `ide-extensions` | VSCode extension patterns |
| `idp` | IDP CLI suite (audit, scorecard, features, init) |
| `java` | Java project patterns |
| `localstack` | LocalStack patterns |
| `mcp-gateway` | MCP gateway patterns |
| `mcp-servers` | MCP server patterns |
| `monitoring` | Shared logger, observability |
| `plugin-system` | Plugin manager + examples |
| `python` | Python project templates |
| `security` | Auth and middleware patterns |
| `shared-constants` | MCP protocol, network, AI providers, storage |
| `shared-infrastructure` | Structured logger with transports |
| `shell` | Shell scripting conventions |
| `testing` | Testing patterns |

## Business Rules

| Rule | Description |
|------|-------------|
| BR-001 | Zero Secrets — no hardcoded credentials; use `{{PLACEHOLDER}}` syntax |
| BR-002 | Pattern Versioning — semantic versioning for all patterns |
| BR-003 | Quality Gates — 100% test coverage |
| BR-004 | Documentation Coverage — README.md for all 23 pattern categories ✅ |
| BR-005 | Performance Standards — measurable performance targets |

## File Structure (Key Files)

```text
src/index.ts                        # Public API: exports MCP server, security, tenant contract
src/tenant/contract.ts              # Tenant contract schema + validation
patterns/idp/index.ts               # IDP barrel: exports all IDP CLIs and types
patterns/idp/scorecards/cli.ts      # forge-scorecard entry point
patterns/idp/feature-toggles/cli.ts # forge-features entry point
patterns/idp/init/cli.ts            # forge-init entry point (--template react/nextjs/node)
patterns/idp/migration/cli.ts       # forge-audit entry point
patterns/idp/scorecards/post-gen-scorer.ts  # AI post-generation scoring
patterns/shared-constants/index.ts  # All shared constants barrel
patterns/shared-infrastructure/logger/src/logger.ts  # Logger + LoggerFactory
scripts/forge-patterns-cli.js       # forge-patterns CLI (list/search/apply)
scripts/integrate.js                # Cross-project integration script
.forge/features.json                # Active feature flags
.forge/policies/                    # Policy files (compliance, quality, security)
.forge/scorecard.json               # Current scorecard state
ops/funding/nlnet/project.json      # NLnet NGI Zero Commons Fund application
```

## Development Commands

```bash
npm run build           # tsc compilation (output: dist/)
npm test                # Jest 30 unit tests
npm run test:coverage   # Jest with coverage report
npm run validate        # lint + format + validation tests
npm run lint            # ESLint 10
npm run format:check    # Prettier check
npx knip                # Unused exports/deps check (currently 0 issues)

# Run specific tests (Jest 30 syntax)
npx jest --testPathPatterns "post-gen-scorer"   # Note: plural flag

# IDP CLI (after build)
node dist/patterns/idp/scorecards/cli.js --project-dir .
node dist/patterns/idp/feature-toggles/cli.js list
node dist/patterns/idp/migration/cli.js --dir . --json
node dist/patterns/idp/init/cli.js --template nextjs --dry-run
```

**Gotchas:**
- `npm run build` uses `tsc` directly (not tsup) — output in `dist/`
- Jest 30: use `--testPathPatterns` (plural), not `--testPathPattern`
- VSCode extension tests use separate `jest.config.json` with vscode mock
- Pre-commit hook auto-generates `tests/unit/` stubs (gitignored)
- ESM `mcp-context-server` excluded from Jest coverage (needs Vitest)
- `NODE_OPTIONS=--experimental-vm-modules` NOT needed (removed in v1.13.0)

## Ecosystem Integration

| Repo | Package | Version | Description |
|------|---------|---------|-------------|
| core | @forgespace/core | 1.13.0 | This repo |
| siza | siza | 0.48.0 | Next.js 16 AI workspace |
| siza-gen | @forgespace/siza-gen | 0.13.2 | AI generation engine |
| ui-mcp | @forgespace/ui-mcp | 0.24.5 | Thin MCP adapter (21 tools) |
| mcp-gateway | — | 1.28.2 | Python/Node.js MCP routing hub |
| branding-mcp | @forgespace/branding-mcp | 0.15.0 | Brand identity MCP tools |
| forge-ai-init | forge-ai-init | 0.34.0 | AI governance CLI |

### Integration Script

```bash
node scripts/integrate.js --project siza      # Integrate with siza
node scripts/integrate.js --project ui-mcp    # Integrate with ui-mcp
node scripts/integrate-all-projects.sh        # Integrate all projects
```

---

**Last Updated**: March 16, 2026
**Version**: 1.13.0
**Maintained By**: Forge Space Team (@Forge-Space)
**Repository**: https://github.com/Forge-Space/core
**NLnet**: NGI Zero Commons Fund application in progress (deadline April 1 2026)
