---
trigger: model_decision
description:
  Security and secrets handling rules. Apply when handling credentials, input
  validation, or configuring security-related tooling.
globs: []
---

# Security Standards - Forge Space Ecosystem

> **Unified security practices and secrets management for all Forge Space
> projects**
>
> **Source of Truth**: This file is the canonical security standard
>
> **Last Updated**: 2026-02-20 **Version**: 1.0.0

---

## 🎯 Overview

This document defines the security standards and secrets management practices
that apply across the Forge Space ecosystem. These standards ensure consistent
security posture, proper secrets handling, and vulnerability prevention across
all projects.

## 🔐 Secrets Management

### Core Principles

- **Never hardcode secrets** in code or configuration files
- **Use environment variables** for all sensitive data
- **Document required variables** in `.env.example` files
- **Never expose secrets** in logs, error messages, or API responses
- **Implement secrets scanning** in CI/CD pipelines

### Environment Variables

#### Required Documentation

```bash
# .env.example (never commit actual values)
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SUPABASE_ANON_KEY=your-anon-key-here

# AI Providers
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Authentication
JWT_SECRET_KEY=your-jwt-secret-32-chars-min
AUTH_ENCRYPTION_SECRET=your-encryption-secret-32-chars-min

# External Services
FIGMA_ACCESS_TOKEN=your-figma-token
GITHUB_TOKEN=your-github-token
```

#### Loading Patterns

```typescript
// JavaScript/TypeScript
const config = {
  databaseUrl: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  jwtSecret: process.env.JWT_SECRET_KEY
};
```

```python
# Python
import os
from dotenv import load_dotenv

load_dotenv()

config = {
    "database_url": os.getenv("DATABASE_URL"),
    "openai_api_key": os.getenv("OPENAI_API_KEY"),
    "jwt_secret_key": os.getenv("JWT_SECRET_KEY"),
}
```

### Secrets Scanning

- **CI Integration**: Block PRs that contain secrets
- **Pre-commit Hooks**: Local secrets detection
- **Automated Scanning**: Regular repository scans

## 🔍 Input Validation

### Validation Framework

- **JavaScript/TypeScript**: Use Zod schemas
- **Python**: Use Pydantic models
- **Universal**: Validate before processing

### Input Validation Rules

#### URL Validation

```typescript
// Prevent SSRF attacks
const urlSchema = z
  .string()
  .url()
  .refine(url => {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  }, 'URL must use HTTP or HTTPS');

// No private IPs
const urlSchema = urlSchema.refine(url => {
  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Block private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./
  ];

  return !privateRanges.some(range => range.test(hostname));
}, 'URL cannot use private IP addresses');
```

#### File Path Validation

```typescript
// Prevent path traversal
const pathSchema = z.string().refine(path => {
  // Normalize path
  const normalized = path.normalize(path);

  // Prevent directory traversal
  return !normalized.includes('..') && !normalized.startsWith('/');
}, 'Invalid file path');
```

#### API Key Validation

```typescript
// Validate API key format
const apiKeySchema = z
  .string()
  .min(20)
  .max(200)
  .regex(/^[a-zA-Z0-9_-]+$/)
  .refine(
    key => !key.includes('password') && !key.includes('secret'),
    'Invalid API key format'
  );
```

### MCP Protocol Validation

```typescript
// MCP tool input validation
const toolInputSchema = z.object({
  name: z.string().min(1).max(100),
  arguments: z.record(z.unknown()),
  metadata: z
    .object({
      requestId: z.string().optional(),
      userId: z.string().optional()
    })
    .optional()
});
```

## 🛡️ Output Safety

### Generated Content Safety

- **Code Templates**: Never include secrets in generated code
- **HTML Output**: Sanitize user-provided text
- **Error Messages**: Don't expose internal details

### Sanitization Patterns

```typescript
// HTML sanitization
import DOMPurify from 'dompurify';

const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: ['class', 'id']
  });
};

// Code template sanitization
const sanitizeTemplate = (template: string): string => {
  // Remove potential secrets
  return template
    .replace(/API_KEY[_\s]*=[_s]*['"][^'"]*['"]/gi, 'API_KEY=***')
    .replace(/password[_\s]*=[_s]*['"][^'"]*['"]/gi, 'password=***');
};
```

### Error Handling

```typescript
// Safe error responses
const safeErrorResponse = (error: Error) => {
  return {
    error: 'An error occurred',
    message: 'Please try again later',
    // Don't include stack trace in production
    ...(process.env.NODE_ENV === 'development' && {
      details: error.message
    })
  };
};
```

