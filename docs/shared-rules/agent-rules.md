---
trigger: always_on
description: Core agent conduct; always enforced across all Forge Space projects
globs: []
---

# Agent Rules

**When to apply:** Always active — core agent conduct across all Forge Space
ecosystem projects.

## Core Principles (Universal)

1. **Be a code partner, not a follower.** Provide opinions and insights,
   especially when requests don't make sense or there's a better way.
2. **Don't overdo changes.** If the request is specific, stay within scope; ask
   for context before changing unrelated parts.
3. **Documentation-first:** Consult official docs before assuming API behavior.
   Include a brief quote/link when relevant.
4. **Explain assumptions** in the chat when guessing.
5. **Ask only when necessary:** Prefer best-effort implementation with clear
   notes.
6. **Choose the simplest effective solution.** The common best solution is not
   always best — be analytical about context, scope, and project size.
7. **Prefer existing patterns** in the codebase over introducing new ones.
8. **No AI attribution in commits or PRs (mandatory):** Never add
   "Co-authored-by: Cursor", "Co-authored-by: Windsurf", or any Co-authored-by
   line referencing any AI/assistant in commit messages, PR descriptions, or
   diffs.

## Development Practices

### Code Quality

9. **Generate tests for functional changes** (unit/integration as needed).
10. **Run local checks:** lint, build, test; include a brief CI-like summary.
11. **Security checks:** Run vulnerability scan and propose remediation for
    high/critical issues.

### Git Workflow

12. **No direct main pushes:** Always use branches/PRs.
13. **Commit conventions:** Follow Angular rules; squash coherent changes.
14. **PR templates & checklist:** Fill required items automatically.

### Documentation

15. **Documentation updates:** ALWAYS update CHANGELOG.md and README.md as
    changes are made.

## Project-Specific Adaptations

### Testing Frameworks

- **Python projects (mcp-gateway):** Use pytest for unit/integration tests
- **JavaScript/TypeScript projects (uiforge-webapp, uiforge-mcp):** Use Vitest
  for unit tests, Playwright for E2E
- **Forge Patterns:** Use Jest for shared patterns testing

### Local Operations

- **Python projects:** Use scripts for local operations; if missing, suggest and
  add a script in the PR
- **JavaScript/TypeScript projects:** Use npm scripts and package.json for local
  operations

### Tool Implementation

16. **When implementing a new tool,** follow the exact pattern established by
    existing tools in `src/tools/` (for MCP servers) or equivalent patterns for
    other project types.

## Quality Gates Summary

All projects must ensure:

- ✅ Tests pass for functional changes
- ✅ Local quality checks (lint, build, test) pass
- ✅ Security scans completed for high/critical issues
- ✅ Documentation updated (CHANGELOG.md, README.md)
- ✅ No AI attribution in commits/PRs
- ✅ Proper branching and PR process followed

## References

This is the **canonical source of truth** for agent rules across all Forge Space
projects.

**Project-specific adaptations:**

- [MCP Gateway specific rules](project-specific/mcp-gateway.md)
- [UIForge WebApp specific rules](project-specific/uiforge-webapp.md)
- [UIForge MCP specific rules](project-specific/uiforge-mcp.md)
- [Forge Patterns specific rules](project-specific/forge-patterns.md)

**Related documentation:**

- [Development Workflows](development-workflows/README.md)
- [Quality Standards](quality-standards/README.md)
- [Testing Guidelines](quality-standards/testing.md)
