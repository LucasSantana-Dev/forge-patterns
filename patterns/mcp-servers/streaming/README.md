# Streaming Patterns for MCP Servers

## 🎯 Overview

This directory contains streaming patterns designed for real-time communication in MCP servers. All patterns integrate with the centralized feature toggle system and support efficient, scalable real-time data delivery.

## 📋 Available Patterns

### Server-Sent Events (SSE)
- **Pattern**: Unidirectional real-time updates
- **Use Case**: Live updates, notifications, progress tracking
- **Features**: Auto-reconnection, event filtering, client management

### WebSocket Streaming
- **Pattern**: Bidirectional real-time communication
- **Use Case**: Interactive applications, chat, collaboration
- **Features**: Room management, message broadcasting, connection pooling

### Real-time Data Streams
- **Pattern**: Continuous data flow processing
- **Use Case**: Analytics, monitoring, live feeds
- **Features**: Stream processing, backpressure handling, data transformation

### Error Handling & Resilience
- **Pattern**: Robust error management for streams
- **Use Case**: Connection failures, data corruption, service degradation
- **Features**: Circuit breakers, retry mechanisms, graceful degradation

## 🔧 Quick Start

### Server-Sent Events Example

```javascript
const UIForgeFeatureToggles = require('@uiforge/feature-toggles');

const features = new UIForgeFeatureToggles({
  appName: 'uiforge-mcp',
  projectNamespace: 'uiforge-mcp'
});

// SSE streaming middleware
function sseMiddleware(req, res) {
  if (!features.isEnabled('sse-streaming')) {
    return res.status(501).json({ error: 'SSE streaming not enabled' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connection event
  res.write('event: connected\ndata: {"status":"connected"}\n\n');

  // Handle client disconnect
  req.on('close', () => {
    console.log('SSE client disconnected');
  });
}
```

### WebSocket Streaming Example

```javascript
const WebSocket = require('ws');

function createWebSocketServer(server) {
  if (!features.isEnabled('websocket-streaming')) {
    console.log('WebSocket streaming disabled');
    return null;
  }

  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    
    // Send welcome message
    ws.send(JSON.stringify({ type: 'welcome', data: 'Connected to MCP server' }));
    
    // Handle messages
    ws.on('message', (message) => {
      handleMessage(ws, message);
    });
    
    // Handle disconnect
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return wss;
}
```

## 📁 Pattern Structure

```
patterns/mcp-servers/streaming/
├── sse/
│   ├── middleware.js
│   ├── client-manager.js
│   └── event-filter.js
├── websocket/
│   ├── server.js
│   ├── room-manager.js
│   └── message-handler.js
├── real-time/
│   ├── stream-processor.js
│   ├── data-transformer.js
│   └── backpressure-handler.js
└── error-handling/
    ├── circuit-breaker.js
    ├── retry-handler.js
    └── graceful-degradation.js
```

## 🎛️ Feature Toggle Integration

### Available Features
- `sse-streaming`: Enable Server-Sent Events
- `websocket-streaming`: Enable WebSocket communication
- `real-time-analytics`: Enable real-time data processing
- `stream-compression`: Enable stream compression
- `connection-pooling`: Enable connection pooling
- `auto-reconnection`: Enable automatic reconnection
- `error-recovery`: Enable error recovery mechanisms

### Usage Examples

```bash
# Enable SSE streaming
forge-features enable uiforge-mcp.sse-streaming

# Enable WebSocket streaming
forge-features enable uiforge-mcp.websocket-streaming

# Enable real-time analytics
forge-features enable uiforge-mcp.real-time-analytics

# Enable stream compression
forge-features enable global.stream-compression
```

## 🚀 Performance Optimization

