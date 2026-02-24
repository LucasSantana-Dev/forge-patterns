# Ecosystem Hub-and-Spoke Architecture

## Purpose
Serena's reference for understanding the hub-and-spoke pattern, component roles, authentication flow, and data flow when editing code.

## Key Files
- `docs/ecosystem/ARCHITECTURE.md` — System architecture overview
- `docs/ecosystem/OVERVIEW.md` — Ecosystem vision and capabilities
- `docs/architecture-decisions/ADR-001-ecosystem-design.md` — Hub-and-spoke pattern

## Hub-and-Spoke Pattern

### Component Roles

**forge-mcp-gateway (Central Hub)**
- **API Layer**: RESTful API, MCP protocol, WebSocket, GraphQL
- **Authentication Service**: JWT token management, user auth, RBAC, security policies
- **Routing Service**: Request routing, load balancing, circuit breaker, protocol translation
- **Virtual Server Manager**: MCP server lifecycle, configuration, health monitoring, resource allocation

**uiforge-mcp (UI Generation Spoke)**
- **MCP Protocol Layer**: Standard MCP implementation, custom extensions, error handling
- **AI Model Service**: OpenAI/Anthropic abstraction, prompt engineering, response processing
- **Template Engine**: Template parsing, component generation, code formatting, framework adapters
- **Storage**: Template repository, component library, cache storage

**uiforge-webapp (Management Interface)**
- **Frontend**: React components, Redux state, Next.js routing, Tailwind UI
- **Backend**: Next.js API routes, middleware, database integration
- **Data Layer**: Supabase client, local storage, session storage, caching

### Authentication Flow
```
1. User → WebApp: Login credentials
2. WebApp → Gateway: Authentication request
3. Gateway → Database: Validate credentials
4. Gateway → Gateway: Generate JWT token
5. Gateway → WebApp: JWT access + refresh tokens
6. WebApp → User: Login success

Subsequent requests:
7. WebApp → Gateway: API request (JWT in header)
8. Gateway: Validate JWT, check permissions
9. Gateway → MCP Server: Forward request with user context
10. MCP Server → Gateway: Response
11. Gateway → WebApp: Response
12. WebApp → User: Display result
```

### Data Flow Patterns

**Component Generation Flow**
```
User → WebApp → Gateway (auth) → Gateway (route to uiforge-mcp) → uiforge-mcp (AI generation) → Gateway → WebApp → User
```

**Template Management Flow**
```
User → WebApp → Gateway (auth + permissions) → Gateway (route to uiforge-mcp) → uiforge-mcp (template CRUD) → Gateway → WebApp → User
```

**Server Status Flow**
```
Admin → WebApp → Gateway (auth + admin role) → Gateway (server manager) → Gateway → WebApp → Admin
```

### Critical Integration Points

**WebApp ↔ Gateway**
- Protocol: RESTful HTTP/JSON
- Auth: JWT tokens (Bearer token in Authorization header)
- Endpoints: `/api/auth/*`, `/api/generate/*`, `/api/templates/*`, `/api/servers/*`

**Gateway ↔ MCP Servers**
- Protocol: MCP stdio (NOT HTTP)
- Auth: User context passed in MCP request metadata
- Tool Calls: `tools/call` method with tool name and arguments
- Responses: JSON result with component data

**WebApp ↔ Supabase**
- Protocol: Supabase client SDK
- Auth: JWT tokens from gateway OR Supabase auth
- Real-time: Supabase subscriptions for live updates
- Storage: PostgreSQL database for user data, projects, components

## Critical Constraints
1. **Single Hub**: Gateway is THE ONLY hub, never create peer-to-peer connections
2. **Authentication**: Gateway authenticates ALL requests, MCP servers trust gateway context
3. **JWT Propagation**: User context MUST be passed from gateway to MCP servers
4. **MCP Protocol**: Use MCP stdio protocol ONLY (stdio transport, not HTTP)
5. **Stateless**: All components MUST be stateless for horizontal scaling
6. **Circuit Breakers**: Gateway MUST use circuit breakers for MCP server failures
7. **Load Balancing**: Gateway MUST load balance across multiple MCP server instances
