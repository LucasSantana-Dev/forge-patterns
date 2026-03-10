import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { type TemplateName, getTemplate } from './templates.js';

const SCORECARD_CONFIG = {
  threshold: 60,
  collectors: ['security', 'quality', 'performance', 'compliance'],
  output: 'summary'
};

const FEATURES_SEED = {
  toggles: [],
  version: '1.0.0'
};

function scorecardWorkflow(): string {
  return `name: Scorecard

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
        continue-on-error: true
        run: |
          OUTPUT=$(npx forge-scorecard --project-dir . --threshold 60 --output summary 2>&1) || true
          echo "result<<EOF" >> "$GITHUB_OUTPUT"
          echo "$OUTPUT" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          npx forge-scorecard --project-dir . --threshold 60 --output json > /dev/null 2>&1
          echo "exit_code=$?" >> "$GITHUB_OUTPUT"

      - name: Comment on PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const body = \`## Project Scorecard\\n\\n\\\`\\\`\\\`\\n\${process.env.SCORECARD_RESULT}\\n\\\`\\\`\\\`\`;
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const existing = comments.find(c =>
              c.body?.includes('## Project Scorecard')
            );
            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body,
              });
            }
        env:
          SCORECARD_RESULT: \${{ steps.scorecard.outputs.result }}
`;
}

function policyWorkflow(): string {
  return `name: Policy Check

on:
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  policy-check:
    name: Policy Evaluation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Run policy check
        continue-on-error: true
        run: |
          npx forge-policy \\
            --policy-dir .forge/policies \\
            --fail-on-block
`;
}

export interface InitResult {
  created: string[];
  skipped: string[];
}

function loadBundledPolicy(name: string): string {
  const policyPath = resolve(__dirname, '..', 'policies', `${name}.policy.json`);
  if (existsSync(policyPath)) {
    return readFileSync(policyPath, 'utf-8');
  }
  return JSON.stringify(
    {
      id: `forge-${name}`,
      name: `Forge ${name.charAt(0).toUpperCase() + name.slice(1)} Policy`,
      version: '1.0.0',
      description: `Default ${name} policy`,
      rules: []
    },
    null,
    2
  );
}

function writeIfNeeded(
  filePath: string,
  content: string,
  force: boolean,
  dryRun: boolean,
  result: InitResult
): void {
  if (existsSync(filePath) && !force) {
    result.skipped.push(filePath);
    return;
  }
  if (dryRun) {
    result.created.push(filePath);
    return;
  }
  const dir = filePath.substring(0, filePath.lastIndexOf('/'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  result.created.push(filePath);
}

export function initProject(
  targetDir: string,
  options: {
    force?: boolean;
    dryRun?: boolean;
    template?: TemplateName;
  } = {}
): InitResult {
  const force = options.force ?? false;
  const dryRun = options.dryRun ?? false;
  const result: InitResult = { created: [], skipped: [] };

  const forgeDir = join(targetDir, '.forge');
  const policiesDir = join(forgeDir, 'policies');
  const workflowsDir = join(targetDir, '.github', 'workflows');

  for (const name of ['security', 'quality', 'compliance']) {
    const content = loadBundledPolicy(name);
    writeIfNeeded(join(policiesDir, `${name}.policy.json`), content, force, dryRun, result);
  }

  const scorecardConfig = options.template
    ? {
        ...SCORECARD_CONFIG,
        weights: getTemplate(options.template).scorecardWeights
      }
    : SCORECARD_CONFIG;

  writeIfNeeded(
    join(forgeDir, 'scorecard.json'),
    JSON.stringify(scorecardConfig, null, 2) + '\n',
    force,
    dryRun,
    result
  );

  writeIfNeeded(
    join(forgeDir, 'features.json'),
    JSON.stringify(FEATURES_SEED, null, 2) + '\n',
    force,
    dryRun,
    result
  );

  writeIfNeeded(join(workflowsDir, 'scorecard.yml'), scorecardWorkflow(), force, dryRun, result);

  writeIfNeeded(join(workflowsDir, 'policy-check.yml'), policyWorkflow(), force, dryRun, result);

  if (options.template) {
    const tmpl = getTemplate(options.template);
    for (const [name, rules] of Object.entries(tmpl.policies)) {
      const policy = {
        id: `forge-${name}`,
        name: `Forge ${name.charAt(0).toUpperCase() + name.slice(1)} Policy`,
        version: '1.0.0',
        description: `Framework-specific ${name} governance rules`,
        rules
      };
      writeIfNeeded(
        join(policiesDir, `${name}.policy.json`),
        JSON.stringify(policy, null, 2) + '\n',
        force,
        dryRun,
        result
      );
    }
  }

  return result;
}
