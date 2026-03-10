#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

INCLUDE_PATHS=(
  "src"
  "patterns"
  "scripts"
  ".github"
)

ALLOWLIST_GLOBS=(
  "--glob=!docs/**"
  "--glob=!**/node_modules/**"
  "--glob=!**/dist/**"
  "--glob=!**/coverage/**"
  "--glob=!**/*.lock"
  "--glob=!CHANGELOG.md"
  "--glob=!scripts/security/validate-tenant-decoupling.sh"
)

TOKENS=(
  "vsantana-organization"
  "@vsantana-org"
  "VSANTANA_"
  "LucasSantana-Dev"
  "github.com/LucasSantana-Dev"
  "github.com/lucassantana/"
  "/Users/lucassantana/"
)

FAIL=0

scan_token() {
  local token="$1"

  if command -v rg >/dev/null 2>&1; then
    rg -n --no-heading "${ALLOWLIST_GLOBS[@]}" "$token" "${INCLUDE_PATHS[@]}" || true
    return
  fi

  grep -RIn \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=coverage \
    --exclude='*.lock' \
    --exclude='CHANGELOG.md' \
    --exclude='validate-tenant-decoupling.sh' \
    -- "$token" "${INCLUDE_PATHS[@]}" 2>/dev/null || true
}

for token in "${TOKENS[@]}"; do
  MATCHES="$(scan_token "$token")"
  if [[ -n "$MATCHES" ]]; then
    echo "BLOCKED token found: $token"
    echo "$MATCHES"
    FAIL=1
  fi
done

if [[ "$FAIL" -ne 0 ]]; then
  echo "Tenant-decoupling validation failed."
  exit 1
fi

echo "Tenant-decoupling validation passed."
