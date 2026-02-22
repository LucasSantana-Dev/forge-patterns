# Shared Constants

Centralised constants, types, and factory helpers extracted from all Forge ecosystem projects.

**Version:** 1.2.0
**Sources:** `mcp-gateway`, `uiforge-mcp`, `UIForge`

---

## Modules

| Module | Contents |
| --- | --- |
| `network.ts` | Timeouts, retry limits, gateway URL, health-check intervals, polling timers |
| `mcp-protocol.ts` | JSON-RPC version, MCP server version, protocol method names |
| `environments.ts` | `NodeEnv` / `LogLevel` types and defaults |
| `ai-providers.ts` | `AI_PROVIDERS` registry, `AIProvider` type, token/rate-limit caps |
| `feature-flags.ts` | `FeatureFlag` interface, `createFeatureFlags()` factory |
| `storage.ts` | `IndexedDBStoreConfig` interface, `createStorageConfig()` factory |
| `ports.ts` | Service port registry, `localUrl()` helper, Unleash URLs |
| `performance.ts` | Cache, connection pool, batch, alert thresholds, file size limits |
| `error-handling.ts` | Retryable status codes, retry/circuit-breaker defaults, error categories |
| `docker.ts` | Health-check timings, restart policies, dev database config |
| `security.ts` | Rate-limit, HSTS, CORS, field-redaction constants |

---

## Usage

```ts
import {
  // network
  DEFAULT_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  GATEWAY_DEFAULT_URL,
  HEALTH_CHECK_INTERVAL_MS,
  FEATURE_REFRESH_INTERVAL_MS,
  METRICS_INTERVAL_MS,
  CLIENT_INIT_TIMEOUT_MS,
  CONNECTION_TIMEOUT_MS,
  // mcp-protocol
  JSONRPC_VERSION,
  // environments
  NODE_ENVS,
  LOG_LEVELS,
  // ai-providers
  AI_PROVIDERS,
  // feature-flags
  createFeatureFlags,
  // storage
  createStorageConfig,
  // ports
  PORTS,
  localUrl,
  UNLEASH_URLS,
  // performance
  CACHE_DEFAULTS,
  POOL_DEFAULTS,
  BATCH_DEFAULTS,
  ALERT_THRESHOLDS,
  FILE_SIZE_LIMITS,
  // error-handling
  RETRYABLE_STATUS_CODES,
  RETRY_DEFAULTS,
  CIRCUIT_BREAKER_DEFAULTS,
  ERROR_CATEGORIES,
  // docker
  HEALTH_CHECK_DEFAULTS,
  RESTART_POLICIES,
  DEV_DATABASE,
  // security
  RATE_LIMIT_DEFAULTS,
  HSTS_DEFAULTS,
  REDACTED_FIELDS,
  DEV_CORS_ORIGINS,
} from '@uiforge/forge-patterns/shared-constants';
```

---

## Module Reference

### `network.ts`

```ts
DEFAULT_TIMEOUT_MS             = 120_000   // ms
MIN_TIMEOUT_MS                 = 1_000
MAX_TIMEOUT_MS                 = 600_000
MAX_RETRIES                    = 3
RETRY_DELAY_MS                 = 2_000
GATEWAY_DEFAULT_URL            = 'http://gateway:4444'
AI_ROUTER_DEFAULT_TIMEOUT_MS   = 2_000
AI_ROUTER_DEFAULT_WEIGHT       = 0.7
MAX_TOOLS_SEARCH               = 10
DEFAULT_TOP_N                  = 1
HEALTH_CHECK_INTERVAL_MS       = 30_000    // 30 seconds
HEALTH_CHECK_TIMEOUT_MS        = 5_000     // 5 seconds
FEATURE_REFRESH_INTERVAL_MS    = 30_000    // 30 seconds
METRICS_INTERVAL_MS            = 60_000    // 1 minute
CLIENT_INIT_TIMEOUT_MS         = 10_000    // 10 seconds
CONNECTION_TIMEOUT_MS          = 30_000    // 30 seconds
```

