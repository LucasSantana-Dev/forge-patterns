# Policy Engine Integration Guide

Enforce governance policies on code generation and project operations.

## Installation

```bash
npm install @forgespace/core
```

## CLI Usage

```bash
# Evaluate policies (report only)
npx forge-policy --policy-dir ./policies

# Fail CI on blocking violations
npx forge-policy --policy-dir ./policies --fail-on-block

# Evaluate with custom context
npx forge-policy --policy-dir ./policies --context-file context.json --fail-on-block
```

### Options

| Flag              | Default      | Description                               |
| ----------------- | ------------ | ----------------------------------------- |
| `--policy-dir`    | `./policies` | Directory containing `.policy.json` files |
| `--context-file`  | —            | JSON file with evaluation context         |
| `--fail-on-block` | `false`      | Exit 1 if any blocking violations         |

## Built-in Policies

Three policy packs ship with `@forgespace/core`:

| Policy     | File                     | What it enforces                        |
| ---------- | ------------------------ | --------------------------------------- |
| Security   | `security.policy.json`   | Secret exposure, prompt injection, auth |
| Quality    | `quality.policy.json`    | Code standards, testing, documentation  |
| Compliance | `compliance.policy.json` | Audit logging, data retention, RLS      |

## Writing Custom Policies

Create a `.policy.json` file:

```json
{
  "id": "my-policy",
  "name": "My Custom Policy",
  "version": "1.0.0",
  "rules": [
    {
      "id": "my-001",
      "name": "Require authentication",
      "conditions": [
        { "field": "auth.authenticated", "operator": "eq", "value": false }
      ],
      "actions": [{ "type": "block", "message": "Authentication required" }],
      "enabled": true
    }
  ]
}
```

### Condition Operators

`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `contains`, `matches`

### Action Types

| Type     | Behavior                                        |
| -------- | ----------------------------------------------- |
| `block`  | Fails the check (exit 1 with `--fail-on-block`) |
| `warn`   | Prints warning, does not fail                   |
| `log`    | Records for audit trail                         |
| `notify` | Prints warning (notification channel TBD)       |

## CI Workflow

Add to `.github/workflows/policy-check.yml`:

```yaml
name: Policy Check

on:
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  policy-check:
    name: Policy Evaluation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Run policy check
        run: |
          npx forge-policy \
            --policy-dir node_modules/@forgespace/core/patterns/idp/policies \
            --fail-on-block
```

## Context File

Provide runtime context for policy evaluation:

```json
{
  "auth": { "authenticated": true, "role": "admin" },
  "security": { "injection_risk": 0.2, "failed_attempts": 0 },
  "content": "function hello() { return 'world'; }"
}
```

Fields are resolved using dot-notation paths (e.g., `auth.authenticated`).
