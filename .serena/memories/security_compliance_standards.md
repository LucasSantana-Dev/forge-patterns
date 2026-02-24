# Security and Compliance Standards

## Purpose
Serena's reference for ecosystem-wide security requirements, authentication patterns, RBAC, vulnerability scanning, and audit logging.

## Key Files
- `docs/standards/SECURITY.md` — Security standards and best practices
- `docs/shared-rules/quality-standards/security.md` — Quality standards for security
- `patterns/mcp-gateway/security/README.md` — Gateway security patterns
- `patterns/mcp-gateway/authentication/README.md` — Authentication patterns

## Security Principles

**Core Principles**
1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimum necessary permissions for users and services
3. **Zero Trust**: Never trust, always verify
4. **Secure by Default**: Security features enabled by default
5. **Privacy by Design**: Privacy built into system design
6. **Transparency**: Security practices documented and visible

**Security Goals**
- **Confidentiality**: Protect sensitive data from unauthorized access
- **Integrity**: Ensure data and system integrity
- **Availability**: Maintain 99.9% uptime
- **Accountability**: Audit all system activities
- **Privacy**: Protect user privacy and personal data

## Authentication Standards

**JWT Token Structure**
```typescript
interface JWTPayload {
  sub: string;          // User ID
  email: string;        // User email
  role: string;         // User role (admin, developer, user, guest)
  permissions: string[]; // User permissions array
  iat: number;          // Issued at (Unix timestamp)
  exp: number;          // Expires at (Unix timestamp)
  jti: string;          // Token ID (for revocation)
}
```

**JWT Token Generation**
- **Algorithm**: HS256 (HMAC-SHA256)
- **Access Token Expiry**: 24 hours (86400 seconds)
- **Refresh Token Expiry**: 7 days (604800 seconds)
- **Secret Key**: Cryptographically random, min 256 bits
- **Issuer**: Service name (e.g., 'forge-mcp-gateway')

**Password Security**
- **Hashing**: bcrypt with 12 salt rounds
- **Min Length**: 12 characters
- **Requirements**: Uppercase, lowercase, numbers, special chars
- **Forbidden Patterns**: 'password', '123456', 'qwerty'
- **Validation**: Check against HIBP (Have I Been Pwned) API

## Authorization Standards

**Role-Based Access Control (RBAC)**
```typescript
enum Role {
  ADMIN = 'admin',       // Full system access
  DEVELOPER = 'developer', // API and component access
  USER = 'user',         // Basic user access
  GUEST = 'guest'        // Read-only access
}

enum Permission {
  // Component permissions
  COMPONENT_READ = 'component:read',
  COMPONENT_CREATE = 'component:create',
  COMPONENT_UPDATE = 'component:update',
  COMPONENT_DELETE = 'component:delete',
  
  // Template permissions
  TEMPLATE_READ = 'template:read',
  TEMPLATE_CREATE = 'template:create',
  TEMPLATE_UPDATE = 'template:update',
  TEMPLATE_DELETE = 'template:delete',
  
  // Server permissions
  SERVER_READ = 'server:read',
  SERVER_MANAGE = 'server:manage',
  SERVER_ADMIN = 'server:admin',
  
  // System permissions
  SYSTEM_READ = 'system:read',
  SYSTEM_MANAGE = 'system:manage',
  SYSTEM_ADMIN = 'system:admin'
}
```

**Permission Checks**
```typescript
// Check single permission
if (!req.user.permissions.includes('component:create')) {
  return res.status(403).json({ error: 'Forbidden' });
}

// Check multiple permissions (AND)
const requiredPermissions = ['component:read', 'template:read'];
const hasAll = requiredPermissions.every(p => req.user.permissions.includes(p));

// Check any permission (OR)
const anyPermission = ['component:read', 'template:read'];
const hasAny = anyPermission.some(p => req.user.permissions.includes(p));
```

## API Security

**Rate Limiting**
- **Default**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **Admin**: 5000 requests per minute
- **Algorithm**: Token bucket with burst capacity
- **Response**: 429 Too Many Requests with Retry-After header

**Input Validation**
- **SQL Injection**: Detect patterns like `SELECT`, `INSERT`, `OR 1=1`, `UNION`
- **XSS**: Detect `<script>`, `javascript:`, `on<event>=`
- **Path Traversal**: Block `../`, `..\\`, `/etc/`, `C:\\`
- **Command Injection**: Block `;`, `|`, `&`, `$()`, backticks
- **Sanitization**: HTML entity encoding for all user inputs

