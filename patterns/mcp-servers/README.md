# MCP Server Patterns

Reference patterns and implementation guides for building Model Context Protocol (MCP) servers in the Forge Space ecosystem. All MCP servers use the stdio transport (no HTTP).

## Contents

```
patterns/mcp-servers/
├── ai-providers/      # AI provider abstraction patterns (OpenAI, Anthropic, Gemini)
├── streaming/         # Real-time streaming patterns for large generations
├── templates/         # Template engine patterns for React/Vue/Next.js UI generation
├── ui-generation/     # UI generation pipeline patterns
└── README.md          # This file
```

## Architecture Constraints

Per [ADR-003](../../docs/architecture-decisions/ADR-003-mcp-server-design.md):

- **stdio protocol only** — MCP servers MUST use stdio, never HTTP
- **Stateless** — all state lives in the gateway or downstream storage
- **Provider abstraction** — use the common `AIProvider` interface, never call provider APIs directly
- **Caching** — generated components are cached; check cache before calling AI providers
- **Streaming** — large generations use chunked streaming to avoid timeouts

## Provider Abstraction

```ts
// Pattern: wrap all AI providers behind a common interface
interface AIProvider {
  generate(prompt: string, options: GenerateOptions): Promise<GenerateResult>;
  stream(prompt: string, options: StreamOptions): AsyncIterable<string>;
}
```

See `ai-providers/README.md` for OpenAI, Anthropic, and Gemini implementations.

## UI Generation Pipeline

```
Tool call → Template selection → AI provider call → Output validation → Cache write → Response
```

See `ui-generation/README.md` for the full pipeline pattern with error handling and retry logic.

## Streaming Pattern

MCP tools that generate large responses (>4KB) should stream using SSE-style chunking:

```ts
// Pattern: yield chunks as they arrive from the AI provider
async *streamGenerate(prompt: string): AsyncIterable<string> {
  for await (const chunk of provider.stream(prompt)) {
    yield chunk;
  }
}
```

See `streaming/README.md` for backpressure handling and client buffering patterns.

## Template System

Templates are framework-specific scaffolds (React, Vue, Next.js, Angular) that provide structure for AI-generated components. The template engine injects AI output into the correct positions.

See `templates/README.md` for template authoring conventions.

## Integration

These patterns are implemented in:
- **ui-mcp** (Forge-Space/ui-mcp) — 21 MCP tools for UI generation
- **branding-mcp** (Forge-Space/branding-mcp) — 7 MCP tools for brand identity

## Security

- Tool inputs must be validated against a schema before processing
- AI provider API keys must never appear in logs or MCP tool responses
- Generated code is sanitized before returning to clients
