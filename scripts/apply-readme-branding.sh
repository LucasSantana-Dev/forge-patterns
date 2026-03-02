#!/usr/bin/env bash
# Apply Forge Space README header (CDN wordmark) to a repo. Idempotent.
# Usage: apply-readme-branding.sh REPO_DIR [TITLE] [DESCRIPTION]
#   REPO_DIR: path to repo root (default: .)
#   TITLE: h1 text (default: from first # line or package.json name)
#   DESCRIPTION: p text (default: from first paragraph after header)
# See brand-guide/docs/REPOSITORY_BRANDING.md

set -e

REPO_DIR="${1:-.}"
TITLE="${2:-}"
DESCRIPTION="${3:-}"
README="${REPO_DIR}/README.md"
WORDMARK_URL="https://brand.forgespace.co/logos/wordmark.svg"

if [[ ! -f "$README" ]]; then
  echo "No README.md at $README" >&2
  exit 1
fi

if grep -q "brand.forgespace.co/logos/wordmark" "$README"; then
  echo "README already has Forge Space wordmark. Nothing to do."
  exit 0
fi

if [[ -z "$TITLE" ]]; then
  if [[ -f "${REPO_DIR}/package.json" ]]; then
    TITLE=$(node -e "try { const p=require('${REPO_DIR}/package.json'); console.log(p.name ? p.name.replace(/^@[^/]+\//,'').replace(/-/g,' ') : '') } catch(e) { console.log('') }" 2>/dev/null || true)
  fi
  if [[ -z "$TITLE" ]]; then
    TITLE=$(sed -n '1,20p' "$README" | sed -n 's/^# *//p' | head -1)
  fi
  [[ -z "$TITLE" ]] && TITLE="Project"
fi

if [[ -z "$DESCRIPTION" ]]; then
  DESCRIPTION=$(sed -n '1,30p' "$README" | sed -e 's/^#.*//' -e 's/^\[.*//' -e 's/^[[:space:]]*$//' | grep -v '^$' | head -1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | cut -c1-120)
  [[ -z "$DESCRIPTION" ]] && DESCRIPTION="Part of the Forge Space ecosystem."
fi

# Strip existing header block (div center + optional h1 + p) so we don't duplicate
# Heuristic: remove lines until we hit a line that's not part of the header (not <div, </div>, <a, <img, <h1, <p>, empty)
TMP=$(mktemp)
{
  echo '<div align="center">'
  echo '  <a href="https://forgespace.co">'
  echo "    <img src=\"${WORDMARK_URL}\" alt=\"Forge Space\" height=\"48\">"
  echo '  </a>'
  echo "  <h1>${TITLE}</h1>"
  echo "  <p>${DESCRIPTION}</p>"
  echo '</div>'
  echo ''
  # Skip first line of original README (usually "# Title") to avoid duplicate heading
  tail -n +2 "$README"
} > "$TMP"
mv "$TMP" "$README"

echo "Applied Forge Space README header to $README (title: $TITLE)"
echo "To open a PR: cd $REPO_DIR && git checkout -b chore/readme-branding && git add README.md && git commit -m 'chore: add Forge Space README header (CDN wordmark)' && git push -u origin chore/readme-branding && gh pr create --title 'chore: add Forge Space README header' --body 'Add CDN wordmark per brand-guide docs/REPOSITORY_BRANDING.md'"
