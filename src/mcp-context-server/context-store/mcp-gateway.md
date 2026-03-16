# Forge MCP Gateway — Project Context

**Version:** 1.28.2  
**Last Updated:** 2026-03-16  
**Repository:** [Forge-Space/mcp-gateway](https://github.com/Forge-Space/mcp-gateway)  
**Status:** CI green, 79.49% test coverage (2026 tests), 0 open PRs

---

## Overview

Forge MCP Gateway is a self-hosted aggregation gateway built on [IBM Context Forge](https://github.com/IBM/mcp-context-forge) that consolidates multiple MCP servers into a single IDE connection point. It solves IDE tool-count limits via virtual servers (tool collections) and an AI-powered tool router with ML-based scoring and feedback loops.

**One connection from Cursor (or other MCP clients) → gateway → all upstream MCP servers.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.12+ |
| Framework | FastAPI |
| Gateway Base | IBM Context Forge |
| Container | Docker Compose |
| Testing | pytest (2026 tests, 79.49% coverage) |
| Auth | JWT + API key middleware |
| Cache | In-process with invalidation + retention policies |
| Observability | Prometheus metrics, structured logging |

---

## Architecture

```
tool_router/
├── core/           # Gateway entry, request routing
├── ai/             # ML tool selector, scoring, feedback
├── cache/          # Cache manager, invalidation, retention
├── cloud/          # Cloud provider abstraction, router
├── security/       # Auth, rate limiting, audit logger
├── observability/  # Metrics, tracing
└── transport/      # HTTP + stdio adapters
```

---

## Quick Start

```bash
cp .env.example .env          # Configure API keys + upstream servers
make start                    # docker compose up -d
make register                 # Register upstream MCP servers
```

Access Admin UI at `http://localhost:4444`.

---

## Testing

```bash
pytest tool_router/tests/ -v         # All 2026 tests
pytest tool_router/tests/ -q         # Quiet mode
pytest --cov=tool_router --cov-report=html  # Coverage report
```

Coverage: 79.49% (threshold: 80% — pre-existing gap, not a regression).

---

## Ecosystem Integrations

| Package | Version | Role |
|---------|---------|------|
| @forgespace/core | 1.13.0 | Shared patterns + IDP governance |
| IBM Context Forge | latest | Gateway base (upstream MCP aggregation) |

---

## Current State (2026-03-16)

- Version: 1.28.2 (latest release)
- 2026 tests passing, 79.49% coverage
- 0 open PRs, 0 open issues
- CI: green (SonarCloud advisory-only on some PRs)
- Recent test additions: 75 auth unit tests (PR #230), 160 cache unit tests (PR #231), cloud provider/router tests (PR #235)
- README badges added: CI pipeline, MIT license, Python 3.12, Docker Ready, PRs Welcome (PR #216)
- Branch protection: `Required reviews: 1`, `Enforce admins: False`

---

## Key Patterns

- Tool routing uses ML scoring with feedback loops (FeedbackStore)
- Virtual servers aggregate tool collections for IDE tool-count limits
- Security: JWT auth, API key middleware, rate limiting, audit logging
- Cache layer: manager + invalidation + security + retention (160 unit tests)
- Cloud: provider abstraction + router (unit tested via PR #235)
