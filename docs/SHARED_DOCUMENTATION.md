# Shared Documentation - Forge Space Ecosystem

> **Centralized documentation hub for all Forge Space projects**
>
> **Source of Truth**: This directory contains the canonical documentation for
> the entire ecosystem
>
> **Last Updated**: 2026-02-20 **Version**: 1.0.0

---

## 🎯 Overview

This directory serves as the **centralized documentation hub** for the Forge
Space ecosystem. All shared rules, workflows, patterns, and standards are
consolidated here to provide a single source of truth for all projects.

## 📁 Documentation Structure

```
docs/
├── ecosystem/                    # Ecosystem-level documentation
│   ├── OVERVIEW.md              # Complete ecosystem overview
│   ├── INTEGRATION_GUIDE.md     # Cross-project integration
│   └── ARCHITECTURE_DIAGRAM.md  # System architecture
├── shared-rules/                 # Unified rules and standards
│   ├── README.md                # Rules overview and navigation
│   ├── agent-rules.md           # Core agent conduct (universal)
│   ├── development-workflows/   # Development process rules
│   ├── quality-standards/       # Code quality and testing
│   ├── project-specific/        # Project-specific adaptations
│   └── templates/               # Templates and examples
├── shared-workflows/             # Consolidated workflows
│   ├── README.md                # Workflow overview
│   ├── development/             # Development workflows
│   ├── deployment/              # Deployment procedures
│   ├── quality-assurance/      # QA and testing workflows
│   └── emergency/               # Emergency procedures
└── shared-memories/             # Common patterns and decisions
    ├── README.md                # Memory overview
    ├── development-patterns/    # Development best practices
    ├── architectural-decisions/ # Key design decisions
    └── troubleshooting/         # Common issues and solutions
```

## 🚀 Quick Navigation

### 🎯 Most Important Documentation

- **[Ecosystem Overview](ecosystem/OVERVIEW.md)** - Complete ecosystem guide
- **[Agent Rules](shared-rules/agent-rules.md)** - Core conduct principles
- **[Testing Standards](shared-rules/quality-standards/testing.md)** - Testing
  strategies
- **[Integration Guide](ecosystem/INTEGRATION_GUIDE.md)** - Cross-project
  patterns

### 📋 Project-Specific Information

- **[MCP Gateway](../../../mcp-gateway/README.md)** - Central MCP aggregation
  service
- **[UIForge WebApp](../../../uiforge-webapp/README.md)** - AI-powered UI
  generation
- **[UIForge MCP](../../../uiforge-mcp/README.md)** - Specialized UI development
  tools
- **[Forge Patterns](../../../forge-patterns/README.md)** - Shared
  configurations

## 🔗 How This Documentation Works

### Single Source of Truth

- **All shared rules** live in `shared-rules/`
- **All shared workflows** live in `shared-workflows/`
- **All common patterns** live in `shared-memories/`
- **Projects reference** these files as canonical sources

### Project Integration

Each project maintains minimal local documentation:

- **Project-specific adaptations** in `.windsurf/rules/project-specific/`
- **References to shared docs** with clear links
- **Local READMEs** for project-specific information

### Version Control

- **All documentation tracked** in forge-patterns repository
- **Git history** provides change tracking
- **Collaboration** through standard GitHub processes
- **Branch protection** for documentation changes

## 📚 Documentation Categories

### 📖 Shared Rules (`shared-rules/`)

**Purpose**: Unified standards and conventions for all projects

**Key Files**:

- **[Agent Rules](shared-rules/agent-rules.md)** - Core conduct principles
- **[Testing Standards](shared-rules/quality-standards/testing.md)** - Testing
  strategies
- **[Quality Standards](shared-rules/quality-standards/README.md)** - Quality
  gates
- **[Development Workflows](shared-rules/development-workflows/README.md)** -
  Process standards

**When to Use**:

- Setting up development environment
- Writing code or tests
- Reviewing changes
- Understanding project standards

### 🔄 Shared Workflows (`shared-workflows/`)

**Purpose**: Standardized procedures for common tasks

