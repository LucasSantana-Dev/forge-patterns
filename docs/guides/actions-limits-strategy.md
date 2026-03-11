# Actions Limits Strategy (v1)

This guide defines the first-pass GitHub Actions limits strategy for new
organizations and newly bootstrapped projects.

## Goals

- Reduce risk of hosted-runner exhaustion
- Keep required CI checks running under budget pressure
- Degrade non-required heavy jobs when usage is high
- Keep full security coverage via nightly scans

## Guard Behavior

Reusable workflow source:

- `Forge-Space/.github/.github/workflows/reusable-actions-budget-guard.yml`

Inputs:

- `org`
- `monthly_cap_minutes`
- `warn_pct` (default `70`)
- `degrade_pct` (default `85`)

Outputs:

- `usage_pct`
- `warn_mode`
- `degrade_mode`
- `summary`

Semantics:

- fail-open on billing API/read failures (`degrade_mode=false`)
- warn mode emits summary signal only
- degrade mode skips heavy non-required jobs on PR CI

## CI Policy Split

Always run (baseline required checks):

- lint
- typecheck
- unit tests
- build
- secret scan

Conditionally skipped when `degrade_mode=true`:

- Docker build
- E2E
- Semgrep
- Trivy
- CodeQL on PR

Always run nightly (schedule + manual dispatch):

- Semgrep
- Trivy
- CodeQL

## New Project Bootstrap

`limit-aware` is the default CI profile.

```bash
./scripts/bootstrap/project.sh my-app node \
  --org Forge-Space \
  --actions-cap-minutes 20000
```

Optional thresholds:

```bash
./scripts/bootstrap/project.sh my-app nextjs \
  --org Forge-Space \
  --actions-cap-minutes 20000 \
  --actions-warn-pct 70 \
  --actions-degrade-pct 85
```

## Organization Setup

Before bootstrapping projects, initialize org/repo variables:

```bash
./scripts/bootstrap/actions-org-setup.sh \
  --org Forge-Space \
  --actions-cap-minutes 20000
```

## Validation Checklist

- reusable guard workflow resolves from `ORG/.github`
- budget summary appears in workflow summary
- degrade mode skips heavy PR jobs only
- required checks remain green-capable under degrade mode
- nightly security workflow runs heavy scans independent of degrade mode