### Connection Management
```javascript
class ConnectionManager {
  constructor() {
    this.connections = new Map();
    this.maxConnections = features.getVariant('max-connections').payload.limit || 1000;
  }

  addConnection(id, connection) {
    if (this.connections.size >= this.maxConnections) {
      throw new Error('Maximum connections exceeded');
    }
    
    this.connections.set(id, connection);
  }

  removeConnection(id) {
    this.connections.delete(id);
  }

  broadcast(message, excludeId = null) {
    this.connections.forEach((connection, id) => {
      if (id !== excludeId) {
        connection.send(message);
      }
    });
  }
}
```

### Stream Processing
```javascript
class StreamProcessor {
  constructor() {
    this.bufferSize = features.getVariant('stream-buffer').payload.size || 1000;
    this.processingInterval = features.getVariant('processing-interval').payload.ms || 100;
  }

  processStream(stream) {
    const buffer = [];
    
    stream.on('data', (chunk) => {
      buffer.push(chunk);
      
      if (buffer.length >= this.bufferSize) {
        this.flushBuffer(buffer);
        buffer.length = 0;
      }
    });
  }

  flushBuffer(buffer) {
    const processedData = buffer.map(this.transformData);
    this.sendProcessedData(processedData);
  }
}
```

## 📊 Monitoring and Analytics

### Stream Metrics
```javascript
class StreamMetrics {
  constructor() {
    this.metrics = {
      connections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      errors: 0,
      latency: []
    };
  }

  recordConnection(type) {
    this.metrics.connections++;
    this.sendMetric('stream.connections', this.metrics.connections);
  }

  recordMessage(type, latency) {
    this.metrics[`messages${type}`]++;
    this.metrics.latency.push(latency);
    this.sendMetric(`stream.messages.${type}`, this.metrics[`messages${type}`]);
  }

  recordError(error) {
    this.metrics.errors++;
    this.sendMetric('stream.errors', this.metrics.errors);
  }
}
```

### Performance Monitoring
```javascript
function performanceMonitor() {
  if (!features.isEnabled('stream-monitoring')) {
    return;
  }

  setInterval(() => {
    const metrics = collectStreamMetrics();
    
    if (metrics.latency > 1000) {
      console.warn('High stream latency detected:', metrics.latency);
    }
    
    if (metrics.errorRate > 0.05) {
      console.warn('High error rate detected:', metrics.errorRate);
    }
  }, 10000);
}
```

## 🔒 Security Considerations

### Authentication & Authorization
```javascript
function authenticateStream(req, res, next) {
  if (!features.isEnabled('stream-authentication')) {
    return next(); // Skip if auth disabled
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = decodeToken(token);
  next();
}
```

### Rate Limiting
```javascript
function rateLimitStream(req, res, next) {
  if (!features.isEnabled('stream-rate-limiting')) {
    return next();
  }

  const clientId = req.ip;
  const limit = features.getVariant('stream-rate-limit').payload.requests || 100;
  
  if (isRateLimited(clientId, limit)) {
    return res.status(429).json({ error: 'Too many stream connections' });
  }

  next();
}
```

## 🧪 Testing

### Unit Tests
```javascript
describe('SSE Streaming', () => {
  test('should establish SSE connection', async () => {
    const response = await request(app)
      .get('/stream/sse')
      .expect(200);
    
    expect(response.headers['content-type']).toBe('text/event-stream');
  });
  
  test('should send real-time updates', async () => {
    const client = new EventSource('/stream/sse');
    
    const message = await new Promise(resolve => {
      client.addEventListener('message', (event) => {
        resolve(JSON.parse(event.data));
      });
    });
    
    expect(message).toHaveProperty('type');
  });
});
```

### Integration Tests
```javascript
describe('WebSocket Streaming', () => {
  test('should handle WebSocket connections', async () => {
    const ws = new WebSocket('ws://localhost:8080');
    
    await new Promise(resolve => {
      ws.on('open', resolve);
    });
    
    expect(ws.readyState).toBe(WebSocket.OPEN);
  });
  
  test('should broadcast messages to all clients', async () => {
    const clients = [
      new WebSocket('ws://localhost:8080'),
      new WebSocket('ws://localhost:8080')
    ];
    
    // Wait for connections
    await Promise.all(clients.map(client => 
      new Promise(resolve => client.on('open', resolve))
    ));
    
    // Send message from first client
    clients[0].send(JSON.stringify({ type: 'broadcast', data: 'test' }));
    
    // Verify all clients received message
    const messages = await Promise.all(clients.map(client =>
      new Promise(resolve => {
        client.on('message', (data) => {
          resolve(JSON.parse(data));
        });
      })
    ));
    
    messages.forEach(message => {
      expect(message.data).toBe('test');
    });
  });
});
```

