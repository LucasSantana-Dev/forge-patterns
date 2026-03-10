# Forge Patterns (@forgespace/core)

## Project
- Shared configuration, architectural patterns, and MCP context server
- Published to npm as `@forgespace/core`
- GitHub: Forge-Space/core, default branch: `main`

## Architecture
```
src/
├── index.ts              (public API barrel)
├── cli.ts                (forge-patterns CLI)
├── mcp-context-server/   (MCP server for pattern serving)
├── ide-extensions/       (VSCode extension)
└── security/             (path traversal, symlink protection)
patterns/                 (cost, security patterns)
```

## Stack
- TypeScript, Node 22, Jest, tsc (not tsup)

## Quick Reference
```bash
npm run build           # tsc compilation
npm test                # Jest unit tests
npm run test:coverage   # Jest with coverage
npm run validate        # lint + format + validation tests
```

## Gotchas
- Local clone is `core/` not `forge-patterns/`
- `npm run build` uses `tsc` directly (not tsup)
- VSCode extension tests use separate jest.config.json with vscode mock
