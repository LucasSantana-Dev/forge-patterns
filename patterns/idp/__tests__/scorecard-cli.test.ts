import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const CLI_PATH = resolve(
  __dirname, '../../../dist/patterns/idp/scorecards/cli.js'
);
const PROJECT_DIR = resolve(__dirname, '../../../');
const MISSING_PROJECT_DIR = resolve(PROJECT_DIR, '.nonexistent-project-dir-for-tests');

function runCli(args: string[]): string {
  return execFileSync(process.execPath, [CLI_PATH, ...args], {
    cwd: PROJECT_DIR,
    encoding: 'utf-8',
    timeout: 15_000,
  });
}

describe('forge-scorecard CLI', () => {
  it('produces summary output', () => {
    const out = runCli(['--project-dir', PROJECT_DIR, '--output', 'summary']);
    expect(out).toContain('Scorecard:');
    expect(out).toContain('/100');
  });

  it('produces JSON output with --output json', () => {
    const out = runCli(['--project-dir', PROJECT_DIR, '--output', 'json']);
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('overallScore');
    expect(parsed).toHaveProperty('categories');
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('grade');
    expect(['A', 'B', 'C', 'D', 'F']).toContain(parsed.grade);
  });

  it('produces JSON output with --json flag', () => {
    const out = runCli(['--project-dir', PROJECT_DIR, '--json']);
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('overallScore');
    expect(parsed).toHaveProperty('grade');
    for (const cat of Object.values(parsed.categories) as Array<Record<string, unknown>>) {
      expect(cat).toHaveProperty('grade');
    }
  });

  it('includes grade in summary output', () => {
    const out = runCli(['--project-dir', PROJECT_DIR]);
    expect(out).toMatch(/Scorecard: \d+\/100 \([A-F]\)/);
  });

  it('exits 0 when score meets threshold', () => {
    expect(() => {
      runCli(['--project-dir', PROJECT_DIR, '--threshold', '0']);
    }).not.toThrow();
  });

  it('exits 1 when score below threshold', () => {
    expect(() => {
      runCli(['--project-dir', PROJECT_DIR, '--threshold', '101']);
    }).toThrow();
  });

  it('exits 1 for non-existent project dir', () => {
    expect(() => {
      runCli(['--project-dir', MISSING_PROJECT_DIR]);
    }).toThrow();
  });
});