### `mcp-protocol.ts`

```ts
JSONRPC_VERSION         = '2.0'
MCP_SERVER_VERSION      = '0.1.0'
MCP_GATEWAY_CLIENT_NAME = 'forge-mcp-gateway-client'
MCP_UIFORGE_SERVER_NAME = 'uiforge'
MCP_PROTOCOL_METHODS    = { TOOLS_LIST, TOOLS_CALL, RESOURCES_LIST, ... }
```

### `environments.ts`

```ts
NODE_ENVS               = ['development', 'production', 'test']
type NodeEnv            = 'development' | 'production' | 'test'
DEFAULT_NODE_ENV        = 'production'
LOG_LEVELS              = ['debug', 'info', 'warn', 'error']
type LogLevel           = 'debug' | 'info' | 'warn' | 'error'
DEFAULT_LOG_LEVEL       = 'info'
isValidNodeEnv(value)   -> boolean
isValidLogLevel(value)  -> boolean
```

### `ai-providers.ts`

```ts
type AIProvider         = 'openai' | 'anthropic' | 'google'
AI_PROVIDERS            // Record<AIProvider, AIProviderConfig>
AI_PROVIDERS_LIST       = ['openai', 'anthropic', 'google']
DEFAULT_AI_PROVIDER     = 'openai'
DEFAULT_MAX_TOKENS      = 2_000
DEFAULT_TEMPERATURE     = 0.7
API_KEY_EXPIRY_DAYS     = 90
isValidAIProvider(v)    -> boolean
getAIProviderConfig(p)  -> AIProviderConfig
```

**Provider details:**

| Provider | Base URL | Max Tokens | Rate Limit/min |
| --- | --- | --- | --- |
| `openai` | `https://api.openai.com/v1` | 128,000 | 3,500 |
| `anthropic` | `https://api.anthropic.com/v1` | 200,000 | 1,000 |
| `google` | `https://generativelanguage.googleapis.com/v1beta` | 2,097,152 | 60 |

### `feature-flags.ts`

```ts
type FeatureFlagCategory = 'auth' | 'ui' | 'generation' | 'storage' | 'analytics' | 'system'

interface FeatureFlag<T extends string> {
  name: T; enabled: boolean; description: string; category: FeatureFlagCategory;
}

createFeatureFlags(definitions, overrides?)  -> Record<T, boolean>
resolveFeatureFlag(name, default, envPrefix?) -> boolean
resolveAllFeatureFlags(definitions, envPrefix?) -> Record<T, boolean>
```

### `storage.ts`

```ts
DEFAULT_DB_VERSION = 1

interface IndexedDBStoreConfig { dbName, version, stores }

createStorageConfig(dbName, stores, version?) -> IndexedDBStoreConfig

COMMON_STORE_NAMES = { API_KEYS, USER_PREFERENCES, SESSIONS, CACHE }
```

### `ports.ts`

```ts
PORTS = {
  APP_DEFAULT: 3000,   APP_SECONDARY: 3001,
  UNLEASH: 4242,       GATEWAY: 4444,
  POSTGRES: 5432,      REDIS: 6379,
  HTTP: 8080,          PROMETHEUS: 9090
}

type ServicePort      = typeof PORTS[keyof typeof PORTS]
localUrl(port, protocol?) -> string   // e.g. 'http://localhost:3000'

UNLEASH_URLS = {
  BASE:  'http://localhost:4242',
  API:   'http://localhost:4242/api',
  ADMIN: 'http://localhost:4242/admin'
}
```

### `performance.ts`

