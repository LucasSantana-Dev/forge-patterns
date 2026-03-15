# Forge Space Ecosystem Overview

## Vision: "The Open Full-Stack AI Workspace"

> **Generate. Integrate. Ship.**

Forge Space is an open, MCP-native platform for full-stack AI-assisted
development. Every AI code tool generates beautiful frontends — Forge Space owns
the full-stack integration layer: auth, DB, APIs, deployment, and governance.

## Ecosystem Repos

| Repo             | GitHub                   | Version | Purpose                                          | Tests |
| ---------------- | ------------------------ | ------- | ------------------------------------------------ | ----- |
| **core**         | Forge-Space/core         | 1.11.2  | Shared patterns, IDP, MCP context server         | 599   |
| **siza**         | Forge-Space/siza         | 0.10.0  | Web app + API (Next.js 16, Cloudflare Workers)   | —     |
| **siza-gen**     | Forge-Space/siza-gen     | 0.5.0   | AI generation engine (npm: @forgespace/siza-gen) | 465   |
| **ui-mcp**       | Forge-Space/ui-mcp       | 0.9.0   | MCP server adapter (21 tools)                    | 394   |
| **mcp-gateway**  | Forge-Space/mcp-gateway  | 1.7.4   | MCP tool routing hub (Python + Node.js)          | 1567  |
| **branding-mcp** | Forge-Space/branding-mcp | 0.2.0   | Brand identity MCP server (7 tools)              | ~100  |

## Architecture: Hub-and-Spoke

```
                    ┌─────────────────────┐
                    │   @forgespace/core   │
                    │  (patterns, IDP,     │
                    │   MCP context server)│
                    └──────────┬──────────┘
                               │ shared contracts
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌─────────────┐  ┌──────────┐
        │ siza-gen │    │ mcp-gateway │  │   siza   │
        │ (AI lib) │    │ (hub/router)│  │ (webapp) │
        └────┬─────┘    └──────┬──────┘  └──────────┘
             │                 │
        ┌────▼─────┐    ┌──────▼──────┐
        │  ui-mcp  │    │branding-mcp │
        │(21 tools)│    │ (7 tools)   │
        └──────────┘    └─────────────┘
```

**Key principle**: `mcp-gateway` is the **single auth authority** — MCP servers
(ui-mcp, branding-mcp) are stateless spokes that never authenticate directly.

## What `@forgespace/core` Provides

### Pattern Library (23 categories)

| Category                | Description                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `idp`                   | IDP patterns: policy engine, scorecards, migration assessor, feature toggles, security spoke                                    |
| `shared-constants`      | Typed constants shared across all repos (11 TypeScript modules)                                                                 |
| `mcp-servers`           | MCP server implementation patterns (AI providers, streaming, templates)                                                         |
| `mcp-gateway`           | Gateway routing, auth, performance, security patterns                                                                           |
| `docker`                | Container and compose patterns                                                                                                  |
| `security`              | Auth, env templates, middleware, OWASP patterns                                                                                 |
| `monitoring`            | Shared logger (Supabase + Sentry), observability                                                                                |
| `feature-toggles`       | Unleash-based centralized feature flags                                                                                         |
| `shared-infrastructure` | Production logger with transports and observability                                                                             |
| `ai` / `ai-tools`       | AI/ML project templates, code generation, code analyzer                                                                         |
| `code-quality`          | ESLint and Prettier shared configs                                                                                              |
| `testing`               | Test creation framework and quality validation                                                                                  |
| + 11 more               | `cloud-native`, `config`, `coverage`, `git`, `ide-extensions`, `java`, `localstack`, `plugin-system`, `python`, `shell`, `java` |

### IDP (Internal Developer Platform)

Six modules for platform governance:

1. **Policy Engine** — Rule-based evaluation (8 operators, path traversal
   protection)
2. **Project Scorecards** — Health scoring: Security, Quality, Performance,
   Compliance, Dependency
3. **Migration Assessor** — 6-category project assessment (score 0-100, grade
   A-F)
4. **Feature Toggles** — File-based Unleash-compatible flag store
5. **Security Spoke** — Typed contract artifacts for security report aggregation
6. **Project Init** — Scaffolding with template-based CI and scorecard seeding

### MCP Context Server

Stdio MCP server that exposes project contexts as resources:

- URI scheme: `forge-space://context/{project-slug}`
- Tools: `get_project_context`, `update_project_context`, `list_projects`
- Store: file-based per-project markdown + JSON metadata

## Quality Standards

| Metric                   | Requirement       | Current             |
| ------------------------ | ----------------- | ------------------- |
| Test coverage            | ≥ 80% all metrics | **100%**            |
| Tests                    | —                 | **599** (27 suites) |
| Security vulnerabilities | 0                 | **0**               |
| Lint errors              | 0                 | **0** (7 warnings)  |
| Knip dead code           | 0                 | **0**               |
| Pattern documentation    | 100%              | **23/23 ✅**        |

## Dependency Graph (change ordering)

When making cross-repo changes, always update in this order:

1. `core` — shared contracts first
2. `siza-gen` — AI/registry layer
3. `ui-mcp` — MCP tools
4. `branding-mcp` — brand tools (parallel with ui-mcp)
5. `mcp-gateway` — routing and orchestration
6. `siza` — web app last

## Business Rules

| Rule                          | Requirement                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| **BR-001** Zero Secrets       | No hardcoded credentials; use `{{PLACEHOLDER}}` in templates |
| **BR-002** Pattern Versioning | Semantic versioning for all patterns                         |
| **BR-003** Quality Gates      | ≥ 80% test coverage on all metrics                           |
| **BR-004** Documentation      | Complete README.md for all pattern directories               |
| **BR-005** Performance        | Measurable performance targets per service                   |

## Key ADRs

| ADR     | Decision                                 |
| ------- | ---------------------------------------- |
| ADR-001 | Hub-and-spoke ecosystem architecture     |
| ADR-002 | `mcp-gateway` as single auth authority   |
| ADR-003 | stdio-only MCP servers (no HTTP)         |
| ADR-004 | Next.js 16 + Cloudflare Workers for siza |
| ADR-005 | Cross-repo integration patterns          |
| ADR-006 | Centralized Unleash feature toggles      |

## Related Docs

- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Developer Onboarding](../guides/DEVELOPER_ONBOARDING.md)
- [MCP Context Server](../guides/MCP_CONTEXT_SERVER.md)
- [Policy Engine Integration](../guides/policy-engine-integration.md)
