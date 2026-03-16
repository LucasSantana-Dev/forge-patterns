# Forge Space Core — Project Overview

## Project Purpose
Forge Space Core provides shared configuration, workflows, and architectural patterns for the Forge Space ecosystem — "The Open Full-Stack AI Workspace". It ensures consistency, security, and high-quality code across all repos (siza, mcp-gateway, ui-mcp, branding-mcp).

## Tech Stack
- **Language**: TypeScript (ES2022)
- **Package Manager**: npm (>=9.0.0)
- **Runtime**: Node.js (>=22.0.0)
- **Build Tool**: TypeScript compiler (tsc, not tsup)
- **Testing**: Jest 30 + custom validation scripts
- **Security**: Trufflehog, Gitleaks, custom validation
- **Documentation**: Markdown with automated validation

## Key Features
- 🔒 Zero Secrets policy with comprehensive security validation
- 🏗️ Architectural patterns for scalable applications
- 🔄 Automation scripts and workflows
- 📊 100% test coverage (all metrics)
- 🛡️ Security-first development
- 🐳 High-efficiency Docker patterns
- 🎛️ Centralized feature toggle system (ForgeSpaceFeatureToggles, backwards-compat UIForgeFeatureToggles alias)
- 📡 MCP Context Server for IDE integration
- 📝 Comprehensive logging and observability

## Repository Structure
```
core/
├── patterns/           # Core pattern libraries (23 categories)
├── scripts/           # Automation and integration scripts
├── src/              # TypeScript source files
├── test/             # Custom validation tests
├── docs/             # Comprehensive documentation
├── .github/          # CI/CD workflows and templates
└── dist/             # Compiled output
```

## Business Rules (BR-001 to BR-005)
1. **BR-001 Zero Secrets**: No hardcoded credentials, use {{PLACEHOLDER}} format
2. **BR-002 Pattern Versioning**: Semantic versioning for all patterns
3. **BR-003 Quality Gates**: 100% test coverage
4. **BR-004 Documentation Coverage**: Complete README.md for all patterns (23/23 ✅)
5. **BR-005 Performance Standards**: Measurable performance targets

## Coverage & Quality (v1.13.0)
- **100% test coverage** across all metrics (statements, branches, functions, lines)
- **609 tests, 27 suites**
- ESM mcp-context-server excluded from coverage (needs Vitest, not Jest)
- shared-constants module fully tested
- src/tenant/contract.ts fully tested (26 tests)
- IDP policy-engine fully tested (77 unit + property-based tests)
- IDP governance assessor fully tested (40 tests covering all 9 check paths)
- Feature-toggles: 27 tests, ui-mcp/siza namespaces added
- knip.json: 0 issues (cleaned 8 stale ignore entries)
- ESLint: warnings only (no errors), magic-number warnings in coverage module
- Security: 0 vulnerabilities
- Pattern READMEs: **23/23 all documented** ✅

## Integration Projects (Forge Space Ecosystem)
- **siza** v0.10.0: Next.js 16 AI workspace (Cloudflare Workers), 85%+ coverage
- **siza-gen** v0.10.0: AI generation engine (@forgespace/siza-gen), 503 TS + 41 Python tests
- **ui-mcp** v0.22.0: Thin MCP adapter (21 tools), 394 tests
- **mcp-gateway** v1.7.4: Python/Node.js MCP tool routing hub, 91.46% coverage, 1567 tests
- **branding-mcp** v0.2.0: 7 MCP tools for brand identity generation, 97.63% coverage

## Recent Changes (2026-03-16 — v1.13.0)
- **v1.13.0**: scorecard A-F grades + features --dry-run (PR #153, closes #90/#91)
- fix(scorer): regex for index-key detection (PR #154)
- forge-init --template flag (PR #155)
- logger real unit tests 44 tests, NaN errorRate bug fix (PR #158)
- chore: remove unused @jest/globals dep + unexport InitResult (PR #159)
- MCP context store updated to Siza v0.48.0 and mcp-gateway v1.28.2
- UIForge → Forge Space rebrand complete across 14 pattern READMEs (PR #162)
- Test project names updated: UIForge → ui-mcp and siza (PR #163)
- Dep bumps: forge-ai-action 1.3.0, upload-artifact v7
- Open PRs: 0
- NLnet application: project.json complete, applicant.local.json needs personal data (April 1 deadline)

## 23 Pattern Categories
ai, ai-tools, cloud-native, code-quality, config, coverage, docker, feature-toggles, git, ide-extensions, idp, java, localstack, mcp-gateway, mcp-servers, monitoring, plugin-system, python, security, shared-constants, shared-infrastructure, shell, testing

## Package Information
- **Name**: @forgespace/core
- **Version**: 1.13.0
- **License**: MIT
- **Repository**: https://github.com/Forge-Space/core.git
