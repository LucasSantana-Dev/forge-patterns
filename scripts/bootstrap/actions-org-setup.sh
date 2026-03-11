#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat << USAGE
Usage: $0 --org <org> --actions-cap-minutes <minutes> [options]

Options:
  --warn-pct <1-99>         Warning threshold percentage (default: 70)
  --degrade-pct <1-100>     Degrade threshold percentage (default: 85)
  --repo <owner/repo>       Target repo variable scope (repeatable)
  --dry-run                 Print actions without writing variables
  -h, --help                Show this help
USAGE
}

is_positive_integer() {
  [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -gt 0 ]
}

is_percentage() {
  [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -ge 1 ] && [ "$1" -le 100 ]
}

require_commands() {
  local missing=()
  for cmd in gh jq; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      missing+=("$cmd")
    fi
  done

  if [ ${#missing[@]} -gt 0 ]; then
    echo "❌ Missing required commands: ${missing[*]}"
    exit 1
  fi
}

ORG=""
ACTIONS_CAP_MINUTES=""
WARN_PCT="70"
DEGRADE_PCT="85"
DRY_RUN="false"
declare -a REPOS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --org)
      ORG="${2:-}"
      shift 2
      ;;
    --actions-cap-minutes)
      ACTIONS_CAP_MINUTES="${2:-}"
      shift 2
      ;;
    --warn-pct)
      WARN_PCT="${2:-}"
      shift 2
      ;;
    --degrade-pct)
      DEGRADE_PCT="${2:-}"
      shift 2
      ;;
    --repo)
      REPOS+=("${2:-}")
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [ -z "$ORG" ]; then
  echo "❌ --org is required"
  usage
  exit 1
fi

if ! is_positive_integer "$ACTIONS_CAP_MINUTES"; then
  echo "❌ --actions-cap-minutes must be a positive integer"
  exit 1
fi

if ! is_percentage "$WARN_PCT" || ! is_percentage "$DEGRADE_PCT"; then
  echo "❌ --warn-pct and --degrade-pct must be between 1 and 100"
  exit 1
fi

if [ "$WARN_PCT" -ge "$DEGRADE_PCT" ]; then
  echo "❌ --warn-pct must be lower than --degrade-pct"
  exit 1
fi

if [ ${#REPOS[@]} -eq 0 ]; then
  REPOS+=("${ORG}/.github")
fi

require_commands

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

echo "🔎 Validating Actions settings for org: $ORG"

if ! gh api "orgs/${ORG}/actions/permissions" >/dev/null 2>&1; then
  echo "❌ Failed to read org Actions permissions for ${ORG}"
  exit 1
fi

echo "✅ Org Actions permissions endpoint is reachable"

if gh api "repos/${ORG}/.github/actions/permissions" >/dev/null 2>&1; then
  echo "✅ ${ORG}/.github Actions permissions are reachable"
else
  echo "⚠️ Could not read ${ORG}/.github Actions permissions"
fi

if access_json=$(gh api "repos/${ORG}/.github/actions/permissions/access" 2>/dev/null); then
  access_level=$(jq -r '.access_level // "unknown"' <<< "$access_json")
  echo "ℹ️ Reusable workflow access for ${ORG}/.github: ${access_level}"
else
  echo "⚠️ Could not read reusable workflow access for ${ORG}/.github"
fi

if usage_json=$(gh api "orgs/${ORG}/settings/billing/usage" 2>/dev/null); then
  month=$(date -u +%Y-%m)
  used_minutes=$(jq -r --arg month "$month" '
    [
      (.usageItems // [])[]
      | select(.product == "actions")
      | select(.unitType == "Minutes")
      | select((.date // "") | startswith($month))
      | (.quantity // 0)
    ] | add // 0
  ' <<< "$usage_json")
  echo "ℹ️ Current month Actions minutes (UTC): $used_minutes"
else
  echo "⚠️ Failed to query billing usage endpoint (continuing)."
fi

upsert_org_var() {
  local name="$1"
  local value="$2"
  if [ "$DRY_RUN" = "true" ]; then
    echo "[dry-run] org var ${name}=${value}"
    return
  fi

  if gh api "orgs/${ORG}/actions/variables/${name}" >/dev/null 2>&1; then
    gh api --method PATCH "orgs/${ORG}/actions/variables/${name}" \
      -f name="$name" -f value="$value" >/dev/null
  else
    gh api --method POST "orgs/${ORG}/actions/variables" \
      -f name="$name" -f value="$value" >/dev/null
  fi
}

upsert_repo_var() {
  local repo="$1"
  local name="$2"
  local value="$3"
  if [ "$DRY_RUN" = "true" ]; then
    echo "[dry-run] repo var ${repo} ${name}=${value}"
    return
  fi

  if gh api "repos/${repo}/actions/variables/${name}" >/dev/null 2>&1; then
    gh api --method PATCH "repos/${repo}/actions/variables/${name}" \
      -f name="$name" -f value="$value" >/dev/null
  else
    gh api --method POST "repos/${repo}/actions/variables" \
      -f name="$name" -f value="$value" >/dev/null
  fi
}

echo "🛠️ Writing Actions budget variables"

upsert_org_var "ACTIONS_MONTHLY_CAP_MINUTES" "$ACTIONS_CAP_MINUTES"
upsert_org_var "ACTIONS_WARN_PCT" "$WARN_PCT"
upsert_org_var "ACTIONS_DEGRADE_PCT" "$DEGRADE_PCT"

for repo in "${REPOS[@]}"; do
  if [[ ! "$repo" =~ ^[^/]+/[^/]+$ ]]; then
    echo "⚠️ Skipping invalid repo slug: $repo"
    continue
  fi

  if gh api "repos/${repo}" >/dev/null 2>&1 || [ "$DRY_RUN" = "true" ]; then
    upsert_repo_var "$repo" "ACTIONS_MONTHLY_CAP_MINUTES" "$ACTIONS_CAP_MINUTES"
    upsert_repo_var "$repo" "ACTIONS_WARN_PCT" "$WARN_PCT"
    upsert_repo_var "$repo" "ACTIONS_DEGRADE_PCT" "$DEGRADE_PCT"
  else
    echo "⚠️ Skipping unavailable repo: $repo"
  fi
done

echo "✅ Actions limit-aware setup complete for ${ORG}."
if [ "$DRY_RUN" = "true" ]; then
  echo "ℹ️ Dry-run mode: no variables were changed."
fi
