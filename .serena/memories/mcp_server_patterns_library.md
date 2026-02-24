# MCP Server Patterns Library

## Purpose
Serena's reference for the 4 core MCP server patterns (AI providers, streaming, templates, UI generation) when editing MCP server code.

## Key Files
- `patterns/mcp-servers/ai-providers/README.md` — Multi-provider AI abstraction
- `patterns/mcp-servers/streaming/README.md` — SSE and WebSocket streaming
- `patterns/mcp-servers/templates/README.md` — Template versioning and management
- `patterns/mcp-servers/ui-generation/README.md` — AI-powered UI component generation

## AI Provider Patterns (`patterns/mcp-servers/ai-providers/`)

**AI Provider Manager** (`ai-provider-manager.ts`)
- **Provider Types**: OpenAI, Anthropic, Custom, Local, Hybrid
- **Provider Abstraction**: Common interface `AIProvider` for all providers
- **Failover**: Automatic failover to backup providers on failure
- **Load Balancing**: Distribute requests across multiple providers
- **Cost Tracking**: Track API costs per provider and per request
- **Circuit Breaking**: Temporarily disable failing providers

**Core Interfaces**
- `AIProvider`: name, type, isAvailable(), supportsModel(), generate(), generateStreaming(), estimateTokens(), getCost(), getMetrics()
- `GenerateOptions`: model, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, stop[], stream
- `GenerateResponse`: content, model, usage (promptTokens, completionTokens, totalTokens), provider, metadata
- `ProviderMetrics`: totalRequests, successfulRequests, failedRequests, averageResponseTime, totalCost, totalTokens, lastUsed, uptime

**Provider Configuration**
- **Enabled**: Flag to enable/disable provider
- **Priority**: Provider selection priority (higher = preferred)
- **Weight**: Load balancing weight
- **Limits**: maxRequestsPerMinute, maxTokensPerMinute, costLimit
- **API Key**: Provider API key (from environment)
- **Endpoint**: Custom endpoint URL (optional)
- **Models**: Supported models with costs and features

## Streaming Patterns (`patterns/mcp-servers/streaming/`)

**Server-Sent Events (SSE)** (`sse/middleware.js`)
- **Headers**: Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive
- **Event Format**: `event: <type>\ndata: <json>\n\n`
- **Auto-Reconnection**: Client-side reconnection with Last-Event-ID
- **Heartbeat**: Periodic keep-alive messages
- **Feature Toggle**: `sse-streaming` feature flag

**WebSocket Streaming** (`websocket/server.js`)
- **Message Format**: JSON with `{ type, data }` structure
- **Room Management**: Group connections by room for broadcasts
- **Connection Pooling**: Max connections limit (default 1000)
- **Heartbeat**: Ping/pong for connection health
- **Feature Toggle**: `websocket-streaming` feature flag

**Stream Processing** (`real-time/stream-processor.js`)
- **Buffer Size**: Configurable buffer (default 1000 items)
- **Processing Interval**: Batch processing interval (default 100ms)
- **Backpressure**: Pause streams when buffer full
- **Data Transformation**: Transform stream data before sending

## Template Patterns (`patterns/mcp-servers/templates/`)

**Template Manager** (`template-manager.ts`)
- **Versioning**: Semantic versioning (major.minor.patch)
- **Registry**: Central version registry per template name
- **Validation**: Syntax, schema, security, performance validation
- **Compilation**: Compile templates once, cache compiled version
- **Rendering**: Context-aware rendering with parameter validation

**Template Structure**
- `Template`: id, name, version, content, metadata, dependencies[], compiled, lastModified, deprecated, deprecationMessage
- `TemplateMetadata`: author, description, tags[], framework, language, category, parameters[], examples[]
- `TemplateParameter`: name, type, required, default, description, validation[]
- `CompiledTemplate`: render(), dependencies[], parameters[]

**Template Caching**
- **Compiled Cache**: Cache compiled templates for faster rendering
- **Fragment Cache**: Cache reusable template fragments
- **Dependency Cache**: Cache template dependencies and imports
- **Cache Invalidation**: Invalidate on template update or version change

**Template Validation**
- **Syntax**: Template syntax checking (framework-specific)
- **Schema**: Structure validation against defined schema
- **Security**: No script injection, no unsafe eval, no external scripts
- **Performance**: Check for performance anti-patterns
- **Integration**: Compatibility with target framework

## UI Generation Patterns (`patterns/mcp-servers/ui-generation/`)

**UI Generation Engine** (`ui-generation-engine.ts`)
- **Component Types**: `component`, `page`, `layout`
- **Frameworks**: React, Next.js, Vue, Svelte, Angular
- **AI Providers**: OpenAI, Anthropic, custom providers
- **Template System**: Template-based or AI-generated components
- **Caching**: Cache generated components for reuse

**Component Request**
- `UIComponentRequest`: type, framework, description, requirements[], context{}, template
- **Validation**: Check description, framework support, template existence
- **Provider Selection**: Select AI provider based on availability and load
- **Prompt Building**: Build prompt from template + request context

**Component Response**
- `UIComponentResponse`: id, type, framework, code, dependencies[], metadata{}, generatedAt
- **Code**: Generated component code
- **Dependencies**: NPM packages required
- **Metadata**: Generation time, provider, template, AI model used

**Streaming Generation** (`generateComponentStreaming()`)
- **Protocol**: Server-Sent Events or WebSocket
- **Chunks**: Stream code as it's generated
- **Progress**: Track generation progress percentage
- **Error Handling**: Graceful error recovery, partial results

**Component Caching**
- **Cache Key**: Hash of (type, framework, description, requirements)
- **TTL**: 1 hour for generated components
- **Invalidation**: On template update or AI model change
- **Storage**: In-memory cache with Redis fallback

## Critical Constraints
1. **Provider Failover**: ALWAYS implement failover for AI providers (3 retries max)
2. **Streaming**: Use SSE for one-way, WebSocket for two-way communication
3. **Template Versioning**: ALWAYS use semantic versioning for templates
4. **Component Validation**: ALWAYS validate generated components before returning
5. **Caching**: Cache AI responses for min 1 hour to reduce costs
6. **Token Limits**: Respect provider token limits (OpenAI: 4096, Anthropic: 100000)
7. **Timeouts**: AI generation timeout = 60 seconds max
8. **Feature Toggles**: Check feature flags before using streaming or AI features
