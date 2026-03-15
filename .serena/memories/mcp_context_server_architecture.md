# MCP Context Server Architecture

## Purpose
Guides editing of the MCP stdio server that exposes project contexts to IDEs.

## Key Files
- `src/mcp-context-server/index.ts` — server init, request handlers, stdio transport
- `src/mcp-context-server/validation.ts` — **TESTABLE** pure functions: `validateProjectSlug`, `isSafePathWithinBase`, `safeResolve`
- `src/mcp-context-server/resources.ts` — resource listing + URI resolution (`forge-space://context/{project}`)
- `src/mcp-context-server/tools.ts` — 3 tools: `get_project_context`, `update_project_context`, `list_projects`
- `src/mcp-context-server/store.ts` — file-based store, `{project}.md` + `{project}.meta.json`
- `src/mcp-context-server/context-store/` — storage directory (overridable via `MCP_CONTEXT_STORE_PATH`)

## Architecture
Server name: `uiforge-context-server` v2.0.0, uses `@modelcontextprotocol/sdk`.

Resource URIs: `forge-space://context/{project}` (e.g., `forge-space://context/forge-patterns`)
- Resources listed via `ListResourcesRequestSchema`
- Content read via `ReadResourceRequestSchema`

Tools:
- `get_project_context(project)` — read markdown context document
- `update_project_context(project, title, description, content)` — write/overwrite full context
- `list_projects()` — list all registered projects with metadata

Store: file-based, per-project `{slug}.md` (content) + `{slug}.meta.json` (title, description, updatedAt).

## Validation Module (validation.ts)
Extracted pure functions — testable with Jest (no `import.meta.url`):
- `validateProjectSlug(slug)` — enforces `/^[a-z0-9]+(-[a-z0-9]+)*$/`, throws on invalid
- `isSafePathWithinBase(base, candidate)` — returns false if path traversal detected
- `safeResolve(base, filename)` — wraps `resolve()` with path traversal protection

**23 tests** covering slug edge cases, null-byte injection, traversal attacks.

## Coverage
- `validation.ts` is in Jest collectCoverageFrom → 100% coverage
- `index.ts`, `store.ts`, `resources.ts`, `tools.ts` excluded (ESM/`import.meta.url`)

## Critical Constraints
- Slugs must be lowercase kebab-case
- `update_project_context` completely replaces existing content (no partial updates)
- Path traversal blocked by `safeResolve()` in validation.ts
- Server is ESM (`"type": "module"`) — excluded from root Jest config
