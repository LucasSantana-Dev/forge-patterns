# Reusable Workflows Reference

This reference guide provides detailed documentation for all reusable workflows
available in Forge-Space/core, including inputs, outputs, and usage examples.

## 📋 Available Workflows

### 1. ci-base.yml - Unified Base CI Pipeline

**Purpose**: Provides a comprehensive base CI pipeline with configurable inputs
for different project types.

**Location**: `Forge-Space/core/.github/workflows/reusable/ci-base.yml`

#### Inputs

| Input             | Type    | Default    | Description                                   |
| ----------------- | ------- | ---------- | --------------------------------------------- |
| `project-type`    | string  | 'patterns' | Project type (gateway, mcp, webapp, patterns) |
| `node-version`    | string  | '22'       | Node.js version to use                        |
| `python-version`  | string  | '3.12'     | Python version to use                         |
| `enable-docker`   | boolean | false      | Enable Docker builds                          |
| `enable-security` | boolean | true       | Enable security scanning                      |
| `enable-coverage` | boolean | true       | Enable test coverage reporting                |
| `timeout-minutes` | number  | 30         | Job timeout in minutes                        |

#### Jobs Included

##### lint-format

**Purpose**: Code linting and formatting **Steps**:

- Setup Node.js/Python environment
- Install dependencies
- Run ESLint/Prettier (Node.js) or Black/Flake8 (Python)
- Check code formatting

##### type-check

**Purpose**: TypeScript type checking **Steps**:

- Setup Node.js environment
- Install dependencies
- Run TypeScript compiler
- Check for type errors

##### test

**Purpose**: Unit testing with coverage **Steps**:

- Setup Node.js/Python environment
- Install dependencies
- Run tests with coverage reporting
- Upload coverage to Codecov

##### build

**Purpose**: Application building **Steps**:

- Setup Node.js/Python environment
- Install dependencies
- Build application
- Store build artifacts

##### docker-build (conditional)

**Purpose**: Docker image building **Steps**:

- Build Docker image
- Tag image with commit SHA
- Store image for deployment

#### Usage Examples

```yaml
# Basic usage for Node.js project
jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'webapp'
      node-version: '22'
      enable-docker: false
      enable-security: true
      enable-coverage: true

# Full configuration for Python project
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
      timeout-minutes: 45
```

### 2. security-scan.yml - Comprehensive Security Scanning

**Purpose**: Provides comprehensive security scanning across multiple tools and
platforms.

**Location**: `Forge-Space/core/.github/workflows/reusable/security-scan.yml`

#### Inputs

| Input                    | Type    | Default    | Description                                 |
| ------------------------ | ------- | ---------- | ------------------------------------------- |
| `project-type`           | string  | 'patterns' | Project type for security configuration     |
| `enable-dependency-scan` | boolean | true       | Enable dependency vulnerability scanning    |
| `enable-code-analysis`   | boolean | true       | Enable CodeQL and Snyk Code analysis        |
| `enable-secret-scan`     | boolean | true       | Enable secret detection                     |
| `enable-validation`      | boolean | true       | Enable custom security validation           |
| `snyk-threshold`         | string  | 'high'     | Snyk severity threshold (low, medium, high) |

#### Jobs Included

##### dependency-scan

**Purpose**: Vulnerability scanning for dependencies **Tools Used**:

- npm audit (Node.js)
- pip-audit (Python)
- Snyk dependency scanning

**Steps**:

- Setup Node.js/Python environment
- Install dependencies
- Run dependency vulnerability scans
- Generate security reports

##### code-analysis

**Purpose**: Static code analysis **Tools Used**:

- GitHub CodeQL
- Snyk Code analysis
- Custom security rules

**Steps**:

- Initialize CodeQL databases
- Run CodeQL analysis
- Run Snyk Code analysis
- Upload SARIF reports

##### secret-scan

**Purpose**: Secret detection in code **Tools Used**:

- Trufflehog (verified secrets only)
- Gitleaks (custom rules)
- Custom validation scripts

**Steps**:

- Scan repository with Trufflehog
- Scan with Gitleaks
- Run custom secret validation
- Generate secret scan reports

