name: CI

on:
  push:
    branches: [main, dev, 'release/*', 'feature/*', 'feat/*']
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.gitignore'
      - 'LICENSE'
      - '.editorconfig'
  pull_request:
    branches: [main, dev, 'release/*']
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.gitignore'
      - 'LICENSE'
      - '.editorconfig'
  workflow_dispatch:

permissions:
  contents: read
  security-events: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  actions-budget-guard:
    name: Actions Budget Guard
    uses: __ORG__/.github/.github/workflows/reusable-actions-budget-guard.yml@main
    with:
      org: '__ORG__'
      monthly_cap_minutes: ${{ vars.ACTIONS_MONTHLY_CAP_MINUTES || '__ACTIONS_MONTHLY_CAP_MINUTES__' }}
      warn_pct: ${{ vars.ACTIONS_WARN_PCT || '__ACTIONS_WARN_PCT__' }}
      degrade_pct: ${{ vars.ACTIONS_DEGRADE_PCT || '__ACTIONS_DEGRADE_PCT__' }}

  lint:
    name: Lint
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run type-check

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run build

  secret-scan:
    name: Secret Scan
    needs: [actions-budget-guard]
    uses: __ORG__/.github/.github/workflows/reusable-secret-scan.yml@main

  docker-build:
    name: Docker Build
    continue-on-error: true
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    if: needs.actions-budget-guard.outputs.degrade_mode != 'true' && github.actor != 'dependabot[bot]'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: false
          tags: __PROJECT_NAME__:ci

  e2e:
    name: E2E
    continue-on-error: true
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    if: needs.actions-budget-guard.outputs.degrade_mode != 'true' && github.event_name == 'pull_request' && github.actor != 'dependabot[bot]'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - name: Run E2E tests when available
        run: |
          if npm run | grep -q "test:e2e"; then
            npm run test:e2e
          else
            echo "No test:e2e script configured"
          fi

  semgrep:
    name: Semgrep Scan
    continue-on-error: true
    if: needs.actions-budget-guard.outputs.degrade_mode != 'true'
    needs: [actions-budget-guard]
    uses: __ORG__/.github/.github/workflows/reusable-semgrep.yml@main

  trivy:
    name: Trivy Scan
    continue-on-error: true
    if: needs.actions-budget-guard.outputs.degrade_mode != 'true'
    needs: [actions-budget-guard]
    uses: __ORG__/.github/.github/workflows/reusable-trivy.yml@main
    with:
      severity: HIGH,CRITICAL
      scan-type: fs

  codeql-pr:
    name: CodeQL (PR)
    continue-on-error: true
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    if: github.event_name == 'pull_request' && needs.actions-budget-guard.outputs.degrade_mode != 'true'
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3

  budget-summary:
    name: Budget Summary
    runs-on: ubuntu-latest
    needs: [actions-budget-guard]
    if: always()
    steps:
      - run: |
          echo "${{ needs.actions-budget-guard.outputs.summary }}" >> "$GITHUB_STEP_SUMMARY"
          if [ "${{ needs.actions-budget-guard.outputs.warn_mode }}" = "true" ]; then
            echo "Budget guard warning mode is active." >> "$GITHUB_STEP_SUMMARY"
          fi
          if [ "${{ needs.actions-budget-guard.outputs.degrade_mode }}" = "true" ]; then
            echo "Budget guard degrade mode is active; heavy jobs are intentionally skipped." >> "$GITHUB_STEP_SUMMARY"
          fi
