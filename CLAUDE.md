# forge-patterns

## Purpose
Shared patterns, templates and context server for the Forge ecosystem.

## Key Commands
- Build: `npm run build`
- Test: `npm test`

## Workflow
- Branch: Feature → Release PR → Main PR → Automated deploy
- Never push directly to main
- Conventional commits: feat, fix, refactor, chore, docs
- Always update CHANGELOG.md and README.md

## Testing
- Coverage: >80% (no false positives)
- Test business logic only

## Cross-repo
- This is a shared dependency - changes impact ALL Forge projects
- Always coordinate releases with mcp-gateway, uiforge-mcp, uiforge-webapp
- mcp-context-server lives here - rebuild dist/ after changes

Then commit and push: git add CLAUDE.md && git commit -m "docs: add CLAUDE.md for Claude Code instructions" && git push
