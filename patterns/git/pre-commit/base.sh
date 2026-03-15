#!/bin/bash
# patterns/git/pre-commit/base.sh
set -euo pipefail

echo "🚀 Running Forge Space pre-commit validations..."

FAILED=0

# 1. Security validation
echo "🔒 Running security validation..."
if ! ./scripts/security/validate-no-secrets.sh; then
  echo "❌ Security validation failed."
  FAILED=1
else
  echo "✅ Security validation passed."
fi

# 2. Lint and format staged files (Node.js projects)
if [ -f "package.json" ]; then
  echo "📝 Running lint and format checks..."
  if ! npx lint-staged; then
    echo "❌ Lint/format check failed."
    FAILED=1
  else
    echo "✅ Lint/format check passed."
  fi
fi

# 3. Python linting (if Python project)
if [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  echo "🐍 Running Python lint..."
  if command -v ruff &> /dev/null; then
    if ! ruff check .; then
      echo "❌ Python lint failed."
      FAILED=1
    else
      echo "✅ Python lint passed."
    fi
  fi
fi

# 4. Type checking (TypeScript projects)
if [ -f "tsconfig.json" ]; then
  echo "🔍 Running type check..."
  if ! npm run type-check; then
    echo "❌ Type check failed."
    FAILED=1
  else
    echo "✅ Type check passed."
  fi
fi

# 5. Run tests
echo "🧪 Running tests..."
if command -v npm &> /dev/null && npm run test --silent 2>/dev/null; then
  if ! npm test -- --bail --passWithNoTests; then
    echo "❌ Tests failed."
    FAILED=1
  else
    echo "✅ Tests passed."
  fi
elif command -v pytest &> /dev/null; then
  if ! pytest --bail; then
    echo "❌ Tests failed."
    FAILED=1
  else
    echo "✅ Tests passed."
  fi
else
  echo "⚠️  No test command found - skipping tests"
fi

# 6. Security audit (Node.js projects)
if [ -f "package.json" ]; then
  echo "🔒 Running security audit..."
  if ! npm audit --audit-level=moderate; then
    echo "❌ Security audit found issues."
    FAILED=1
  else
    echo "✅ Security audit passed."
  fi
fi

# Summary
if [ $FAILED -eq 0 ]; then
  echo "✅ All pre-commit validations passed!"
else
  echo "❌ Some validations failed. Please fix the issues above."
  exit 1
fi