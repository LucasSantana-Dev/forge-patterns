#!/usr/bin/env bash
# Forge Space Ecosystem Health Check
# Usage: ./scripts/ecosystem-health.sh [--prs] [--branches] [--versions] [--all]
# Default: runs all checks

set -euo pipefail

REPOS=(
	"Forge-Space/core"
	"Forge-Space/siza-gen"
	"Forge-Space/ui-mcp"
	"Forge-Space/mcp-gateway"
	"Forge-Space/branding-mcp"
	"Forge-Space/siza"
	"Forge-Space/forge-ai-init"
	"Forge-Space/forgespace-web"
)

CHECK_PRS=false
CHECK_BRANCHES=false
CHECK_VERSIONS=false

if [[ $# -eq 0 ]]; then
	CHECK_PRS=true
	CHECK_BRANCHES=true
	CHECK_VERSIONS=true
else
	for arg in "$@"; do
		case "$arg" in
		--prs) CHECK_PRS=true ;;
		--branches) CHECK_BRANCHES=true ;;
		--versions) CHECK_VERSIONS=true ;;
		--all)
			CHECK_PRS=true
			CHECK_BRANCHES=true
			CHECK_VERSIONS=true
			;;
		esac
	done
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Forge Space Ecosystem Health — $(date -u '+%Y-%m-%d %H:%M UTC')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if $CHECK_VERSIONS; then
	echo ""
	echo "## Versions"
	for repo in "${REPOS[@]}"; do
		short="${repo#Forge-Space/}"
		ver=$(gh release view --repo "$repo" --json tagName 2>/dev/null |
			python3 -c "import json,sys; print(json.load(sys.stdin)['tagName'])" 2>/dev/null || echo "no release")
		printf "  %-20s %s\n" "$short" "$ver"
	done
fi

if $CHECK_PRS; then
	echo ""
	echo "## Open Pull Requests"
	total_prs=0
	for repo in "${REPOS[@]}"; do
		short="${repo#Forge-Space/}"
		prs=$(gh pr list --repo "$repo" --state open --json number,title,mergeable 2>/dev/null)
		count=$(echo "$prs" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)
		total_prs=$((total_prs + count))
		if [[ "$count" -gt 0 ]]; then
			echo "  $short ($count open):"
			echo "$prs" | python3 -c "
import json, sys
prs = json.load(sys.stdin)
for p in prs:
    m = p.get('mergeable','?')
    icon = '✅' if m == 'MERGEABLE' else ('⚠️ ' if m == 'CONFLICTING' else '⏳')
    print(f'    {icon} #{p[\"number\"]} {p[\"title\"][:55]}')
"
		fi
	done
	if [[ "$total_prs" -eq 0 ]]; then
		echo "  ✅ No open PRs across all repos"
	else
		echo ""
		echo "  Total open: $total_prs"
	fi
fi

if $CHECK_BRANCHES; then
	echo ""
	echo "## Stale Remote Branches"
	total_stale=0
	for repo in "${REPOS[@]}"; do
		short="${repo#Forge-Space/}"
		branches=$(gh api "repos/$repo/git/refs/heads" 2>/dev/null |
			python3 -c "
import json, sys
refs = json.load(sys.stdin)
names = [r['ref'].replace('refs/heads/', '') for r in refs if r['ref'] != 'refs/heads/main']
print(len(names))
for n in names: print(n)
" 2>/dev/null || echo "0")
		count=$(echo "$branches" | head -1)
		if [[ "$count" -gt 0 ]]; then
			total_stale=$((total_stale + count))
			echo "  $short ($count branches):"
			echo "$branches" | tail -n +2 | while read -r branch; do
				# Check if branch has an open PR
				pr=$(gh pr list --repo "$repo" --head "$branch" --state open --json number 2>/dev/null |
					python3 -c "import json,sys; prs=json.load(sys.stdin); print(f'PR#{prs[0][\"number\"]}') if prs else print('')" 2>/dev/null)
				if [[ -n "$pr" ]]; then
					echo "    🔀 $branch ($pr)"
				else
					echo "    🕸️  $branch (no open PR)"
				fi
			done
		fi
	done
	if [[ "$total_stale" -eq 0 ]]; then
		echo "  ✅ All repos have only main branch"
	fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
