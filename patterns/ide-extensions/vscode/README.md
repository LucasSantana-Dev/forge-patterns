# Forge Patterns — VS Code Extension

Discover, apply, and validate [forge-patterns](https://github.com/Forge-Space/core) within your development environment.

## Features

- **List Patterns** — Browse available forge-patterns templates from your local clone
- **Apply Pattern** — Scaffold a selected pattern into the current workspace
- **Validate Compliance** — Check the project against forge-patterns standards (ESLint, Prettier, TypeScript strict, package scripts, secret scanning)

## Commands

| Command | Description |
|--------|-------------|
| `Forge Patterns: List Available Patterns` | Show all patterns; optionally apply after selection |
| `Forge Patterns: Apply Pattern` | Pick a pattern and scaffold it into the workspace |
| `Forge Patterns: Validate Pattern Compliance` | Run compliance checks and show results in the Problems panel |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `forgePatterns.repoPath` | `""` | Path to your local forge-patterns (core) repository. Required for pattern discovery and apply. |
| `forgePatterns.mcpServerUrl` | `""` | MCP context server URL (reserved for future integration) |

## Usage

1. **Set the patterns repo path**  
   Open Settings → search for `forgePatterns.repoPath` → set it to your local clone (e.g. `~/Desenvolvimento/forge-space/core`).

2. **List or apply patterns**  
   Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → `Forge Patterns: List Available Patterns` or `Forge Patterns: Apply Pattern`.

3. **Validate compliance**  
   Command Palette → `Forge Patterns: Validate Pattern Compliance`. Results appear in the Problems panel with errors and warnings.

## Development

```bash
npm install
npm run compile
```

Press F5 in VS Code to launch the Extension Development Host and test the extension.

```bash
npm test          # Run unit tests
npm run lint      # Lint source
npx vsce package  # Build .vsix for distribution
```

## MCP Integration

This extension is designed to work alongside the UIForge Context MCP Server. Set `forgePatterns.mcpServerUrl` when that integration is available.
