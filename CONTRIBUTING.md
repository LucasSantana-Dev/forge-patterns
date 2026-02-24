# Contributing to Forge Space Patterns

Thank you for contributing to the Forge Space Patterns library. This guide covers everything you need to know to submit high-quality patterns.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Pattern Requirements](#pattern-requirements)
- [Submitting a Pattern](#submitting-a-pattern)
- [Review Process](#review-process)
- [Business Rules](#business-rules)

---

## Code of Conduct

All contributors are expected to be respectful, constructive, and professional. Harassment or exclusionary behavior will not be tolerated.

---

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/Forge-Space/core.git
cd forge-patterns
npm install
```

### 2. Create a feature branch

```bash
git checkout -b feat/my-new-pattern
```

### 3. Validate your environment

```bash
npm run patterns:validate
./scripts/security/validate-no-secrets.sh
```

---

## Pattern Requirements

Every pattern submission must satisfy all five business rules before it can be merged.

### BR-001 — Zero Secrets

**No hardcoded credentials, tokens, passwords, or API keys — ever.**

Use `{{PLACEHOLDER}}` syntax for any value that would be secret in production:

```yaml
# ✅ Correct
database_url: "{{DATABASE_URL}}"
api_key: "{{API_KEY}}"

# ❌ Wrong
database_url: "postgres://user:password@localhost/db"
api_key: "sk-abc123xyz"
```

Run the secret scanner before committing:

```bash
./scripts/security/scan-for-secrets.sh
./scripts/security/validate-placeholders.sh
```

### BR-002 — Pattern Versioning

All patterns must declare a semantic version. Add a `version` field to your pattern's metadata comment or `package.json`:

```javascript
/**
 * @pattern my-pattern
 * @version 1.0.0
 * @category cloud-native
 */
```

Update `CHANGELOG.md` with every change under `[Unreleased]`.

### BR-003 — Quality Gates

- Minimum **80% test coverage** for any executable code
- All existing tests must continue to pass: `npm run test:all`
- New patterns with executable code must include a test file

```bash
# Run all tests
npm run test:all

# Run plugin system tests
npm run test:plugins
```

### BR-004 — Documentation Coverage

Every pattern directory **must** contain a `README.md` with:

- **Overview** — what the pattern does and when to use it
- **Directory structure** — annotated file tree
- **Usage examples** — working code snippets
- **Security considerations** — how BR-001 is satisfied
- **Performance targets** — measurable benchmarks
- **Related patterns** — links to complementary patterns

Use this template:

```markdown
# Pattern Name

One-line description of what this pattern does.

## 📁 Directory Structure

\`\`\`text
pattern-name/
├── file.js    # Description
└── README.md
\`\`\`

## 🎯 Overview

...

## 🚀 Usage

\`\`\`javascript
// Working example
\`\`\`

## 🔒 Security Considerations

...

## 📊 Performance Targets

| Metric | Target |
| --- | --- |
| ... | ... |

## 🔗 Related Patterns

- [`patterns/other/`](../other/)
```

### BR-005 — Performance Standards

Patterns must meet the project performance targets:

| Metric | Target |
| --- | --- |
| Pattern validation | < 10 seconds |
| Docker wake time | < 200ms (p95) |
| Resource efficiency | ≥ 50% reduction vs baseline |
| Test suite runtime | < 60 seconds |

---

## Submitting a Pattern

### Directory structure

Place your pattern under the appropriate category in `patterns/`:

```text
patterns/
├── ai/                 # AI/ML patterns
├── cloud-native/       # Serverless, microservices, event-driven
├── code-quality/       # Linting, formatting, testing configs
├── docker/             # Containerization patterns
├── feature-toggles/    # Feature flag management
├── plugin-system/      # Extensibility patterns
├── security/           # Auth, secrets, middleware
└── shared-infrastructure/  # Logging, monitoring, utilities
```

For a new category, open an issue first to discuss placement.

### Checklist before opening a PR

```
- [ ] Pattern placed in correct category directory
- [ ] README.md present with all required sections (BR-004)
- [ ] No hardcoded secrets — all sensitive values use {{PLACEHOLDER}} (BR-001)
- [ ] Secret scanner passes: ./scripts/security/scan-for-secrets.sh
- [ ] Version declared in pattern metadata (BR-002)
- [ ] CHANGELOG.md updated under [Unreleased]
- [ ] Tests added for any executable code with ≥80% coverage (BR-003)
- [ ] npm run test:all passes
- [ ] npm run patterns:validate passes
- [ ] Commit messages follow Angular conventional commits format
```

### Commit message format

```
feat(patterns): add circuit breaker pattern for microservices

- Implement CircuitBreaker class with CLOSED/OPEN/HALF_OPEN states
- Add configurable failure threshold and timeout
- Include usage examples and performance targets

Closes #42
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `chore`

### Opening the pull request

1. Push your branch: `git push origin feat/my-new-pattern`
2. Open a PR against `main`
3. Fill in the PR template
4. Request a review from a maintainer

---

## Review Process

1. **Automated CI** runs lint, type-check, build, tests, and security scans
2. **Maintainer review** checks pattern quality, documentation, and business rule compliance
3. **Approval** requires CI passing + at least 1 maintainer approval
4. **Merge** is done by a maintainer using squash merge

Typical review turnaround: 2–5 business days.

---

## Questions?

Open a [GitHub Discussion](https://github.com/Forge-Space/core/discussions) or file an [issue](https://github.com/Forge-Space/core/issues).
