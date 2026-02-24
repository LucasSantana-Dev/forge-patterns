# Feature Toggle System

## Purpose
Guides editing of the Unleash-based cross-project feature toggle infrastructure.

## Key Files
- `patterns/feature-toggles/README.md` — full documentation and SDK examples
- `patterns/feature-toggles/libraries/nodejs/index.js` — Node.js `UIForgeFeatureToggles` class
- `patterns/feature-toggles/libraries/advanced/index.js` — advanced toggle patterns
- `patterns/feature-toggles/config/centralized-config.yml` — centralized toggle config

## Architecture
Self-hosted Unleash instance (zero licensing cost) providing unified feature management across all Forge projects.

`forge-features` CLI for centralized management:
- `forge-features enable global.debug-mode`
- `forge-features enable mcp-gateway.rate-limiting`
- `forge-features status --project=mcp-gateway`

Feature namespaces:
- `global.*` — cross-project (debug-mode, beta-features, experimental-ui, enhanced-logging)
- `mcp-gateway.*` — rate-limiting, request-validation, security-headers
- `uiforge-mcp.*` — ai-chat, template-management, ui-generation
- `uiforge-webapp.*` — dark-mode, advanced-analytics, experimental-components

Toggle strategies: boolean, multivariate, gradual rollout, A/B testing, kill switches.
SDK implementations: Node.js, Python, React (`FeatureToggleProvider` + hooks).

Unleash runs via Docker Compose on port 4242 with PostgreSQL.

## Critical Constraints
- Zero-cost deployment requirement
- Feature changes propagate via `forge-features` CLI (not direct API)
- Kill switch pattern: `{feature}-killed` flag for emergency disable