##### validation

**Purpose**: Custom security validation **Validations**:

- Placeholder format validation
- Environment variable validation
- Configuration security checks

#### Usage Examples

```yaml
# Standard security scanning
jobs:
  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'gateway'
      snyk-threshold: 'high'

# Minimal security scanning
jobs:
  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'webapp'
      enable-dependency-scan: true
      enable-code-analysis: false
      enable-secret-scan: true
```

### 3. branch-protection.yml - Automated Branch Protection

**Purpose**: Provides automated branch protection and validation for release
branches.

**Location**:
`Forge-Space/core/.github/workflows/reusable/branch-protection.yml`

#### Inputs

| Input                   | Type    | Default    | Description                                   |
| ----------------------- | ------- | ---------- | --------------------------------------------- |
| `branch-name`           | string  | 'main'     | Target branch name                            |
| `action`                | string  | 'validate' | Action to perform (enable, disable, validate) |
| `require-reviews`       | boolean | true       | Require PR reviews                            |
| `require-status-checks` | boolean | true       | Require status checks                         |
| `enforce-admins`        | boolean | true       | Enforce for admins                            |
| `required-reviewers`    | number  | 1          | Number of required reviewers                  |
| `dismiss-stale-reviews` | boolean | true       | Dismiss stale PR reviews                      |

#### Jobs Included

##### branch-protection

**Purpose**: Configure GitHub branch protection rules **Actions**:

- Enable branch protection
- Configure required status checks
- Set review requirements
- Apply admin enforcement

##### validation

**Purpose**: Validate branch protection configuration **Validations**:

- Check branch protection rules
- Verify required status checks
- Validate review requirements
- Test admin enforcement

#### Usage Examples

```yaml
# Enable branch protection for main branch
jobs:
  protect-main:
    uses: Forge-Space/core/.github/workflows/reusable/branch-protection.yml@main
    with:
      branch-name: 'main'
      action: 'enable'
      require-reviews: true
      require-status-checks: true
      enforce-admins: true
      required-reviewers: 2

# Validate existing branch protection
jobs:
  validate-protection:
    uses: Forge-Space/core/.github/workflows/reusable/branch-protection.yml@main
    with:
      branch-name: 'main'
      action: 'validate'
```

### 4. dependency-management.yml - Centralized Dependency Updates

**Purpose**: Provides automated dependency management and updates.

**Location**:
`Forge-Space/core/.github/workflows/reusable/dependency-management.yml`

#### Inputs

| Input             | Type    | Default    | Description                           |
| ----------------- | ------- | ---------- | ------------------------------------- |
| `project-type`    | string  | 'patterns' | Project type for dependency handling  |
| `enable-updates`  | boolean | true       | Enable dependency updates             |
| `enable-audits`   | boolean | true       | Enable security audits                |
| `update-strategy` | string  | 'patch'    | Update strategy (patch, minor, major) |
| `create-pr`       | boolean | true       | Create pull requests for updates      |
| `auto-merge`      | boolean | false      | Auto-merge minor updates              |

#### Jobs Included

##### security-audit

**Purpose**: Security vulnerability scanning **Tools Used**:

- npm audit (Node.js)
- pip-audit (Python)
- Snyk dependency scanning

**Steps**:

- Run security audits
- Generate vulnerability reports
- Check for high-severity issues
- Create security alerts

##### outdated-check

**Purpose**: Check for outdated dependencies **Steps**:

- List outdated dependencies
- Categorize by severity
- Generate update recommendations
- Create update reports

##### dependency-update

**Purpose**: Automated dependency updates **Strategies**:

- Patch updates: Security fixes only
- Minor updates: New features, breaking changes unlikely
- Major updates: Breaking changes, manual review required

**Steps**:

- Update dependencies based on strategy
- Run tests to validate updates
- Create pull requests
- Update changelog

##### validation

**Purpose**: Validate updated dependencies **Validations**:

- Build compatibility
- Test compatibility
- Security compatibility
- Performance impact

#### Usage Examples