## 📚 Implementation Examples

### Express.js Integration
```javascript
const express = require('express');
const sseMiddleware = require('./sse/middleware');
const createWebSocketServer = require('./websocket/server');

const app = express();

// Apply streaming middleware
app.use('/stream/sse', authenticateStream, rateLimitStream, sseMiddleware);

// Create WebSocket server
const server = app.listen(8080);
const wss = createWebSocketServer(server);

// Handle real-time events
function handleRealTimeEvent(event) {
  if (features.isEnabled('sse-streaming')) {
    sseClients.broadcast(event);
  }
  
  if (features.isEnabled('websocket-streaming')) {
    wss.broadcast(event);
  }
}
```

### Next.js Integration
```javascript
// pages/api/stream.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    // SSE endpoint
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send real-time updates
    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
    }, 1000);

    req.on('close', () => {
      clearInterval(interval);
    });
  }
}
```

## 🚀 Configuration

### Environment Variables
```bash
# Streaming Configuration
SSE_ENABLED=true
WEBSOCKET_ENABLED=true
MAX_CONNECTIONS=1000
STREAM_BUFFER_SIZE=1000
PROCESSING_INTERVAL=100

# Performance
STREAM_COMPRESSION=true
CONNECTION_POOLING=true
AUTO_RECONNECTION=true
MONITORING_ENABLED=true

# Security
STREAM_AUTHENTICATION=true
STREAM_RATE_LIMITING=true
MAX_REQUESTS_PER_MINUTE=100
CORS_ENABLED=true
```

### Feature Toggle Configuration
```yaml
streaming:
  sse:
    enabled: true
    max_connections: 1000
    compression: true
    
  websocket:
    enabled: true
    room_management: true
    message_history: 100
    
  real_time:
    enabled: true
    buffer_size: 1000
    processing_interval: 100
    
  security:
    authentication: true
    rate_limiting: true
    max_requests_per_minute: 100
```

## 📈 Best Practices

### Performance Optimization
1. Use connection pooling for WebSocket clients
2. Implement backpressure handling for high-volume streams
3. Use compression for large data transfers
4. Monitor connection health and resource usage

### Error Handling
1. Implement circuit breakers for external dependencies
2. Use exponential backoff for reconnection attempts
3. Provide graceful degradation for service failures
4. Log errors for debugging and monitoring

### Security
1. Authenticate all stream connections
2. Implement rate limiting to prevent abuse
3. Use HTTPS/WSS for secure communication
4. Validate and sanitize all incoming data

## 🔄 Advanced Features

### Stream Composition
```javascript
function composeStreams(...streams) {
  return new TransformStream({
    transform(chunk, controller) {
      streams.forEach(stream => {
        const transformed = stream.transform(chunk);
        if (transformed) {
          controller.enqueue(transformed);
        }
      });
    }
  });
}
```

### Adaptive Streaming
```javascript
class AdaptiveStreamer {
  constructor() {
    this.qualityLevels = ['low', 'medium', 'high'];
    this.currentQuality = 'medium';
  }

  adaptQuality(networkConditions) {
    if (networkConditions.bandwidth < 1000) {
      this.currentQuality = 'low';
    } else if (networkConditions.bandwidth > 5000) {
      this.currentQuality = 'high';
    }
    
    return this.currentQuality;
  }
}
```

## 🤝 Contributing

When adding streaming patterns:
1. Test under various network conditions
2. Include performance benchmarks
3. Add feature toggle support
4. Implement proper error handling
5. Ensure security best practices
