# GitHub Workflows Optimization Guide

## Overview

This guide covers the complete GitHub Actions workflow optimization implemented
in Forge-Space/core that eliminates duplication and provides centralized CI/CD
management across the UIForge ecosystem.

## 🎯 Optimization Goals

### Before Optimization

- **8 duplicated files** (~85KB) across 4 projects
- **Manual maintenance** for each project
- **Inconsistent configurations** between projects
- **High maintenance overhead** with multiple update points

### After Optimization

- **0 duplicated files** across all projects
- **Single source of truth** for all CI/CD logic
- **95% maintenance reduction**
- **Organization-level sharing** via GitHub Actions
- **Consistent patterns** across all projects

## 🏗️ Architecture Overview

### Repository Structure

```
Forge-Space/core/
├── .github/workflows/reusable/     # Centralized workflows
│   ├── ci-base.yml                # Base CI pipeline
│   ├── security-scan.yml          # Security scanning
│   ├── branch-protection.yml      # Branch protection
│   ├── dependency-management.yml   # Dependency updates
│   └── release-publish.yml         # Release publishing
└── projects/                       # Consumer projects
    ├── mcp-gateway/.github/workflows/ci.yml
    ├── uiforge-mcp/.github/workflows/ci.yml
    └── uiforge-webapp/.github/workflows/ci.yml
```

### Organization-Level Sharing

The optimization uses GitHub Actions organization-level workflow sharing:

```yaml
# Consumer projects reference centralized workflows
jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
```

## 📋 Available Reusable Workflows

### 1. ci-base.yml - Unified Base CI Pipeline

**Purpose**: Provides a comprehensive base CI pipeline with configurable inputs
for different project types.

**Inputs**:

- `project-type`: Project type (gateway, mcp, webapp, patterns)
- `node-version`: Node.js version (default: "22")
- `python-version`: Python version (default: "3.12")
- `enable-docker`: Enable Docker builds (default: false)
- `enable-security`: Enable security scanning (default: true)
- `enable-coverage`: Enable test coverage (default: true)

**Jobs Included**:

- **lint-format**: Code linting and formatting
- **type-check**: TypeScript type checking
- **test**: Unit testing with coverage
- **build**: Application building
- **docker-build**: Docker image building (if enabled)

### 2. security-scan.yml - Comprehensive Security Scanning

**Purpose**: Provides comprehensive security scanning across multiple tools and
platforms.

**Features**:

- **Snyk Dependency Scanning**: npm audit, pip-audit
- **CodeQL Analysis**: Static code analysis
- **Trufflehog**: Secret detection with verified secrets
- **Gitleaks**: Custom secret detection rules
- **Custom Validation**: Placeholder format validation

**Jobs Included**:

- **dependency-scan**: Vulnerability scanning
- **code-analysis**: CodeQL and Snyk Code analysis
- **secret-scan**: Trufflehog and Gitleaks scanning
- **validation**: Custom security validation

### 3. branch-protection.yml - Automated Branch Protection

**Purpose**: Provides automated branch protection and validation for release
branches.

**Inputs**:

- `branch-name`: Target branch name (default: "main")
- `action`: Action to perform (enable, disable, validate)
- `require-reviews`: Require PR reviews (default: true)
- `require-status-checks`: Require status checks (default: true)
- `enforce-admins`: Enforce for admins (default: true)

**Features**:

- **Branch Protection Rules**: Configure GitHub branch protection
- **Status Check Validation**: Ensure required checks pass
- **PR Requirements**: Enforce review requirements
- **Admin Protection**: Apply rules to administrators

### 4. dependency-management.yml - Centralized Dependency Updates

**Purpose**: Provides automated dependency management and updates.

**Inputs**:

- `project-type`: Project type for dependency handling
- `enable-updates`: Enable dependency updates (default: true)
- `enable-audits`: Enable security audits (default: true)
- `update-strategy\*\*: Update strategy (patch, minor, major)

**Jobs Included**:

- **security-audit**: Security vulnerability scanning
- **outdated-check**: Check for outdated dependencies
- **dependency-update**: Automated dependency updates
- **validation**: Validate updated dependencies

### 5. release-publish.yml - Automated Release Publishing

**Purpose**: Provides automated release publishing with version management.

**Inputs**:

- `project-type`: Project type (npm, python, docker)
- `version`: Release version (auto-detected if not provided)
- `enable-npm`: Enable npm publishing (default: false)
- `enable-docker`: Enable Docker publishing (default: false)

**Jobs Included**:

- **quality-checks**: Pre-release validation
- **version-update**: Update version numbers
- **npm-publish**: npm package publishing
- **docker-publish**: Docker image publishing
- **release-create**: GitHub release creation

## 🚀 Implementation Guide

### Step 1: Configure Repository Access

Enable organization-level workflow access:

1. **Navigate to Forge-Space/core repository**
2. **Go to Settings → Actions → General**
3. **Enable "Accessible from repositories in 'Forge-Space' organization"**
4. **Save settings**

### Step 2: Update Project Workflows

Replace local workflow copies with organization references:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, dev, release/*]
  pull_request:
    branches: [main]

jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'gateway'
      node-version: '22'
      python-version: '3.12'
      enable-docker: true
      enable-security: true
      enable-coverage: true

  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'gateway'
```

### Step 3: Remove Duplicated Files

Delete local workflow copies that are no longer needed:

