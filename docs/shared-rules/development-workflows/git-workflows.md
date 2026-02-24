---
trigger: model_decision
description:
  Git workflows, commit conventions, and release guidelines. Apply when
  authoring commits, PR templates, or release process changes.
globs: []
---

# Git Workflows - Forge Space Ecosystem

> **Unified Git workflows and conventions for all Forge Space projects**
>
> **Source of Truth**: This file is the canonical standard for all projects
>
> **Last Updated**: 2026-02-20 **Version**: 1.0.0

---

## 🎯 Overview

This document defines the standardized Git workflows, commit conventions, and
release processes that apply across the entire Forge Space ecosystem. These
workflows ensure consistency, quality, and maintainability across all projects.

## 📝 Commit Message Convention

### Angular Commit Format (Strict)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type       | Description   | When to Use                              |
| ---------- | ------------- | ---------------------------------------- |
| `feat`     | New feature   | Adding new functionality                 |
| `fix`      | Bug fix       | Fixing issues                            |
| `docs`     | Documentation | Documentation changes                    |
| `style`    | Code style    | Formatting, linting                      |
| `refactor` | Code refactor | Code improvement without feature changes |
| `perf`     | Performance   | Performance improvements                 |
| `test`     | Testing       | Adding or improving tests                |
| `chore`    | Maintenance   | Dependencies, build process              |
| `ci`       | CI/CD         | Continuous integration                   |
| `build`    | Build system  | Build configuration                      |
| `revert`   | Revert        | Reverting previous changes               |

### Scopes by Project Type

#### Universal Scopes

- `git` - Git configuration and hooks
- `deps` - Dependencies management
- `ci` - CI/CD configuration
- `docs` - Documentation

#### Project-Specific Scopes

- **MCP Gateway**: `gateway`, `ai`, `scoring`, `security`, `config`
- **UIForge WebApp**: `ui`, `api`, `auth`, `components`, `database`
- **UIForge MCP**: `mcp`, `tools`, `generation`, `ai`, `figma`
- **Forge Patterns**: `patterns`, `workflows`, `templates`, `shared`

### Subject Rules

- **Imperative mood**: Use command tone ("Add feature" not "Added feature")
- **Lowercase start**: First letter lowercase
- **Max 50 characters**: Keep it concise
- **No trailing period**: Don't end with a period

### Body Rules

- **Explain what and why**: Not how
- **Line length**: ≤72 characters
- **Blank line**: Between subject and body
- **Wrap at 72**: For longer descriptions

### Footer Rules

- **Issue references**: `Closes #123`, `Fixes #456`
- **Breaking changes**: `BREAKING CHANGE:`
- **Co-authors**: Only for human collaborators

## 🚫 No AI Attribution (Mandatory)

**NEVER add AI attribution lines:**

- ❌ `Co-authored-by: Cursor`
- ❌ `Co-authored-by: Windsurf`
- ❌ `Co-authored-by: [any AI/assistant]`
- ❌ Any similar AI attribution

**Valid footer examples:**

```bash
Closes #123
Fixes #456
BREAKING CHANGE: Updated API signature
Co-authored-by: human-developer@example.com
```

## 🌿 Branch Naming Convention

### Feature Branches

```
feat/<scope>-short-description
fix/<scope>-short-description
docs/<scope>-short-description
```

### Examples

```bash
feat/gateway-add-ai-routing
fix/ui-auth-validation
docs/mcp-protocol-updates
refactor/scoring-algorithm
```

### Release Branches

```
release/v1.2.0
develop
main
```

## 🔀 Pull Request Process

### PR Requirements

#### Branch Protection

- **No direct pushes** to `main` or protected branches
- **Required reviews**: Minimum 1 approving reviewer for non-trivial changes
- **Required checks**: All CI checks must pass
- **Required status**: Up-to-date with target branch

#### PR Title Format

- **Same as commit subject**: `type(scope): description`
- **Imperative mood**: Describe the change
- **Concise**: Max 50 characters

#### PR Description Template

```markdown
## Description

Brief description of the change

## Changes Made

- Bullet list of key changes
- Include breaking changes if any

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Breaking changes documented
```

### PR Quality Gates

#### Automated Checks

- **Lint**: 0 errors, 0 warnings
- **Type Check**: 0 type errors
- **Format**: Properly formatted
- **Tests**: 100% pass rate
- **Build**: Successful compilation
- **Security**: No high/critical vulnerabilities

#### Manual Review Criteria

- **Code quality**: Follows project patterns
- **Functionality**: Works as intended
- **Performance**: No performance regressions
- **Security**: No security issues
- **Documentation**: Adequate documentation

## 🔄 Merge Strategy

### When to Squash

- **Small PRs**: Single feature or fix
- **Cleanup PRs**: Minor improvements
- **Documentation**: Documentation updates

### When to Rebase

