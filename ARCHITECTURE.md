# Architecture

## Overview

`@forgespace/core` is the foundational package for the Forge Space IDP ecosystem. It provides shared constants, governance tooling (scorecards, policy engine, feature toggles), an MCP context server, and reusable GitHub Actions workflows. Published to npm as `@forgespace/core`.

## Module Map

```
src/
├── index.ts                          # Public API barrel export
├── cli.ts                            # forge-patterns CLI entry
├── mcp-context-server/               # MCP server (stdio transport)
│   ├── index.ts                      # Server setup
│   ├── tools.ts                      # get/update/list project context
│   ├── resources.ts                  # Resource discovery
│   └── store.ts                      # Context persistence
└── security/                         # Path traversal protection

patterns/
├── idp/                              # Internal Developer Platform
│   ├── init/                         # forge-init (project scaffolding)
│   ├── scorecards/                   # forge-scorecard (quality scoring)
│   │   ├── aggregator.ts             # Score aggregation
│   │   ├── post-gen-scorer.ts        # Post-generation code quality
│   │   └── collectors/               # Security, quality, perf, compliance
│   ├── policy-engine/                # forge-policy (governance rules)
│   │   ├── evaluator.ts              # Rule evaluation engine
│   │   ├── loader.ts                 # Policy file loader
│   │   └── builtin-functions.ts      # Condition operators
│   └── feature-toggles/              # forge-features (flag management)
│       ├── store.ts                  # File-based toggle store
│       └── cli.ts                    # CLI entry point
├── shared-constants/                 # Cross-project constants (compiled)
│   ├── network.ts, mcp-protocol.ts, ai-providers.ts
│   ├── feature-flags.ts, storage.ts, environments.ts
├── mcp-gateway/                      # Gateway patterns (routing, auth, caching)
├── mcp-servers/                      # MCP server patterns (providers, streaming)
├── security/                         # Auth strategies, middleware templates
├── code-quality/                     # ESLint/Prettier configs
└── docker/, monitoring/, testing/    # Infrastructure patterns
```

## Key Modules

**IDP Scorecards** - Quality scoring with pluggable collectors. Post-gen scorer validates AI code against anti-patterns and framework conventions (A-F grading).

**Policy Engine** - Rule-based governance with block/warn/log actions. Loads YAML/JSON policies, evaluates conditions, enforces compliance.

**Feature Toggles** - File-based toggle store with namespace support and CLI management.

**MCP Context Server** - Stdio MCP server exposing project documentation as resources. Tools for context CRUD.

**Shared Constants** - Type-safe constants for network, MCP protocol, AI providers, feature flags. Compiled to `dist/`.

## Binary Commands

- `forge-patterns` - Pattern discovery and validation
- `forge-scorecard` - Project quality scoring (A-F grades)
- `forge-policy` - Policy evaluation and enforcement
- `forge-features` - Feature toggle management
- `forge-init` - Project initialization wizard

## Data Flow

```
Ecosystem Projects (siza, mcp-gateway, ui-mcp, branding-mcp, siza-gen)
    │
    ├─> npm install @forgespace/core
    │     ├─> Import shared-constants
    │     └─> Import IDP modules (scorecards, policies, toggles)
    │
    ├─> CI/CD workflows
    │     ├─> uses: Forge-Space/core/.github/workflows/reusable/*.yml
    │     ├─> npx forge-scorecard (quality gates)
    │     └─> npx forge-policy (governance checks)
    │
    └─> MCP Context Server (local IDE integration)
```

## Extension Points

**New Scorecard Collector**: Extend `BaseCollector` in `patterns/idp/scorecards/collectors/`, implement `collect()`, export from index.

**New Policy Functions**: Add to `builtin-functions.ts`, update `ConditionOperator` type.

**New Patterns**: Create directory under `patterns/CATEGORY/`, add README.md, update docs.

**New Workflows**: Create YAML in `.github/workflows/reusable/` with `workflow_call` trigger.

## Build

- **Compiler**: tsc (ES2022, NodeNext)
- **Includes**: `src/**/*.ts`, `patterns/shared-constants/**/*.ts`, `patterns/idp/**/*.ts`
- **Tests**: Jest 29 with ts-jest (386 tests)
- **Linting**: ESLint 9 flat config + Prettier
