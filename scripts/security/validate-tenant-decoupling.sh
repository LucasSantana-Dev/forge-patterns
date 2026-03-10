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

TOKENS=(
  "vsantana-organization"
  "@vsantana-org"
  "VSANTANA_"
  "LucasSantana-Dev"
  "github.com/LucasSantana-Dev"
  "github.com/lucassantana/"
  "/Users/lucassantana/"
)

SEARCH_PATHS=()
for include_path in "${INCLUDE_PATHS[@]}"; do
  if [[ -e "$include_path" ]]; then
    SEARCH_PATHS+=("$include_path")
  fi
done

if [[ "${#SEARCH_PATHS[@]}" -eq 0 ]]; then
  echo "No paths to validate."
  exit 0
fi

FAIL=0
SEARCH_MODE="grep"

if command -v rg >/dev/null 2>&1; then
  SEARCH_MODE="rg"
fi

search_matches() {
  local token="$1"
  if [[ "$SEARCH_MODE" == "rg" ]]; then
    rg -n --no-heading -F \
      --glob '!docs/**' \
      --glob '!**/node_modules/**' \
      --glob '!**/dist/**' \
      --glob '!**/coverage/**' \
      --glob '!**/*.lock' \
      --glob '!CHANGELOG.md' \
      --glob '!scripts/security/validate-tenant-decoupling.sh' \
      "$token" "${SEARCH_PATHS[@]}" || true
    return 0
  fi

  grep -R -n -F \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=coverage \
    --exclude='*.lock' \
    --exclude='CHANGELOG.md' \
    --exclude='validate-tenant-decoupling.sh' \
    --exclude='*.min.js' \
    "$token" "${SEARCH_PATHS[@]}" 2>/dev/null || true
}

echo "Running tenant-decoupling validation with: ${SEARCH_MODE}"

for token in "${TOKENS[@]}"; do
  MATCHES="$(search_matches "$token")"
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
