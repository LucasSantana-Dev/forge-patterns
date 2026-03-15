# Security Patterns

Authentication, environment protection, and middleware security patterns for the Forge Space ecosystem. Implements BR-001 (Zero Secrets) and security-first development practices.

## Contents

```
patterns/security/
├── authentication/    # JWT auth, RBAC, token validation patterns
├── env/               # Environment file templates and .gitignore guards
│   ├── base.env.template  # Canonical .env template with {{PLACEHOLDER}} values
│   └── README.md
├── middleware/        # Express/Hono middleware: rate limiting, CORS, CSP
└── README.md          # This file
```

## Business Rules

| Rule | Requirement |
|------|-------------|
| **BR-001 Zero Secrets** | No hardcoded credentials. All secrets use `{{PLACEHOLDER}}` in templates |
| Authentication | Gateway is the **single auth authority** — MCP servers never authenticate directly |
| JWT | Access tokens expire in 1 hour, refresh tokens in 7 days |
| API Keys | Client-side AES-256 encryption for BYOK (Bring Your Own Key) |

## Authentication Pattern

```ts
// Pattern: validate JWT at gateway, propagate user context to MCP servers
import { validateJWT, extractUserContext } from '@forgespace/core/security/authentication';

const middleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await validateJWT(token, process.env.JWT_SECRET!);
  req.user = extractUserContext(user);
  next();
};
```

See `authentication/README.md` for full RBAC implementation and role definitions.

## Environment Protection

Always use `{{PLACEHOLDER}}` in `.env.example` and template files:

```env
# base.env.template — safe to commit
DATABASE_URL={{PLACEHOLDER_DATABASE_URL}}
SUPABASE_KEY={{PLACEHOLDER_SUPABASE_KEY}}
JWT_SECRET={{PLACEHOLDER_JWT_SECRET}}
```

Validation script: `scripts/security/validate-placeholders.sh` — fails CI if real secrets match known patterns.

## Middleware Stack

Recommended middleware order for Express/Hono:

```
CORS → Rate Limit → Auth → CSP → Request Validation → Handler → Error Handler
```

See `middleware/README.md` for Hono middleware composition examples.

## Security Scanning

All commits are scanned by:
- **Trufflehog** — detects real secrets with entropy analysis
- **Gitleaks** — pattern-based secret detection
- **Custom validators** — `scripts/security/` for placeholder and tenant-decoupling checks

Run locally:
```bash
bash scripts/security/scan-for-secrets.sh
bash scripts/security/validate-no-secrets.sh
bash scripts/security/validate-placeholders.sh
```

## OWASP Alignment

| OWASP Risk | Pattern |
|------------|---------|
| A01 Broken Access Control | Gateway-only auth, RBAC, JWT validation |
| A02 Cryptographic Failures | AES-256 BYOK, HTTPS-only, no secrets in code |
| A03 Injection | Input validation schemas, parameterized queries |
| A05 Security Misconfiguration | env templates, CSP headers, rate limiting |
| A07 Auth Failures | Short-lived JWTs, refresh rotation, no cookie auth |
| A09 Logging Failures | Structured logs, no PII in messages, Sentry alerts |