## 🐳 Docker Security

### Container Security

- **Multi-stage builds**: Minimize attack surface
- **Non-root user**: Run containers as non-root
- **Minimal base images**: Use minimal base images
- **Security scanning**: Regular image vulnerability scans

### Dockerfile Best Practices

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine AS production
RUN addgroup -g appuser && adduser -S -G appuser user
USER appuser
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Security
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/health || exit 1
```

### Docker Compose Security

```yaml
services:
  app:
    build: .
    user: '1000:1000' # Non-root user
    read_only: true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    security_opt:
      - no-new-privileges:true
```

## 🌐 API & Network Security

### HTTPS and TLS

- **HTTPS only**: Use HTTPS in production
- **Secure cookies**: Use secure cookie attributes
- **TLS certificates**: Use valid certificates
- **HSTS headers**: Implement HTTP Strict Transport Security

### Rate Limiting

```typescript
// Express.js rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### CORS Configuration

```typescript
// Strict CORS policy
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

### Request Timeouts

```typescript
// HTTP request timeouts
const httpsAgent = new https.Agent({
  timeout: 10000 // 10 seconds
});

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      agent: httpsAgent
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};
```

## 🔍 Security Scanning

### Dependency Security

```bash
# JavaScript/TypeScript
npm audit --audit-level=high

# Python
pip-audit
safety check

# Docker
docker scan my-app:latest
trivy image my-app:latest
```

### Secrets Scanning

```bash
# Git hooks
npx git-secrets-scan

# CI/CD
- name: Run TruffleHog
  uses: trufflesecurity/trufflehog@main
  with:
    paths: .
```

### Code Analysis

```bash
# JavaScript/TypeScript
npm run security-scan

# Python
bandit -r .
safety check

# Infrastructure
checkov --file .checkov.yaml
```

## 🚨 Incident Response

### Security Incident Process

1. **Detection**: Automated monitoring or manual report
2. **Assessment**: Evaluate impact and scope
3. **Containment**: Isolate affected systems
4. **Remediation**: Fix vulnerabilities
5. **Recovery**: Restore normal operations
6. **Post-mortem**: Document lessons learned

### Emergency Contacts

- **Security team**: security@forgespace.com
- **Infrastructure team**: infra@forgespace.com
- **Legal team**: legal@forgespace.com

## 📋 Project-Specific Security

### MCP Gateway Security

- **JWT tokens**: Secure token generation and validation
- **MCP protocol**: Validate MCP requests and responses
- **AI providers**: Secure AI API key management
- **Tool access**: Implement tool permission controls

### UIForge WebApp Security

- **Supabase RLS**: Row Level Security policies
- **Authentication**: Secure user session management
- **File uploads**: Validate and scan uploaded files
- **XSS protection**: Content Security Policy headers

### UIForge MCP Security

- **MCP server**: Secure MCP server implementation
- **Tool execution**: Validate tool parameters and outputs
- **AI integration**: Secure AI provider communication
- **Code generation**: Validate generated code for security

### Forge Patterns Security

- **Template security**: Validate templates for security issues
- **Workflow security**: Secure CI/CD workflows
- **Dependency security**: Validate shared dependencies
- **Documentation security**: No secrets in documentation

## 🎯 Security Metrics

### Compliance Targets

- **Zero critical vulnerabilities**: No critical security issues
- **Zero high vulnerabilities**: No high security issues
- **Regular scans**: Weekly security scans
- **Patch coverage**: 100% of known vulnerabilities patched

### Monitoring

- **Security alerts**: Real-time security monitoring
- **Vulnerability tracking**: Track and prioritize vulnerabilities
- **Compliance reporting**: Regular security reports
- **Training completion**: Security training for all developers

## 🔗 Related Documentation

### Shared Rules

- **[Agent Rules](../agent-rules.md)** - Core security principles
- **[Quality Standards](../quality-standards/README.md)** - Quality requirements
- **[Development Workflows](../development-workflows/README.md)** - Process
  standards

### Security Tools

- **[Snyk Documentation](https://snyk.io/docs/)** - Vulnerability scanning
- **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** - Security risks
- **[CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)** - Security
  controls

### External Resources

- **[NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/)** -
  Security framework
- **[ISO 27001](https://www.iso.org/isoiec-27001-information-security.html)** -
  Security management

---

_These security standards are maintained as part of the forge-patterns
repository and serve as the canonical security requirements for all Forge Space
projects._
