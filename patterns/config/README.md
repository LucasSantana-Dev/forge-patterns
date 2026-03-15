# Config Patterns

Central configuration manifest for the Forge Space pattern infrastructure.

## Contents

```
patterns/config/
├── patterns-config.yml    # Infrastructure pattern toggles and feature flag config
└── README.md
```

## patterns-config.yml

Controls which infrastructure patterns are enabled globally and configures the Unleash feature flag provider:

```yaml
infrastructure:
  docker: true
  feature_toggles: true

feature_toggles:
  provider: unleash          # Centralized flag management
  centralized: true
  local_instance: true       # Runs locally via Docker (port 4242)
  database: sqlite
  cross_project: true        # Flags shared across repos
  global_features: true
  project_namespaces:
    mcp-gateway: "mcp-gateway"
    uiforge-mcp: "uiforge-mcp"
    uiforge-webapp: "uiforge-webapp"
```

## Usage

This config is read by the integration scripts when pushing patterns to downstream repos:

```bash
npm run integrate:mcp-gateway   # Uses this config to determine which patterns to push
npm run integrate:uiforge-mcp
npm run integrate:uiforge-webapp
```

See `patterns/feature-toggles/README.md` for the Unleash integration details.
