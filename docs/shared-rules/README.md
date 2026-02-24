# Shared Rules - Forge Space Ecosystem

> **Centralized rules and standards for all Forge Space projects**
>
> **Source of Truth**: This directory contains the canonical rules for the
> entire ecosystem
>
> **Last Updated**: 2026-02-20 **Version**: 1.0.0

---

## 🎯 Overview

This directory contains all shared rules, standards, and conventions that apply
across the Forge Space ecosystem. These rules are the **absolute source of
truth** for all projects.

## 📁 Directory Structure

```
shared-rules/
├── README.md                    # This file - overview and navigation
├── agent-rules.md              # Core agent conduct (universal)
├── development-workflows/       # Development process rules
│   ├── README.md               # Workflow overview
│   ├── git-workflows.md        # Branching, commits, PRs
│   ├── code-review.md           # Review process and guidelines
│   └── cross-project.md        # Multi-project coordination
├── quality-standards/          # Code quality and testing
│   ├── README.md               # Quality standards overview
│   ├── testing.md              # Testing strategies (unified)
│   ├── linting-formatting.md   # Code style and formatting
│   ├── security.md             # Security scanning and practices
│   └── performance.md          # Performance standards
├── project-specific/           # Project-specific adaptations
│   ├── README.md               # When and why project-specific rules exist
│   ├── mcp-gateway.md          # Python/FastAPI specific rules
│   ├── uiforge-webapp.md       # Next.js/React specific rules
│   ├── uiforge-mcp.md          # Node.js/MCP specific rules
│   └── forge-patterns.md       # Shared patterns specific rules
└── templates/                   # Templates and examples
    ├── README.md               # Template overview
    ├── commit-messages.md      # Commit message templates
    ├── pr-templates.md         # Pull request templates
    └── issue-templates.md      # Issue report templates
```

## 🔗 How to Use These Rules

### For All Projects

1. **Start with shared rules** - All projects must follow the base rules in this
   directory
2. **Check project-specific adaptations** - Some projects have specific
   variations
3. **Reference the source of truth** - Always link to these files, not copies

### For Project Maintainers

1. **Keep shared rules up to date** - Update these files when standards change
2. **Document project-specific needs** - Use `project-specific/` for legitimate
   variations
3. **Maintain consistency** - Ensure project rules reference these shared
   standards

### For Contributors

1. **Read the relevant shared rules** - Understand the base standards
2. **Check project-specific adaptations** - Understand any project variations
3. **Follow the source of truth** - Reference these files in discussions and PRs

## 🚀 Quick Reference

### Most Important Rules

- **[Agent Rules](agent-rules.md)** - Core conduct principles (always enforced)
- **[Testing Standards](quality-standards/testing.md)** - Testing strategies and
  coverage
- **[Git Workflows](development-workflows/git-workflows.md)** - Branching and
  commits

### Quality Gates Summary

- ✅ **Coverage**: ≥80% for all projects
- ✅ **Lint**: 0 errors, 0 warnings
- ✅ **Type Check**: 0 errors
- ✅ **Format**: Consistent formatting
- ✅ **Build**: Successful compilation
- ✅ **Security**: No high/critical vulnerabilities

## 📋 Rule Hierarchy

1. **Shared Rules** (this directory) - Base standards for all projects
2. **Project-Specific Rules** - Adaptations where legitimately needed
3. **Local Project Rules** - Only for truly unique requirements

## 🔄 Maintenance Process

### Updating Shared Rules

1. **Propose changes** - Create issue or discussion about needed changes
2. **Get consensus** - Ensure changes work across all projects
3. **Update shared rules** - Modify files in this directory
4. **Update project references** - Ensure all projects reference updated rules
5. **Test across projects** - Verify changes work in all contexts

### Adding Project-Specific Rules

1. **Justify the need** - Explain why shared rules don't suffice
2. **Document clearly** - Use the project-specific template
3. **Reference shared rules** - Explain how they're adapted
4. **Keep minimal** - Only include what's truly project-specific

## 🎯 Success Metrics

- **Consistency**: All projects follow the same base standards
- **Clarity**: Rules are easy to understand and apply
- **Maintainability**: Single place to update shared standards
- **Flexibility**: Projects can adapt when legitimately needed
- **Compliance**: High adoption rate across the ecosystem

## 📞 Support and Questions

### Getting Help

- **Check this directory first** - Most answers are here
- **Search project-specific rules** - Check if your project has adaptations
- **Ask in project discussions** - Use GitHub Discussions for questions
- **Create issues** - For rule problems or suggestions

### Contributing to Rules

- **Propose changes** - Use GitHub Issues for suggestions
- **Discuss improvements** - Use GitHub Discussions for ideas
- **Submit PRs** - Follow the contribution process for rule updates
- **Document changes** - Update CHANGELOG.md when rules change

## 🔗 Related Documentation

### Forge Patterns Documentation

- **[Ecosystem Overview](../ecosystem/OVERVIEW.md)** - Complete ecosystem guide
- **[Integration Guide](../ecosystem/INTEGRATION_GUIDE.md)** - Cross-project
  patterns
- **[Architecture Diagrams](../ecosystem/ARCHITECTURE_DIAGRAM.md)** - System
  design

### Project Documentation

- **[MCP Gateway](../../../mcp-gateway/README.md)** - Gateway-specific
  documentation
- **[UIForge WebApp](../../../uiforge-webapp/README.md)** - Web application
  guide
- **[UIForge MCP](../../../uiforge-mcp/README.md)** - MCP server documentation

---

_This directory is maintained as part of the forge-patterns repository and
serves as the canonical source of truth for all Forge Space projects._
