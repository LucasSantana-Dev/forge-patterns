# Monitoring Patterns

Shared logging and observability utilities for the Forge Space ecosystem. Provides unified log shipping, Sentry integration, Supabase-backed log storage, and cross-service correlation tracking.

## Contents

```
patterns/monitoring/
├── shared-logger.ts              # TypeScript shared logger (Supabase + Sentry)
├── shared_logger.py              # Python shared logger (mcp-gateway sidecar)
├── SHARED_LOGGING_IMPLEMENTATION.md  # Full implementation guide
└── sentry-supabase.md            # Sentry + Supabase setup reference
```

## Architecture

All services log to a single Supabase `shared_logs` table with structured JSON entries. Sentry captures errors and performance spans. Correlation IDs (`correlationId`, `traceId`, `spanId`) link log entries across service boundaries.

```
mcp-gateway (Python)  ──┐
ui-mcp (Node.js)      ──┤──▶ Supabase shared_logs ──▶ Sentry Dashboard
siza (Next.js)        ──┘
```

## TypeScript Usage

```ts
import { SharedLogger } from '@forgespace/core/monitoring';

const logger = new SharedLogger({
  serviceName: 'ui-mcp',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV ?? 'development',
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_KEY!,
  enableSentry: true,
  sentryDsn: process.env.SENTRY_DSN,
});

await logger.info('Tool executed', { toolName: 'generate-ui', duration: 342 });
await logger.error('Tool failed', new Error('Timeout'), { toolName: 'generate-ui' });
```

**Log levels:** `trace`, `debug`, `info`, `warn`, `error`, `fatal`

**Structured fields:** `correlationId`, `userId`, `sessionId`, `requestId`, `traceId`, `spanId`, `tags`

## Python Usage

See `shared_logger.py` for the mcp-gateway sidecar equivalent. Uses the same Supabase table schema for cross-language correlation.

## Security

- **BR-001 Zero Secrets**: Supabase URL/Key must use `{{PLACEHOLDER}}` format in config files
- Log entries must never contain PII in the `message` field — use structured `context` only
- `userId` is an opaque identifier, not an email or username

## See Also

- `patterns/shared-infrastructure/logger/` — Full production logger with transports, Winston compatibility, and observability
- `SHARED_LOGGING_IMPLEMENTATION.md` — SQL schema, RLS policies, Sentry setup steps
