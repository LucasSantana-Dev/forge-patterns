# Task Completion Checklist

## Code Quality Requirements
- [ ] **Linting**: `npm run lint:check` passes without errors
- [ ] **Formatting**: `npm run format:check` passes without changes
- [ ] **Type Checking**: TypeScript compilation succeeds (`npm run build`)
- [ ] **Tests**: All tests pass (`npm run test:all`)
- [ ] **Coverage**: Minimum 80% test coverage maintained

## Security Requirements
- [ ] **No Secrets**: `./scripts/security/validate-no-secrets.sh` passes
- [ ] **Placeholders**: `./scripts/security/validate-placeholders.sh` passes
- [ ] **Security Scan**: `./scripts/security/scan-for-secrets.sh` passes
- [ ] **Dependencies**: No known vulnerabilities (`npm audit`)

## Documentation Requirements
- [ ] **README Updated**: Changes reflected in relevant documentation
- [ ] **JSDoc Comments**: All public APIs documented
- [ ] **Examples**: Working code examples provided
- [ ] **CHANGELOG**: Updates added to [Unreleased] section

## Pattern-Specific Requirements
- [ ] **Pattern Version**: Semantic version declared in metadata
- [ ] **Pattern README**: Complete with all required sections
- [ ] **Performance Targets**: Measurable benchmarks defined
- [ ] **Security Considerations**: BR-001 compliance documented

## Integration Requirements
- [ ] **Cross-Project**: Integration scripts tested (`npm run test:integration`)
- [ ] **Feature Toggles**: Feature toggle validation passes
- [ ] **Shared Constants**: Constants validation passes
- [ ] **Plugin System**: Plugin system validation passes

## Git Requirements
- [ ] **Branch Naming**: Following conventional format (feat/, fix/, chore/)
- [ ] **Commit Message**: Angular conventional commits format
- [ ] **No Backup Files**: Pre-commit backup check passes
- [ ] **Clean Working Directory**: No untracked backup files

## Pre-Commit Validation
```bash
# Run complete pre-commit validation
npm run pre-commit

# Or run individual checks
npm run lint:check
npm run format:check
npm run test:all
./scripts/security/scan-for-secrets.sh
```

## Before PR Creation
1. **Sync Branch**: Ensure main branch is up to date
2. **Full Validation**: Run all checks locally
3. **Documentation**: Update all relevant docs
4. **Testing**: Verify all tests pass
5. **Security**: Confirm no secrets introduced

## Post-Merge Requirements
- [ ] **Version Bump**: Update package.json version if needed
- [ ] **CHANGELOG**: Move changes to appropriate version section
- [ ] **Tags**: Create git tag for release if applicable
- [ ] **Publish**: Publish to npm if this is a release

## Quality Gates
All of the following must pass before any task is considered complete:
- ✅ Code compiles without errors
- ✅ All linting rules pass
- ✅ All tests pass (100% success rate)
- ✅ Test coverage ≥ 80%
- ✅ Security scans pass
- ✅ Documentation is complete and accurate
- ✅ No secrets or placeholders violations
- ✅ Git working directory is clean