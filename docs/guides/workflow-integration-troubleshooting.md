# Workflow Integration Troubleshooting

This guide provides comprehensive troubleshooting for common issues when
integrating Forge-Space/core reusable workflows into your projects.

## 🔍 Common Issues

### Repository Access Denied

#### Problem

```
Error: Workflow not found: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
Error: Access denied: cannot access Forge-Space/core
```

#### Causes

1. Forge-Space/core repository doesn't allow organization access
2. Your repository doesn't have Actions permissions enabled
3. GitHub Actions permissions are misconfigured

#### Solutions

**Step 1: Configure Forge-Space/core Repository Access**

1. Navigate to [Forge-Space/core](https://github.com/Forge-Space/core)
2. Go to **Settings → Actions → General**
3. Under "Workflow permissions", select:
   - ✅ **Allow all actions**
   - ✅ **Allow select actions** (and add Forge-Space organization)
4. Under "Access", check:
   - ✅ **Accessible from repositories in 'Forge-Space' organization**
5. Click **Save settings**

**Step 2: Check Your Repository Permissions**

1. Go to your repository **Settings → Actions → General**
2. Ensure **Workflow permissions** is set to:
   - ✅ **Allow all actions** OR
   - ✅ **Allow select actions** (including Forge-Space/core)
3. Verify **Fork pull request workflows from outside collaborators** is enabled
   if needed

**Step 3: Verify Organization Access**

```bash
# Check if you can access Forge-Space/core
gh api repos/Forge-Space/core

# Check organization membership
gh api orgs/Forge-Space/memberships/your-username

# Test workflow access
gh workflow view Forge-Space/core/.github/workflows/reusable/ci-base.yml
```

### Workflow Not Found

#### Problem

```
Error: Can't find 'workflow.yml', 'workflow.yaml' or 'workflow' in Forge-Space/core/.github/workflows/reusable/ci-base.yml
```

#### Causes

1. Incorrect workflow path or filename
2. Wrong tag/branch reference (@main vs @v1.0.0)
3. Workflow file doesn't exist in Forge-Space/core

#### Solutions

**Step 1: Verify Workflow File Exists**

```bash
# List all reusable workflows
gh api repos/Forge-Space/core/contents/.github/workflows/reusable

# Check specific workflow
gh api repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml
```

**Step 2: Check Workflow Reference Format**

```yaml
# Correct format
uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main

# Incorrect formats
uses: Forge-Space/core/.github/workflows/ci-base.yml@main  # Missing /reusable/
uses: Forge-Space/core/ci-base.yml@main                  # Missing .github/workflows/reusable/
uses: forge-patterns/.github/workflows/reusable/ci-base.yml@main  # Old repository name
```

**Step 3: Verify Tag/Branch Reference**

```bash
# Check available branches
gh api repos/Forge-Space/core/branches

# Check available tags
gh api repos/Forge-Space/core/tags

# Use specific version if needed
uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@v1.0.0
```

### Input Validation Errors

#### Problem

```
Error: Invalid input value for project-type. Must be one of: [gateway, mcp, webapp, patterns]
Error: Input required and not provided: node-version
```

#### Causes

1. Invalid input values
2. Missing required inputs
3. Incorrect data types

#### Solutions

**Step 1: Check Valid Input Values**

```yaml
# Valid project-type values
project-type: 'gateway'    # Python/FastAPI projects
project-type: 'mcp'        # Node.js MCP server projects
project-type: 'webapp'     # Next.js/React web applications
project-type: 'patterns'   # Forge-Space/core patterns project

# Invalid values
project-type: 'python'     # Not supported
project-type: 'node'       # Not supported
project-type: 'react'      # Not supported
```

**Step 2: Verify Required Inputs**

```yaml
# ci-base.yml required inputs
project-type: 'gateway' # Required
node-version: '22' # Required (even for Python projects)
python-version: '3.12' # Required (even for Node.js projects)

# Optional inputs with defaults
enable-docker: true # Default: false
enable-security: true # Default: true
enable-coverage: true # Default: true
timeout-minutes: 30 # Default: 30
```

**Step 3: Check Data Types**

```yaml
# String inputs (use quotes)
project-type: 'gateway'
node-version: '22'
python-version: '3.12'

# Boolean inputs (true/false without quotes)
enable-docker: true
enable-security: false

# Number inputs (without quotes)
timeout-minutes: 30
required-reviewers: 2
```

### Permission Errors

#### Problem

```
Error: Permission denied: cannot create workflow_dispatch event
Error: Insufficient permissions to access repository
```

#### Causes

1. Missing GitHub token permissions
2. Repository access restrictions
3. Organization policy restrictions

#### Solutions

**Step 1: Check GitHub Token Permissions**

```yaml
# Ensure GITHUB_TOKEN has necessary permissions
permissions:
  contents: read
  actions: read
  pull-requests: read
  issues: read
```

**Step 2: Check Repository Access**

```bash
# Verify repository visibility
gh api repos/your-username/your-repo

# Check if repository is private
gh repo view your-username/your-repo --json | jq '.private'
```

**Step 3: Check Organization Policies**

Contact your organization administrator to ensure:

- Forge-Space/core is whitelisted for workflow reuse
- Your repository has necessary permissions
- No policy blocks workflow sharing

## 🛠️ Debugging Steps

### Step 1: Check Workflow Run Logs

1. Go to your repository **Actions** tab
2. Click on the failed workflow run
3. Review the error messages in each job
4. Check the **Annotations** section for specific errors

### Step 2: Validate Repository Configuration

```bash
# Check repository settings
gh repo view your-username/your-repo --json | jq '.permissions'

# Check Actions permissions
gh api repos/your-username/your-repo/actions/permissions

# Check organization access
gh api orgs/Forge-Space/repos
```

### Step 3: Test Workflow Reference

```yaml
# Create a simple test workflow
name: Test Workflow Access

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test workflow reference
        uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
        with:
          project-type: 'patterns'
          node-version: '22'
          python-version: '3.12'
          enable-docker: false
          enable-security: false
          enable-coverage: false
```

### Step 4: Verify Workflow Files

```bash
# List all reusable workflows
gh api repos/Forge-Space/core/contents/.github/workflows/reusable | jq '.[].name'

# Check workflow content
gh api repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml | jq '.content' | base64 -d

# Verify workflow has workflow_call trigger
gh api repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml | jq '.content' | base64 -d | grep "workflow_call:"
```

## 📋 Common Error Messages and Solutions

### Error: "Workflow file not found"

**Message**: `Can't find 'workflow.yml', 'workflow.yaml' or 'workflow'`

**Solution**:

```yaml
# Wrong path
uses: Forge-Space/core/ci-base.yml@main

# Correct path
uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
```

### Error: "Invalid input value"

**Message**: `Invalid input value for project-type`

**Solution**:

```yaml
# Check valid values in workflow documentation
# Use one of: gateway, mcp, webapp, patterns
project-type: 'gateway'
```

### Error: "Input required and not provided"

**Message**: `Input required and not provided: node-version`

**Solution**:

```yaml
# Add required inputs
uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
with:
  project-type: 'gateway'
  node-version: '22'
  python-version: '3.12'
```

### Error: "Permission denied"

**Message**: `Permission denied: cannot access Forge-Space/core`

**Solution**:

1. Configure Forge-Space/core repository access
2. Check organization membership
3. Verify Actions permissions

### Error: "Workflow timeout"

**Message**: `The job exceeded the maximum timeout`

**Solution**:

```yaml
# Increase timeout
uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
with:
  project-type: 'gateway'
  timeout-minutes: 60
```

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable debug logging to get more detailed information:

```yaml
jobs:
  debug:
    runs-on: ubuntu-latest
    steps:
      - name: Debug workflow access
        run: |
          echo "Checking Forge-Space/core access..."
          gh api repos/Forge-Space/core
          echo "Checking workflow files..."
          gh api repos/Forge-Space/core/contents/.github/workflows/reusable
```

### Manual Testing

Test workflow components manually:

```bash
# Test API access
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml

# Test workflow syntax
gh workflow validate .github/workflows/ci.yml
```

### Environment Validation

Check your environment configuration:

```yaml
# Verify environment variables
env:
  NODE_VERSION: ${{ inputs.node-version }}
  PYTHON_VERSION: ${{ inputs.python-version }}
  PROJECT_TYPE: ${{ inputs.project-type }}

# Debug environment
- name: Debug environment
  run: |
    echo "Node version: $NODE_VERSION"
    echo "Python version: $PYTHON_VERSION"
    echo "Project type: $PROJECT_TYPE"
```

## 📞 Getting Help

### Self-Service Resources

1. **Documentation**: Check
   [Workflow Optimization Guide](github-workflows-optimization.md)
2. **Reference**: Review
   [Reusable Workflow Reference](reusable-workflows-reference.md)
3. **Examples**: See configuration examples in project repositories

### Community Support

1. **GitHub Issues**: Create an issue on
   [Forge-Space/core](https://github.com/Forge-Space/core/issues)
2. **Discussions**: Start a discussion in
   [Forge-Space/core](https://github.com/Forge-Space/core/discussions)
3. **Search**: Check existing issues for similar problems

### Escalation

If you've tried all troubleshooting steps and still have issues:

1. **Collect Information**:
   - Error messages (full text)
   - Workflow configuration (YAML)
   - Repository settings screenshots
   - GitHub Actions run logs

2. **Create Detailed Issue**:

   ````markdown
   ## Issue Description

   [Describe the problem]

   ## Error Messages

   [Paste full error messages]

   ## Configuration

   ```yaml
   [Paste your workflow YAML]
   ```
   ````

   ## Troubleshooting Steps Taken

   [List what you've tried]

   ## Environment
   - Repository: [your-repo]
   - Organization: [your-org]
   - Workflow: [workflow-name]

   ```

   ```

## 🚀 Prevention Tips

### Best Practices

1. **Test in Development**: Always test workflow changes in a development branch
2. **Use Semantic Versions**: Use version tags for production workflows
3. **Monitor Changes**: Subscribe to Forge-Space/core repository changes
4. **Document Configuration**: Keep workflow configuration documented

### Monitoring Setup

Set up monitoring for workflow failures:

```yaml
# Add notification on failure
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
        run: |
          echo "Workflow failed - check logs"
          # Add Slack/email notifications here
```

### Regular Maintenance

1. **Monthly Review**: Check for workflow updates
2. **Quarterly Audit**: Review all workflow configurations
3. **Annual Update**: Update to latest workflow versions

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Reusable Workflows Guide](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [Forge-Space/core Repository](https://github.com/Forge-Space/core)
- [Workflow Optimization Guide](github-workflows-optimization.md)
- [Reusable Workflow Reference](reusable-workflows-reference.md)

---

_Last updated: February 2026_
