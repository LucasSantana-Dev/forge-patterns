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
- **100% test coverage** (PR #53, 2026-02-24)
- ESM mcp-context-server excluded from coverage (needs Vitest, not Jest)
- shared-constants module fully tested

## Integration Projects (Forge Space Ecosystem)
- **siza** v0.10.0: Next.js 16 AI workspace (Cloudflare Workers), 85%+ coverage
- **siza-gen** v0.5.0 RELEASED: AI generation engine (npm: @forgespace/siza-gen), 424 TS + 41 Python tests, Python ML sidecar (FastAPI), PR #4 merged, tag pushed, npm published
- **siza-mcp** v0.9.0: Thin MCP adapter (21 tools), 394 tests
- **mcp-gateway** v1.7.4: Python/Node.js MCP tool routing hub, 91.46% coverage, 1567 tests
- **branding-mcp** v0.2.0: 7 MCP tools for brand identity generation, 97.63% coverage

## Recent Changes (2026-02-27)
- Added LICENSE (MIT) and CLAUDE.md to this repo
- GitHub issue #56: Standardize Actions versions across ecosystem

## Package Information
- **Name**: @forgespace/core
- **Version**: 1.3.1
- **License**: MIT
- **Registry**: https://registry.npmjs.org/
- **Repository**: https://github.com/Forge-Space/core.git