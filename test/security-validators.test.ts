import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');
const fixtures: string[] = [];

type ScriptResult = {
  ok: boolean;
  output: string;
};

function createFixture(files: Record<string, string>): string {
  const fixtureDir = mkdtempSync(path.join(tmpdir(), 'core-security-'));
  const scriptsSource = path.join(repoRoot, 'scripts', 'security');
  const scriptsTarget = path.join(fixtureDir, 'scripts', 'security');
  cpSync(scriptsSource, scriptsTarget, { recursive: true });

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(fixtureDir, relativePath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  fixtures.push(fixtureDir);
  return fixtureDir;
}

function runScript(
  scriptName: 'validate-no-secrets.sh' | 'validate-tenant-decoupling.sh',
  cwd: string,
  extraEnv: Record<string, string> = {}
): ScriptResult {
  try {
    const output = execFileSync('bash', [`scripts/security/${scriptName}`], {
      cwd,
      env: { ...process.env, ...extraEnv },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { ok: true, output };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    return {
      ok: false,
      output: `${err.stdout ?? ''}${err.stderr ?? ''}`
    };
  }
}

afterEach(() => {
  for (const fixtureDir of fixtures) {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
  fixtures.length = 0;
});

describe('security validators', () => {
  it('does not flag "required keys are" as a secret', () => {
    const fixtureDir = createFixture({
      'src/tenant/contract.ts':
        "export const message = 'Invalid tenant profile: required keys are';\n"
    });

    const result = runScript('validate-no-secrets.sh', fixtureDir);
    expect(result.ok).toBe(true);
  });

  it('flags hardcoded API key assignments', () => {
    const fixtureDir = createFixture({
      'src/config.ts': 'export const API_KEY = "sk_live_12345678901234567890";\n'
    });

    const result = runScript('validate-no-secrets.sh', fixtureDir);
    expect(result.ok).toBe(false);
    expect(result.output).toContain('Found potential secret');
  });

  it('falls back to grep when rg is unavailable in PATH', () => {
    const fixtureDir = createFixture({
      'src/config.ts': 'export const owner = "vsantana-organization";\n'
    });

    const result = runScript('validate-tenant-decoupling.sh', fixtureDir, {
      PATH: '/usr/bin:/bin'
    });
    expect(result.ok).toBe(false);
    expect(result.output).toContain('Running tenant-decoupling validation with: grep');
    expect(result.output).toContain('BLOCKED token found: vsantana-organization');
  });
});
