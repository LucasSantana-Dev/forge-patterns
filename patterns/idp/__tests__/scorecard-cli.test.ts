import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const CLI_PATH = resolve(
  __dirname, '../../../dist/patterns/idp/scorecards/cli.js'
);
const PROJECT_DIR = resolve(__dirname, '../../../');

function runCli(args: string): string {
  return execSync(
    `node "${CLI_PATH}" ${args}`,
    { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15_000 }
  );
}

describe('forge-scorecard CLI', () => {
  it('produces summary output', () => {
    const out = runCli(`--project-dir "${PROJECT_DIR}" --output summary`);
    expect(out).toContain('Scorecard:');
    expect(out).toContain('/100');
  });

  it('produces JSON output', () => {
    const out = runCli(`--project-dir "${PROJECT_DIR}" --output json`);
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('overallScore');
    expect(parsed).toHaveProperty('categories');
    expect(parsed).toHaveProperty('timestamp');
  });

  it('exits 0 when score meets threshold', () => {
    expect(() => {
      runCli(`--project-dir "${PROJECT_DIR}" --threshold 0`);
    }).not.toThrow();
  });

  it('exits 1 when score below threshold', () => {
    expect(() => {
      runCli(`--project-dir "${PROJECT_DIR}" --threshold 101`);
    }).toThrow();
  });

  it('exits 1 for non-existent project dir', () => {
    expect(() => {
      runCli('--project-dir /tmp/nonexistent-forge-dir');
    }).toThrow();
  });
});
