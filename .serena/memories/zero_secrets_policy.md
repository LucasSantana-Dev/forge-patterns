# Zero Secrets Policy (BR-001)

## Purpose
Enforces that no secrets, credentials, or sensitive values exist anywhere in the codebase.

## Key Files
- `scripts/security/scan-for-secrets.sh` — pre-commit secret scanning
- `scripts/security/validate-no-secrets.sh` — validation script
- `scripts/security/validate-placeholders.sh` — placeholder format validation
- `.gitleaks.yml` — Gitleaks configuration

## Rules
**Core rule**: No secrets anywhere in this public repository — no exceptions.

What counts as a secret: API keys, access tokens, passwords, private keys, DB connection strings with credentials, OAuth client secrets, webhook signing secrets, internal hostnames/IPs.

Required practices:
- Use `{{PLACEHOLDER}}` syntax for environment-dependent values
- Document required env vars in `.env.example` with placeholders only
- Never commit `.env`, `.env.local`, `.env.production`
- Use `process.env.VAR_NAME` at runtime — never inline values

## Security Tools
- **Gitleaks**: `.gitleaks.yml` — blocks commits with detected secrets
- **Trufflehog**: deep scan for historical leaks
- **Custom scripts**: `scripts/security/` — project-specific validation

## CI Enforcement
- Secret scanning runs on every PR and push to `main`
- Security vulnerabilities: remediate within 24 hours (NFR-002.3)
- All code must pass automated security scanning before merge

## Incident Response
1. Immediately revoke/rotate the exposed credential
2. `git filter-branch` or BFG Repo Cleaner to purge from history
3. Force-push to all branches
4. Notify maintainer (@LucasSantana-Dev)
5. Document the incident and remediation
