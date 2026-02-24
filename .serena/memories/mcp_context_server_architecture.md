# MCP Context Server Architecture

## Purpose
Guides editing of the MCP stdio server that exposes project contexts to IDEs.

## Key Files
- `src/mcp-context-server/index.ts` — server init, request handlers, stdio transport
- `src/mcp-context-server/resources.ts` — `ProjectResource` interface, URI resolution (`uiforge://context/{project}`)
- `src/mcp-context-server/tools.ts` — 3 tools: `get_project_context`, `update_project_context`, `list_projects`
- `src/mcp-context-server/store.ts` — file-based store, `{project}.md` + `{project}.meta.json`
- `src/mcp-context-server/context-store/` — storage directory (overridable via `MCP_CONTEXT_STORE_PATH`)

## Architecture
Server name: `uiforge-context-server` v2.0.0, uses `@modelcontextprotocol/sdk`.

Resource URIs: `uiforge://context/{project}` (e.g., `uiforge://context/forge-patterns`)
- Resources listed via `ListResourcesRequestSchema`
- Content read via `ReadResourceRequestSchema`

Tools:
- `get_project_context(project)` — read markdown context document
- `update_project_context(project, title, description, content)` — write/overwrite full context
- `list_projects()` — list all registered projects with metadata

Store: file-based, per-project `{slug}.md` (content) + `{slug}.meta.json` (title, description, updatedAt).
Slug validation: `/^[a-z0-9]+(-[a-z0-9]+)*$/` (kebab-case only).
Path traversal protection via `safeResolve()`.

Build: `npm run mcp-context:build`, entry: `dist/mcp-context-server/index.js`
Run: `npm run mcp-context:start`

## Critical Constraints
- Slugs must be lowercase kebab-case
- `update_project_context` completely replaces existing content (no partial updates)
- Path traversal blocked by `safeResolve()`
