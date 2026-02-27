# Forge Patterns (@forgespace/core)

## Project

- Shared configuration, architectural patterns, and MCP context server
- Published to npm as `@forgespace/core`
- GitHub: Forge-Space/core, default branch: `main`
- Local clone path: `~/Desenvolvimento/forge-space/core/`

## Architecture

```
src/
├── index.ts              (public API barrel)
├── cli.ts                (forge-patterns CLI)
├── mcp-context-server/   (MCP server for pattern serving)
├── ide-extensions/        (VSCode extension)
└── security/             (path traversal, symlink protection)
patterns/
├── cost/                 (cost management patterns)
├── security/             (security patterns)
└── ...
scripts/
├── release-core.sh       (release automation)
├── integrate.js          (cross-project integration)
└── security/             (secret scanning scripts)
```

## Stack

- TypeScript, Node 22, Jest, tsc (not tsup)
- Husky pre-commit hooks

## Build/Test

```bash
npm run build           # tsc compilation
npm test                # Jest unit tests
npm run test:coverage   # Jest with coverage
npm run test:validation # Plugin, feature toggle, shared constants validation
npm run validate        # lint + format + validation tests
```

## Conventions

- Functions <50 lines, complexity <10, line width <100
- Conventional commits: feat, fix, refactor, chore, docs
- 100% test coverage target
- Security-first: path traversal protection, symlink skipping

## Gotchas

- Local clone is `core/` not `forge-patterns/`
- `npm run build` uses `tsc` directly (not tsup)
- VSCode extension tests use separate jest.config.json with vscode mock
- IDE extension tests excluded from root jest config