```yaml
# Standard dependency management
jobs:
  deps:
    uses: Forge-Space/core/.github/workflows/reusable/dependency-management.yml@main
    with:
      project-type: 'gateway'
      enable-updates: true
      update-strategy: 'patch'
      create-pr: true

# Security-only updates
jobs:
  security-deps:
    uses: Forge-Space/core/.github/workflows/reusable/dependency-management.yml@main
    with:
      project-type: 'webapp'
      enable-updates: true
      update-strategy: 'patch'
      auto-merge: true
```

### 5. release-publish.yml - Automated Release Publishing

**Purpose**: Provides automated release publishing with version management.

**Location**: `Forge-Space/core/.github/workflows/reusable/release-publish.yml`

#### Inputs

| Input                   | Type    | Default    | Description                              |
| ----------------------- | ------- | ---------- | ---------------------------------------- |
| `project-type`          | string  | 'patterns' | Project type (npm, python, docker)       |
| `version`               | string  | ''         | Release version (auto-detected if empty) |
| `enable-npm`            | boolean | false      | Enable npm publishing                    |
| `enable-docker`         | boolean | false      | Enable Docker publishing                 |
| `enable-github-release` | boolean | true       | Enable GitHub release creation           |
| `create-tag`            | boolean | true       | Create git tag for release               |

#### Jobs Included

##### quality-checks

**Purpose**: Pre-release validation **Checks**:

- Code quality and linting
- Test coverage requirements
- Security scan results
- Build validation

##### version-update

**Purpose**: Update version numbers **Updates**:

- package.json version (Node.js)
- pyproject.toml version (Python)
- Docker image tags
- Changelog updates

##### npm-publish (conditional)

**Purpose**: npm package publishing **Steps**:

- Build package
- Run tests
- Publish to npm
- Verify publishing

##### docker-publish (conditional)

**Purpose**: Docker image publishing **Steps**:

- Build multi-platform Docker image
- Tag with version and latest
- Push to registry
- Verify deployment

##### release-create

**Purpose**: GitHub release creation **Steps**:

- Generate release notes
- Create GitHub release
- Upload artifacts
- Notify teams

#### Usage Examples

```yaml
# npm package release
jobs:
  release:
    uses: Forge-Space/core/.github/workflows/reusable/release-publish.yml@main
    with:
      project-type: 'npm'
      enable-npm: true
      enable-github-release: true
      create-tag: true

# Docker image release
jobs:
  release:
    uses: Forge-Space/core/.github/workflows/reusable/release-publish.yml@main
    with:
      project-type: 'docker'
      enable-docker: true
      enable-github-release: true
      create-tag: true

# Full release with multiple platforms
jobs:
  release:
    uses: Forge-Space/core/.github/workflows/reusable/release-publish.yml@main
    with:
      project-type: 'gateway'
      version: '1.2.3'
      enable-npm: true
      enable-docker: true
      enable-github-release: true
      create-tag: true
```

## 🔧 Configuration Reference

### Project Types

| Project Type | Description               | Default Tools                 |
| ------------ | ------------------------- | ----------------------------- |
| `patterns`   | Forge-Space/core patterns | Node.js, ESLint, Prettier     |
| `gateway`    | MCP Gateway projects      | Python, Black, Flake8, Docker |
| `mcp`        | MCP Server projects       | Node.js, TypeScript, Docker   |
| `webapp`     | Web applications          | Node.js, Next.js, React       |

### Environment Variables

Workflows use the following environment variables:

```yaml
# Common variables
NODE_VERSION: '22'
PYTHON_VERSION: '3.12'
SNYK_SEVERITY_THRESHOLD: 'high'
SNYK_ORGANIZATION: 'LucasSantana-Dev'

# Project-specific variables
PROJECT_TYPE: 'gateway' # Set by workflow input
ENABLE_DOCKER: 'true' # Set by workflow input
ENABLE_SECURITY: 'true' # Set by workflow input
```

### Secrets Required

