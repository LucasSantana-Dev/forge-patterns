# Organization Setup Guide

This guide configures a new Forge-Space organization to consume reusable workflows
from `Forge-Space/.github` and enable limit-aware CI defaults for newly
bootstrapped projects.

## Scope

- Canonical reusable workflow source: `Forge-Space/.github`
- New organization and new project onboarding only
- Hosted runner guardrails (no self-hosted runner rollout in this phase)

## Prerequisites

- Organization owner or admin access
- `gh` CLI authenticated with admin scope
- `jq` installed

## 1. Configure Reusable Workflow Source

Open the workflow source repository:

- [https://github.com/Forge-Space/.github/settings/actions](https://github.com/Forge-Space/.github/settings/actions)

Set:

- Actions permissions: allow GitHub Actions for the repository
- Reusable workflow access: accessible from repositories in the organization

Verify from CLI:

```bash
gh api repos/Forge-Space/.github/actions/permissions
gh api repos/Forge-Space/.github/actions/permissions/access
```

## 2. Configure Actions Budget Variables

Use the helper script in this repository:

```bash
./scripts/bootstrap/actions-org-setup.sh \
  --org Forge-Space \
  --actions-cap-minutes 20000 \
  --warn-pct 70 \
  --degrade-pct 85
```

What this does:

- validates org Actions permissions endpoints
- checks reusable-workflow accessibility on `ORG/.github`
- queries billing usage endpoint (`/orgs/{org}/settings/billing/usage`)
- upserts org and repo variables:
  - `ACTIONS_MONTHLY_CAP_MINUTES`
  - `ACTIONS_WARN_PCT`
  - `ACTIONS_DEGRADE_PCT`

Dry-run example:

```bash
./scripts/bootstrap/actions-org-setup.sh \
  --org Forge-Space \
  --actions-cap-minutes 20000 \
  --dry-run
```

## 3. Bootstrap New Projects With Limit-Aware CI

Default profile is `limit-aware` and requires budget inputs:

```bash
./scripts/bootstrap/project.sh my-service node \
  --org Forge-Space \
  --actions-cap-minutes 20000
```

The generated workflows include:

- concurrency controls
- docs/meta `paths-ignore`
- baseline required jobs (lint, typecheck, unit tests, build, secret scan)
- conditional heavy jobs (Docker, E2E, Semgrep, Trivy, CodeQL on PR)
- nightly security workflow that always runs heavy scans

## 4. Validate Setup

From a generated project:

```bash
bash -n .github/workflows/ci.yml
bash -n .github/workflows/security-nightly.yml
```

Run a PR and confirm:

- baseline jobs run every time
- heavy jobs skip when `degrade_mode=true`
- workflow summary includes budget mode status

## Related Guide

- [Actions Limits Strategy](./actions-limits-strategy.md)
