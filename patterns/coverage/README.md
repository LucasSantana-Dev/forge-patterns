# Coverage Standards

Test coverage configuration templates and quality gate standards for the Forge Space ecosystem.

## Contents

```
patterns/coverage/
├── codecov.template.yml      # Codecov configuration for CI integration
├── coverage-standards.md     # Full coverage requirements and rationale
├── jest.config.template.js   # Jest coverage config template
└── patterns-config.yml       # Pattern-level configuration
```

## Requirements

| Metric | Threshold |
|--------|-----------|
| Statements | 80% minimum |
| Branches | 80% minimum |
| Functions | 80% minimum |
| Lines | 80% minimum |

**Target:** 100% (current state of `@forgespace/core` — all modules at 100%)

## Jest Configuration

```js
// jest.config.js — copy from jest.config.template.js
module.exports = {
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/mcp-context-server/**'  // ESM modules need Vitest
  ]
};
```

## CI Integration

```bash
npm run test:coverage   # Runs Jest with coverage, fails if below threshold
```

Codecov uploads automatically on CI — see `codecov.template.yml` for configuration.

## Exclusions

Modules excluded from coverage collection:
- `src/mcp-context-server/` — ESM-only, requires Vitest
- `patterns/ide-extensions/` — VSCode extension (separate jest config)
- `patterns/monitoring/` — Supabase client dependency
