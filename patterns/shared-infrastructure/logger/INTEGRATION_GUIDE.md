# 📊 Logger Module Integration Guide

This guide provides comprehensive instructions for integrating the Forge Patterns Logger module into your applications and services.

## 🚀 Quick Integration

### 1. Basic Setup

```typescript
// Install and import the logger
import { LoggerFactory } from '../patterns/shared-infrastructure/logger/index.js';

// Create a logger with default configuration
const logger = LoggerFactory.createDefault('my-service', '1.0.0');

// Start logging
logger.info('Application started successfully');
```

### 2. Environment-based Configuration

Set environment variables:

```bash
# Basic configuration
LOGGER_SERVICE=my-api-service
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
LOGGER_REDACT_FIELDS=password,token,secret,key,auth,ssn,creditcard
```

Then use automatic configuration:

```typescript
import { ConfigUtils } from '../patterns/shared-infrastructure/logger/index.js';

const logger = LoggerFactory.create(
  ConfigUtils.createForEnvironment('my-service', '1.0.0')
);
```

## 🏗️ Integration Patterns

### Express.js Integration

```typescript
import express from 'express';
import { LoggerFactory, LogLevel } from '../patterns/shared-infrastructure/logger/index.js';

const app = express();
const logger = LoggerFactory.createDefault('express-app', '1.0.0');

// Request logging middleware
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
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    logger.info('Request completed', {
      statusCode: res.statusCode,
      contentLength: data?.length || 0
    });
    return originalSend.call(this, data);
  };
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: req.headers['x-request-id']
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
```

### Microservices Integration

```typescript
// Service A - Request Initiator
import { LoggerFactory, DistributedTracer } from '../patterns/shared-infrastructure/logger/index.js';

const serviceA = LoggerFactory.createDefault('service-a', '1.0.0');
const tracer = new DistributedTracer();

export async function processUserRequest(userId: string) {
  // Start tracing
  const span = tracer.startSpan('user-request', {
    'user.id': userId,
    'service.name': 'service-a'
  });
  
  try {
    serviceA.info('Processing user request', { userId });
    
    // Call Service B
    const correlationId = serviceA.startTimer('service-b-call');
    serviceA.setCorrelation({
      correlationId,
      traceId: span.traceId,
      userId
    });
    
    const result = await fetch('http://service-b/api/data', {
      headers: {
        'x-correlation-id': correlationId,
        'x-trace-id': span.traceId,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    serviceA.endTimer(correlationId, { 
      service: 'service-b',
      status: result.ok ? 'success' : 'error'
    });
    
    if (!result.ok) {
      throw new Error(`Service B returned ${result.status}`);
    }
    
    const data = await result.json();
    serviceA.info('Request completed successfully', { userId, dataCount: data.length });
    
    tracer.finishSpan(span.spanId);
    return data;
    
  } catch (error) {
    serviceA.error('Request failed', error instanceof Error ? error : new Error(String(error)), { userId });
    tracer.finishSpan(span.spanId, error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

// Service B - Request Receiver
import { LoggerFactory } from '../patterns/shared-infrastructure/logger/index.js';

const serviceB = LoggerFactory.createDefault('service-b', '1.0.0');

// Express middleware for correlation
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'];
  const traceId = req.headers['x-trace-id'];
  
  if (correlationId) {
    serviceB.setCorrelation({
      correlationId,
      traceId,
      userId: req.body?.userId
    });
  }
  
  next();
});

app.post('/api/data', async (req, res) => {
  try {
    const { userId } = req.body;
    
    serviceB.info('Processing data request', { userId });
    
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const data = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      userId,
      data: `item_${i + 1}`
    }));
    
    serviceB.info('Data request completed', { userId, itemCount: data.length });
    
    res.json(data);
  } catch (error) {
    serviceB.error('Data request failed', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Background Job Integration

```typescript
import { LoggerFactory, ConfigBuilder, LogLevel } from '../patterns/shared-infrastructure/logger/index.js';

