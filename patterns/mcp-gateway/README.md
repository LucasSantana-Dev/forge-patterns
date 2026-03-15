# MCP Gateway Patterns

Reference patterns for the `mcp-gateway` (Forge-Space/mcp-gateway) — the central hub of the Forge Space ecosystem. The gateway handles authentication, routing, orchestration, and feature toggles for all MCP server spokes.

## Contents

```
patterns/mcp-gateway/
├── authentication/    # JWT validation, RBAC, token propagation
├── performance/       # Caching, connection pooling, timeout patterns
├── routing/           # MCP tool routing, spoke discovery, load balancing
├── security/          # Rate limiting, input validation, audit logging
└── README.md          # This file
```

## Architecture Role

Per [ADR-002](../../docs/architecture-decisions/ADR-002-gateway-central-hub.md):

- **Single auth authority** — all JWT tokens issued and validated here
- **Central routing** — all MCP tool calls route through the gateway
- **Stateless** — no session state; JWTs carry all user context
- **Spoke isolation** — each MCP server (ui-mcp, branding-mcp) is a stateless spoke

## Authentication Pattern

```
Client → Gateway (JWT validate) → Spoke (JWT propagated) → Response
```

Gateway validates the JWT, extracts user context (id, roles, tier), and propagates it to spokes as a signed sub-token. Spokes never authenticate directly.

See `authentication/README.md` for JWT structure, RBAC roles, and token propagation details.

## Routing Pattern

The gateway maps MCP tool names to their spoke servers:

```
generate-ui     → ui-mcp:8001
generate-brand  → branding-mcp:8002
...
```

Tool routing uses a static registry + dynamic spoke discovery. Circuit breakers prevent cascade failures.

See `routing/README.md` for route config format, circuit breaker settings, and spoke health check protocol.

## Performance Pattern

- **Response caching** — generated components cached by prompt hash (TTL: 1 hour)
- **Connection pooling** — persistent stdio connections to MCP spokes
- **Timeout handling** — 30s hard timeout per tool call, 5s for health checks

See `performance/README.md` for cache configuration and benchmarks.

## Security Pattern

- Rate limiting: 100 req/min per user (Free), 500 (Pro), unlimited (Enterprise)
- All inputs validated against MCP tool schemas before forwarding
- Audit log: every tool call logged with user, tool, duration, result code

See `security/README.md` for rate limit config and audit log schema.

## Current Version

mcp-gateway v1.7.4 — 1567 tests, 91.46% coverage (Python + Node.js)