**Key Workflows**:

- **Development workflows** - Feature development, bug fixes
- **Deployment workflows** - Release processes, environment setup
- **Quality assurance** - Testing, security scanning, validation
- **Emergency procedures** - Incident response, recovery

**When to Use**:

- Following established procedures
- Training new team members
- Automating common tasks
- Ensuring consistency

### 🧠 Shared Memories (`shared-memories/`)

**Purpose**: Common patterns, decisions, and knowledge

**Key Content**:

- **Development patterns** - Best practices and common solutions
- **Architectural decisions** - Design choices and rationale
- **Troubleshooting** - Common issues and solutions
- **Learning resources** - Documentation and references

**When to Use**:

- Understanding system design
- Solving common problems
- Making architectural decisions
- Learning about the ecosystem

## 🎯 Documentation Principles

### ✅ What We Document

- **Shared standards** that apply across projects
- **Common workflows** used by multiple teams
- **Architectural decisions** affecting the ecosystem
- **Best practices** proven to work well
- **Troubleshooting** for common issues

### ❌ What We Don't Document

- **Project-specific details** (kept in project repos)
- **Temporary workarounds** (fix the issue instead)
- **Outdated information** (keep current)
- **Personal opinions** (use consensus-based decisions)
- **Implementation details** (focus on behavior)

### 📝 Documentation Standards

- **Clear structure** with consistent formatting
- **Actionable content** with specific guidance
- **Cross-references** to related documentation
- **Version tracking** with change history
- **Regular reviews** to keep content current

## 🔧 Using This Documentation

### For Developers

1. **Start with shared rules** - Understand base standards
2. **Check project adaptations** - Understand project-specific needs
3. **Follow workflows** - Use established procedures
4. **Reference patterns** - Apply proven solutions

### For Project Maintainers

1. **Keep shared docs updated** - Update when standards change
2. **Document adaptations** - Explain project-specific needs
3. **Maintain references** - Ensure links work correctly
4. **Review regularly** - Keep content current and relevant

### For New Team Members

1. **Read ecosystem overview** - Understand the big picture
2. **Study shared rules** - Learn the standards
3. **Practice workflows** - Follow established procedures
4. **Ask questions** - Use community channels for help

## 🔄 Maintenance Process

### Regular Updates

- **Weekly**: Review for accuracy and relevance
- **Monthly**: Check for broken links and references
- **Quarterly**: Major updates and improvements
- **Annually**: Comprehensive review and reorganization

### Contribution Process

1. **Identify need** - What documentation is missing or outdated?
2. **Propose changes** - Create issue or discussion
3. **Get consensus** - Ensure changes benefit the ecosystem
4. **Update documentation** - Make the changes
5. **Verify integration** - Test that references work
6. **Communicate changes** - Notify affected teams

## 📊 Success Metrics

### Documentation Quality

- **Accuracy**: All information is current and correct
- **Completeness**: Covers all essential topics
- **Usability**: Easy to find and understand information
- **Consistency**: Unified format and structure

### Adoption Metrics

- **Usage**: References in project documentation
- **Compliance**: Teams follow documented standards
- **Feedback**: Positive responses from users
- **Contributions**: Active participation in maintenance

## 🔗 Related Resources

### External Documentation

- **[GitHub Documentation](https://docs.github.com/)** - Git and GitHub
  workflows
- **[Node.js Docs](https://nodejs.org/docs/)** - JavaScript runtime
- **[Python Docs](https://docs.python.org/)** - Python language
- **[Docker Docs](https://docs.docker.com/)** - Containerization

### Community Resources

- **[GitHub Discussions](https://github.com/LucasSantana-Dev/forge-patterns/discussions)** -
  General discussions
- **[GitHub Issues](https://github.com/LucasSantana-Dev/forge-patterns/issues)** -
  Bug reports and features
- **[Discord Community](https://discord.gg/)** - Real-time chat and support

---

_This shared documentation is maintained as part of the forge-patterns
repository and serves as the canonical source of truth for the entire Forge
Space ecosystem._