// Create logger for background jobs
const jobLogger = LoggerFactory.create(
  ConfigBuilder
    .create()
    .service('background-processor')
    .version('1.0.0')
    .environment('production')
    .level(LogLevel.INFO)
    .enableConsole(false)
    .enableStructured(true)
    .enableFile('./logs/jobs.log', 100 * 1024 * 1024, 5)
    .enableCorrelationIds(true)
    .enableMetrics(true)
    .redactFields(['password', 'token', 'secret'])
    .build()
);

class JobProcessor {
  async processJob(jobId: string, jobType: string, payload: any) {
    const timerId = jobLogger.startTimer(`job-${jobType}`);
    
    try {
      jobLogger.info('Job started', {
        jobId,
        jobType,
        payloadSize: JSON.stringify(payload).length
      });
      
      // Simulate job processing
      await this.executeJob(jobType, payload);
      
      jobLogger.info('Job completed successfully', {
        jobId,
        jobType,
        duration: Date.now() - parseInt(timerId.split('_')[1])
      });
      
    } catch (error) {
      jobLogger.error('Job failed', error instanceof Error ? error : new Error(String(error)), {
        jobId,
        jobType,
        payload: { ...payload, sensitive: '[REDACTED]' }
      });
      throw error;
    } finally {
      jobLogger.endTimer(timerId);
    }
  }
  
  private async executeJob(jobType: string, payload: any) {
    // Job-specific logic here
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  }
}

// Usage
const processor = new JobProcessor();
processor.processJob('job_123', 'email-send', { 
  to: 'user@example.com', 
  template: 'welcome',
  variables: { name: 'John' }
});
```

### Database Integration

```typescript
import { LoggerFactory } from '../patterns/shared-infrastructure/logger/index.js';

const dbLogger = LoggerFactory.createDefault('database-service', '1.0.0');

class DatabaseService {
  async query(sql: string, params?: any[]) {
    const timerId = dbLogger.startTimer('database-query');
    
    try {
      dbLogger.debug('Executing query', { 
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        paramCount: params?.length || 0
      });
      
      // Simulate database query
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
      
      const result = { rows: [], rowCount: 0 };
      
      dbLogger.debug('Query completed', {
        rowCount: result.rowCount,
        duration: Date.now() - parseInt(timerId.split('_')[1])
      });
      
      return result;
      
    } catch (error) {
      dbLogger.error('Query failed', error instanceof Error ? error : new Error(String(error)), {
        sql: sql.substring(0, 100),
        paramCount: params?.length || 0
      });
      throw error;
    } finally {
      dbLogger.endTimer(timerId);
    }
  }
  
