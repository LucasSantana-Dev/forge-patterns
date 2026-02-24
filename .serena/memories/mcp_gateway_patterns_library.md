# MCP Gateway Patterns Library

## Purpose
Serena's reference for the 4 core gateway patterns (routing, security, performance, authentication) when editing mcp-gateway code.

## Key Files
- `patterns/mcp-gateway/routing/README.md` — Request routing and load balancing
- `patterns/mcp-gateway/security/README.md` — Security, rate limiting, validation
- `patterns/mcp-gateway/performance/README.md` — Caching, connection pooling, batching
- `patterns/mcp-gateway/authentication/README.md` — JWT, sessions, authorization

## Routing Patterns (`patterns/mcp-gateway/routing/`)

**Core Router** (`core-router.ts`)
- **Route Matching**: Path, method, header, query parameter, content-based
- **Load Balancers**: Round robin, weighted, least connections, response time, health-based
- **Health Checking**: Continuous service health monitoring with auto-failover
- **Retry Policy**: Max retries, backoff, retryable status codes (5xx, timeouts)
- **Timeouts**: Connect (5s), request (30s), response (60s)

**Key Interfaces**
- `Route`: id, path, method, headers, query, target, priority, enabled
- `ServiceTarget`: serviceId, endpoint, weight, healthy, lastHealthCheck, responseTime, activeConnections
- `RoutingConfig`: routes[], loadBalancer type, healthCheck config, retryPolicy, timeoutPolicy

**Load Balancer Types** (enum `LoadBalancerType`)
- `ROUND_ROBIN`: Even distribution
- `WEIGHTED_ROUND_ROBIN`: Capacity-based distribution
- `LEAST_CONNECTIONS`: Route to least busy server
- `RESPONSE_TIME_BASED`: Route to fastest server
- `HEALTH_BASED`: Prioritize recently health-checked services

## Security Patterns (`patterns/mcp-gateway/security/`)

**Rate Limiting** (`rate-limiter.ts`)
- **Token Bucket**: Flexible rate limiting with burst capacity
- **Sliding Window**: Time-based windowing for accurate rate limiting
- **Per-User/IP**: Different limits per user or IP address
- **Per-Endpoint**: Different limits per API endpoint

**Request Validation** (`request-validator.ts`)
- **SQL Injection**: Pattern detection for SQL injection attempts
- **XSS Prevention**: Script tag and inline JavaScript detection
- **Input Sanitization**: HTML entity encoding for all string inputs
- **Schema Validation**: Request body structure validation

**Security Headers** (`security-headers.ts`)
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains`
- **Content-Security-Policy**: Default-src 'self', no unsafe-inline/eval
- **CORS**: Configured origins, methods, headers, credentials

**API Key Management** (`api-key-manager.ts`)
- **Key Generation**: Crypto-random 32-byte keys
- **Rate Limiting**: Per-key limits (minute/hour/day)
- **Permissions**: Per-key permission arrays
- **Expiration**: Optional key expiration dates
- **Usage Tracking**: Request count and timing per key

## Performance Patterns (`patterns/mcp-gateway/performance/`)

**Response Caching** (`response-cache.ts`)
- **Cache Strategy**: LRU eviction with TTL expiration
- **Max Size**: Configurable max cache entries
- **Default TTL**: 5 minutes (300000ms)
- **Cleanup**: Periodic cleanup of expired entries
- **Metrics**: Hit rate, miss rate, eviction count

**Connection Pooling** (`connection-pool.ts`)
- **Min/Max Connections**: Configurable pool size (e.g., 5-20)
- **Idle Timeout**: Close idle connections (default 5 minutes)
- **Acquire Timeout**: Max wait time for connection (default 5 seconds)
- **Health Checking**: Periodic connection health validation
- **Auto-scaling**: Dynamic pool size based on demand

**Request Batching** (`request-batcher.ts`)
- **Max Batch Size**: Configurable batch size (default 10)
- **Max Wait Time**: Max wait before processing batch (default 100ms)
- **Batch Timeout**: Overall batch processing timeout (default 1s)
- **Aggregation Strategy**: `first`, `last`, or `merge`

**Performance Monitoring** (`performance-monitor.ts`)
- **Metrics**: Request count, average latency, P95/P99, error rate, throughput
- **Resource Monitoring**: Memory usage, CPU usage, active connections
- **Alerting**: Threshold-based alerts for latency, error rate, throughput, resources
- **Metrics Interval**: Configurable collection interval (default 10s)

## Authentication Patterns (`patterns/mcp-gateway/authentication/`)

**JWT Token Management** (`jwt-token-generation.ts`)
- **Token Generation**: HS256 algorithm, 1-hour access tokens, 7-day refresh tokens
- **Token Payload**: userId, roles[], permissions[], sessionId, iat, exp
- **Token Validation**: Signature verification, expiration check, issuer validation
- **Token Refresh**: Generate new access token from valid refresh token

**Authentication Middleware** (`auth-middleware.ts`)
- **Token Extraction**: Bearer token from Authorization header
- **Token Validation**: JWT verification with secret key
- **User Context**: Attach user to request object (userId, roles, permissions, sessionId)
- **Authorization**: Permission-based access control

**Session Management** (`session-management.ts`)
- **Session Timeout**: 30 minutes default, refreshed on activity
- **Session Storage**: In-memory map (consider Redis for production)
- **Session Cleanup**: Periodic cleanup of expired sessions (every 5 minutes)
- **Session Metadata**: Created, last activity, expires, metadata object

## Critical Constraints
1. **Rate Limiting**: ALWAYS enforce rate limits on public endpoints
2. **Input Validation**: ALWAYS validate and sanitize ALL user inputs
3. **Security Headers**: ALWAYS include all security headers on responses
4. **JWT Expiry**: Access tokens = 1 hour, refresh tokens = 7 days (NO exceptions)
5. **Connection Pooling**: ALWAYS use connection pools for DB and external services
6. **Caching**: Cache responses for min 5 minutes, max 1 hour
7. **Circuit Breakers**: ALWAYS use circuit breakers for downstream service calls
8. **Timeouts**: Connect (5s), request (30s), response (60s) — enforce strictly
