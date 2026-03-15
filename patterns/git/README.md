# Git Patterns

Shared Git hooks and commit conventions for the Forge Space ecosystem. Enforces conventional commits, pre-commit quality gates, and backup file detection.

## Contents

```
patterns/git/
├── commit-msg/
│   └── conventional.sh    # Validates Angular conventional commit format
├── pre-commit/
│   ├── base.sh            # Core pre-commit: lint, format, test:validation
│   └── conventional.sh    # Conventional commit enforcement
└── README.md
```

## Commit Convention

```
<type>(<scope>): <short description>

Types: feat, fix, refactor, chore, docs, style, ci, test
```

Examples:
```
feat(idp): add AI governance scoring to forge-audit
fix(ci): remove reserved secret mapping from limit-aware templates
chore(deps): bump trufflesecurity/trufflehog from 3.93.7 to 3.93.8
docs: add IDP README and pattern documentation
test(idp): add governance assessor coverage tests
```

## Pre-commit Hook

The `base.sh` hook runs:
1. `npm run lint` — ESLint auto-fix
2. `npm run format` — Prettier auto-format
3. `npm run test:validation` — Plugin, feature toggle, shared constants tests
4. Backup file check — fails if `*.bak`, `*.orig`, or `*~` files staged

## Setup

```bash
# Install via Husky (already configured in package.json)
npm run prepare   # runs: npm run build && husky

# Manual install
cp patterns/git/pre-commit/base.sh .husky/pre-commit
chmod +x .husky/pre-commit
```

## Husky Configuration

```json
// package.json
{
  "scripts": {
    "prepare": "npm run build && husky"
  }
}
```

## Branch Naming

```
feat/<feature-name>
fix/<issue-description>
chore/<task>
refactor/<module>
ci/<workflow-name>
docs/<topic>
release/<version>
```

**Never use** `codex/` or `ai/` prefixes for branches.
