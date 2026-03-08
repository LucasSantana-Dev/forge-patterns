import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const CLI_PATH = resolve(
  __dirname,
  '../../../dist/patterns/idp/migration/cli.js',
);

function makeTmpDir(): string {
  const dir = join(tmpdir(), `forge-cli-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe('forge-audit CLI', () => {
  it('prints help', () => {
    const output = execSync(`node ${CLI_PATH} --help`, {
      encoding: 'utf-8',
    });
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

    const output = execSync(
      `node ${CLI_PATH} --dir ${dir}`,
      { encoding: 'utf-8' },
    );
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

    const output = execSync(
      `node ${CLI_PATH} --dir ${dir} --json`,
      { encoding: 'utf-8' },
    );
    const report = JSON.parse(output);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.categories).toHaveLength(6);
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
      execSync(
        `node ${CLI_PATH} --dir ${dir} --threshold 999`,
        { encoding: 'utf-8' },
      ),
    ).toThrow();

    rmSync(dir, { recursive: true, force: true });
  });

  it('exits 1 for non-existent directory', () => {
    expect(() =>
      execSync(
        `node ${CLI_PATH} --dir /nonexistent/path`,
        { encoding: 'utf-8' },
      ),
    ).toThrow();
  });
});
