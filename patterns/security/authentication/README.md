# Authentication Patterns for UIForge Projects

## 🎯 Overview

This directory contains authentication patterns designed for secure, zero-secrets development across the UIForge ecosystem. All patterns support centralized feature toggle integration and follow security best practices.

## 📋 Available Patterns

### JWT Authentication
- **Pattern**: JSON Web Token-based authentication
- **Use Case**: API authentication, session management
- **Features**: Token validation, refresh tokens, secure storage

### OAuth 2.0 Integration
- **Pattern**: OAuth 2.0 provider integration
- **Use Case**: Third-party authentication, SSO
- **Features**: Provider abstraction, token management

### API Key Authentication
- **Pattern**: API key-based authentication
- **Use Case**: Service-to-service communication
- **Features**: Key rotation, rate limiting integration

### Session Management
- **Pattern**: Secure session handling
- **Use Case**: Web application authentication
- **Features**: Secure cookies, session expiration

## 🔧 Quick Start

### JWT Authentication Example

```javascript
const UIForgeFeatureToggles = require('@uiforge/feature-toggles');

// Initialize feature toggles
const features = new UIForgeFeatureToggles({
  appName: 'mcp-gateway',
  projectNamespace: 'mcp-gateway'
});

// Check if JWT authentication is enabled
if (features.isEnabled('jwt-auth')) {
  const jwt = require('jsonwebtoken');
  
  // Verify JWT token
  function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
```

### OAuth Integration Example

```javascript
// Check if OAuth is enabled
if (features.isEnabled('oauth-auth')) {
  const passport = require('passport');
  const OAuth2Strategy = require('passport-oauth2');
  
  // Configure OAuth strategy
  passport.use(new OAuth2Strategy({
    authorizationURL: process.env.OAUTH_AUTH_URL,
    tokenURL: process.env.OAUTH_TOKEN_URL,
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    // Handle OAuth callback
    return done(null, profile);
  }));
}
```

## 📁 Pattern Structure

```
patterns/security/authentication/
├── jwt/
│   ├── middleware.js
│   ├── token-generator.js
│   └── token-validator.js
├── oauth/
│   ├── providers/
│   ├── strategies.js
│   └── callbacks.js
├── api-keys/
│   ├── middleware.js
│   ├── key-manager.js
│   └── validator.js
└── sessions/
    ├── middleware.js
    ├── store.js
    └── config.js
```

## 🎛️ Feature Toggle Integration

### Available Features
- `jwt-auth`: Enable JWT authentication
- `oauth-auth`: Enable OAuth 2.0 authentication
- `api-key-auth`: Enable API key authentication
- `session-auth`: Enable session-based authentication
- `multi-factor-auth`: Enable MFA support
- `auth-logging`: Enable authentication logging

### Usage Examples

```bash
# Enable JWT authentication
forge-features enable mcp-gateway.jwt-auth

# Enable OAuth authentication
forge-features enable uiforge-webapp.oauth-auth

# Enable API key authentication
forge-features enable mcp-gateway.api-key-auth

# Enable multi-factor authentication
forge-features enable uiforge-webapp.multi-factor-auth
```

## 🔒 Security Considerations

### Zero-Secrets Approach
- All secrets managed through environment variables
- No hardcoded credentials in code
- Secure secret rotation practices

### Best Practices
- Use HTTPS for all authentication endpoints
- Implement proper token expiration
- Secure storage of tokens and keys
- Rate limiting for authentication attempts

### Compliance
- GDPR compliant authentication
- SOC2 compatible patterns
- Data protection by design

## 🧪 Testing

### Unit Tests
```javascript
describe('JWT Authentication', () => {
  test('should validate valid JWT token', () => {
    const token = generateValidToken();
    expect(verifyToken(token)).toBeTruthy();
  });
  
  test('should reject invalid JWT token', () => {
    const token = 'invalid.token';
    expect(() => verifyToken(token)).toThrow();
  });
});
```

### Integration Tests
```javascript
describe('Authentication Flow', () => {
  test('should authenticate user with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
      .expect(200);
    
    expect(response.body.token).toBeDefined();
  });
});
```

## 📚 Additional Resources

- [Security Standards](../../../docs/standards/SECURITY.md)
- [Feature Toggle Documentation](../feature-toggles/README.md)
- [Compliance Guidelines](compliance/README.md)
- [Testing Patterns](testing/README.md)

## 🚀 Migration Guide

### From Basic Auth to JWT
1. Enable JWT authentication feature flag
2. Implement JWT middleware
3. Update authentication endpoints
4. Migrate existing sessions
5. Disable basic authentication

### From Session to Token-based Auth
1. Enable token-based authentication
2. Implement token generation
3. Update client-side authentication
4. Migrate existing sessions
5. Remove session dependencies

## 🤝 Contributing

When adding new authentication patterns:
1. Follow the zero-secrets principle
2. Include comprehensive tests
3. Add feature toggle support
4. Update documentation
5. Ensure compliance with security standards
