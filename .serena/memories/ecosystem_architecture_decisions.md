# Ecosystem Architecture Decisions

## Purpose
Consolidated ADR digest for Serena to understand the core architectural patterns and constraints when editing code across all forge-space projects.

## Key Files
- `docs/architecture-decisions/ADR-001-ecosystem-design.md` — Hub-and-spoke architecture
- `docs/architecture-decisions/ADR-002-gateway-central-hub.md` — Gateway authentication authority
- `docs/architecture-decisions/ADR-003-mcp-server-design.md` — MCP server UI generation
- `docs/architecture-decisions/ADR-004-webapp-architecture.md` — Next.js webapp architecture
- `docs/architecture-decisions/ADR-005-integration-patterns.md` — Integration and API contracts
- `docs/architecture-decisions/ADR-006-centralized-feature-toggles.md` — Feature toggle system

## Architecture Digest

### ADR-001: Hub-and-Spoke Architecture
- **Pattern**: forge-mcp-gateway as central hub, specialized MCP servers as spokes
- **Components**: Gateway (hub), MCP servers (spokes), WebApp (client)
- **Centralized Features**: Authentication, routing, orchestration, feature toggles
- **Isolation**: Each component can scale independently
- **Feature Toggles**: Unleash-based centralized management across all projects

### ADR-002: Gateway as Central Authority
- **Single Authentication Source**: Gateway handles all JWT tokens and user auth
- **Centralized Authorization**: RBAC and permission enforcement at gateway
- **Request Routing**: Gateway routes all requests to appropriate MCP servers
- **Security**: Token propagation to MCP servers with user context
- **API Gateway Pattern**: Single entry point for all ecosystem operations

### ADR-003: MCP Server Design
- **Core Components**: MCP protocol layer, AI provider layer, UI generation engine, template manager
- **Provider Abstraction**: Common interface for OpenAI, Anthropic, custom providers
- **Template System**: Flexible templates for React, Vue, Angular, Svelte
- **Caching**: Intelligent caching for generated components
- **Streaming**: Real-time streaming support for large UI generations

### ADR-004: WebApp Architecture
- **Stack**: Next.js App Router + Supabase + Redux Toolkit + Tailwind CSS + TypeScript
- **Structure**: `/app` for routes, `/components` for UI, `/lib` for utilities, `/store` for state
- **API Client**: Gateway client with auth token management
- **Real-time**: Supabase subscriptions for live updates
- **Authentication**: NextAuth integration with gateway JWT tokens

### ADR-005: Integration Patterns
- **API Contracts**: RESTful HTTP/JSON with OpenAPI documentation
- **MCP Protocol**: Standard MCP for gateway ↔ MCP server communication
- **JWT Propagation**: Tokens passed securely across service boundaries
- **Circuit Breakers**: Fault tolerance with automatic failover
- **Event-Driven**: Async messaging for real-time updates
- **Versioning**: Semantic versioning with migration strategies

### ADR-006: Centralized Feature Toggles
- **System**: Unleash-based feature flag management
- **Namespacing**: Global (`global.*`) and project-specific (`mcp-gateway.*`, `uiforge-mcp.*`, `uiforge-webapp.*`)
- **CLI Tool**: `forge-features` for developer-friendly feature management
- **Real-time**: Features can be toggled without redeployment
- **Integration**: All pattern libraries include feature toggle support

## Critical Constraints
1. **Hub-and-Spoke Only**: Gateway MUST be central hub, never peer-to-peer
2. **Authentication**: Gateway is SINGLE source of auth, MCP servers NEVER authenticate directly
3. **MCP Protocol**: MCP servers MUST use stdio protocol only (no HTTP MCP servers)
4. **Stateless Services**: All services MUST be stateless for horizontal scaling
5. **JWT Expiry**: Access tokens = 1 hour, refresh tokens = 7 days
6. **Feature Toggles**: Use Unleash for ALL feature flags, never hardcoded flags
7. **API Versioning**: ALL breaking changes require new API version
8. **Zero Secrets**: NO plaintext secrets in code, use environment variables only
