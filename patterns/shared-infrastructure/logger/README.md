# 📊 Shared Infrastructure Logger

A comprehensive, production-ready logging module for Node.js applications with built-in observability, structured logging, and distributed tracing capabilities.

## 🚀 Features

### Core Logging
- **Multiple Log Levels**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- **Structured Logging**: JSON and formatted console output
- **Multiple Transports**: Console, File, Remote, and custom transports
- **Context Management**: Rich context support with correlation IDs
- **Performance Tracking**: Built-in timing and performance metrics

### Observability
- **Metrics Collection**: Counters, gauges, histograms, and timers
- **Distributed Tracing**: OpenTelemetry-compatible tracing spans
- **Health Checks**: Comprehensive health monitoring
- **Alerting**: Rule-based alerting system
- **Correlation IDs**: Automatic request tracing across services

### Configuration
- **Environment-based Config**: Automatic configuration from environment variables
- **Fluent Builder API**: Easy programmatic configuration
- **Validation**: Built-in configuration validation
- **Multiple Environments**: Pre-configured profiles for dev/staging/prod

## 📦 Installation

```bash
npm install @forge-patterns/logger
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { LoggerFactory } from '@forge-patterns/logger';

// Create a logger with default configuration
const logger = LoggerFactory.createDefault('my-service', '1.0.0');

// Basic logging
logger.info('Application started');
logger.error('Something went wrong', new Error('Detailed error'));
logger.warn('Deprecated API used', { api: 'old-endpoint', version: 'v1' });
```

### Advanced Configuration

```typescript
import { ConfigBuilder, LogLevel, ConsoleTransport, FileTransport } from '@forge-patterns/logger';

const logger = LoggerFactory.create(
  ConfigBuilder
    .create()
    .service('my-api')
    .version('2.1.0')
    .environment('production')
    .level(LogLevel.INFO)
    .enableConsole(false)
    .enableStructured(true)
    .enableFile('./logs/api.log', 50 * 1024 * 1024, 10)
    .enableCorrelationIds(true)
    .enableMetrics(true)
    .redactFields(['password', 'token', 'secret'])
    .defaultContext({ region: 'us-west-2' })
    .build()
);
```

### Environment-based Configuration

```typescript
import { ConfigUtils } from '@forge-patterns/logger';

// Automatically configures based on NODE_ENV
const logger = LoggerFactory.create(
  ConfigUtils.createForEnvironment('my-service', '1.0.0')
);
```

## 📝 Logging Examples

### Structured Logging with Context

```typescript
// Rich context logging
logger.info('User authenticated', {
  userId: '12345',
  email: 'user@example.com',
  roles: ['admin', 'user'],
  loginMethod: 'oauth',
  ip: '192.168.1.100'
});

// Error logging with stack traces
logger.error('Database connection failed', new Error('Connection timeout'), {
  database: 'postgres',
  host: 'db.example.com',
  port: 5432,
  retryCount: 3
});
```

### Performance Tracking

```typescript
// Manual timing
const timerId = logger.startTimer('database-query');
await performDatabaseQuery();
logger.endTimer(timerId, { query: 'SELECT * FROM users', rows: 150 });

// Automatic timing with wrapper
const result = await logger.trackAsync('api-call', async () => {
  return await fetch('https://api.example.com/data');
}, { endpoint: '/data', method: 'GET' });
```

### Child Loggers with Context

```typescript
// Create child logger with additional context
const userLogger = logger.child({
  userId: '12345',
  sessionId: 'sess_abc123'
});

userLogger.info('User action performed', { action: 'profile_update' });
```

## 🔍 Observability

### Metrics Collection

```typescript
import { MetricsCollector } from '@forge-patterns/logger';

const metrics = new MetricsCollector();

// Counters
metrics.incrementCounter('api.requests', 1, { method: 'GET', status: '200' });

// Gauges
metrics.setGauge('memory.usage', 85.5, { type: 'heap' });

// Histograms
metrics.recordHistogram('response.time', 150, { endpoint: '/api/users' });

// Timers
const timerId = metrics.startTimer('operation.timing', { operation: 'database-query' });
// ... perform operation
const duration = metrics.endTimer(timerId);
```

### Distributed Tracing

```typescript
import { DistributedTracer } from '@forge-patterns/logger';

const tracer = new DistributedTracer();

// Start a span
const span = tracer.startSpan('api-request', {
  'http.method': 'GET',
  'http.url': '/api/users'
});

// Add tags and events
tracer.addTags(span.spanId, {
  'user.id': '12345',
  'service.version': '1.0.0'
});

tracer.addEvent(span.spanId, 'database.query', {
  query: 'SELECT * FROM users WHERE id = ?',
  duration: 45
});

// Finish the span
tracer.finishSpan(span.spanId);
```