**Security Headers**
```typescript
// Required headers on ALL responses
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Permissions-Policy': 'default-src \'self\''
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'

// Content Security Policy
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ')
```

**CORS Configuration**
```typescript
'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
'Access-Control-Allow-Credentials': 'true'
'Access-Control-Max-Age': '86400'
```

## Data Protection

**Encryption at Rest**
- **Database**: AES-256 encryption for sensitive columns
- **Files**: AES-256-GCM for stored files
- **Backups**: Encrypted backups with separate encryption keys
- **Key Management**: AWS KMS, HashiCorp Vault, or similar

**Encryption in Transit**
- **TLS**: TLS 1.2+ for all network communication
- **Certificates**: Valid TLS certificates from trusted CA
- **HSTS**: Enforce HTTPS with Strict-Transport-Security header
- **Certificate Pinning**: Consider for mobile clients

**Data Retention**
- **User Data**: Retained as long as account active + 30 days after deletion
- **Logs**: 90 days retention, then archived or deleted
- **Audit Logs**: 7 years retention for compliance
- **Backups**: 30 days retention, encrypted

**PII Handling**
- **Redaction**: Redact PII from logs (email, phone, SSN, credit card)
- **Encryption**: Encrypt PII at rest and in transit
- **Access Control**: Limit PII access to authorized users only
- **Deletion**: Implement right to be forgotten (GDPR)

## Vulnerability Scanning

**Pre-Merge Scanning**
- **Tool**: npm audit, Snyk, or similar
- **Threshold**: Block merge if high/critical vulnerabilities found
- **Frequency**: On every commit to PR
- **Exemptions**: Document exemptions with justification

**Dependency Scanning**
- **Direct Dependencies**: Scan all package.json dependencies
- **Transitive Dependencies**: Scan all sub-dependencies
- **License Compliance**: Check for GPL/AGPL licenses
- **Auto-Updates**: Dependabot for patch updates

**SAST (Static Analysis)**
- **Tool**: SonarQube, CodeQL, or similar
- **Rules**: OWASP Top 10, CWE Top 25
- **Threshold**: Block merge if critical issues found
- **False Positives**: Mark and document false positives

## Audit Logging

**Security Events to Log**
- **Authentication**: Login, logout, failed login attempts
- **Authorization**: Permission checks, access denials
- **Data Access**: Read/write/delete of sensitive data
- **Configuration Changes**: Security config updates
- **API Calls**: All API requests with user context

**Audit Log Format**
```typescript
interface AuditLog {
  timestamp: string;        // ISO 8601 timestamp
  eventType: string;        // e.g., 'user.login', 'component.create'
  userId: string;           // User who performed action
  ip: string;               // Client IP address
  userAgent: string;        // Client user agent
  resource: string;         // Resource affected (e.g., 'component:123')
  action: string;           // Action performed (e.g., 'create', 'delete')
  result: 'success' | 'failure'; // Outcome
  metadata: object;         // Additional context
  correlationId: string;    // Request correlation ID
}
```

**Audit Log Retention**
- **Storage**: Centralized log aggregation (e.g., ELK, Splunk)
- **Retention**: 7 years for compliance
- **Access**: Restricted to admins and auditors only
- **Integrity**: Cryptographically signed logs (optional)

## Critical Constraints
1. **Zero Secrets**: NO plaintext secrets in code, use environment variables
2. **JWT Expiry**: Access tokens = 24 hours, refresh tokens = 7 days (NO exceptions)
3. **Password Hashing**: bcrypt with 12 salt rounds (NO plain passwords)
4. **HTTPS Only**: ALL network communication must use TLS 1.2+
5. **Rate Limiting**: ALWAYS enforce rate limits on public endpoints
6. **Input Validation**: ALWAYS validate and sanitize ALL user inputs
7. **Security Headers**: ALWAYS include ALL security headers on responses
8. **Audit Logging**: ALWAYS log security events (auth, authz, data access)
9. **Vulnerability Scanning**: Block merge if high/critical vulnerabilities found
10. **RBAC**: ALWAYS check permissions before performing actions
