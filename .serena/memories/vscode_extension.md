# VSCode Extension

## Status
- **Merged**: PR #55 → main (2026-02-25), tags v1.3.0 + v1.3.1 (security hardening patch)
- **Version**: 0.1.0 (never published to Marketplace)
- **Tests**: 38 passing, 3 suites (discovery, scaffolding, validation)
- **Security hardening**: commit 168f0f5 on main (2026-02-25)

## Architecture
- `patterns/ide-extensions/vscode/src/`
- `discovery.ts` — pattern scanning, uses `lstatSync` to skip symlinks
- `scaffolding.ts` — file copy with dry-run, conflict detection, path traversal protection (`assertWithinTarget`)
- `validation.ts` — ESLint/Prettier/TS strict/pkg scripts/secrets scanning, reports malformed JSON, uses `lstatSync`
- `extension.ts` — command registration with `handleError()` try-catch on all commands
- `ui/pattern-picker.ts` — grouped QuickPick with category separators
- `ui/output.ts` — OutputChannel wrapper

## Config
- `forgePatterns.repoPath` — path to local forge-patterns clone (required)
- `forgePatterns.mcpServerUrl` — MCP context server URL (not yet implemented)

## Key Decisions
- No runtime dependencies — uses Node.js `fs` and `vscode` API only
- CommonJS output (tsconfig `module: commonjs`) despite root ESM
- Root jest.config.js excludes `patterns/ide-extensions/` (extension has own Jest config with vscode mock)
- `promptAndScaffold` is VSCode UI interaction — excluded from unit test coverage

## Out of Scope (v0.1.0)
- MCP Context Server integration
- VSCode Marketplace publishing
- Template variable substitution
- Code actions / quick-fixes
- JetBrains plugin
