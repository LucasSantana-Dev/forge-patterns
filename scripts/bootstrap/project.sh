#!/bin/bash
# scripts/bootstrap/project.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
PATTERNS_DIR="${REPO_ROOT}/patterns"
TEMPLATE_DIR="${SCRIPT_DIR}/templates/workflows/limit-aware"

usage() {
  cat << EOF
Usage: $0 <project-name> [project-type] [options]

Project types:
  node | nextjs | python

Options:
  --ci-profile <limit-aware|legacy>  CI profile (default: limit-aware)
  --org <github-org>                 Required when ci-profile is limit-aware
  --actions-cap-minutes <minutes>    Required when ci-profile is limit-aware
  --actions-warn-pct <1-99>          Default: 70
  --actions-degrade-pct <1-100>      Default: 85
  -h, --help                         Show this help message
EOF
}

is_positive_integer() {
  [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -gt 0 ]
}

is_percentage() {
  [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -ge 1 ] && [ "$1" -le 100 ]
}

render_limit_aware_workflow() {
  local template_file="$1"
  local output_file="$2"

  sed \
    -e "s|__ORG__|${ORG}|g" \
    -e "s|__PROJECT_NAME__|${PROJECT_NAME}|g" \
    -e "s|__ACTIONS_MONTHLY_CAP_MINUTES__|${ACTIONS_CAP_MINUTES}|g" \
    -e "s|__ACTIONS_WARN_PCT__|${ACTIONS_WARN_PCT}|g" \
    -e "s|__ACTIONS_DEGRADE_PCT__|${ACTIONS_DEGRADE_PCT}|g" \
    "$template_file" > "$output_file"
}

generate_limit_aware_workflows() {
  if [ "$CI_PROFILE" != "limit-aware" ]; then
    return
  fi

  local ci_template
  local nightly_template
  case "$PROJECT_TYPE" in
    node)
      ci_template="${TEMPLATE_DIR}/ci-node.yml.tpl"
      nightly_template="${TEMPLATE_DIR}/security-nightly-node.yml.tpl"
      ;;
    nextjs)
      ci_template="${TEMPLATE_DIR}/ci-nextjs.yml.tpl"
      nightly_template="${TEMPLATE_DIR}/security-nightly-nextjs.yml.tpl"
      ;;
    python)
      ci_template="${TEMPLATE_DIR}/ci-python.yml.tpl"
      nightly_template="${TEMPLATE_DIR}/security-nightly-python.yml.tpl"
      ;;
    *)
      echo "❌ Unsupported project type for limit-aware CI profile: $PROJECT_TYPE"
      exit 1
      ;;
  esac

  if [ ! -f "$ci_template" ] || [ ! -f "$nightly_template" ]; then
    echo "❌ Missing workflow templates for project type '$PROJECT_TYPE' in $TEMPLATE_DIR"
    exit 1
  fi

  mkdir -p .github/workflows
  render_limit_aware_workflow "$ci_template" .github/workflows/ci.yml
  render_limit_aware_workflow "$nightly_template" .github/workflows/security-nightly.yml
}

PROJECT_NAME=""
PROJECT_TYPE="node"
CI_PROFILE="limit-aware"
ORG=""
ACTIONS_CAP_MINUTES=""
ACTIONS_WARN_PCT="70"
ACTIONS_DEGRADE_PCT="85"

while [ $# -gt 0 ]; do
  case "$1" in
    --ci-profile)
      CI_PROFILE="${2:-}"
      shift 2
      ;;
    --org)
      ORG="${2:-}"
      shift 2
      ;;
    --actions-cap-minutes)
      ACTIONS_CAP_MINUTES="${2:-}"
      shift 2
      ;;
    --actions-warn-pct)
      ACTIONS_WARN_PCT="${2:-}"
      shift 2
      ;;
    --actions-degrade-pct)
      ACTIONS_DEGRADE_PCT="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --*)
      echo "❌ Unknown option: $1"
      usage
      exit 1
      ;;
    *)
      if [ -z "$PROJECT_NAME" ]; then
        PROJECT_NAME="$1"
      elif [ "$PROJECT_TYPE" = "node" ] && [[ "$1" =~ ^(node|nextjs|python)$ ]]; then
        PROJECT_TYPE="$1"
      else
        echo "❌ Unexpected argument: $1"
        usage
        exit 1
      fi
      shift
      ;;
  esac