  async transaction(operations: () => Promise<any>) {
    const timerId = dbLogger.startTimer('database-transaction');
    
    try {
      dbLogger.info('Transaction started');
      
      const result = await operations();
      
      dbLogger.info('Transaction committed', {
        duration: Date.now() - parseInt(timerId.split('_')[1])
      });
      
      return result;
      
    } catch (error) {
      dbLogger.error('Transaction rolled back', error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      dbLogger.endTimer(timerId);
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Transport Implementation

```typescript
import { LoggerTransport, LogEntry, LogLevel } from '../patterns/shared-infrastructure/logger/index.js';

class SlackTransport implements LoggerTransport {
  name = 'slack';
  level: LogLevel;
  private webhookUrl: string;
  private channel: string;

  constructor(webhookUrl: string, channel: string, level: LogLevel = LogLevel.ERROR) {
    this.webhookUrl = webhookUrl;
    this.channel = channel;
    this.level = level;
  }

  format(entry: LogEntry): string {
    return `🚨 *${LogLevel[entry.level].toUpperCase()}* in ${entry.service}\n${entry.message}`;
  }

  async write(entry: LogEntry): Promise<void> {
    if (entry.level < this.level) return;
    
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: this.channel,
          text: this.format(entry),
          attachments: [{
            color: this.getColorForLevel(entry.level),
            fields: [
              { title: 'Service', value: entry.service, short: true },
              { title: 'Environment', value: entry.environment, short: true },
              { title: 'Timestamp', value: entry.timestamp, short: true }
            ],
            ...(entry.context ? [{ title: 'Context', value: JSON.stringify(entry.context, null, 2) }] : [])
          }]
        })
      });
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return 'danger';
      case LogLevel.WARN: return 'warning';
      case LogLevel.FATAL: return 'danger';
      default: return 'good';
    }
  }
}

// Usage with custom transport
const logger = LoggerFactory.create({
  service: 'critical-service',
  version: '1.0.0',
  environment: 'production',
  level: LogLevel.INFO,
  enableConsole: true,
  enableStructured: true,
  transports: [
    new SlackTransport(
      process.env.SLACK_WEBHOOK_URL!,
      '#alerts',
      LogLevel.ERROR
    )
  ]
});
```

### Health Check Integration

```typescript
import { HealthChecker, LoggerFactory } from '../patterns/shared-infrastructure/logger/index.js';

const healthChecker = new HealthChecker();
const logger = LoggerFactory.createDefault('health-service', '1.0.0');

// Register health checks
healthChecker.registerCheck('database', {
  async execute() {
    try {
      // Check database connection
      const result = await checkDatabaseHealth();
      return {
        healthy: result.isHealthy,
        message: result.isHealthy ? 'Database healthy' : 'Database unhealthy',
        details: {
          connectionPool: result.poolSize,
          activeConnections: result.activeConnections,
          maxConnections: result.maxConnections
        }
      };
    } catch (error) {
      return {
        healthy: false,
        message: 'Database health check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
});

healthChecker.registerCheck('external-api', {
  async execute() {
    try {
      const response = await fetch('https://api.example.com/health', {
        timeout: 5000
      });
      return {
        healthy: response.ok,
        message: response.ok ? 'External API healthy' : 'External API unhealthy',
        details: {
          status: response.status,
          responseTime: Date.now()
        }
      };
    } catch (error) {
      return {
        healthy: false,
        message: 'External API unreachable',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
});

// Express health endpoint
app.get('/health', async (req, res) => {
  try {
    const healthReport = await healthChecker.runChecks();
    
    res.status(healthReport.status === 'healthy' ? 200 : 503).json({
      status: healthReport.status,
      timestamp: healthReport.timestamp,
      checks: healthReport.checks,
      summary: healthReport.summary
    });
    
    // Log health check results
    logger.info('Health check completed', {
      status: healthReport.status,
      healthy: healthReport.summary.healthy,
      unhealthy: healthReport.summary.unhealthy
    });
    
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});
```

### Metrics Integration

```typescript
import { MetricsCollector, LoggerFactory } from '../patterns/shared-infrastructure/logger/index.js';

const metrics = new MetricsCollector();
const logger = LoggerFactory.createDefault('metrics-service', '1.0.0');

// Track API metrics
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const method = req.method;
    const status = res.statusCode.toString();
    const endpoint = req.route?.path || req.path;
    
    // Increment request counter
    metrics.incrementCounter('http.requests', 1, {
      method,
      status,
      endpoint
    });
    
    // Record response time
    metrics.recordHistogram('http.response_time', duration, {
      method,
      endpoint
    });
    
    // Track error rate
    if (res.statusCode >= 400) {
      metrics.incrementCounter('http.errors', 1, {
        method,
        status,
        endpoint
      });
    }
    
    logger.info('Request metrics recorded', {
      method,
      endpoint,
      status,
      duration
    });
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  const metricsData = metrics.getMetrics();
  
  res.json({
    timestamp: new Date().toISOString(),
    metrics: metricsData
  });
  
  logger.info('Metrics endpoint accessed', {
    metricsCount: Object.keys(metricsData.counters).length + 
                   Object.keys(metricsData.histograms).length +
                   Object.keys(metricsData.gauges).length
  });
});
```

## 🚀 Production Deployment

### Docker Integration

```dockerfile
FROM node:18-alpine

# Set environment variables for logging
ENV LOGGER_SERVICE=my-app
ENV LOGGER_VERSION=1.0.0
ENV LOGGER_ENVIRONMENT=production
ENV LOGGER_LEVEL=info
ENV LOGGER_ENABLE_CONSOLE=false
ENV LOGGER_ENABLE_STRUCTURED=true
ENV LOGGER_ENABLE_FILE=true
ENV LOGGER_FILE_PATH=/app/logs/app.log
ENV LOGGER_REDACT_FIELDS=password,token,secret,key,auth

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown -R node:node /app/logs

# Copy application
COPY --chown=node:node . /app
WORKDIR /app

# Install dependencies
RUN npm ci --only=production

# Switch to non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('./dist/health-check.js').check()" || exit 1

# Start application
CMD ["node", "dist/index.js"]
```

### Kubernetes Integration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: LOGGER_SERVICE
          value: "my-app"
        - name: LOGGER_VERSION
          value: "1.0.0"
        - name: LOGGER_ENVIRONMENT
          value: "production"
        - name: LOGGER_LEVEL
          value: "info"
        - name: LOGGER_ENABLE_CONSOLE
          value: "false"
        - name: LOGGER_ENABLE_STRUCTURED
          value: "true"
        - name: LOGGER_ENABLE_FILE
          value: "true"
        - name: LOGGER_FILE_PATH
          value: "/app/logs/app.log"
        - name: LOGGER_REDACT_FIELDS
          value: "password,token,secret,key,auth"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: logs
          mountPath: /app/logs
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: logs
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

## 📊 Best Practices

### 1. Structured Logging

```typescript
// ✅ Good - structured context
logger.info('User authenticated', {
  userId: '12345',
  email: 'user@example.com',
  roles: ['admin', 'user'],
  loginMethod: 'oauth',
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0...'
});

// ❌ Avoid - unstructured messages
logger.info('User 12345 authenticated via oauth from 192.168.1.100 using Mozilla/5.0...');
```

### 2. Error Handling

```typescript
// ✅ Good - include error object and context
logger.error('API request failed', error, {
  endpoint: '/api/users',
  method: 'POST',
  statusCode: 500,
  retryCount: 3,
  requestPayload: { ...payload, sensitive: '[REDACTED]' }
});

// ❌ Avoid - lose error details
logger.error('API request failed');
```

### 3. Performance Logging

```typescript
// ✅ Good - use performance tracking
const timerId = logger.startTimer('database-query');
await performQuery();
logger.endTimer(timerId, { 
  query: 'SELECT * FROM users WHERE id = $1',
  rows: 150,
  affectedRows: 25
});

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
  email: 'user@example.com',
  password: '[REDACTED]', // Automatically redacted
  token: '[REDACTED]'
});
```

### 5. Correlation in Microservices

```typescript
// ✅ Good - propagate correlation context
const correlationId = logger.startTimer('service-call');
logger.setCorrelation({ correlationId, traceId, userId });

fetch('http://other-service/api', {
  headers: {
    'x-correlation-id': correlationId,
    'x-trace-id': traceId
  }
});
```

## 🔍 Troubleshooting

### Common Issues

1. **Logger not outputting**: Check log level configuration
2. **Missing correlation IDs**: Ensure correlation is set before logging
3. **Performance issues**: Disable debug logging in production
4. **Memory leaks**: Ensure logger.close() is called on shutdown

### Debug Mode

```typescript
// Enable debug logging for troubleshooting
const debugLogger = LoggerFactory.create({
  service: 'debug-service',
  version: '1.0.0',
  environment: 'development',
  level: LogLevel.TRACE,
  enableConsole: true,
  enableStructured: false
});

debugLogger.trace('Debug trace message');
debugLogger.debug('Debug message with context', { debug: true });
```

---

This integration guide provides comprehensive patterns for using the Forge Patterns Logger module in various scenarios. For more detailed examples, see the `examples/` directory in the logger module.