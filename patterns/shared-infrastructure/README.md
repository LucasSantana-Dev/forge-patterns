# Shared Infrastructure Patterns

This directory contains shared infrastructure patterns and utilities that can be used across multiple projects and services.

## 📊 Logger Module

A comprehensive, production-ready logging module for Node.js applications with built-in observability, structured logging, and distributed tracing capabilities.

### 🚀 Features

- **Multiple Log Levels**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- **Structured Logging**: JSON and formatted console output
- **Multiple Transports**: Console, File, Remote, and custom transports
- **Context Management**: Rich context support with correlation IDs
- **Performance Tracking**: Built-in timing and performance metrics
- **Observability**: Metrics collection, distributed tracing, health checks
- **Configuration**: Environment-based and programmatic configuration
- **Security**: Automatic redaction of sensitive data

### 📁 Structure

```
logger/
├── src/
│   ├── types.ts           # Type definitions and interfaces
│   ├── logger.ts          # Core logger implementation
│   ├── transports.ts      # Transport implementations
│   └── observability.ts   # Metrics, tracing, and health checks
├── config/
│   └── index.ts          # Configuration utilities and builders
├── examples/
│   ├── basic-usage.ts    # Basic usage examples
│   └── advanced-usage.ts  # Advanced usage examples
├── tests/                # Test files (to be added)
├── README.md             # Detailed documentation
├── package.json          # Package configuration
└── tsconfig.json         # TypeScript configuration
```

### 🎯 Quick Start

```typescript
import { LoggerFactory } from './logger/index.js';

// Create a logger with default configuration
const logger = LoggerFactory.createDefault('my-service', '1.0.0');

// Basic logging
logger.info('Application started');
logger.error('Something went wrong', new Error('Detailed error'));
logger.warn('Deprecated API used', { api: 'old-endpoint', version: 'v1' });
```

### 🔧 Configuration

```typescript
import { ConfigBuilder, LogLevel } from './logger/index.js';

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
    .build()
);
```

### 📈 Observability

```typescript
import { MetricsCollector, DistributedTracer } from './logger/index.js';

// Metrics collection
const metrics = new MetricsCollector();
metrics.incrementCounter('api.requests', 1, { method: 'GET', status: '200' });
metrics.recordHistogram('response.time', 150, { endpoint: '/api/users' });

// Distributed tracing
const tracer = new DistributedTracer();
const span = tracer.startSpan('api-request', { 'http.method': 'GET' });
tracer.addTags(span.spanId, { 'user.id': '12345' });
tracer.finishSpan(span.spanId);
```

### 🌍 Environment Variables

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

# Feature flags
LOGGER_ENABLE_CORRELATION=true
LOGGER_ENABLE_METRICS=true
LOGGER_ENABLE_TRACING=false

# Security
LOGGER_REDACT_FIELDS=password,token,secret,key,auth
```

### 🔗 Integration Examples

#### Express.js Integration

```typescript
import express from 'express';
import { LoggerFactory } from './logger/index.js';

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
```

#### Microservices Integration

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

### 📊 Best Practices

1. **Structured Logging**: Use rich context objects instead of string concatenation
2. **Error Handling**: Always include error objects and relevant context
3. **Performance Logging**: Use built-in timing functions for performance tracking
4. **Security**: Configure redaction for sensitive data fields
5. **Correlation**: Use correlation IDs for request tracing across services

### 🧪 Testing

```typescript
import { LoggerFactory, LogLevel } from './logger/index.js';

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
```

### 📦 Installation and Usage

1. Copy the logger module to your project
2. Install dependencies: `npm install typescript @types/node`
3. Import and use in your application
4. Configure based on your environment and needs

### 🔗 Related Patterns

- [Docker Patterns](../docker/) - Container logging best practices
- [Terraform Patterns](../terraform/) - Infrastructure logging
- [Cost Monitoring](../cost/) - Log analysis and cost optimization

---

## 🚧 Future Enhancements

- **Additional Transports**: Elasticsearch, Splunk, Datadog integrations
- **Log Aggregation**: Built-in log aggregation and forwarding
- **Real-time Monitoring**: WebSocket-based real-time log streaming
- **Advanced Filtering**: More sophisticated log filtering and routing
- **Performance Optimization**: Async processing and batching improvements

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add comprehensive tests for new features
3. Update documentation for any API changes
4. Ensure TypeScript strict mode compliance
5. Follow the established coding standards