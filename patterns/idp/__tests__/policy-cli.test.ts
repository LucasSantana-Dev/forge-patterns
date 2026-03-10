import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const CLI_PATH = resolve(
  __dirname, '../../../dist/patterns/idp/policy-engine/cli.js'
);
const POLICY_DIR = resolve(__dirname, '../policies');
const PROJECT_DIR = resolve(__dirname, '../../../');
const MISSING_POLICY_DIR = resolve(PROJECT_DIR, '.nonexistent-policy-dir-for-tests');

function runCli(args: string[]): string {
  return execFileSync(process.execPath, [CLI_PATH, ...args], {
    cwd: PROJECT_DIR,
    encoding: 'utf-8',
    timeout: 15_000,
  });
}

describe('forge-policy CLI', () => {
  it('loads and evaluates all policy packs', () => {
    const out = runCli(['--policy-dir', POLICY_DIR]);
    expect(out).toContain('Policy Evaluation');
    expect(out).toContain('policies loaded');
  });

  it('reports pass with empty context (no matching conditions)', () => {
    const out = runCli(['--policy-dir', POLICY_DIR]);
    expect(out).toContain('All policies passed');
  });

  it('exits 0 without --fail-on-block even if violations exist', () => {
    expect(() => {
      runCli(['--policy-dir', POLICY_DIR]);
    }).not.toThrow();
  });

  it('exits 1 for non-existent policy dir', () => {
    expect(() => {
      runCli(['--policy-dir', MISSING_POLICY_DIR]);
    }).toThrow();
  });

  it('handles --fail-on-block with no violations', () => {
    expect(() => {
      runCli(['--policy-dir', POLICY_DIR, '--fail-on-block']);
    }).not.toThrow();
  });
});
