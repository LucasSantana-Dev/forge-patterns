# Development Workflows - Forge Space Ecosystem

> **Standardized development processes and workflows for all Forge Space
> projects**
>
> **Source of Truth**: This directory contains canonical workflow standards
>
> **Last Updated**: 2026-02-20 **Version**: 1.0.0

---

## 🎯 Overview

This directory contains standardized development workflows and processes that
apply across the Forge Space ecosystem. These workflows ensure consistent
development practices, quality assurance, and efficient collaboration across all
projects.

## 📁 Workflow Categories

```
development-workflows/
├── README.md                    # This file - overview and navigation
├── git-workflows.md           # Git workflows, commits, releases
├── code-review.md              # Code review process and guidelines
├── cross-project.md           # Multi-project coordination
├── emergency.md               # Emergency procedures
└── onboarding.md              # Developer onboarding
```

## 🚀 Quick Reference

### Most Important Workflows

- **[Git Workflows](git-workflows.md)** - Branching, commits, releases
- **[Code Review](code-review.md)** - Review process and guidelines
- **[Cross-Project](cross-project.md)** - Multi-project coordination

### Quality Gates Summary

- ✅ **Code Review**: All changes require review
- ✅ **Automated Testing**: All tests must pass
- ✅ **Security Scanning**: No high/critical vulnerabilities
- ✅ **Documentation**: Updated for all changes

## 🔗 Workflow Navigation

### By Development Phase

- **Feature Development**: [Git Workflows](git-workflows.md#feature-development)
- **Bug Fixing**: [Git Workflows](git-workflows.md#bug-fix-workflow)
- **Documentation**: [Git Workflows](git-workflows.md#documentation-updates)

### By Project Type

- **MCP Gateway**: [Project-Specific](../project-specific/mcp-gateway.md)
- **UIForge WebApp**: [Project-Specific](../project-specific/uiforge-webapp.md)
- **UIForge MCP**: [Project-Specific](../project-specific/uiforge-mcp.md)
- **Forge Patterns**: [Project-Specific](../project-specific/forge-patterns.md)

### By Quality Area

- **Code Quality**: [Quality Standards](../quality-standards/README.md)
- **Security**: [Security Standards](../quality-standards/security.md)
- **Testing**: [Testing Standards](../quality-standards/testing.md)

## 📋 Workflow Standards

### Universal Principles

1. **Consistency**: Same processes across all projects
2. **Quality First**: Quality gates at every step
3. **Documentation**: Document decisions and processes
4. **Security**: Security considerations at every step
5. **Collaboration**: Clear communication and coordination

### Process Requirements

- **Git Workflow**: Feature → Review → Merge → Deploy
- **Code Review**: Required for all non-trivial changes
- **Testing**: Automated testing at multiple levels
- **Security**: Regular security scanning and audits
- **Documentation**: Updated for all functional changes

### Tool Requirements

- **Version Control**: Git with proper branching
- **CI/CD**: Automated build and test pipelines
- **Code Quality**: Automated linting and formatting
- **Security**: Automated vulnerability scanning
- **Documentation**: Documentation generation tools

## 🔄 Workflow Integration

### Shared Rules Integration

All workflows reference the shared rules and standards:

- **[Agent Rules](../agent-rules.md)** - Core conduct principles
- **[Quality Standards](../quality-standards/README.md)** - Quality requirements
- **[Testing Standards](../quality-standards/testing.md)** - Testing strategies

### Project-Specific Adaptations

Each project may have specific adaptations documented in:

- **[Project-Specific Rules](../project-specific/)** - Project-unique
  requirements
- **Local READMEs** - Project-specific documentation
- **Configuration Files** - Project-specific tooling

## 🎯 Success Metrics

### Workflow Efficiency

- **PR Merge Time**: <24 hours for small changes
- **Review Turnaround**: <48 hours for reviews
- **Build Time**: <5 minutes for full builds
- **Deployment Time**: <10 minutes for deployments

### Quality Metrics

- **Code Review Coverage**: 100% of changes reviewed
- **Test Pass Rate**: 100% of tests passing
- **Security Compliance**: Zero high/critical issues
- **Documentation Coverage**: 100% of features documented

### Collaboration Metrics

- **Developer Satisfaction**: Positive feedback on processes
- **Process Adherence**: High compliance with workflows
- **Knowledge Sharing**: Regular documentation updates
- **Issue Resolution**: Fast turnaround on issues

## 🔧 Implementation by Project Type

### JavaScript/TypeScript Projects

- **Package Manager**: npm with package-lock.json
- **Testing Framework**: Jest or Vitest
- **Code Quality**: ESLint + Prettier
- **Build Tools**: Webpack, Vite, or Next.js

### Python Projects

- **Package Manager**: pip with requirements.txt
- **Testing Framework**: pytest
- **Code Quality**: ruff + mypy
- **Build Tools**: setuptools or poetry

### MCP Servers

- **Protocol**: Model Context Protocol
- **Language**: TypeScript or Python
- **Testing**: MCP protocol compliance tests
- **Documentation**: Tool discovery documentation

## 📚 Documentation Maintenance

### Regular Updates

- **Weekly**: Review and update workflows
- **Monthly**: Check for process improvements
- **Quarterly**: Major workflow updates
- **Annually**: Comprehensive workflow review

### Change Process

1. **Identify Need**: Recognize workflow improvement opportunity
2. **Propose Changes**: Create issue or discussion
3. **Get Consensus**: Ensure agreement from stakeholders
4. **Update Documentation**: Make changes in forge-patterns
5. **Communicate Changes**: Notify affected teams
6. **Validate Implementation**: Ensure changes work correctly

## 🔗 Related Documentation

### Shared Rules

- **[Agent Rules](../agent-rules.md)** - Core conduct principles
- **[Quality Standards](../quality-standards/README.md)** - Quality requirements
- **[Testing Standards](../quality-standards/testing.md)** - Testing strategies

### Project Documentation

- **[MCP Gateway Development](../../../mcp-gateway/docs/DEVELOPMENT.md)** -
  Gateway-specific workflows
- **[UIForge WebApp Development](../../../uiforge-webapp/docs/DEVELOPMENT.md)** -
  WebApp-specific workflows
- **[UIForge MCP Development](../../../uiforge-mcp/docs/DEVELOPMENT.md)** -
  MCP-specific workflows

### External Resources

- **[GitHub Flow](https://guides.github.com/introduction/flow/)** - Git workflow
- **[GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)** -
  Alternative Git workflow
- **[Trunk-Based Development](https://trunkbaseddevelopment.com/)** -
  Development methodology

---

_These development workflows are maintained as part of the forge-patterns
repository and serve as the canonical process standards for all Forge Space
projects._
