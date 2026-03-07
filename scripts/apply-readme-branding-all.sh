#!/usr/bin/env bash
# Run apply-readme-branding.sh for all Forge Space projects (from forge-serena.yml).
# Usage: run from forge-space monorepo root:
#   ./core/scripts/apply-readme-branding-all.sh [--dry-run]
# Or from core/: ./scripts/apply-readme-branding-all.sh [--dry-run]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CORE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FORGE_ROOT="$(cd "$CORE_DIR/.." && pwd)"
APPLY_SCRIPT="$SCRIPT_DIR/apply-readme-branding.sh"

PROJECTS=(brand-guide branding-mcp core mcp-gateway siza siza-gen siza-mcp ui-mcp)

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

if [[ ! -x "$APPLY_SCRIPT" ]]; then
  echo "Missing or not executable: $APPLY_SCRIPT" >&2
  exit 1
fi

echo "Forge Space root: $FORGE_ROOT"
echo "Projects: ${PROJECTS[*]}"
$DRY_RUN && echo "(dry run — no changes)"
echo ""

for name in "${PROJECTS[@]}"; do
  repo="$FORGE_ROOT/$name"
  if [[ ! -d "$repo" ]]; then
    echo "⏭ $name — skip (not found)"
    continue
  fi
  if $DRY_RUN; then
    if grep -q "brand.forgespace.co/logos/wordmark" "${repo}/README.md" 2>/dev/null; then
      echo "✓ $name — already has wordmark"
    else
      echo "▸ $name — would apply header"
    fi
    continue
  fi
  echo "▶ $name"
  "$APPLY_SCRIPT" "$repo" || true
  echo ""
done

echo "Done. To open PRs: run the printed 'gh pr create' one-liner in each repo that was updated."