done

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Project name is required"
  usage
  exit 1
fi

if ! [[ "$PROJECT_TYPE" =~ ^(node|nextjs|python)$ ]]; then
  echo "❌ Invalid project type: $PROJECT_TYPE"
  usage
  exit 1
fi

if ! [[ "$CI_PROFILE" =~ ^(limit-aware|legacy)$ ]]; then
  echo "❌ Invalid ci profile: $CI_PROFILE"
  usage
  exit 1
fi

if [ "$CI_PROFILE" = "limit-aware" ]; then
  if [ -z "$ORG" ]; then
    echo "❌ --org is required when --ci-profile=limit-aware"
    exit 1
  fi
  if ! is_positive_integer "$ACTIONS_CAP_MINUTES"; then
    echo "❌ --actions-cap-minutes must be a positive integer"
    exit 1
  fi
  if ! is_percentage "$ACTIONS_WARN_PCT"; then
    echo "❌ --actions-warn-pct must be between 1 and 100"
    exit 1
  fi
  if ! is_percentage "$ACTIONS_DEGRADE_PCT"; then
    echo "❌ --actions-degrade-pct must be between 1 and 100"
    exit 1
  fi
  if [ "$ACTIONS_WARN_PCT" -ge "$ACTIONS_DEGRADE_PCT" ]; then
    echo "❌ --actions-warn-pct must be lower than --actions-degrade-pct"
    exit 1
  fi
fi

echo "🚀 Bootstrapping new UIForge project..."
echo "Creating project: $PROJECT_NAME (type: $PROJECT_TYPE, ci-profile: $CI_PROFILE)"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize Git repository
git init

# Create basic structure
mkdir -p src docs tests scripts feature-toggles

# Copy patterns from uiforge-patterns
echo "📋 Copying patterns from uiforge-patterns..."

# Copy ESLint config
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  cp "${PATTERNS_DIR}/code-quality/eslint/base.config.js" .eslintrc.js
  cp "${PATTERNS_DIR}/code-quality/prettier/base.config.json" .prettierrc.json
fi

# Copy Jest config for TypeScript projects
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  if [ -f "${PATTERNS_DIR}/coverage/jest.config.template.js" ]; then
    cp "${PATTERNS_DIR}/coverage/jest.config.template.js" jest.config.js
  else
    cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
};
EOF
  fi
fi

# Copy Codecov config
if [ -f "${PATTERNS_DIR}/coverage/codecov.template.yml" ]; then
  cp "${PATTERNS_DIR}/coverage/codecov.template.yml" .codecov.yml
else
  cat > .codecov.yml << 'EOF'
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 1%
EOF
fi

# Copy Git hooks
mkdir -p .git/hooks
cp "${PATTERNS_DIR}/git/pre-commit/base.sh" .git/hooks/pre-commit
cp "${PATTERNS_DIR}/git/commit-msg/conventional.sh" .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit .git/hooks/commit-msg

# Copy Docker patterns
echo "🐳 Adding Docker patterns..."
cp "${PATTERNS_DIR}/docker/Dockerfile.node.template" Dockerfile
cp "${PATTERNS_DIR}/docker/docker-compose.dev.yml" docker-compose.yml
cp "${PATTERNS_DIR}/docker/docker-compose.prod.yml" docker-compose.prod.yml
cp "${PATTERNS_DIR}/docker/.dockerignore" .dockerignore

