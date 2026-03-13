import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const CLI_PATH = resolve(
  __dirname,
  '../../../dist/patterns/idp/migration/cli.js',
);

function makeTmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'forge-cli-'));
}

function runCli(args: string[]): string {
  return execFileSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf-8',
  });
}

describe('forge-audit CLI', () => {
  it('prints help', () => {
    const output = runCli(['--help']);
    expect(output).toContain('forge-audit');
    expect(output).toContain('--dir');
    expect(output).toContain('--json');
  });

  it('runs assessment on a directory', () => {
    const dir = makeTmpDir();
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        dependencies: { express: '^4.0.0' },
        devDependencies: { jest: '^29.0.0' },
      }),
    );
    writeFileSync(join(dir, '.gitignore'), '.env\nnode_modules');

    const output = runCli(['--dir', dir]);
    expect(output).toContain('Migration Assessment');
    expect(output).toContain('Readiness');
    expect(output).toContain('Strategy');

    rmSync(dir, { recursive: true, force: true });
  });

  it('outputs JSON with --json', () => {
    const dir = makeTmpDir();
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        dependencies: { express: '^4.0.0' },
        devDependencies: { jest: '^29.0.0' },
      }),
    );

    const output = runCli(['--dir', dir, '--json']);
    const report = JSON.parse(output);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.categories).toHaveLength(6);
    expect(report.categories.map((c: { category: string }) => c.category)).toContain(
      'ai-governance',
    );
    expect(report.strategy).toBeTruthy();
    expect(report.readiness).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('exits 1 when below threshold', () => {
    const dir = makeTmpDir();
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ dependencies: {} }),
    );

    expect(() =>
      runCli(['--dir', dir, '--threshold', '999']),
    ).toThrow();

    rmSync(dir, { recursive: true, force: true });
  });

  it('exits 1 for non-existent directory', () => {
    expect(() =>
      runCli(['--dir', '/nonexistent/path']),
    ).toThrow();
  });
});
