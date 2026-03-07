import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { initProject } from '../init/cli.js';

function makeTmpDir(): string {
  const dir = join(tmpdir(), `forge-init-test-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe('forge-init', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTmpDir();
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds all governance files', () => {
    const result = initProject(tmpDir);

    expect(result.created).toHaveLength(7);
    expect(result.skipped).toHaveLength(0);

    expect(existsSync(join(tmpDir, '.forge/policies/security.policy.json'))).toBe(true);
    expect(existsSync(join(tmpDir, '.forge/policies/quality.policy.json'))).toBe(true);
    expect(existsSync(join(tmpDir, '.forge/policies/compliance.policy.json'))).toBe(true);
    expect(existsSync(join(tmpDir, '.forge/scorecard.json'))).toBe(true);
    expect(existsSync(join(tmpDir, '.forge/features.json'))).toBe(true);
    expect(existsSync(join(tmpDir, '.github/workflows/scorecard.yml'))).toBe(true);
    expect(existsSync(join(tmpDir, '.github/workflows/policy-check.yml'))).toBe(true);
  });

  it('creates valid JSON config files', () => {
    initProject(tmpDir);

    const scorecard = JSON.parse(
      readFileSync(join(tmpDir, '.forge/scorecard.json'), 'utf-8')
    );
    expect(scorecard.threshold).toBe(60);
    expect(scorecard.collectors).toContain('security');

    const features = JSON.parse(
      readFileSync(join(tmpDir, '.forge/features.json'), 'utf-8')
    );
    expect(features.toggles).toEqual([]);
    expect(features.version).toBe('1.0.0');
  });

  it('creates valid policy files with rules', () => {
    initProject(tmpDir);

    const security = JSON.parse(
      readFileSync(
        join(tmpDir, '.forge/policies/security.policy.json'),
        'utf-8'
      )
    );
    expect(security.id).toBe('forge-security');
    expect(security.rules.length).toBeGreaterThan(0);
  });

  it('skips existing files without --force', () => {
    initProject(tmpDir);
    const result = initProject(tmpDir);

    expect(result.created).toHaveLength(0);
    expect(result.skipped).toHaveLength(7);
  });

  it('overwrites existing files with force', () => {
    initProject(tmpDir);
    const result = initProject(tmpDir, { force: true });

    expect(result.created).toHaveLength(7);
    expect(result.skipped).toHaveLength(0);
  });

  it('dry run does not write files', () => {
    const result = initProject(tmpDir, { dryRun: true });

    expect(result.created).toHaveLength(7);
    expect(existsSync(join(tmpDir, '.forge'))).toBe(false);
  });

  it('creates CI workflows with correct content', () => {
    initProject(tmpDir);

    const scorecard = readFileSync(
      join(tmpDir, '.github/workflows/scorecard.yml'),
      'utf-8'
    );
    expect(scorecard).toContain('npx forge-scorecard');
    expect(scorecard).toContain('Project Scorecard');

    const policy = readFileSync(
      join(tmpDir, '.github/workflows/policy-check.yml'),
      'utf-8'
    );
    expect(policy).toContain('npx forge-policy');
    expect(policy).toContain('.forge/policies');
  });
});