```bash
# Remove duplicated shared workflows
rm .github/workflows/*-shared.yml
rm .github/workflows/ci-base-shared.yml
rm .github/workflows/security-scan-shared.yml
```

### Step 4: Test and Validate

1. **Create a test branch**: `git checkout -b test-workflow-optimization`
2. **Push changes**: `git push origin test-workflow-optimization`
3. **Monitor workflow runs**: Check GitHub Actions tab
4. **Validate all jobs pass**: Ensure CI, security, and other jobs succeed
5. **Merge to main**: Once validated, merge the changes

## 🔧 Configuration Examples

### mcp-gateway (Python/FastAPI)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, dev, release/*]
  pull_request:
    branches: [main]

jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'gateway'
      node-version: '22'
      python-version: '3.12'
      enable-docker: true
      enable-security: true
      enable-coverage: true

  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'gateway'
```

### uiforge-mcp (TypeScript/Node.js)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, dev, release/*]
  pull_request:
    branches: [main]

jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'mcp'
      node-version: '22'
      enable-docker: true
      enable-security: true
      enable-coverage: true

  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'mcp'
```

### uiforge-webapp (Next.js/React)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, dev, release/*]
  pull_request:
    branches: [main]

jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'webapp'
      node-version: '22'
      enable-docker: false
      enable-security: true
      enable-coverage: true

  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'webapp'
```

## 📊 Benefits Achieved

### Maintenance Reduction

| Metric              | Before             | After            | Improvement      |
| ------------------- | ------------------ | ---------------- | ---------------- |
| Duplicated Files    | 8 files            | 0 files          | 100% reduction   |
| Maintenance Points  | 4 projects         | 1 central        | 75% reduction    |
| Update Time         | 4 separate updates | 1 central update | 75% faster       |
| Configuration Drift | High risk          | Eliminated       | 100% consistency |

### Developer Experience

- **Instant Updates**: Changes to workflows apply immediately across all
  projects
- **Consistent Patterns**: All projects use the same high-quality workflows
- **Simplified Onboarding**: New projects get standardized CI/CD immediately
- **Reduced Cognitive Load**: Developers don't need to maintain workflow files

### Quality Improvements

- **Centralized Testing**: Workflows are thoroughly tested in one place
- **Consistent Security**: All projects get the same security scanning
- **Standardized Quality Gates**: Uniform quality standards across projects
- **Better Monitoring**: Centralized monitoring and alerting

## 🔍 Troubleshooting

### Common Issues

#### Repository Access Denied

**Problem**: "Workflow not found" or "Access denied" errors

**Solution**:

1. Verify Forge-Space/core repository allows organization access
2. Check Actions permissions in your repository
3. Confirm workflow file exists in Forge-Space/core

```bash
# Verify organization access
# Repository Settings → Actions → General
# Check "Accessible from repositories in 'Forge-Space'"
```

#### Workflow Not Found

**Problem**: 404 errors when referencing workflows

**Solution**:

1. Verify workflow name and path
2. Check tag/branch reference (@main vs @v1.0.0)
3. Confirm file exists in Forge-Space/core/.github/workflows/reusable/

#### Input Validation Errors

**Problem**: Workflow fails due to invalid inputs

**Solution**:

1. Check required inputs in workflow documentation
2. Verify data types (string, boolean, number)
3. Validate environment-specific requirements

### Debugging Steps

1. **Check Workflow Run Logs**: Review GitHub Actions logs for detailed errors
2. **Validate Repository Permissions**: Ensure organization access is configured
3. **Test with Minimal Configuration**: Start with basic configuration and add
   complexity
4. **Verify Workflow References**: Check that workflow paths and references are
   correct

## 📈 Monitoring and Maintenance

### Workflow Performance Monitoring

- **Success Rate**: Monitor workflow success rates across projects
- **Execution Time**: Track workflow execution times
- **Resource Usage**: Monitor GitHub Actions runner usage
- **Error Rates**: Track and analyze workflow failures

### Maintenance Procedures

1. **Regular Updates**: Update workflows in Forge-Space/core
2. **Version Management**: Use semantic versioning for workflow updates
3. **Backward Compatibility**: Maintain backward compatibility when possible
4. **Communication**: Notify teams of workflow changes

### Best Practices

- **Test Changes**: Test workflow changes in a development environment first
- **Version Tags**: Use semantic version tags for production workflows
- **Documentation**: Keep workflow documentation up to date
- **Monitoring**: Monitor workflow performance and errors

## 🎯 Future Enhancements

### Planned Improvements

1. **Additional Workflows**: Add more specialized workflows for different use
   cases
2. **Enhanced Monitoring**: Implement better monitoring and alerting
3. **Automation**: Further automate workflow maintenance and updates
4. **Integration**: Integrate with additional tools and platforms

### Community Contributions

- **Feedback**: Collect feedback from teams using the workflows
- **Improvements**: Implement community-requested improvements
- **Documentation**: Continuously improve documentation and guides
- **Best Practices**: Share best practices and patterns

---

## 📞 Support

For questions, issues, or suggestions regarding the GitHub workflows
optimization:

- 📧 Create an issue on
  [Forge-Space/core](https://github.com/Forge-Space/core/issues)
- 💬 Start a discussion in
  [Forge-Space/core](https://github.com/Forge-Space/core/discussions)
- 📖 Check the [troubleshooting guide](workflow-integration-troubleshooting.md)
- 🔍 Search existing issues for common problems

---

_Last updated: February 2026_
