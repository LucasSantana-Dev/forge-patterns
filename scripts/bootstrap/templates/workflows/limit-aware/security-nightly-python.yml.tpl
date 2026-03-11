name: Security Nightly

on:
  schedule:
    - cron: '30 3 * * *'
  workflow_dispatch:

permissions:
  contents: read
  security-events: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

jobs:
  semgrep:
    name: Semgrep Scan
    uses: __ORG__/.github/.github/workflows/reusable-semgrep.yml@main

  trivy:
    name: Trivy Scan
    uses: __ORG__/.github/.github/workflows/reusable-trivy.yml@main
    with:
      severity: HIGH,CRITICAL
      scan-type: fs

  codeql-nightly:
    name: CodeQL Nightly
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: python
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
