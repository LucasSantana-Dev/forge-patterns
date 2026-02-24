# Suggested Commands for Development

## Essential Commands
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development mode (watch)
npm run dev

# Run all validations
npm run validate

# Run all tests
npm run test:all

# Lint and fix
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Testing Commands
```bash
# Run all tests
npm run test

# Plugin system tests
npm run test:plugins

# Feature toggle tests
npm run test:feature-toggles

# Integration tests
npm run test:integration

# Shared constants tests
npm run test:shared-constants

# Performance benchmarks
npm run test:workflow
```

## Pattern Management
```bash
# List all patterns
npm run patterns:list

# Search patterns
npm run patterns:search <query>

# Validate patterns
npm run patterns:validate

# Integrate with projects
npm run integrate

# Project-specific integration
npm run integrate:mcp-gateway
npm run integrate:uiforge-mcp
npm run integrate:uiforge-webapp
```

## Security Commands
```bash
# Comprehensive security scan
./scripts/security/scan-for-secrets.sh

# Validate no secrets
./scripts/security/validate-no-secrets.sh

# Validate placeholder format
./scripts/security/validate-placeholders.sh
```

## MCP Context Server
```bash
# Build MCP context server
npm run mcp-context:build

# Start MCP context server
npm run mcp-context:start
```

## Git Workflow
```bash
# Create feature branch
git checkout -b feat/feature-name

# Pre-commit validation (runs automatically)
npm run pre-commit

# Check git status
git status

# Add changes
git add .

# Commit with conventional format
git commit -m "feat(scope): description"

# Push to remote
git push origin feat/feature-name
```

## Publishing Commands
```bash
# Prepare for publishing
npm run prepack

# Publish to npm
npm run publish:npm

# Build and prepare
npm run prepare
```

## System Commands (Darwin/macOS)
```bash
# Find files
find . -name "*.ts" -type f

# Search in files
grep -r "pattern" src/

# List directories
ls -la

# Check file permissions
ls -l script.sh

# Make executable
chmod +x script.sh

# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force
```

## Docker Commands
```bash
# Build Docker image
docker build -t forgespace/core .

# Run container
docker run -p 3000:3000 forgespace/core

# View logs
docker logs -f <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>
```