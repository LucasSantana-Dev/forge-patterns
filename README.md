<div align="center">
  <a href="https://forgespace.co">
    <img src="https://brand.forgespace.co/logos/wordmark.svg" alt="Forge Space" height="48">
  </a>
  <h1>Forge-Space Core</h1>
  <p>Shared standards, patterns, and MCP context server for the Forge Space ecosystem.</p>
</div>

Part of [Forge Space](https://github.com/Forge-Space) — the open full-stack AI workspace. This repo provides the foundation that all other Forge Space projects build on: code quality standards, security framework, CI/CD workflows, and a local MCP context server for IDE integration.


## Overview

Forge-Space Core provides shared configurations, workflows, and architectural patterns for consistency across the ecosystem. Centralized feature toggles, reusable GitHub Actions workflows (95% reduction in maintenance overhead), and comprehensive security validation.

### Key Features

- 🔒 **Zero Secrets**: Public repository with comprehensive security validation
- 🏗️ **Architectural Patterns**: Proven patterns for scalable applications
- 🔄 **Automation**: Scripts and workflows for consistent project setup
- 📊 **Quality Standards**: 80% test coverage, linting, and security scanning
- 🛡️ **Security First**: Built-in security scanning and validation
- 🐳 **Docker Patterns**: Containerization and deployment patterns
- 🎛️ **Centralized Feature Toggles**: Cross-project feature management with CLI control
- 📡 **MCP Context Server**: Local stdio MCP server exposing all Forge Space project context documents as resources
- 📝 **Logger Module**: Comprehensive logging with observability and distributed tracing
- 🚀 **High Performance**: Sub-100ms integration times and optimized patterns
- 🔄 **GitHub Workflows Optimization**: Organization-level reusable workflows eliminating duplication
- 🔐 **SHA-Pinned Automation**: Workflow/action references use full commit SHAs for supply-chain safety

## Tenant Isolation Standard

Forge-Space Core now defines an explicit tenant contract and enforces decoupling checks
to keep platform code tenant-agnostic.

- Contract export: `TenantProfile` and validators from `src/tenant/contract.ts`
- Required profile keys:
  - `tenant_id`
  - `github_owner`
  - `sonar_org`
  - `npm_scope`
  - `quality_policy`
  - `ci_policy`
- CI guardrail: `npm run check:tenant-decoupling`
  - Blocks tenant-specific hardcodes in platform paths (`src`, `patterns`, `scripts`, `.github`)
  - Uses `rg` when available and automatically falls back to `grep` on constrained runners
  - Allowed references should live in dedicated tenant profile repositories or explicit examples
  - Works in CI/local environments with `rg` or `grep` fallback

## Test Autogen — Phase 0 (Warn)

Phase 0 is active in warn-only mode to guide contributors without blocking delivery:

- Local hooks (`.husky/pre-commit`, `.husky/pre-push`) run `forge-ai-init test-autogen` only
  when `FORGE_TENANT_ID` and `FORGE_TENANT_PROFILE_REF` are set, and always exit `0` in phase 0.
- Pull requests run CI job `test-autogen-warn` using `forge-ai-action` with:
  - `command: test-autogen-check`
  - `tenant: acme-sandbox`
  - `tenant_profile_ref: .forge-tenant-profiles/tenants/acme-sandbox/profile.yaml`
  - `test_autogen_phase: warn`
  - PR feedback enabled (`comment: true`, `annotations: true`)
  - Cross-repo profile checkout token: `FORGE_TENANT_PROFILES_READ_TOKEN` (fallback: `GITHUB_TOKEN`)
  - External tenant profile checkout is best-effort; if unavailable, parity is skipped
    and the warn-only flow remains non-blocking

This phase highlights missing tests early while preserving non-blocking developer flow.

## Lint Toolchain Compatibility

Keep `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, and
`typescript-eslint` on the same minor version to avoid `npm ci` peer-dependency
resolution failures in CI.

## 📋 Projects Using These Patterns

- **[siza](https://github.com/Forge-Space/siza)**: Next.js web application with multi-environment deployment
- **[siza-mcp](https://github.com/Forge-Space/ui-mcp)**: MCP server for AI-powered UI generation
- **[mcp-gateway](https://github.com/Forge-Space/mcp-gateway)**: Python/Node.js MCP gateway with comprehensive CI/CD
- **[branding-mcp](https://github.com/Forge-Space/branding-mcp)**: AI-powered brand identity generation
- **[siza-gen](https://github.com/Forge-Space/siza-gen)**: AI generation engine with component registry

## 🌐 Ecosystem Integration

This core repository provides the foundation for the entire Forge Space ecosystem:

- **🔗 Shared Standards**: Consistent coding patterns across all projects
- **🛡️ Security Framework**: Unified security validation and scanning
- **🔄 Automation**: Centralized workflows and CI/CD pipelines
- **📊 Quality Gates**: Standardized testing and quality requirements

**Related Projects:**
- [**Siza**](https://github.com/Forge-Space/siza) - AI-powered full-stack workspace
- [**MCP Gateway**](https://github.com/Forge-Space/mcp-gateway) - Central tool aggregation and routing
- [**Siza MCP**](https://github.com/Forge-Space/ui-mcp) - MCP server for UI generation

**Documentation:**
- [**Documentation Hub**](docs/README.md) - Complete documentation
- [**Project Context**](docs/project/PROJECT_CONTEXT.MD) - Project guide and context

## IDP — Internal Developer Platform

CLI tools for project governance, shipped as part of `@forgespace/core`:

| Tool | Command | Purpose |
|------|---------|---------|
| **Scorecard** | `npx forge-scorecard` | Evaluate project quality across security, quality, performance, compliance |
| **Policy Engine** | `npx forge-policy` | Enforce governance policies with block/warn/log actions |
| **Init** | `npx forge-init` | Bootstrap governance for any project |
| **Feature Toggles** | `npx forge-features` | Manage file-based feature toggles |
| **Audit** | `npx forge-audit` | Assess legacy codebase migration readiness |

### Runtime Import Safety

Importing `@forgespace/core` is side-effect free. Governance scaffolding runs only when
`forge-init` is executed as a CLI command (`npx forge-init` or `forge-init` binary), not when the
package is imported in application runtime code.

`forge-audit` evaluates 6 categories: dependencies, architecture, security,
quality, migration-readiness, and ai-governance.

### Quick Start

```bash
npx forge-init --template nextjs   # Next.js project with SSR + bundle policies
npx forge-init --template react    # React with accessibility + component coverage
npx forge-init --template node     # Node.js with dependency audit + API validation
npx forge-init                     # Base governance (no framework-specific rules)

npx forge-audit --dir /path/to/legacy-app       # Migration assessment
npx forge-audit --json --threshold 60            # CI gate mode
```

### Guides

- [Scorecard Integration](docs/guides/scorecard-integration.md) — add quality scorecards to any repo
- [Policy Engine Integration](docs/guides/policy-engine-integration.md) — add policy checks to any repo
- [Security Spoke Contract v1](docs/guides/security-spoke-contract.md) — shared scanner output contract

### Security Spoke Contract v1

Security scanner outputs across Forge Space use the canonical v1 contract in
`patterns/idp/security-spoke`.

- Report schema:
  `patterns/idp/security-spoke/schema/security-spoke-report-v1.schema.json`
- Rule catalog:
  `patterns/idp/security-spoke/rules/security-spoke-rules-v1.json`
- Compatibility fixtures:
  `patterns/idp/security-spoke/fixtures/*.json`

## � GitHub Workflows Optimization

### Canonical Workflow Source

Reusable workflows are now centralized in **`Forge-Space/.github`**. This
repository (`core`) provides bootstrap orchestration and templates for new
projects.

### Limit-Aware CI (New Orgs + New Projects)

New projects generated by `scripts/bootstrap/project.sh` default to the
`limit-aware` CI profile:

- baseline checks always run: lint, typecheck, unit tests, build, secret scan
- heavy jobs degrade when Actions usage crosses configured thresholds:
  - Docker build
  - E2E
  - Semgrep
  - Trivy
  - CodeQL on PR
- nightly security workflow still runs heavy scans regardless of degrade mode

Bootstrap example:

```bash
./scripts/bootstrap/project.sh my-service node \
  --org Forge-Space \
  --actions-cap-minutes 20000
```

Initialize Actions budget variables for an org:

```bash
./scripts/bootstrap/actions-org-setup.sh \
  --org Forge-Space \
  --actions-cap-minutes 20000
```

### Related Guides

1. [Organization Setup](docs/guides/organization-setup.md)
2. [Actions Limits Strategy](docs/guides/actions-limits-strategy.md)

## � Documentation

For complete documentation, see our **[Documentation Hub](docs/README.md)** which includes:

- **[Project Context](docs/project/PROJECT_CONTEXT.MD)** - Complete project guide and context
- **[Implementation Reports](docs/reports/)** - Integration and analysis reports
- **[Pattern Documentation](docs/patterns/)** - All pattern documentation
- **[Architecture Decisions](docs/architecture-decisions/)** - System design decisions
- **[User Guides](docs/guides/)** - Deployment and user journey guides
- **[MCP Context Server](docs/guides/MCP_CONTEXT_SERVER.md)** - Setup and IDE integration for the Forge Space context MCP server
- **[VSCode Extension](patterns/ide-extensions/vscode/README.md)** - Pattern discovery, scaffolding, and compliance validation in VSCode
- **[Development Standards](docs/standards/)** - Coding and security standards

## 🚀 Quick Start

### 1. Install Forge Patterns

```bash
npm install @forgespace/core
```

### 2. Integrate into Your Project

```bash
# Navigate to your project directory
cd /path/to/your-project
# Use the automated integration CLI
npx forge-patterns integrate

# Or use individual integration commands
npx forge-patterns integrate --project=mcp-gateway
npx forge-patterns integrate --project=siza-mcp
npx forge-patterns integrate --project=siza
```

## 📁 Repository Structure

```bash

forge-patterns/
├── .github/
│   ├── workflows/          # CI/CD workflow templates
│   └── templates/          # GitHub templates (PR, issues)
├── patterns/
│   ├── code-quality/       # ESLint, Prettier configurations
│   ├── config/            # Centralized configuration management
│   ├── docker/            # Docker and containerization patterns
│   ├── feature-toggles/   # 🎛️ Centralized feature toggle system
│   ├── git/               # Git hooks and workflows
│   ├── mcp-gateway/       # MCP Gateway patterns (security, performance)
│   ├── mcp-servers/       # MCP Server patterns (AI providers, streaming)
│   ├── security/          # Security patterns (authentication, middleware)
│   └── shared-infrastructure/ # Shared infrastructure patterns (optimization)
├── docs/                   # 📚 Comprehensive documentation
│   ├── architecture/       # Architecture decisions and summaries
│   ├── architecture-decisions/ # ADRs for system design
│   ├── guides/            # User guides and deployment playbooks
│   ├── standards/         # Development and security standards
│   └── reports/           # Implementation and analysis reports
├── test/                   # 🧪 Comprehensive test suites
│   ├── feature-toggle-validation.js # Feature toggle system tests
│   ├── cross-project-integration.js # Cross-project integration tests
│   └── performance-benchmark.js # Performance benchmarking
├── scripts/
│   ├── forge-features      # 🎛️ CLI tool for feature management
│   ├── integrate.js        # Automated integration script
│   ├── apply-readme-branding.sh     # Forge Space README header (CDN wordmark)
│   ├── apply-readme-branding-all.sh # Run branding for all Forge Space projects
│   ├── security/          # Security validation scripts
│   └── bootstrap/         # Project bootstrap scripts
├── src/                   # TypeScript source files
├── test/                  # 🧪 Comprehensive test suites
├── package.json           # Package configuration
└── README.md             # This file
```

## 🔧 Available Patterns

### 🎛️ Centralized Feature Toggle System

**NEW**: Cross-project feature management with unified control

```bash
# Enable global features
forge-features enable global.debug-mode
forge-features enable global.beta-features

# Enable project-specific features
forge-features enable mcp-gateway.rate-limiting
forge-features enable forge-space-ui.rate-limiting
forge-features enable forge-space-mcp.ai-chat
forge-features enable forge-space-ui.dark-mode

# Check feature status
forge-features status --global
forge-features status --project=mcp-gateway
```

**Features**:

- Global and project-specific feature namespaces
- CLI tool for feature management
- Real-time feature updates
- Cross-project consistency

### Code Quality Patterns

#### ESLint Configuration

```javascript
// Base ESLint config for TypeScript projects
module.exports = {
  root: true,
  extends: ['eslint:recommended', '@typescript-eslint/recommended', 'prettier'],
  // ... comprehensive rules
};
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Docker Patterns

#### **NEW**: High-Efficiency Docker Standards
```yaml
# Three-state service model with sleep/wake architecture
services:
  [service-name]:
    resources:
      memory: "512M"
      cpu: "0.5"
      memory_reservation: "256M"
    sleep_policy:
      enabled: true
      idle_timeout: 300
      priority: "normal"
    auto_start: false
```

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:22-alpine AS builder
# ... build process

# Production stage
FROM node:22-alpine AS runtime
# ... optimized production image
```

#### Docker Compose Development
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: npm run dev
```

### Test Coverage Patterns

#### Jest Configuration (TypeScript)
```javascript
module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Codecov Configuration
```yaml
codecov:
  coverage:
    status:
      project:
        default:
          target: 80%
          threshold: 1%
```

### Git Workflow Patterns

#### Pre-commit Hook
```bash
#!/bin/bash
# Comprehensive pre-commit validation
echo "🚀 Running Forge Space pre-commit validations..."
# Security validation, linting, testing, etc.
```

#### Conventional Commits
```bash
# Enforces conventional commit format
# feat, fix, docs, style, refactor, test, chore, etc.
```

### Security Patterns

#### Environment Template
```bash
# SECURITY NOTICE: PUBLIC REPOSITORY TEMPLATE
JWT_SECRET_KEY=REPLACE_WITH_STRONG_SECRET
DATABASE_URL=REPLACE_WITH_DATABASE_URL
API_KEY=REPLACE_WITH_API_KEY
```

#### Security Validation
```bash
# Automated secret detection and validation
./scripts/security/validate-no-secrets.sh
./scripts/security/validate-placeholders.sh
```

## 🐳 Docker Development

### Quick Start with Docker

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop environment
docker-compose down
```

### Production Deployment

```bash
# Build production image
docker build -t my-app .

# Run production container
docker run -p 3000:3000 my-app

# Or use production compose
docker-compose -f docker-compose.prod.yml up -d
```

### Available Docker Patterns

- **🆕 High-Efficiency Standards**: Serverless-like efficiency with sleep/wake architecture
- **Multi-stage builds**: Optimized production images
- **Development environments**: Hot reload and debugging
- **Production deployments**: Scaling and monitoring
- **Security best practices**: Non-root users, minimal images
- **Resource Optimization**: 50-80% memory reduction, 80-95% CPU reduction
- **Fast Wake Times**: ~100-200ms vs 2-5 second cold starts
- **Costless Scalability**: Serverless efficiency with container benefits

### 📋 **Rules Library** (35+ Rules)

#### **Core Development Rules**
- **agent-rules.md**: Code partner philosophy and minimal changes
- **documentation-first.md**: Documentation-driven development
- **error-handling.md**: Consistent error handling patterns

#### **Code Quality & Standards**
- **code-quality-analysis.md**: Comprehensive code quality standards
- **testing-quality.md**: Testing standards and quality assurance
- **ts-js-rules.md**: TypeScript/JavaScript coding standards

#### **Security & Dependencies**
- **security-secrets.md**: Security and secrets management
- **dependencies-security.md**: Dependency vulnerability management
- **snyk_rules.md**: Snyk security scanning rules

#### **CI/CD & Automation**
- **ci-cd.md**: CI/CD pipeline standards
- **enforcement-automation.md**: Automated enforcement of standards

#### **Project Management**
- **commit-pr-release.md**: Commit, PR, and release standards
- **version-management.md**: Comprehensive version management
- **plan-context.md**: Project context and state management

#### **Frontend & UI**
- **react-patterns.md**: React development patterns
- **nextjs-app-router.md**: Next.js App Router patterns
- **accessibility-openness.md**: Accessibility guidelines

#### **Backend & Architecture**
- **pattern.md**: Architectural patterns and SOLID principles
- **dependency-injection.md**: Dependency injection patterns
- **db-migrations.md**: Database migration standards

### 🔄 **Workflows Library** (16+ Workflows)

#### **Development Workflows**
- **quality-checks.md**: Comprehensive quality validation (// turbo)
- **run-tests.md**: Testing workflow execution
- **verify.md**: Implementation verification

#### **Tool & Framework Workflows**
- **add-framework-template.md**: Framework template addition
- **implement-tool.md**: Tool implementation procedures
- **deploy-checklist.md**: Deployment preparation

#### **MCP & Documentation Workflows**
- **mcp-docs-and-tools.md**: MCP documentation usage
- **skill-mcp-docs-search.md**: Documentation search skills

#### **Infrastructure Workflows**
- **start-and-register-gateway.md**: Gateway setup
- **connect-ide-to-mcp-gateway.md**: IDE integration
- **change-gateways-prompts-resources.md**: Gateway configuration

#### **Specialized Skill Workflows**
- **skill-backend-express.md**: Express.js development
- **skill-frontend-react-vite.md**: React + Vite development
- **skill-e2e-playwright.md**: E2E testing

#### **Planning Workflows**
- **use-plan-context.md**: Plan context loading
- **update-plan.md**: Plan maintenance

#### **Safety Workflows**
- **safety-shell-commands.md**: Safe command execution

### 🎯 **Skills Library** (5+ Skills)

#### **Development & Engineering Skills**
- **code-generation-templates.md**: Code generation and templating
- **design-output.md**: System design and specification
- **docker-deployment.md**: Docker deployment expertise

#### **Documentation & Research Skills**
- **mcp-docs-search.md**: Documentation research and lookup
- **mcp-tool-development.md**: MCP tool development

### 📋 **Plans Library** (5+ Plans)

#### **Comprehensive Project Plans**
- **high-efficiency-docker-standards-c1f908.md**: Complete Docker standards
- **docker-standards-implementation-summary-c1f908.md**: Implementation overview
- **serverless-mcp-sleep-architecture-c1f908.md**: Sleep/wake architecture
- **scalable-docker-compose-architecture-c1f908.md**: Dynamic scaling
- **docker-optimization-lightweight-mcp-c1f908.md**: Docker optimization

## 🛡️ Security

### Zero Secrets Policy

This repository is designed to be **completely public** with zero secrets:

- ✅ No actual secrets in any files
- ✅ All sensitive values use `REPLACE_WITH_[TYPE]` format
- ✅ Automated secret scanning and validation
- ✅ Comprehensive security workflows

### Security Validation

```bash
# Run comprehensive security scan
./scripts/security/scan-for-secrets.sh

# Validate no secrets
./scripts/security/validate-no-secrets.sh

# Validate placeholder formats
./scripts/security/validate-placeholders.sh
```

`validate-no-secrets.sh` excludes `.forge`, `.serena`, and `.agents` so policy and
assistant metadata do not produce false positives.

### Security Features

- **Trufflehog**: Secret detection with verified secrets only
- **Gitleaks**: Custom secret detection rules
- **Custom Validation**: Placeholder format validation
- **Continuous Monitoring**: Daily security scans

## 📊 Quality Standards

### Test Coverage Requirements

- **Minimum Coverage**: 80% across all metrics
- **Coverage Types**: Branches, Functions, Lines, Statements
- **Quality Gates**: Fail builds below 80%
- **Reporting**: XML, HTML, Terminal formats

### Code Quality Requirements

- **Linting**: ESLint/Prettier for consistency
- **Type Checking**: TypeScript strict mode
- **Security Auditing**: npm audit for vulnerabilities
- **Pre-commit**: Automated quality validation

## 🔄 Automation

### Bootstrap Scripts

```bash
# Create new project with full patterns
./scripts/bootstrap/project.sh my-project node

# Bootstrap specific project types
./scripts/bootstrap/gateway.sh      # mcp-gateway style
./scripts/bootstrap/webapp.sh       # uiforge-webapp style
./scripts/bootstrap/mcp.sh          # uiforge-mcp style
```

### Synchronization Scripts

```bash
# Sync patterns to all projects
./scripts/sync/patterns.sh

# Sync configurations
./scripts/sync/configs.sh

# Sync templates
./scripts/sync/templates.sh
```

### Repository branding

Apply the Forge Space README header (CDN wordmark) to any repo. See [brand-guide/docs/REPOSITORY_BRANDING.md](https://github.com/Forge-Space/brand-guide/blob/main/docs/REPOSITORY_BRANDING.md). Logo assets: SVG, PNG, WEBP at `https://brand.forgespace.co/logos/` (e.g. `wordmark.svg`, `wordmark.png`, `wordmark.webp`).

```bash
# Single repo
./scripts/apply-readme-branding.sh path/to/repo [TITLE] [DESCRIPTION]

# All Forge Space projects (from monorepo root)
./scripts/apply-readme-branding-all.sh --dry-run   # preview
./scripts/apply-readme-branding-all.sh             # apply
```

### Validation Scripts

```bash
# Validate pattern consistency
./scripts/validate/patterns.sh

# Validate security configs
./scripts/validate/security.sh

# Validate code quality
./scripts/validate/quality.sh
```

## 🚀 CI/CD Integration

### GitHub Actions Workflows

```yaml
# Security scanning (automated)
- name: Security Scan
  uses: trufflesecurity/trufflehog@v3.93.3
- name: Gitleaks Secret Scan
  uses: gitleaks/gitleaks-action@v2

# Quality checks
- name: Lint and Format
- name: Type Check
- name: Test with Coverage
- name: Security Audit
```

### Quality Gates

- ✅ All linting checks pass
- ✅ All tests pass (100% success)
- ✅ Code coverage ≥ 80%
- ✅ Security scans pass
- ✅ Build verification succeeds

## 📚 Documentation

### Getting Started

- [Setup Guide](docs/getting-started.md) - Complete setup instructions
- [Customization Guide](docs/customization-guide.md) - How to adapt patterns
- [Maintenance Guide](docs/maintenance-guide.md) - Ongoing maintenance
- [Docker Guide](docs/docker-guide.md) - Containerization patterns

### Architecture

- [Architecture Overview](docs/ARCHITECTURE.md) - System architecture
- [Security Guidelines](docs/SECURITY.md) - Security best practices
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment patterns

### Reference

- [Pattern Catalog](docs/pattern-catalog.md) - All available patterns
- [Configuration Reference](docs/configuration-reference.md) - All options
- [Troubleshooting](docs/troubleshooting.md) - Common issues

## 🤝 Contributing

We welcome contributions to Forge Space Patterns! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.
For repository-specific agent workflow and operational gotchas, see [AGENTS.md](AGENTS.md).

### Contribution Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all validation scripts
5. Submit a pull request

### Requirements for Contributions

- ✅ Follow security guidelines (no secrets)
- ✅ Pass all automated tests
- ✅ Maintain 80% test coverage
- ✅ Follow conventional commit format
- ✅ Update documentation as needed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/Forge-Space/core
- **Issues**: https://github.com/Forge-Space/core/issues
- **Discussions**: https://github.com/Forge-Space/core/discussions

## 📞 Support

For questions, issues, or suggestions:

- 📧 Create an issue on GitHub
- 💬 Start a discussion
- 📖 Check the documentation
- 🔍 Search existing issues

---

**Forge Space Patterns** - Consistency, Security, Quality, Automation, Docker 🚀
