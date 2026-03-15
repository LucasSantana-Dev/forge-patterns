# Forge Space Core — Project Overview

## Project Purpose
Forge Space Core provides shared configuration, workflows, and architectural patterns for the Forge Space ecosystem — "The Open Full-Stack AI Workspace". It ensures consistency, security, and high-quality code across all repos (siza, mcp-gateway, siza-mcp, branding-mcp).

## Tech Stack
- **Language**: TypeScript (ES2022)
- **Package Manager**: npm (>=9.0.0)
- **Runtime**: Node.js (>=22.0.0)
- **Build Tool**: TypeScript compiler
- **Testing**: Custom validation scripts
- **Security**: Trufflehog, Gitleaks, custom validation
- **Documentation**: Markdown with automated validation

## Key Features
- 🔒 Zero Secrets policy with comprehensive security validation
- 🏗️ Architectural patterns for scalable applications
- 🔄 Automation scripts and workflows
- 📊 80% test coverage requirement
- 🛡️ Security-first development
- 🐳 High-efficiency Docker patterns
- 🎛️ Centralized feature toggle system
- 📡 MCP Context Server for IDE integration
- 📝 Comprehensive logging and observability

## Repository Structure
```
core/
├── patterns/           # Core pattern libraries (code-quality, docker, security, etc.)
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
3. **BR-003 Quality Gates**: 80% test coverage minimum
4. **BR-004 Documentation Coverage**: Complete README.md for all patterns
5. **BR-005 Performance Standards**: Measurable performance targets

## Coverage
- **100% test coverage** across all metrics (statements, branches, functions, lines)
- ESM mcp-context-server excluded from coverage (needs Vitest, not Jest)
- shared-constants module fully tested
- src/tenant/contract.ts fully tested (26 tests)
- IDP policy-engine fully tested (77 unit + property-based tests)
- IDP governance assessor fully tested (40 tests covering all 9 check paths)
- Total: 609 tests, 27 suites (post-feature-toggle expansion)
- Feature-toggles: 27 tests (was 18), ui-mcp/siza namespaces added
- Dep bumps landed (#139): eslint v10, jest v30, commander v14, removed unused eslint-plugin-import
- Open PRs: none
- sonar-project.properties added (fixes SonarCloud advisory CI failure)
- v1.11.2 released: https://github.com/Forge-Space/core/releases/tag/v1.11.2
- changelog-update skill created for structured CHANGELOG maintenance
- PR #136: docs rebrand UIForge → Forge Space across 12 documentation files (auto-merge enabled)
- MCP context server validation.ts: 23 tests (path traversal, slug validation)
- knip.json configured: 0 unused files/exports/types
- VERSION constant fixed (1.11.0) + drift-protected by test + release script  
- Security: 0 vulnerabilities

## Integration Projects (Forge Space Ecosystem)
- **siza** v0.10.0: Next.js 16 AI workspace (Cloudflare Workers), 85%+ coverage
- **siza-gen** v0.5.0 RELEASED: AI generation engine (npm: @forgespace/siza-gen), 424 TS + 41 Python tests, Python ML sidecar (FastAPI), PR #4 merged, tag pushed, npm published
- **siza-mcp** v0.9.0: Thin MCP adapter (21 tools), 394 tests
- **mcp-gateway** v1.7.4: Python/Node.js MCP tool routing hub, 91.46% coverage, 1567 tests
- **branding-mcp** v0.2.0: 7 MCP tools for brand identity generation, 97.63% coverage

## Recent Changes (2026-03-15)
- v1.11.2 released + additional PRs on main (136+137)
- Current state: 600 tests, 27 suites, 100% coverage, 23/23 READMEs
- MCP_UI_SERVER_NAME='forge-ui' added, MCP_UIFORGE_SERVER_NAME deprecated
- Docs fully rebranded: UIForge → Forge Space across 12 doc files
- v1.11.0: forge-audit ai-governance category
- IDP security spoke v1 contracts
- Limit-aware CI actions bootstrap for new projects
- Tenant-agnostic refactoring (core decoupled from specific tenant)
- Import side-effect prevention
- Quality hardening: 517 tests, ESLint warnings reduced from 92 to 7
- 23 pattern categories: ai, ai-tools, cloud-native, code-quality, config, coverage, docker, feature-toggles, git, ide-extensions, idp, java, localstack, mcp-gateway, mcp-servers, monitoring, plugin-system, python, security, shared-constants, shared-infrastructure, shell, testing
- Pattern READMEs: **23/23 all documented** ✅
- knip.json configured: 0 unused files/exports/types
- VERSION constant fixed and drift-protected by test + release script
- Security: 0 vulnerabilities (flatted CVE fixed)
- Skills: forge-audit skill created (AI governance assessment, all check paths documented)
- Skills: forge-space-resume skill created (ecosystem-specific session bootstrap)
- PR #133: open (post-132 followup — knip, VERSION, MCP tests, security, docs)
- **Repository**: https://github.com/Forge-Space/core.git