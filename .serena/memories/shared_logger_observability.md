# Shared Logger and Observability

## Purpose
Serena's reference for the centralized structured logging system and OpenTelemetry tracing when editing logging and observability code.

## Key Files
- `patterns/shared-infrastructure/logger/README.md` — Logger features and usage
- `patterns/shared-infrastructure/logger/INTEGRATION_GUIDE.md` — Integration patterns
- `patterns/shared-infrastructure/logger/index.js` — Logger exports

## Logger Features

**Core Logging**
- **Log Levels**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL (enum `LogLevel`)
- **Structured Logging**: JSON format for machine parsing
- **Multiple Transports**: Console (formatted), File (rotating), Remote (HTTP/gRPC)
- **Context Management**: Rich context with correlation IDs
- **Performance Tracking**: Built-in timing with `startTimer()` and `endTimer()`

**Observability**
- **Metrics**: Counters, gauges, histograms, timers via `MetricsCollector`
- **Distributed Tracing**: OpenTelemetry-compatible tracing spans
- **Health Checks**: Comprehensive health monitoring endpoints
- **Alerting**: Rule-based alerting system
- **Correlation IDs**: Automatic request tracing across services

## Logger Factory (`LoggerFactory`)

**Creation Methods**
```typescript
// Default configuration (console, INFO level)
const logger = LoggerFactory.createDefault('service-name', '1.0.0');

// Environment-based configuration (from env vars)
const logger = LoggerFactory.create(
  ConfigUtils.createForEnvironment('service-name', '1.0.0')
);

// Custom configuration (fluent builder)
const logger = LoggerFactory.create(
  ConfigBuilder
    .create()
    .service('my-api')
    .version('2.1.0')
    .environment('production')
    .level(LogLevel.INFO)
    .enableConsole(false)
    .enableStructured(true)
    .enableFile('./logs/api.log', 50 * 1024 * 1024, 10) // 50MB, 10 files
    .enableCorrelationIds(true)
    .enableMetrics(true)
    .redactFields(['password', 'token', 'secret'])
    .defaultContext({ region: 'us-west-2' })
    .build()
);
```

## Logging Methods

**Basic Logging**
```typescript
logger.trace('Detailed trace info', { data });
logger.debug('Debug information', { data });
logger.info('Informational message', { data });
logger.warn('Warning message', { data });
logger.error('Error occurred', error, { data });
logger.fatal('Fatal error', error, { data });
```

**Structured Logging with Context**
```typescript
logger.info('User authenticated', {
  userId: '12345',
  email: 'user@example.com',
  roles: ['admin', 'user'],
  loginMethod: 'oauth',
  ip: '192.168.1.100'
});
```

**Error Logging**
```typescript
logger.error('Database connection failed', new Error('Connection timeout'), {
  database: 'postgres',
  host: 'db.example.com',
  port: 5432,
  retryCount: 3
});
```

## Performance Tracking

**Manual Timing**
```typescript
const timerId = logger.startTimer('database-query');
await performDatabaseQuery();
logger.endTimer(timerId, { query: 'SELECT * FROM users', rows: 150 });
```

**Async Timing Wrapper**
```typescript
const result = await logger.trackAsync('api-call', async () => {
  return await fetch('https://api.example.com/data');
}, { endpoint: '/data', method: 'GET' });
```

## Child Loggers

**Create Child with Context**
```typescript
const userLogger = logger.child({
  userId: '12345',
  sessionId: 'sess_abc123'
});

userLogger.info('User action', { action: 'profile_update' });
// Output includes userId and sessionId automatically
```

## Metrics Collection (`MetricsCollector`)

**Counters**
```typescript
metrics.incrementCounter('api.requests', 1, { method: 'GET', status: '200' });
metrics.incrementCounter('api.errors', 1, { type: 'DatabaseError' });
```

**Gauges**
```typescript
metrics.setGauge('memory.usage', 85.5, { type: 'heap' });
metrics.setGauge('active.connections', 42);
```

**Histograms**
```typescript
metrics.recordHistogram('response.time', 150, { endpoint: '/api/users' });
metrics.recordHistogram('query.duration', 25, { query: 'SELECT users' });
```

**Timers**
```typescript
const timer = metrics.startTimer('operation');
await performOperation();
metrics.endTimer(timer, { operation: 'data-processing' });
```

## Distributed Tracing (`DistributedTracer`)

**Start Span**
```typescript
const span = tracer.startSpan('user-request', {
  'user.id': userId,
  'service.name': 'service-a',
  'http.method': 'POST',
  'http.url': '/api/users'
});
```

**End Span**
```typescript
span.end({ success: true, duration: 150 });
```

**Propagate Trace Context**
```typescript
// Service A
const traceId = span.traceId;
const spanId = span.spanId;

// Pass to Service B
fetch('http://service-b/api', {
  headers: {
    'x-trace-id': traceId,
    'x-span-id': spanId,
    'x-correlation-id': correlationId
  }
});

// Service B
const parentSpan = tracer.extractSpan(req.headers['x-trace-id'], req.headers['x-span-id']);
const childSpan = tracer.startSpan('service-b-operation', { parent: parentSpan });
```

## Configuration Options

**Environment Variables**
```bash
LOGGER_SERVICE=my-service
LOGGER_VERSION=1.0.0
LOGGER_ENVIRONMENT=production
LOGGER_LEVEL=info
LOGGER_ENABLE_CONSOLE=false
LOGGER_ENABLE_STRUCTURED=true
LOGGER_ENABLE_FILE=true
LOGGER_FILE_PATH=./logs/app.log
LOGGER_FILE_MAX_SIZE=52428800  # 50MB
LOGGER_FILE_MAX_FILES=10
LOGGER_ENABLE_CORRELATION=true
LOGGER_ENABLE_METRICS=true
LOGGER_ENABLE_TRACING=true
LOGGER_REDACT_FIELDS=password,token,secret,apiKey,auth
```

**Field Redaction**
- Always redact: `password`, `token`, `secret`, `apiKey`, `auth`, `ssn`, `creditCard`
- Redaction replaces value with `[REDACTED]`
- Case-insensitive field name matching
- Nested object support

## Integration Patterns

**Express.js Middleware**
```typescript
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
  logger.setCorrelation({ requestId, userId: req.user?.id });
  
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });
  
  next();
});
```

**Error Handling**
```typescript
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

## Critical Constraints
1. **Structured Format**: ALWAYS log in JSON format for production (set `enableStructured: true`)
2. **Field Redaction**: ALWAYS redact sensitive fields (passwords, tokens, secrets)
3. **Correlation IDs**: ALWAYS use correlation IDs for request tracing
4. **Log Levels**: Use INFO for production, DEBUG for development, ERROR for errors
5. **File Rotation**: Set max file size (50MB) and max files (10) for file transport
6. **OpenTelemetry**: Use OpenTelemetry-compatible tracing for distributed systems
7. **Performance**: Use `startTimer()`/`endTimer()` for performance tracking
8. **Error Context**: ALWAYS include error object AND context in `logger.error()`