### Health Checks

```typescript
import { HealthChecker } from '@forge-patterns/logger';

const healthChecker = new HealthChecker();

// Register health checks
healthChecker.registerCheck('database', {
  async execute() {
    const isHealthy = await checkDatabaseConnection();
    return {
      healthy: isHealthy,
      message: isHealthy ? 'Database connected' : 'Database connection failed',
      details: { connectionPool: 'active' }
    };
  }
});

healthChecker.registerCheck('external-api', {
  async execute() {
    const response = await fetch('https://api.example.com/health');
    return {
      healthy: response.ok,
      message: response.ok ? 'API healthy' : 'API unhealthy',
      details: { status: response.status }
    };
  }
});

// Run health checks
const healthReport = await healthChecker.runChecks();
console.log('Health status:', healthReport.status);
```

### Alerting

```typescript
import { AlertManager, LogLevel } from '@forge-patterns/logger';

const alertManager = new AlertManager();

// Add alert rules
alertManager.addRule({
  name: 'high-error-rate',
  severity: 'high',
  message: 'High error rate detected',
  conditions: {
    level: LogLevel.ERROR,
    rateLimit: {
      maxAlerts: 1,
      windowMs: 60000 // 1 minute
    }
  }
});

alertManager.addRule({
  name: 'critical-errors',
  severity: 'critical',
  conditions: {
    level: LogLevel.FATAL,
    messagePattern: 'database.*connection.*failed'
  }
});

// The alert manager will automatically evaluate log entries
logger.error('Database connection failed', new Error('Connection timeout'));
```

## ⚙️ Configuration

### Environment Variables

```bash
# Basic configuration
LOGGER_SERVICE=my-service
LOGGER_VERSION=1.0.0
LOGGER_ENVIRONMENT=production
LOGGER_LEVEL=info

# Transport configuration
LOGGER_ENABLE_CONSOLE=false
LOGGER_ENABLE_STRUCTURED=true
LOGGER_ENABLE_FILE=true
LOGGER_FILE_PATH=./logs/app.log
LOGGER_MAX_FILE_SIZE=52428800
LOGGER_MAX_FILES=10

# Feature flags
LOGGER_ENABLE_CORRELATION=true
LOGGER_ENABLE_METRICS=true
LOGGER_ENABLE_TRACING=false

# Security
LOGGER_REDACT_FIELDS=password,token,secret,key,auth,ssn,creditcard
```

### Configuration Files

```json
{
  "service": "my-service",
  "version": "1.0.0",
  "environment": "production",
  "level": "info",
  "enableConsole": false,
  "enableStructured": true,
  "enableFile": true,
  "filePath": "./logs/app.log",
  "maxFileSize": 52428800,
  "maxFiles": 10,
  "enableCorrelationIds": true,
  "enableMetrics": true,
  "enableTracing": false,
  "redactFields": ["password", "token", "secret"],
  "defaultContext": {
    "region": "us-west-2",
    "cluster": "production"
  }
}
```

## 🏗️ Architecture

### Transport System

The logger uses a pluggable transport system:

- **ConsoleTransport**: Formatted console output with colors
- **JsonTransport**: Structured JSON output for log aggregation
- **FileTransport**: File-based logging with rotation
- **RemoteTransport**: Remote logging service integration
- **FilteredTransport**: Filter logs based on criteria
- **MultiTransport**: Combine multiple transports

### Correlation Context

Automatic correlation ID propagation:

```typescript
// Set correlation context
logger.setCorrelation({
  correlationId: 'corr_123456',
  userId: 'user_789',
  sessionId: 'sess_abc',
  requestId: 'req_def'
});

// All subsequent logs will include correlation data
logger.info('Processing request'); // Includes correlation data
```

### Performance Optimization

- **Lazy Evaluation**: Transports only process logs at their level
- **Batch Processing**: Remote transports batch log entries
- **Memory Management**: Automatic cleanup of old data
- **Async Operations**: Non-blocking log writing

## 🧪 Testing

```typescript
import { LoggerFactory, LogLevel } from '@forge-patterns/logger';

// Test with mock transport
const mockTransport = {
  name: 'mock',
  level: LogLevel.DEBUG,
  format: (entry) => JSON.stringify(entry),
  write: (entry) => {
    // Capture logs for testing
    testLogs.push(entry);
  }
};

const logger = LoggerFactory.create({
  service: 'test-service',
  version: '1.0.0',
  environment: 'test',
  level: LogLevel.DEBUG,
  transports: [mockTransport]
});

// Test logging
logger.info('Test message', { test: true });
expect(testLogs).toHaveLength(1);
expect(testLogs[0].message).toBe('Test message');
```

