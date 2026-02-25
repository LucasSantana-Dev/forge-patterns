# Documentation Governance (Ecosystem-Wide)

## Rule
No task-specific documentation files in repo root or docs/ directories.

## Prohibited Patterns
- `*_COMPLETE.md`, `*_SUMMARY.md`, `STATUS_*.md`, `PHASE*.md`
- `*_REPORT.md`, `*_CHECKLIST.md`, `*_PLAN.md`
- Any file that answers "no" to: "Will this need updating in 6 months?"

## Where Task Info Belongs
- **Commit messages**: What changed and why
- **CHANGELOG.md**: User-facing changes per release
- **PR descriptions**: Context for reviewers
- **Memory files**: Cross-session context for AI assistants

## Allowed Root .md Files
README, CHANGELOG, CONTRIBUTING, CLAUDE, ARCHITECTURE, SECURITY, TRUNK_DEVELOPMENT

## docs/ Purpose
Living operational and architectural guides only — not task completion reports.

## Enforcement
- `.gitignore` guards: `.windsurf/plans/`, `.claude/plans/`
- Clean up `~/.claude/plans/` periodically (ephemeral session artifacts)
- Applied across all 5 Forge Space repos (2026-02-24)
