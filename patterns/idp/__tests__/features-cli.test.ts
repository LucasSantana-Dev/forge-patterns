import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CLI_PATH = resolve(
  __dirname, '../../../dist/patterns/idp/feature-toggles/cli.js'
);
const TEST_DIR = join(process.cwd(), '.test-features-cli');
const STORE_PATH = join(TEST_DIR, 'features.json');

function runCli(args: string[]): string {
  return execFileSync(process.execPath, [CLI_PATH, '--store', STORE_PATH, ...args], {
    encoding: 'utf-8',
    timeout: 15_000,
  });
}

beforeEach(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
});

describe('forge-features CLI --dry-run', () => {
  it('create --dry-run shows intent without creating', () => {
    const out = runCli(['create', 'MY_FLAG', '--namespace', 'global', '--dry-run']);
    expect(out).toContain('[dry-run]');
    expect(out).toContain('Would create');
    expect(out).toContain('MY_FLAG');

    expect(() => runCli(['get', 'MY_FLAG'])).toThrow();
  });

  it('enable --dry-run shows intent without enabling', () => {
    runCli(['create', 'TEST_FLAG', '--namespace', 'global']);
    const out = runCli(['enable', 'TEST_FLAG', '--dry-run']);
    expect(out).toContain('[dry-run]');
    expect(out).toContain('Would enable');

    const check = runCli(['get', 'TEST_FLAG', '--json']);
    const parsed = JSON.parse(check);
    expect(parsed.enabled).toBe(false);
  });

  it('disable --dry-run shows intent without disabling', () => {
    runCli(['create', 'TEST_FLAG', '--namespace', 'global', '--enabled']);
    const out = runCli(['disable', 'TEST_FLAG', '--dry-run']);
    expect(out).toContain('[dry-run]');
    expect(out).toContain('Would disable');

    const check = runCli(['get', 'TEST_FLAG', '--json']);
    const parsed = JSON.parse(check);
    expect(parsed.enabled).toBe(true);
  });

  it('remove --dry-run shows intent without removing', () => {
    runCli(['create', 'TEST_FLAG', '--namespace', 'global']);
    const out = runCli(['remove', 'TEST_FLAG', '--dry-run']);
    expect(out).toContain('[dry-run]');
    expect(out).toContain('Would remove');

    const get = runCli(['get', 'TEST_FLAG', '--json']);
    expect(JSON.parse(get)).toHaveProperty('name', 'TEST_FLAG');
  });

  it('exits 0 on dry-run success', () => {
    expect(() => {
      runCli(['create', 'DRY_FLAG', '--namespace', 'mcp-gateway', '--dry-run']);
    }).not.toThrow();
  });
});
