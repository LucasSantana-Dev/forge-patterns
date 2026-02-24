---
trigger: model_decision
description: Testing strategy and quality gates. Apply when creating or updating tests, or modifying quality thresholds.
globs: []
---

# Testing & Quality Standards

**When to apply:** Writing or modifying test suites, quality gates, or coverage targets across all Forge Space projects.

## Universal Coverage Thresholds

- **Minimum**: ≥80% statements, functions, lines, branches (enforced in config)
- **Target**: ≥85% for production-critical code
- **E2E**: 100% coverage for critical user flows (auth, project CRUD, generation)

## Test Runners by Project Type

### JavaScript/TypeScript Projects
- **Jest 29.7** for unit and integration tests (UIForge WebApp primary)
- **Vitest** for MCP server and Vite-based projects (UIForge MCP)
- **Playwright 1.48** for E2E tests
- **React Testing Library** for React component testing

### Python Projects
- **pytest** for unit and integration tests (MCP Gateway)
- **pytest-cov** for coverage reporting
- **pytest-asyncio** for async testing

## Test File Naming Conventions

### Universal Patterns
- Unit tests: `src/__tests__/unit/my-module.test.ts` or `*.unit.test.ts`
- Integration tests: `src/__tests__/integration/my-flow.test.ts` or `*.integration.test.ts`
- E2E tests: `e2e/my-flow.spec.ts` or `tests/e2e/`

### Project-Specific Patterns

#### UIForge WebApp (Next.js + Jest)
- Unit tests: `src/components/__tests__/MyComponent.test.tsx`
- Integration tests: `src/__tests__/integration/my-flow.test.ts`
- Test file mapping: See project-specific documentation

#### MCP Gateway (Python + pytest)
- Unit tests: `tests/unit/test_module.py`
- Integration tests: `tests/integration/test_flow.py`
- E2E tests: `tests/e2e/test_scenario.py`

#### UIForge MCP (Node.js + Vitest)
- Unit tests: `src/__tests__/unit/my-tool.test.ts`
- Integration tests: `src/__tests__/integration/my-flow.test.ts`

## Universal Testing Conventions

1. **Test behavior, not implementation details**
2. **Mock external dependencies** (APIs, DB, native addons) in tests
3. **Keep tests independent and deterministic**
4. **Do NOT mix test runner imports** — use globals available for the configured runner
5. **Test error conditions and edge cases**, not just happy paths

## Quality Gates (CI must run in order)

### JavaScript/TypeScript Projects
1. **Lint**: `npm run lint` — 0 errors, 0 warnings
2. **Type check**: `npx tsc --noEmit` — 0 errors
3. **Format**: `npm run format:check` — Prettier clean
4. **Tests**: `npm run test` — 100% pass rate, coverage threshold met
5. **Build**: `npm run build` — successful compilation

### Python Projects
1. **Lint**: `ruff check .` — 0 errors, 0 warnings
2. **Format**: `ruff format . --check` — Proper formatting
3. **Type check**: `mypy .` — 0 errors (if applicable)
4. **Tests**: `pytest tests/ -v --cov=src` — 100% pass rate, coverage threshold met
5. **Security**: `bandit -r .` — No high/critical issues

## Commands by Project Type

### JavaScript/TypeScript
- Run all: `npm test`
- Watch mode: `npm run test:watch`
- With coverage: `npm run test:coverage`
- E2E: `npm run test:e2e`
- Single file: `npm test -- path/to/test.test.ts`

### Python
- Run all: `pytest tests/ -v`
- Watch mode: `pytest tests/ -v --watch`
- With coverage: `pytest tests/ -v --cov=src --cov-report=html`
- Single file: `pytest tests/unit/test_module.py -v`

## Configuration Examples

### Jest (UIForge WebApp)
```js
// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
};

export default createJestConfig(config);
```

### Vitest (UIForge MCP)
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        global: { lines: 80, branches: 80, functions: 80, statements: 80 },
      },
    },
  },
});
```

### pytest (MCP Gateway)
```ini
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --cov=src --cov-report=html --cov-report=term-missing
```

## Pre-commit Hooks

All hooks must pass before commit:
- **JavaScript/TypeScript**: lint-staged (ESLint + Prettier), type-check
- **Python**: pre-commit (ruff format + ruff check), pytest

## Project-Specific Guidelines

### UIForge WebApp Specific
- Use Jest with ESM preset: `ts-jest/presets/default-esm`
- Requires `NODE_OPTIONS=--experimental-vm-modules` for ESM support
- Test each framework template produces valid file structures
- Test design context updates flow correctly through tools

### MCP Gateway Specific
- Use pytest fixtures for database and API mocking
- Test FastAPI endpoints with TestClient
- Include integration tests for MCP protocol compliance

### UIForge MCP Specific
- Test MCP tool registration and execution
- Mock external AI providers (OpenAI, Anthropic, Ollama)
- Test component generation across all frameworks

## Anti-Patterns to Avoid

❌ **Never create tests that:**
- Only test trivial functionality (enum values, basic getters/setters)
- Use meaningless test data
- Test implementation details rather than behavior
- Increase coverage without adding real value

✅ **Always create tests that:**
- Verify actual business logic
- Test realistic user scenarios
- Cover error conditions and edge cases
- Provide confidence in system behavior

## References

**Project-specific testing guides:**
- [UIForge WebApp Testing](../../project-specific/uiforge-webapp/testing.md)
- [MCP Gateway Testing](../../project-specific/mcp-gateway/testing.md)
- [UIForge MCP Testing](../../project-specific/uiforge-mcp/testing.md)

**Related documentation:**
- [Agent Rules](../agent-rules.md)
- [Development Workflows](../development-workflows/README.md)
- [Quality Gates Overview](README.md)