```yaml
# GitHub token (automatically provided)
GITHUB_TOKEN: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Snyk token (for security scanning)
SNYK_TOKEN: snyp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Codecov token (for coverage reporting)
CODECOV_TOKEN: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Docker registry tokens (if publishing)
DOCKER_USERNAME: your-docker-username
DOCKER_PASSWORD: your-docker-password

# npm token (if publishing)
NPM_TOKEN: npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📊 Workflow Outputs

### Common Outputs

| Output                  | Description             | Source       |
| ----------------------- | ----------------------- | ------------ |
| `workflow-status`       | Overall workflow status | Final job    |
| `test-results`          | Test execution results  | Test job     |
| `coverage-report`       | Coverage percentage     | Test job     |
| `security-scan-results` | Security scan findings  | Security job |
| `build-artifacts`       | Build artifact URLs     | Build job    |

### Release-Specific Outputs

| Output               | Description        | Source             |
| -------------------- | ------------------ | ------------------ |
| `release-version`    | Published version  | Version job        |
| `npm-package-url`    | npm package URL    | npm publish job    |
| `docker-image-url`   | Docker image URL   | Docker publish job |
| `github-release-url` | GitHub release URL | Release create job |

## 🚀 Best Practices

### Workflow Composition

```yaml
# Combine multiple workflows
name: CI/CD Pipeline

on:
  push:
    branches: [main, dev]

jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'gateway'
      enable-docker: true
      enable-security: true
      enable-coverage: true

  security:
    uses: Forge-Space/core/.github/workflows/reusable/security-scan.yml@main
    with:
      project-type: 'gateway'
      snyk-threshold: 'high'

  deps:
    uses: Forge-Space/core/.github/workflows/reusable/dependency-management.yml@main
    with:
      project-type: 'gateway'
      enable-updates: true
      update-strategy: 'patch'
```

### Conditional Execution

```yaml
# Conditional workflow execution
jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'webapp'
      enable-docker: ${{ github.ref == 'refs/heads/main' }}
      enable-security: true
      enable-coverage: ${{ github.event_name == 'pull_request' }}
```

### Error Handling

```yaml
# Error handling and notifications
jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'gateway'

  notify:
    needs: ci
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - name: Notify on failure
        run: echo "Workflow failed - check logs"
```

## 🔍 Troubleshooting

### Common Issues

#### Workflow Not Found

**Error**:
`Workflow not found: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main`

**Solutions**:

1. Verify repository access permissions
2. Check workflow file exists in Forge-Space/core
3. Verify tag/branch reference (@main vs @v1.0.0)

#### Input Validation Errors

**Error**: `Invalid input value for project-type`

**Solutions**:

1. Check allowed values: gateway, mcp, webapp, patterns
2. Verify input type (string, boolean, number)
3. Check for typos in input names

#### Permission Errors

**Error**: `Permission denied: cannot access Forge-Space/core`

**Solutions**:

1. Enable organization access in Forge-Space/core settings
2. Check repository visibility
3. Verify GitHub Actions permissions

### Debug Commands

```bash
# Check workflow file exists
gh api repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml

# Check organization access
gh api orgs/Forge-Space

# Test workflow reference
gh workflow view Forge-Space/core/.github/workflows/reusable/ci-base.yml
```

## 📈 Performance Optimization

### Workflow Optimization Tips

1. **Use Caching**: Enable dependency caching for faster builds
2. **Parallel Jobs**: Run independent jobs in parallel
3. **Conditional Execution**: Skip unnecessary jobs based on context
4. **Resource Limits**: Set appropriate timeout and resource limits

```yaml
# Optimized workflow example
jobs:
  ci:
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
    with:
      project-type: 'gateway'
      timeout-minutes: 20 # Reduced timeout
    strategy:
      matrix:
        node-version: [18, 20] # Test multiple versions
```

---

## 📞 Support

For questions about reusable workflows:

- 📧 Create an issue on
  [Forge-Space/core](https://github.com/Forge-Space/core/issues)
- 💬 Start a discussion in
  [Forge-Space/core](https://github.com/Forge-Space/core/discussions)
- 📖 Check the [workflow optimization guide](github-workflows-optimization.md)
- 🔍 Search existing issues for common problems

---

_Last updated: February 2026_
