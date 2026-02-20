# Organization Setup Guide

This guide provides step-by-step instructions for configuring the Forge-Space
organization to enable GitHub Actions workflow sharing across all repositories.

## 🎯 Overview

Forge-Space/core uses GitHub Actions organization-level workflow sharing to
provide centralized reusable workflows. This requires proper organization
configuration to allow repositories to access and use these workflows.

## 📋 Prerequisites

### Required Permissions

- **Organization Owner** or **Admin** access to Forge-Space organization
- **Repository Admin** access to target repositories
- **GitHub Actions** enabled for the organization

### Required Tools

- GitHub CLI (`gh`) - for command-line operations
- Web browser - for GitHub UI configuration

## 🔧 Step 1: Configure Forge-Space/core Repository

### Enable Organization Access

1. **Navigate to Forge-Space/core**
   - Go to
     [https://github.com/Forge-Space/core](https://github.com/Forge-Space/core)
   - Ensure you're logged in with appropriate permissions

2. **Configure Actions Settings**
   - Click **Settings** tab
   - Click **Actions** in the left sidebar
   - Scroll to **Workflow permissions**
   - Select **Allow all actions** OR **Allow select actions**
   - Under **Access**, check **Accessible from repositories in 'Forge-Space'
     organization**

3. **Save Settings**
   - Click **Save** to apply changes
   - Verify settings are saved successfully

### Verify Configuration

```bash
# Check repository permissions
gh api repos/Forge-Space/core/actions/permissions

# Verify organization access
gh api orgs/Forge-Space
```

## 🔧 Step 2: Configure Target Repositories

### Enable Actions for Each Repository

For each repository that will use Forge-Space/core workflows:

1. **Navigate to Repository**
   - Go to the repository settings page
   - Example: https://github.com/Forge-Space/mcp-gateway

2. **Configure Actions Settings**
   - Click **Settings** tab
   - Click **Actions** in the left sidebar
   - Under **Workflow permissions**, select:
     - **Allow all actions** (recommended) OR
     - **Allow select actions** and add Forge-Space/core

3. **Enable Required Permissions**
   - Ensure **Allow GitHub Actions to create and approve pull requests** is
     checked
   - Enable **Allow GitHub Actions to run workflows** if needed

### Batch Configuration (Advanced)

For multiple repositories, use the GitHub CLI:

```bash
#!/bin/bash
# Configure multiple repositories for workflow access

REPOSITORIES=(
  "Forge-Space/mcp-gateway"
  "Forge-Space/uiforge-mcp"
  "Forge-Space/uiforge-webapp"
)

for repo in "${REPOSITORIES[@]}"; do
  echo "Configuring $repo..."
  gh api repos/$repo/actions/permissions \
    --method PATCH \
    --field enabled=true \
    --field allowed_actions=select \
    --field selected_actions=Forge-Space/core
done
```

## 🔧 Step 3: Verify Workflow Access

### Test Workflow Access

Create a test workflow in one of your repositories:

```yaml
# .github/workflows/test-access.yml
name: Test Workflow Access

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test Forge-Space/core access
        uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
        with:
          project-type: 'patterns'
          node-version: '22'
          python-version: '3.12'
          enable-docker: false
          enable-security: false
          enable-coverage: false
```

### Run Test Workflow

```bash
# Trigger the test workflow
gh workflow run test-access --repo your-username/your-repo

# Check the results
gh run list --repo your-username/your-repo
```

## 🔧 Step 4: Configure Organization Policies

### Workflow Permissions Policy

1. **Navigate to Organization Settings**
   - Go to
     [https://github.com/organizations/Forge-Space](https://github.com/organizations/Forge-Space)
   - Click **Settings**

2. **Configure Member Privileges**
   - Under **Member privileges**, ensure:
     - **Can update organization repository settings** is checked for admins
     - **Can manage organization billing settings** is checked for owners

3. **Repository Permissions**
   - Under **Repository permissions**, ensure:
     - **Members can create repositories** is set appropriately
     - **Members can create internal repositories** is set if needed

### Security Considerations

- **Review Access Regularly**: Periodically review who has access to
  Forge-Space/core
- **Use Principle of Least Privilege**: Only grant necessary permissions
- **Monitor Workflow Usage**: Track which repositories use centralized workflows

## 🔧 Step 5: Configure GitHub Actions Secrets

### Organization-Level Secrets

For shared secrets across all repositories:

```bash
# Add organization-wide secrets
gh secret set --org Forge-Space SNYK_TOKEN "your-snyk-token"
gh secret set --org Forge-Space CODECOV_TOKEN "your-codecov-token"
```

### Repository-Level Secrets

For repository-specific secrets:

```bash
# Add repository-specific secrets
gh secret set --repo Forge-Space/mcp-gateway DOCKER_PASSWORD "your-docker-password"
gh secret set --repo Forge-Space/uiforge-mcp NPM_TOKEN "your-npm-token"
```

## 🔧 Step 6: Configure Self-Hosted Runners (Optional)

If using self-hosted runners:

### Configure Runner Groups

1. **Navigate to Organization Settings**
   - Go to **Settings** → **Actions** → **Runners**
   - Click **New runner group**

2. **Create Runner Group**
   - Name: `forge-workflows`
   - Visibility: **All repositories** or **Selected repositories**
   - Add Forge-Space/core to allowed repositories

3. **Configure Runner Settings**
   - Set appropriate labels
   - Configure runner image and resources
   - Set up runner scaling

### Runner Group Example

```yaml
# .github/workflows/ci.yml
jobs:
  ci:
    runs-on:
      group: forge-workflows
      labels: [ubuntu-latest, self-hosted]
    uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
```

## 🔧 Step 7: Configure Monitoring and Notifications

### Organization-Level Monitoring

Set up monitoring for workflow failures:

```yaml
# .github/workflows/monitor.yml
name: Organization Workflow Monitor

on:
  workflow_run:
    types: [completed]
    workflows: ['ci-base', 'security-scan']

jobs:
  monitor:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    steps:
      - name: Notify on failure
        run: |
          echo "Workflow failed in ${{ github.repository }}"
          # Add Slack/Teams notifications here
```

### Repository-Specific Monitoring

For individual repository monitoring:

```yaml
# .github/workflows/notify.yml
name: Repository Notifications

on:
  workflow_run:
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    steps:
      - name: Send notification
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#ci-cd'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔧 Step 8: Validate Configuration

### Comprehensive Validation Script

```bash
#!/bin/bash
# Validate Forge-Space organization setup

echo "🔍 Validating Forge-Space organization setup..."

# Check organization access
echo "📋 Checking organization access..."
gh api orgs/Forge-Space || {
  echo "❌ Cannot access Forge-Space organization"
  exit 1
}

# Check Forge-Space/core repository
echo "📋 Checking Forge-Space/core repository..."
gh api repos/Forge-Space/core || {
  echo "❌ Cannot access Forge-Space/core repository"
  exit 1
}

# Check reusable workflows
echo "📋 Checking reusable workflows..."
WORKFLOWS=("ci-base" "security-scan" "branch-protection" "dependency-management" "release-publish")

for workflow in "${WORKFLOWS[@]}"; do
  echo "  Checking $workflow.yml..."
  gh api repos/Forge-Space/core/contents/.github/workflows/reusable/$workflow.yml || {
    echo "❌ Missing workflow: $workflow.yml"
    exit 1
  }
done

# Check workflow_call trigger
echo "📋 Checking workflow_call triggers..."
for workflow in "${WORKFLOWS[@]}"; do
  if gh api repos/Forge-Space/core/contents/.github/workflows/reusable/$workflow.yml | grep -q "workflow_call:"; then
    echo "  ✅ $workflow.yml has workflow_call trigger"
  else
    echo "  ❌ $workflow.yml missing workflow_call trigger"
  fi
done

# Test repository access
echo "📋 Testing repository access..."
TEST_REPOS=("mcp-gateway" "uiforge-mcp" "uiforge-webapp")

for repo in "${TEST_REPOS[@]}"; do
  echo "  Testing $repo..."
  if gh api repos/Forge-Space/$repo/actions/permissions; then
    echo "    ✅ $repo has Actions permissions"
  else
    echo "    ❌ $repo missing Actions permissions"
  fi
done

echo "✅ Validation complete!"
```

## 🔧 Step 9: Create Documentation

### Update Repository READMEs

Update each repository's README.md to include workflow integration instructions:

````markdown
## 🔄 GitHub Actions Integration

This repository uses Forge-Space/core reusable workflows for CI/CD.

### Quick Start

1. Ensure your repository has Actions permissions
2. Update `.github/workflows/ci.yml`:
   ```yaml
   jobs:
     ci:
       uses: Forge-Space/core/.github/workflows/reusable/ci-base.yml@main
       with:
         project-type: 'gateway'
         node-version: '22'
         python-version: '3.12'
   ```
````

3. Remove any duplicated workflow files
4. Test the workflow integration

### Documentation

- [Workflow Optimization Guide](https://github.com/Forge-Space/core/blob/main/docs/guides/github-workflows-optimization.md)
- [Reusable Workflow Reference](https://github.com/Forge-Space/core/blob/main/docs/guides/reusable-workflows-reference.md)
- [Troubleshooting Guide](https://github.com/Forge-Space/core/blob/main/docs/guides/workflow-integration-troubleshooting.md)

```

## 🔧 Step 10: Training and Onboarding

### Team Training Materials

Create training materials for team members:

1. **Workflow Overview Presentation**
   - Explain benefits of centralized workflows
   - Show before/after comparison
   - Demonstrate integration process

2. **Hands-On Workshop**
   - Practice workflow integration
   - Troubleshooting common issues
   - Best practices and tips

3. **Documentation Access**
   - Link to all relevant guides
   - Create quick reference cards
   - Set up help channels

### Communication Channels

Set up communication channels for support:

1. **Slack/Teams Channel**: `#github-workflows`
2. **Email Distribution List**: workflows@forge-space.com
3. **Regular Meetings**: Monthly workflow review sessions

## 🔍 Troubleshooting Common Issues

### Issue: Repository Not Found

**Error**: `Repository not found: Forge-Space/core`

**Solution**:
1. Verify organization name is correct: `Forge-Space`
2. Check repository exists: `gh api repos/Forge-Space/core`
3. Ensure you have access permissions

### Issue: Workflow Not Found

**Error**: `Workflow not found: .github/workflows/reusable/ci-base.yml`

**Solution**:
1. Check workflow path: `gh api repos/Forge-Space/core/contents/.github/workflows/reusable`
2. Verify workflow exists: `gh api repos/Forge-Space/core/contents/.github/workflows/reusable/ci-base.yml`
3. Check workflow has `workflow_call:` trigger

### Issue: Permission Denied

**Error**: `Permission denied: cannot access Forge-Space/core`

**Solution**:
1. Configure Forge-Space/core repository access
2. Check organization membership: `gh api orgs/Forge-Space/memberships/your-username`
3. Verify Actions permissions in your repository

### Issue: Workflow Timeout

**Error**: `The job exceeded the maximum timeout`

**Solution**:
1. Increase timeout in workflow call
2. Optimize workflow performance
3. Check for infinite loops or long-running processes

## 📊 Success Metrics

### Configuration Completion Checklist

- [ ] Forge-Space/core repository configured for organization access
- [ ] Target repositories have Actions permissions enabled
- [ ] Organization policies configured for workflow sharing
- [ ] Secrets configured for shared tools
- [ ] Self-hosted runners configured (if needed)
- [ ] Monitoring and notifications set up
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Validation tests passing

### Performance Metrics

- **Workflow Success Rate**: Target >95%
- **Average Execution Time**: Monitor and optimize
- **Repository Coverage**: All target repositories using centralized workflows
- **Maintenance Reduction**: Measure 95% reduction goal

## 🚀 Next Steps

### Immediate Actions

1. **Complete Configuration**: Finish all setup steps
2. **Test Integration**: Validate workflow access in all repositories
3. **Update Documentation**: Ensure all repositories have updated READMEs
4. **Train Team**: Conduct training sessions

### Ongoing Maintenance

1. **Monthly Review**: Review organization configuration
2. **Quarterly Audit**: Audit workflow usage and permissions
3. **Annual Update**: Update to latest workflow versions
4. **Continuous Improvement**: Gather feedback and optimize processes

## 📞 Support

### Getting Help

- **GitHub Issues**: Create issues on [Forge-Space/core](https://github.com/Forge-Space/core/issues)
- **Discussions**: Start discussions in [Forge-Space/core](https://github.com/Forge-Space/core/discussions)
- **Documentation**: Review all available guides in Forge-Space/core
- **Community**: Join the Forge-Space community for support

### Emergency Contacts

- **Organization Admin**: For permission and access issues
- **Repository Admin**: For repository-specific problems
- **DevOps Team**: For workflow and CI/CD issues

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Reusable Workflows Guide](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [Organization Settings](https://docs.github.com/en/organizations/managing-organizations/settings-for-organizations)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

---

*Last updated: February 2026*
```
