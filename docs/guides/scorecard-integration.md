# Scorecard Integration Guide

Add project quality scorecards to any Forge Space repository.

## Installation

```bash
npm install @forgespace/core
```

## CLI Usage

```bash
# Summary output
npx forge-scorecard --project-dir . --output summary

# JSON output for programmatic use
npx forge-scorecard --project-dir . --output json

# Fail if score below threshold
npx forge-scorecard --project-dir . --threshold 60 --output summary
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--project-dir` | `.` | Project root directory |
| `--output` | `summary` | Output format: `summary` or `json` |
| `--threshold` | `0` | Minimum score (exits 1 if below) |

## Collectors

Four built-in collectors evaluate your project:

| Collector | Weight | What it checks |
|-----------|--------|----------------|
| `security` | 30% | Secret exposure, auth enforcement, injection risk |
| `quality` | 30% | Test coverage, code complexity, lint violations |
| `performance` | 20% | Generation latency, cache hit ratios |
| `compliance` | 20% | Audit logging, data retention, RLS policies |

## CI Workflow

Add this to `.github/workflows/scorecard.yml`:

```yaml
name: Scorecard

on:
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: write

jobs:
  scorecard:
    name: Project Scorecard
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Run scorecard
        id: scorecard
        run: |
          OUTPUT=$(npx forge-scorecard --project-dir . --threshold 60 --output summary 2>&1) || true
          echo "result<<EOF" >> "$GITHUB_OUTPUT"
          echo "$OUTPUT" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
      - name: Comment on PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const body = `## Project Scorecard\n\n\`\`\`\n${process.env.SCORECARD_RESULT}\n\`\`\``;
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const existing = comments.find(c => c.body?.includes('## Project Scorecard'));
            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner, repo: context.repo.repo,
                comment_id: existing.id, body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner, repo: context.repo.repo,
                issue_number: context.issue.number, body,
              });
            }
        env:
          SCORECARD_RESULT: ${{ steps.scorecard.outputs.result }}
```

## Threshold Tuning

- **60**: Minimum viable — catches critical gaps
- **70**: Recommended for production repos
- **80+**: Strict — use for security-sensitive projects

Start at 60 and raise incrementally as your project matures.