```ts
CACHE_DEFAULTS = {
  MAX_SIZE: 1000,
  DEFAULT_TTL_MS: 300_000,        // 5 minutes
  CLEANUP_INTERVAL_MS: 60_000     // 1 minute
}

POOL_DEFAULTS = { MIN_CONNECTIONS: 5, MAX_CONNECTIONS: 20 }

BATCH_DEFAULTS = { SIZE: 10, FLUSH_INTERVAL_MS: 5_000 }

ALERT_THRESHOLDS = {
  LATENCY_WARNING_MS: 1_000,
  ERROR_RATE_PERCENT: 5
}

FILE_SIZE_LIMITS = {
  SMALL: 1MB,  MEDIUM: 10MB,  LARGE: 25MB,  XLARGE: 50MB,  MAX: 100MB
}
```

### `error-handling.ts`

```ts
RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504]

RETRY_DEFAULTS = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY_MS: 2_000,
  BACKOFF_FACTOR: 2,
  MAX_DELAY_MS: 16_000
}

CIRCUIT_BREAKER_DEFAULTS = {
  FAILURE_THRESHOLD: 5,
  RESET_TIMEOUT_MS: 30_000,
  SUCCESS_THRESHOLD: 3
}

ERROR_CATEGORIES = {
  VALIDATION, AUTHENTICATION, AUTHORIZATION,
  NOT_FOUND, RATE_LIMIT, TIMEOUT, UPSTREAM, INTERNAL
}

type ErrorCategory = typeof ERROR_CATEGORIES[keyof typeof ERROR_CATEGORIES]
```

### `docker.ts`

```ts
HEALTH_CHECK_DEFAULTS = {
  INTERVAL_S: 30,
  TIMEOUT_S: 10,
  RETRIES: 3,
  START_PERIOD_S: 10
}

RESTART_POLICIES = { DEV: 'unless-stopped', PROD: 'always', ONE_SHOT: 'on-failure' }

type RestartPolicy = typeof RESTART_POLICIES[keyof typeof RESTART_POLICIES]

DEV_DATABASE = {
  USER: 'forge_dev',
  PASSWORD: 'REPLACE_WITH_DEV_PASSWORD',
  NAME: 'uiforge_dev',
  PROD_NAME: 'uiforge_prod'
}
```

### `security.ts`

```ts
RATE_LIMIT_DEFAULTS = { WINDOW_MS: 900_000, MAX_REQUESTS: 100 }

HSTS_DEFAULTS = { MAX_AGE_S: 31_536_000, INCLUDE_SUBDOMAINS: true, PRELOAD: true }

REDACTED_FIELDS = [
  'password', 'token', 'secret', 'key', 'auth', 'authorization',
  'cookie', 'apiKey', 'api_key', 'accessToken', 'access_token',
  'refreshToken', 'refresh_token'
]

type RedactedField = typeof REDACTED_FIELDS[number]

DEV_CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:8080']
```

---

## Python Consumers (mcp-gateway)

The Python `tool_router` reads these values from environment variables. The canonical defaults are:

| Env Var | Default | TS Constant |
| --- | --- | --- |
| `GATEWAY_URL` | `http://gateway:4444` | `GATEWAY_DEFAULT_URL` |
| `GATEWAY_TIMEOUT_MS` | `120000` | `DEFAULT_TIMEOUT_MS` |
| `GATEWAY_MAX_RETRIES` | `3` | `MAX_RETRIES` |
| `GATEWAY_RETRY_DELAY_MS` | `2000` | `RETRY_DELAY_MS` |
| `ROUTER_AI_TIMEOUT_MS` | `2000` | `AI_ROUTER_DEFAULT_TIMEOUT_MS` |
| `ROUTER_AI_WEIGHT` | `0.7` | `AI_ROUTER_DEFAULT_WEIGHT` |
| `MAX_TOOLS_SEARCH` | `10` | `MAX_TOOLS_SEARCH` |
| `DEFAULT_TOP_N` | `1` | `DEFAULT_TOP_N` |

---

## Business Rules

- **BR-001** Zero-Secrets: no secrets or credentials in this module.
- **BR-002** Pattern Versioning: follows semantic versioning.
- **BR-004** Documentation Coverage: all exports documented above.