- **Feature branches**: Preserving commit history
- **Long-lived branches**: Maintaining linear history
- **Collaborative work**: Multiple contributors

### Merge Commands

```bash
# Squash merge
git checkout main
git merge --squash feature-branch

# Rebase merge
git checkout main
git rebase feature-branch
```

## 🚀 Release Process

### Semantic Versioning

- **Major**: `X.0.0` - Breaking changes
- **Minor**: `X.Y.0` - New features (backward compatible)
- **Patch**: `X.Y.Z` - Bug fixes

### Release Steps

#### 1. Prepare Release

```bash
# Update version files
npm version patch  # or minor/major

# Update CHANGELOG.md
npm run changelog

# Validate build
npm run build
npm test
```

#### 2. Tag Release

```bash
# Create tag
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push tag
git push origin v1.2.3
```

#### 3. Publish

```bash
# Publish package (JavaScript/TypeScript)
npm publish

# Publish package (Python)
python -m build
twine upload dist/*

# Deploy application
npm run deploy
```

### Release Validation

- **Version consistency**: All version files updated
- **CHANGELOG accuracy**: Reflects actual changes
- **Build success**: Production build passes
- **Tests pass**: All tests pass in release
- **Documentation**: Updated for new features

## 🛠️ Development Workflow Examples

### Feature Development Workflow

```bash
# 1. Create feature branch
git checkout -b feat/ui-add-component-generation

# 2. Make changes
# ... develop feature ...

# 3. Commit changes
git add .
git commit -m "feat(ui): add component generation with AI"

# 4. Push and create PR
git push origin feat/ui-add-component-generation
# Create PR on GitHub

# 5. Review and merge
# PR review process
# Merge to main after approval
```

### Bug Fix Workflow

```bash
# 1. Create fix branch
git checkout -b fix/auth-validation-error

# 2. Fix issue
# ... fix bug ...

# 3. Commit fix
git add .
git commit -m "fix(auth): resolve validation error for user login"

# 4. Push and create PR
git push origin fix/auth-validation-error
# Create PR on GitHub

# 5. Review and merge
# PR review process
# Merge to main after approval
```

### Documentation Update Workflow

```bash
# 1. Create docs branch
git checkout -b docs/api-endpoint-documentation

# 2. Update documentation
# ... update docs ...

# 3. Commit changes
git add .
git commit -m "docs(api): update endpoint documentation for v2.0"

# 4. Push and merge
git push origin docs/api-endpoint-documentation
# Can merge directly to main for docs
```

## 📋 Project-Specific Adaptations

### MCP Gateway Specific

- **Python dependencies**: Update `pyproject.toml` and `requirements.txt`
- **Docker images**: Update version tags
- **API documentation**: Update OpenAPI specs

### UIForge WebApp Specific

- **Next.js dependencies**: Update `package.json`
- **Database migrations**: Update Supabase migrations
- **Component library**: Update component versions

### UIForge MCP Specific

- **MCP protocol**: Update protocol version
- **Tool definitions**: Update tool schemas
- **AI providers**: Update provider integrations

### Forge Patterns Specific

- **Shared configurations**: Update pattern versions
- **Workflow templates**: Update workflow files
- **Documentation**: Update shared documentation

## 🔍 Quality Assurance

### Pre-commit Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
npm run test:unit
npm run type-check
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
      - name: Type check
        run: npm run type-check
```

## 🎯 Success Metrics

### Workflow Efficiency

- **PR merge time**: <24 hours for small changes
- **Release frequency**: Regular releases (weekly/bi-weekly)
- **Branch protection**: 100% compliance
- **Quality gates**: 100% pass rate

### Code Quality

- **Commit message compliance**: 100% following convention
- **PR description quality**: Complete and informative
- **Review turnaround**: <48 hours for reviews
- **Release notes**: Accurate and comprehensive

## 🔗 Related Documentation

### Shared Rules

- **[Agent Rules](../agent-rules.md)** - Core conduct principles
- **[Quality Standards](../quality-standards/README.md)** - Quality requirements
- **[Development Workflows](README.md)** - Process overview

### Project Documentation

- **[MCP Gateway Development](../../../mcp-gateway/docs/DEVELOPMENT.md)** -
  Gateway-specific workflows
- **[UIForge WebApp Development](../../../uiforge-webapp/docs/DEVELOPMENT.md)** -
  WebApp-specific workflows
- **[UIForge MCP Development](../../../uiforge-mcp/docs/DEVELOPMENT.md)** -
  MCP-specific workflows

### External Resources

- **[Angular Commit Convention](https://www.conventionalcommits.org/)** - Commit
  message standard
- **[GitHub Flow](https://guides.github.com/introduction/flow/)** - GitHub
  workflow
- **[Semantic Versioning](https://semver.org/)** - Versioning standard

---

_This Git workflow documentation is maintained as part of the forge-patterns
repository and serves as the canonical standard for all Forge Space projects._
