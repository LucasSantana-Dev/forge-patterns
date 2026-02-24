# Development Workflow

## Trunk-Based Development Pattern
**Workflow**: Feature → Release → Main → Deploy

### Phase 1: Feature Development
1. **Create feature branch** from main
   - Naming: `feat/feature-name` or `fix/issue-description`
   - Isolated development environment

### Phase 2: Integration Testing
2. **Pull Request to release branch**
   - Target: `release` or `develop` branch
   - CI/CD runs: tests, linting, security scans
   - Code review required

### Phase 3: Production Readiness
3. **Pull Request to main branch**
   - Target: `main` branch
   - All quality gates must pass
   - Automated deployment triggers on merge

### Phase 4: Automated Deployment
4. **CI/CD Pipeline on main branch merge**
   - Automatic version bump
   - Package publishing
   - Production deployment
   - Release notes generation

## Daily Development Flow

### Starting Work
```bash
# Sync with main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/my-new-feature

# Start development
npm run dev
```

### During Development
```bash
# Continuous validation
npm run lint
npm run format
npm run test

# Security checks
./scripts/security/validate-no-secrets.sh

# Build verification
npm run build
```

### Before Committing
```bash
# Run complete validation
npm run validate

# Check git status
git status

# Add and commit
git add .
git commit -m "feat(scope): implement new feature"

# Push to remote
git push origin feat/my-new-feature
```

## Quality Gates

### Pre-commit Hooks (Automatic)
- Lint fixing and validation
- Code formatting
- Test execution
- Backup file detection
- Secret scanning

### CI/CD Pipeline
- **Lint Check**: ESLint validation
- **Format Check**: Prettier validation
- **Type Check**: TypeScript compilation
- **Test Suite**: All tests with coverage
- **Security Scan**: Secret detection
- **Build Verification**: Package builds correctly

### Branch Protection
- **Main Branch**: Protected, PRs only, required reviews
- **Release Branch**: Integration testing environment
- **Feature Branches**: Short-lived, focused scope

## Pattern Development Workflow

### Creating New Patterns
1. **Design Phase**
   - Define pattern purpose and scope
   - Identify business rules compliance
   - Plan directory structure

2. **Implementation Phase**
   - Create pattern directory
   - Implement pattern code
   - Add comprehensive tests

3. **Documentation Phase**
   - Write README.md with all sections
   - Add JSDoc comments
   - Create usage examples

4. **Validation Phase**
   - Run pattern validation
   - Security scanning
   - Integration testing

5. **Review Phase**
   - Create pull request
   - Code review process
   - Address feedback

## Integration Workflow

### Cross-Project Integration
```bash
# Test integration with all projects
npm run test:integration

# Integrate with specific project
npm run integrate:mcp-gateway
npm run integrate:uiforge-mcp
npm run integrate:uiforge-webapp

# Validate integration
npm run test:plugins
npm run test:feature-toggles
```

### Feature Toggle Management
```bash
# List feature status
forge-features status --global

# Enable features
forge-features enable global.debug-mode
forge-features enable mcp-gateway.new-feature

# Validate feature toggles
npm run test:feature-toggles
```

## Security Workflow

### Before Every Commit
```bash
# Comprehensive security scan
./scripts/security/scan-for-secrets.sh

# Individual validations
./scripts/security/validate-no-secrets.sh
./scripts/security/validate-placeholders.sh
```

### Dependency Management
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Re-validate after updates
npm run validate
```

## Release Workflow

### Pre-Release Checklist
- All quality gates pass
- Documentation updated
- CHANGELOG updated
- Version bumped
- Security scan passed

### Release Process
```bash
# Prepare release
npm run prepack

# Run final validation
npm run validate

# Publish to npm
npm run publish:npm

# Create git tag
git tag v1.2.0
git push origin v1.2.0
```

## Troubleshooting Workflow

### Common Issues
1. **Lint Errors**: Run `npm run lint` to auto-fix
2. **Test Failures**: Check test output for specific issues
3. **Security Violations**: Check for hardcoded secrets
4. **Build Errors**: Verify TypeScript configuration
5. **Integration Issues**: Run integration tests

### Getting Help
- Check documentation in `docs/`
- Review pattern README files
- Run validation scripts for detailed output
- Check GitHub issues for known problems