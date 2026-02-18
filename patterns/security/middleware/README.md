# Security Middleware Patterns for UIForge Projects

## 🎯 Overview

This directory contains security middleware patterns designed to provide comprehensive protection for UIForge applications. All middleware integrates with the centralized feature toggle system and follows zero-secrets principles.

## 📋 Available Patterns

### CORS Middleware
- **Pattern**: Cross-Origin Resource Sharing protection
- **Use Case**: API security, browser compatibility
- **Features**: Configurable origins, preflight handling

### Rate Limiting Middleware
- **Pattern**: Request rate limiting and throttling
- **Use Case**: API protection, DDoS prevention
- **Features**: Dynamic limits, IP-based limiting

### Input Validation Middleware
- **Pattern**: Request validation and sanitization
- **Use Case**: Data integrity, injection prevention
- **Features**: Schema validation, XSS protection

### Security Headers Middleware
- **Pattern**: HTTP security headers
- **Use Case**: Browser security, vulnerability protection
- **Features**: CSP, HSTS, security headers

### Authentication Middleware
- **Pattern**: Request authentication
- **Use Case**: Protected routes, API security
- **Features**: JWT validation, token refresh

## 🔧 Quick Start

### Rate Limiting Example

```javascript
const UIForgeFeatureToggles = require('@uiforge/feature-toggles');

// Initialize feature toggles
const features = new UIForgeFeatureToggles({
  appName: 'mcp-gateway',
  projectNamespace: 'mcp-gateway'
});

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
  if (!features.isEnabled('rate-limiting')) {
    return next(); // Skip if feature disabled
  }

  const clientIp = req.ip;
  const limit = features.getVariant('rate-limiting');
  
  // Implement rate limiting logic
  if (isRateLimited(clientIp, limit.payload.maxRequests)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  next();
}
```

### Security Headers Example

```javascript
function securityHeadersMiddleware(req, res, next) {
  if (!features.isEnabled('security-headers')) {
    return next();
  }

  const headers = {
    'Content-Security-Policy': features.isEnabled('csp') 
      ? "default-src 'self'" 
      : undefined,
    'Strict-Transport-Security': features.isEnabled('hsts')
      ? 'max-age=31536000; includeSubDomains'
      : undefined,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  Object.entries(headers).forEach(([key, value]) => {
    if (value) res.setHeader(key, value);
  });

  next();
}
```

## 📁 Pattern Structure

```
patterns/security/middleware/
├── cors/
│   ├── middleware.js
│   ├── config.js
│   └── presets.js
├── rate-limiting/
│   ├── middleware.js
│   ├── store.js
│   └── config.js
├── input-validation/
│   ├── middleware.js
│   ├── schemas/
│   └── sanitizers.js
├── security-headers/
│   ├── middleware.js
│   ├── headers.js
│   └── csp.js
└── authentication/
    ├── middleware.js
    ├── jwt-validator.js
    └── token-refresh.js
```

## 🎛️ Feature Toggle Integration

### Available Features
- `cors-protection`: Enable CORS middleware
- `rate-limiting`: Enable rate limiting protection
- `input-validation`: Enable input validation
- `security-headers`: Enable security headers
- `auth-middleware`: Enable authentication middleware
- `request-logging`: Enable request logging
- `ip-whitelist`: Enable IP whitelist filtering
- `api-key-validation`: Enable API key validation

### Usage Examples

```bash
# Enable rate limiting
forge-features enable mcp-gateway.rate-limiting

# Enable security headers
forge-features enable mcp-gateway.security-headers

# Enable CORS protection
forge-features enable uiforge-webapp.cors-protection

# Enable input validation
forge-features enable mcp-gateway.input-validation
```

## 🔒 Security Considerations

### Defense in Depth
- Multiple layers of security protection
- Fail-safe defaults
- Comprehensive logging and monitoring

### Performance Considerations
- Efficient middleware ordering
- Caching for validation results
- Minimal performance overhead

### Zero-Secrets Approach
- No hardcoded security configurations
- Environment-based configuration
- Secure default settings

## 🧪 Testing

### Unit Tests
```javascript
describe('Rate Limiting Middleware', () => {
  test('should allow requests within limit', async () => {
    const req = { ip: '192.168.1.1' };
    const res = {};
    const next = jest.fn();
    
    await rateLimitMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  
  test('should block requests exceeding limit', async () => {
    const req = { ip: '192.168.1.1' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    
    // Exceed rate limit
    for (let i = 0; i < 100; i++) {
      await rateLimitMiddleware(req, res, next);
    }
    
    expect(res.status).toHaveBeenCalledWith(429);
  });
});
```

### Integration Tests
```javascript
describe('Security Middleware Integration', () => {
  test('should apply all security middleware', async () => {
    const app = express();
    
    app.use(corsMiddleware);
    app.use(rateLimitMiddleware);
    app.use(securityHeadersMiddleware);
    
    const response = await request(app)
      .get('/api/test')
      .expect(200);
    
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
```

## 📚 Implementation Examples

### Express.js Integration
```javascript
const express = require('express');
const cors = require('./middleware/cors');
const rateLimit = require('./middleware/rate-limiting');
const securityHeaders = require('./middleware/security-headers');

const app = express();

// Apply security middleware
app.use(cors.middleware);
app.use(rateLimit.middleware);
app.use(securityHeaders.middleware);

// Protected routes
app.use('/api', authMiddleware);
```

### Next.js Integration
```javascript
const next = require('next');
const express = require('express');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // Apply security middleware
  server.use(corsMiddleware);
  server.use(rateLimitMiddleware);
  server.use(securityHeadersMiddleware);
  
  server.all('*', (req, res) => handle(req, res));
});
```

## 🚀 Configuration

### Environment Variables
```bash
# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://uiforge.com
CORS_METHODS=GET,POST,PUT,DELETE
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# Security Headers
SECURITY_HEADERS_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
```

### Feature Toggle Configuration
```yaml
security_middleware:
  cors:
    enabled: true
    origins: ["http://localhost:3000"]
    credentials: true
  
  rate_limiting:
    enabled: true
    window_ms: 900000
    max_requests: 100
    
  security_headers:
    enabled: true
    csp: "default-src 'self'"
    hsts: "max-age=31536000"
```

## 📊 Monitoring and Analytics

### Metrics Collection
```javascript
function securityMetricsMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Record security metrics
    metrics.record('security.request_duration', duration);
    metrics.record('security.request_count', 1);
    
    if (res.statusCode === 429) {
      metrics.record('security.rate_limit_hits', 1);
    }
  });
  
  next();
}
```

### Alerting
```javascript
function securityAlertingMiddleware(req, res, next) {
  // Check for suspicious patterns
  if (isSuspiciousRequest(req)) {
    alerts.send('security.suspicious_request', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
  }
  
  next();
}
```

## 🤝 Contributing

When adding new security middleware:
1. Follow zero-secrets principles
2. Include comprehensive tests
3. Add feature toggle support
4. Document security implications
5. Ensure performance optimization