# Copy centralized feature toggle patterns
echo "🎛️ Adding centralized feature toggle patterns..."
mkdir -p feature-toggles
mkdir -p feature-toggles/libraries
mkdir -p feature-toggles/libraries/nodejs
cp "${PATTERNS_DIR}/feature-toggles/README.md" feature-toggles/
cp "${PATTERNS_DIR}/feature-toggles/libraries/nodejs/index.js" \
  feature-toggles/libraries/nodejs/ 2>/dev/null || \
  echo "# Feature toggle library will be added here" > \
  feature-toggles/libraries/nodejs/index.js

# Copy forge-features CLI tool
cp "${REPO_ROOT}/scripts/forge-features" scripts/ 2>/dev/null || \
  echo "# Forge Features CLI will be added here" > scripts/forge-features
chmod +x scripts/forge-features

# Create package.json for Node.js projects
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "UIForge project: $PROJECT_NAME",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts,.js",
    "lint:fix": "eslint src --ext .ts,.js --fix",
    "format": "prettier --write src/**/*.{ts,js,json}",
    "type-check": "tsc --noEmit",
    "docker:build": "docker build -t $PROJECT_NAME .",
    "docker:run": "docker run -p 3000:3000 $PROJECT_NAME",
    "docker:dev": "docker-compose up -d",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^9.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "ts-jest": "^29.4.1",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,yml,yaml}": [
      "prettier --write"
    ]
  }
}
EOF
fi

# Create TypeScript config for Node.js projects
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF
fi

# Create Python config for Python projects
if [ "$PROJECT_TYPE" = "python" ]; then
  cat > pyproject.toml << EOF
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "$PROJECT_NAME"
version = "1.0.0"
description = "UIForge project: $PROJECT_NAME"
authors = [{name = "UIForge Team"}]
license = {text = "MIT"}
dependencies = []

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "ruff>=0.1.0",
    "black>=23.0.0",
    "mypy>=1.0.0"
]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
addopts = "--cov=src --cov-report=xml --cov-report=html --cov-report=term-missing --cov-fail-under=80"

[tool.coverage.report]
fail_under = 80
show_missing = true
precision = 2

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "B", "A", "C4", "DTZ", "T10", "EM", "FA", "ISC", "ICN", "G", "PIE", "T20", "PT", "Q", "RSE", "RET", "SIM", "TID", "TCH", "ARG", "PTH", "ERA", "PGH", "PL", "TRY", "FLY", "NPY", "RUF"]
ignore = ["E501"]

