#!/bin/bash
# scripts/security/scan-for-secrets.sh
set -euo pipefail

echo "🔍 Running comprehensive secret scan..."

FAILED=0

# 1. Run custom validation scripts
echo "1. Running custom security validation..."
if ! ./scripts/security/validate-no-secrets.sh; then
  echo "❌ Custom security validation failed"
  FAILED=1
fi

if ! ./scripts/security/validate-placeholders.sh; then
  echo "❌ Placeholder validation failed"
  FAILED=1
fi

# 2. Run Gitleaks if available
echo "2. Running Gitleaks scan..."
if command -v gitleaks &> /dev/null; then
  if ! gitleaks detect --verbose --config=.gitleaks.yml; then
    echo "❌ Gitleaks scan found issues"
    FAILED=1
  else
    echo "✅ Gitleaks scan passed"
  fi
else
  echo "⚠️  Gitleaks not installed - skipping"
fi

# 3. Run Trufflehog if available
echo "3. Running Trufflehog scan..."
if command -v trufflehog &> /dev/null; then
  if ! trufflehog filesystem --directory . --only-verified; then
    echo "❌ Trufflehog scan found issues"
    FAILED=1
  else
    echo "✅ Trufflehog scan passed"
  fi
else
  echo "⚠️  Trufflehog not installed - skipping"
fi

# 4. Check for common file patterns that might contain secrets
echo "4. Checking for sensitive file patterns..."
SENSITIVE_FILES=(
  "*.pem"
  "*.key"
  "*.p12"
  "*.jks"
  "*.crt"
  "*.pfx"
  "id_rsa"
  "id_dsa"
  "id_ecdsa"
  ".env"
  "config.json"
  "secrets.json"
)

for pattern in "${SENSITIVE_FILES[@]}"; do
  if find . -name "$pattern" | grep -v node_modules | grep -v .git; then
    echo "❌ Found potentially sensitive file: $pattern"
    FAILED=1
  fi
done

# 5. Check for hardcoded URLs and endpoints
echo "5. Checking for hardcoded URLs..."
URL_MATCHES="$(
  grep -r -n "https://.*\.com" \
    --include="*.yml" --include="*.yaml" --include="*.json" --include="*.js" --include="*.ts" \
    --exclude="package-lock.json" --exclude="*.test.ts" --exclude="*.test.js" \
    --exclude-dir="node_modules" --exclude-dir=".git" --exclude-dir="dist" \
    src scripts .github 2>/dev/null \
    | grep -v "REPLACE_WITH_" \
    | grep -v "github.com" \
    | grep -v "npmjs.com" \
    | grep -v "example.com" \
    | grep -v "SECURITY NOTICE" \
    || true
)"
if [ -n "$URL_MATCHES" ]; then
  echo "$URL_MATCHES"
  echo "⚠️  Found potentially hardcoded URLs - review manually"
fi

if [ $FAILED -eq 0 ]; then
  echo "✅ Comprehensive security scan passed"
  echo "🔒 Repository is secure for public distribution"
else
  echo "❌ Security scan failed - fix issues before making public"
  exit 1
fi
