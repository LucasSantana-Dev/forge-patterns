# Forge Space Test Coverage Standards

## Coverage Requirements
- **Minimum Coverage**: 80% across all metrics
- **Coverage Types**: Branches, Functions, Lines, Statements
- **Reporting**: XML, HTML, Terminal formats
- **Quality Gates**: Fail builds below 80%

## Coverage Configuration Standards

### JavaScript/TypeScript (Jest)
```javascript
// Jest configuration template
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/**/*.config.{js,ts}',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Python (pytest)
```toml
# pyproject.toml configuration
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=xml --cov-report=html --cov-report=term-missing --cov-fail-under=80"

[tool.coverage.report]
fail_under = 80
show_missing = true
precision = 2
```

### Codecov Configuration
```yaml
# .codecov.yml template
codecov:
  require_ci_to_pass: true
  coverage:
    precision: 2
    round: down
    range: "70...100"
    status:
      project:
        default:
          target: 80%
          threshold: 1%
      patch:
        default:
          target: 80%
          threshold: 1%
```

## Coverage Flags and Categories

### Test Categories
- **unit**: Unit tests for individual functions/components
- **integration**: Integration tests for module interactions
- **e2e**: End-to-end tests for complete workflows

### Coverage Flags
```yaml
flags:
  unit:
    paths:
      - src/**/__tests__/**/*.unit.*
    carryforward: true
  integration:
    paths:
      - src/**/__tests__/**/*.integration.*
    carryforward: true
  e2e:
    paths:
      - tests/e2e/**/*.test.*
    carryforward: true
```

## Coverage Validation Scripts

### Coverage Check Script
```bash
#!/bin/bash
# Validate coverage meets 80% threshold
COVERAGE=$(npm run test:coverage -- --coverageReporters=json | jq '.total.lines.pct')
if (( $(echo "$COVERAGE < 80" | bc -l) )); then
  echo "❌ Coverage $COVERAGE% is below 80% threshold"
  exit 1
fi
echo "✅ Coverage $COVERAGE% meets 80% threshold"
```

### Coverage Comparison Script
```bash
#!/bin/bash
# Compare coverage across projects
echo "Comparing coverage across UIForge projects..."
for project in mcp-gateway uiforge-webapp uiforge-mcp; do
  echo "📊 $project coverage:"
  cd "/path/to/$project"
  npm run test:coverage -- --coverageReporters=json | jq '.total.lines.pct'
done
```

## Coverage Monitoring

### Weekly Coverage Report
```markdown
# Coverage Report - Week of [Date]

## Project Coverage Summary
- **mcp-gateway**: X% (status: ✅/⚠️/❌)
- **uiforge-webapp**: X% (status: ✅/⚠️/❌)
- **uiforge-mcp**: X% (status: ✅/⚠️/❌)

## Coverage Trends
- Overall trend: ↗️/↘️/➡️
- Coverage change: +/- X%
- Uncovered files: X

## Action Items
- [ ] Address files below coverage threshold
- [ ] Add tests for uncovered critical paths
- [ ] Review coverage exclusions
```

## Coverage Best Practices

### Test Organization
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete user workflows
- **Coverage Exclusions**: Only exclude truly untestable code

### Coverage Quality
- Focus on meaningful coverage, not just percentage
- Test critical paths and error conditions
- Use test-driven development for new features
- Regularly review and update test suites

### Coverage Maintenance
- Monitor coverage trends over time
- Address coverage drops immediately
- Update coverage thresholds as needed
- Celebrate coverage improvements
