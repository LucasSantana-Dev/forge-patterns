# Feature Toggle System

## Purpose
Guides editing of the file-based IDP feature-toggle infrastructure (`patterns/idp/feature-toggles/`).

## Key Files
- `patterns/idp/feature-toggles/schema.ts` — `ToggleNamespace`, `FeatureToggle`, types
- `patterns/idp/feature-toggles/store.ts` — `FileToggleStore` class (create/enable/disable/remove/list/reload)
- `patterns/idp/feature-toggles/cli.ts` — `forge-features` CLI
- `patterns/idp/feature-toggles/index.ts` — barrel exports
- `patterns/idp/__tests__/feature-toggles.test.ts` — 27 tests
- `patterns/idp/__tests__/features-cli.test.ts` — 16 tests (dry-run coverage)
- `patterns/feature-toggles/` — reference patterns (Unleash SDK wrappers, advanced patterns)

## Architecture
File-based toggle store: `.forge/features.json` (JSON with version + toggles array).

`FileToggleStore` methods: `create()`, `enable()`, `disable()`, `remove()`, `get()`, `list()`, `isEnabled()`, `reload()`.

`forge-features` CLI commands: `list`, `get`, `create`, `enable`, `disable`, `remove`, `check`.

## Canonical Namespaces (v1.11.2+)
```ts
type ToggleNamespace =
  | 'global'        // cross-project flags
  | 'mcp-gateway'   // gateway-specific
  | 'ui-mcp'        // UI generation server (canonical, replaces 'uiforge-mcp')
  | 'siza'          // web app (canonical, replaces 'uiforge-webapp')
  | 'uiforge-mcp'   // @deprecated → use 'ui-mcp'
  | 'uiforge-webapp'// @deprecated → use 'siza'
```

## Toggle Strategies
- `default` — simple boolean
- `gradual-rollout` — with `parameters: { rollout: 0-100 }`
- `user-ids` — with `parameters: { ids: string[] }`

## Feature Flag Examples
```bash
forge-features create ENABLE_BETA --namespace siza --description "Beta rollout" --enabled
forge-features enable ENABLE_BETA
forge-features list --namespace global
forge-features check ENABLE_BETA
```

## Critical Constraints
- `FeatureToggleStore.version` must always be `1` (version field is literal type `1`)
- `create()` throws if toggle already exists — check with `get()` first
- `enable()/disable()` throw if toggle not found
- Legacy namespaces kept for backwards compat — don't remove them
- `updatedAt` is ISO string set by `new Date().toISOString()`