[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
EOF
fi

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.venv/
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Build outputs
dist/
build/
out/
.next/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local
!.env.example
!.env.template

# Logs
*.log
logs/

# Coverage
coverage/
htmlcov/
.coverage
.nyc_output

# IDE
.vscode/
.idea/
*.swp
*.swo
.windsurf/

# OS
.DS_Store
Thumbs.db

# Testing
.jest/
test-results/
playwright-report/

# Security cleanup
cleanup-*.sh
replacements.txt
bfg.jar
SECURITY_INCIDENT.md
POST_CLEANUP_CHECKLIST.md

# Docker
.dockerignore
EOF

# Create README
cat > README.md << EOF
# $PROJECT_NAME

UIForge project: $PROJECT_NAME

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
$([ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ] && echo "npm install" || echo "pip install -e .[dev]")

# Run tests
$([ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ] && echo "npm test" || echo "pytest")

# Start development
$([ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ] && echo "npm run dev" || echo "python src/main.py")

# Docker development
docker-compose up -d
\`\`\`

## 🐳 Docker Development

This project includes Docker patterns for consistent development and deployment:

### Development Environment
\`\`\`bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop environment
docker-compose down
\`\`\`

### Production Deployment
\`\`\`bash
# Build production image
docker build -t $PROJECT_NAME .

# Run production container
docker run -p 3000:3000 $PROJECT_NAME

# Or use production compose
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🎛️ Centralized Feature Toggles

This project includes centralized feature toggle management for the UIForge ecosystem:

### Start Unleash Instance
\`\`\`bash
# Start Unleash feature toggle service
docker run -p 4242:4242 unleashorg/unleash-server

# Check Unleash health
curl http://localhost:4242/api/health

# Access Unleash UI
open http://localhost:4242
\`\`\`

### Manage Features with CLI
\`\`\`bash
# Enable global features
./scripts/forge-features enable global.debug-mode
./scripts/forge-features enable global.beta-features

# Enable project-specific features
./scripts/forge-features enable mcp-gateway.rate-limiting
./scripts/forge-features enable uiforge-mcp.ai-chat

# Check feature status
./scripts/forge-features status --global
./scripts/forge-features status --project=mcp-gateway

# List all available features
./scripts/forge-features list
\`\`\`

## 🎛️ Feature Toggles

This project includes feature toggle patterns for dynamic feature management:

### Feature Toggle Setup
\`\`\`bash
# Install feature toggle library
npm install @uiforge/feature-toggles

# Configure feature toggles
cp feature-toggles/config/unleash.template.yml unleash.yml

# Start development with feature toggles
npm run dev:features
\`\`\`

## 📋 Requirements

EOF

if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  {
    echo "- Node.js 22+"
    echo "- npm 9+"
    echo "- Docker & Docker Compose"
  } >> README.md
elif [ "$PROJECT_TYPE" = "python" ]; then
  {
    echo "- Python 3.12+"
    echo "- pip"
    echo "- Docker & Docker Compose"
  } >> README.md
fi

cat >> README.md << EOF

## 🧪 Testing

This project uses UIForge patterns for consistent testing:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test module interactions
- **Coverage**: 80% minimum coverage requirement

Run tests with coverage:
\`\`\`bash
$([ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ] && echo "npm run test:coverage" || echo "pytest --cov")
\`\`\`

## 🔒 Security

This project follows UIForge security patterns:

- No secrets in repository
- Automated security scanning
- Dependency vulnerability checks
- Code quality enforcement

## 📚 Documentation

- [UIForge Patterns](https://github.com/Forge-Space/core)
- [Security Guidelines](docs/SECURITY.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Docker Patterns](docs/DOCKER.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and security checks
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
EOF

# Create initial source files
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  cat > src/index.ts << EOF
/**
 * Main entry point for $PROJECT_NAME
 */

export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

if (require.main === module) {
  const name = process.argv[2] || 'World';
  console.log(hello(name));
}
EOF
elif [ "$PROJECT_TYPE" = "python" ]; then
  cat > src/main.py << EOF
"""
Main entry point for $PROJECT_NAME
"""

def hello(name: str = "World") -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"


if __name__ == "__main__":
    import sys
    name = sys.argv[1] if len(sys.argv) > 1 else "World"
    print(hello(name))
EOF
fi

# Create basic test
if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "nextjs" ]; then
  mkdir -p src/__tests__
  cat > src/__tests__/index.test.ts << EOF
import { hello } from '../index';

describe('hello function', () => {
  it('should return greeting with default name', () => {
    expect(hello('World')).toBe('Hello, World!');
  });

  it('should return greeting with custom name', () => {
    expect(hello('UIForge')).toBe('Hello, UIForge!');
  });
});
EOF
elif [ "$PROJECT_TYPE" = "python" ]; then
  mkdir -p tests
  cat > tests/test_main.py << EOF
import pytest
from src.main import hello


def test_hello_default():
    assert hello() == "Hello, World!"


def test_hello_custom():
    assert hello("UIForge") == "Hello, UIForge!"
EOF
fi

generate_limit_aware_workflows

echo "✅ Project $PROJECT_NAME created successfully!"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Install dependencies"
echo "3. Run tests to verify setup"
if [ "$CI_PROFILE" = "limit-aware" ]; then
  echo "4. Add org variables with scripts/bootstrap/actions-org-setup.sh"
  echo "5. Start development with: docker-compose up -d"
  echo "6. Happy coding! 🚀"
else
  echo "4. Start development with: docker-compose up -d"
  echo "5. Happy coding! 🚀"
fi
