# UIForge Patterns Project Overview

## Project Purpose
UIForge Patterns provides shared configuration, workflows, and architectural patterns for the UIForge ecosystem. It ensures consistency, security, and high-quality code across all UIForge projects (mcp-gateway, uiforge-webapp, uiforge-mcp).

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

## Integration Projects
- **mcp-gateway**: Python/Node.js MCP gateway
- **uiforge-webapp**: Next.js web application
- **uiforge-mcp**: Node.js MCP server

## Package Information
- **Name**: @forgespace/core
- **Version**: 1.2.0
- **License**: MIT
- **Registry**: https://registry.npmjs.org/
- **Repository**: https://github.com/Forge-Space/core.git