## 📊 Best Practices

### 1. Structured Logging
```typescript
// ✅ Good - structured context
logger.info('User login successful', {
  userId: '12345',
  method: 'oauth',
  ip: '192.168.1.100'
});

// ❌ Avoid - unstructured messages
logger.info('User 12345 logged in via oauth from 192.168.1.100');
```

### 2. Error Handling
```typescript
// ✅ Good - include error object and context
logger.error('API request failed', error, {
  endpoint: '/api/users',
  method: 'POST',
  statusCode: 500,
  retryCount: 3
});

// ❌ Avoid - lose error details
logger.error('API request failed');
```

### 3. Performance Logging
```typescript
// ✅ Good - use performance tracking
const timerId = logger.startTimer('database-query');
await performQuery();
logger.endTimer(timerId, { query: 'SELECT * FROM users' });

// ❌ Avoid - manual timing
const start = Date.now();
await performQuery();
const duration = Date.now() - start;
logger.info('Query completed', { duration });
```

### 4. Security
```typescript
// ✅ Good - sensitive data is redacted
logger.info('User authentication', {
  userId: '12345',
  password: '[REDACTED]', // Automatically redacted
  token: '[REDACTED]'
});
```

## 🔧 Integration Examples

### Express.js Integration

```typescript
import express from 'express';
import { LoggerFactory } from '@forge-patterns/logger';

const app = express();
const logger = LoggerFactory.createDefault('api-server', '1.0.0');

// Request middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
  
  logger.setCorrelation({
    requestId,
    userId: req.user?.id,
    sessionId: req.session?.id
  });
  
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });
  
  next();
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    method: req.method,
    url: req.url,
    statusCode: err.statusCode
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

### Microservices Integration

```typescript
// Service A - Request initiator
const loggerA = LoggerFactory.createDefault('service-a', '1.0.0');

const correlationId = loggerA.startTimer('api-call');
loggerA.setCorrelation({ correlationId });

// Pass correlation to Service B
fetch('http://service-b/api', {
  headers: {
    'x-correlation-id': correlationId,
    'x-trace-id': tracer.getCurrentTraceId()
  }
});

// Service B - Request receiver
const loggerB = LoggerFactory.createDefault('service-b', '1.0.0');

app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'];
  const traceId = req.headers['x-trace-id'];
  
  loggerB.setCorrelation({ correlationId, traceId });
  next();
});
```

## 📈 Monitoring and Metrics

### Built-in Metrics

The logger automatically tracks:

- **Log Volume**: Total logs and logs by level
- **Error Rate**: Percentage of error logs
- **Transport Health**: Success/failure rates per transport
- **Performance**: Average log processing time

### Custom Metrics

```typescript
// Get logger metrics
const metrics = logger.getMetrics();
console.log('Total logs:', metrics.totalLogs);
console.log('Error rate:', metrics.errorRate);
console.log('Transport errors:', metrics.transportErrors);

// Health check
const isHealthy = await logger.health();
console.log('Logger health:', isHealthy);
```

## 🚀 Production Deployment

### Docker Integration

```dockerfile
FROM node:18-alpine

# Set environment variables
ENV LOGGER_SERVICE=my-app
ENV LOGGER_VERSION=1.0.0
ENV LOGGER_ENVIRONMENT=production
ENV LOGGER_LEVEL=info
ENV LOGGER_ENABLE_CONSOLE=false
ENV LOGGER_ENABLE_STRUCTURED=true
ENV LOGGER_ENABLE_FILE=true
ENV LOGGER_FILE_PATH=/app/logs/app.log

# Create logs directory
RUN mkdir -p /app/logs

# Copy application
COPY . /app

# Run application
CMD ["node", "index.js"]
```

### Kubernetes Integration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: my-app:latest
        env:
        - name: LOGGER_SERVICE
          value: "my-app"
        - name: LOGGER_ENVIRONMENT
          value: "production"
        - name: LOGGER_ENABLE_STRUCTURED
          value: "true"
        - name: LOGGER_ENABLE_FILE
          value: "true"
        volumeMounts:
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: logs
        emptyDir: {}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Patterns

- [Docker Patterns](../docker/) - Container logging best practices
- [Terraform Patterns](../terraform/) - Infrastructure logging
- [Cost Monitoring](../cost/) - Log analysis and cost optimization
