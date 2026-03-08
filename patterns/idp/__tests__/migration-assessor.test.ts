import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  assessProject,
  detectStrategy,
  collectDependencyFindings,
  collectArchitectureFindings,
  collectSecurityFindings,
  collectQualityFindings,
  collectReadinessFindings,
  collectGovernanceFindings,
  type AssessmentContext,
} from '../migration/index.js';

function makeTmpDir(): string {
  const dir = join(tmpdir(), `forge-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeFile(dir: string, path: string, content: string): void {
  const full = join(dir, path);
  const parent = full.substring(0, full.lastIndexOf('/'));
  mkdirSync(parent, { recursive: true });
  writeFileSync(full, content, 'utf-8');
}

function makeCtx(dir: string, overrides: Partial<AssessmentContext> = {}): AssessmentContext {
  return {
    dir,
    language: 'typescript',
    framework: 'express',
    packageManager: 'npm',
    testFramework: 'jest',
    hasLinting: true,
    hasTypeChecking: true,
    hasCi: true,
    hasFormatting: true,
    ...overrides,
  };
}

afterEach(() => {
  // cleanup handled by OS for tmp dirs
});

describe('assessProject', () => {
  it('returns a complete report with 6 categories', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { express: '^4.0.0' },
      devDependencies: { jest: '^29.0.0' },
    }));
    writeFile(dir, '.gitignore', '.env\nnode_modules');

    const ctx = makeCtx(dir);
    const report = assessProject(ctx);

    expect(report.categories).toHaveLength(6);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(report.grade);
    expect(['ready', 'needs-work', 'high-risk']).toContain(report.readiness);
    expect(report.timestamp).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('sorts findings by severity', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { jquery: '^3.0.0' },
    }));
    writeFile(dir, 'src/bad.js', 'eval("code");\nconst x = "password: abc123";');

    const ctx = makeCtx(dir, { hasLinting: false, hasCi: false });
    const report = assessProject(ctx);

    const severities = report.findings.map(f => f.severity);
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    for (let i = 1; i < severities.length; i++) {
      expect(order[severities[i]!]).toBeGreaterThanOrEqual(order[severities[i - 1]!]);
    }

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('detectStrategy', () => {
  it('returns strangler-fig for backends', () => {
    expect(detectStrategy(makeCtx('', { framework: 'express' })).toString()).toBe('strangler-fig');
    expect(detectStrategy(makeCtx('', { framework: 'fastapi' }))).toBe('strangler-fig');
    expect(detectStrategy(makeCtx('', { framework: 'django' }))).toBe('strangler-fig');
  });

  it('returns branch-by-abstraction for frontends', () => {
    expect(detectStrategy(makeCtx('', { framework: 'react' }))).toBe('branch-by-abstraction');
    expect(detectStrategy(makeCtx('', { framework: 'vue' }))).toBe('branch-by-abstraction');
    expect(detectStrategy(makeCtx('', { framework: 'nextjs' }))).toBe('branch-by-abstraction');
  });

  it('returns parallel-run for Java', () => {
    expect(detectStrategy(makeCtx('', { language: 'java', framework: undefined }))).toBe('parallel-run');
  });
});

describe('collectDependencyFindings', () => {
  it('detects legacy packages', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { jquery: '^3.0.0', moment: '^2.0.0' },
      devDependencies: { jest: '^29.0.0' },
    }));

    const result = collectDependencyFindings(makeCtx(dir));
    const legacyFindings = result.findings.filter(f =>
      f.message.includes('Legacy package'),
    );
    expect(legacyFindings.length).toBeGreaterThanOrEqual(2);
    expect(result.score).toBeLessThan(100);

    rmSync(dir, { recursive: true, force: true });
  });

  it('detects missing lockfile', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: {},
      devDependencies: { jest: '^29.0.0' },
    }));

    const result = collectDependencyFindings(makeCtx(dir));
    const lockFinding = result.findings.find(f =>
      f.message.includes('No lockfile'),
    );
    expect(lockFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('scores 100 for clean project', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { express: '^4.0.0' },
      devDependencies: { jest: '^29.0.0' },
      engines: { node: '>=18' },
    }));
    writeFile(dir, 'package-lock.json', '{}');

    const result = collectDependencyFindings(makeCtx(dir));
    expect(result.score).toBe(100);
    expect(result.findings).toHaveLength(0);

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('collectArchitectureFindings', () => {
  it('detects god files', () => {
    const dir = makeTmpDir();
    const bigContent = Array(600).fill('const x = 1;').join('\n');
    writeFile(dir, 'src/god.ts', bigContent);

    const result = collectArchitectureFindings(makeCtx(dir));
    const godFinding = result.findings.find(f =>
      f.message.includes('Large file') || f.message.includes('God file'),
    );
    expect(godFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('collectSecurityFindings', () => {
  it('detects missing .env in gitignore', () => {
    const dir = makeTmpDir();
    writeFile(dir, '.gitignore', 'node_modules');
    writeFile(dir, 'package.json', '{}');

    const result = collectSecurityFindings(makeCtx(dir));
    const envFinding = result.findings.find(f =>
      f.message.includes('.env not in .gitignore'),
    );
    expect(envFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('detects hardcoded secrets', () => {
    const dir = makeTmpDir();
    writeFile(dir, '.gitignore', '.env');
    writeFile(dir, 'src/config.ts', 'const password = "super_secret_123";');

    const result = collectSecurityFindings(makeCtx(dir));
    const secretFinding = result.findings.find(f =>
      f.message.includes('secret'),
    );
    expect(secretFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('collectQualityFindings', () => {
  it('flags missing test framework', () => {
    const dir = makeTmpDir();
    const ctx = makeCtx(dir, { testFramework: undefined });
    const result = collectQualityFindings(ctx);
    const finding = result.findings.find(f =>
      f.message.includes('No test framework'),
    );
    expect(finding).toBeTruthy();
  });

  it('detects empty catch blocks', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'src/bad.ts', 'try { x() } catch(e) {}');

    const result = collectQualityFindings(makeCtx(dir));
    const catchFinding = result.findings.find(f =>
      f.message.includes('empty catch'),
    );
    expect(catchFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('collectReadinessFindings', () => {
  it('flags legacy stack dependencies', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { jquery: '^3.0.0' },
    }));

    const result = collectReadinessFindings(makeCtx(dir));
    const legacyFinding = result.findings.find(f =>
      f.message.includes('Legacy stack'),
    );
    expect(legacyFinding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags no tests as critical for migration', () => {
    const dir = makeTmpDir();
    const ctx = makeCtx(dir, { testFramework: undefined });
    const result = collectReadinessFindings(ctx);
    const finding = result.findings.find(f =>
      f.severity === 'critical',
    );
    expect(finding).toBeTruthy();
    expect(finding!.message).toContain('migration unsafe');
  });

  it('reports ready for well-configured project', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'package.json', JSON.stringify({
      dependencies: { express: '^4.0.0' },
      devDependencies: { jest: '^29.0.0' },
    }));
    writeFile(dir, 'README.md', '# Project');
    writeFile(dir, '.gitignore', '.env');

    const ctx = makeCtx(dir);
    const result = collectReadinessFindings(ctx);
    expect(result.score).toBeGreaterThanOrEqual(80);

    rmSync(dir, { recursive: true, force: true });
  });
});

describe('collectGovernanceFindings', () => {
  it('flags missing AI coding rules', () => {
    const dir = makeTmpDir();
    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('No AI coding rules'),
    );
    expect(finding).toBeTruthy();
    expect(finding!.severity).toBe('critical');

    rmSync(dir, { recursive: true, force: true });
  });

  it('passes when CLAUDE.md exists with content', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
    writeFile(dir, '.gitignore', '.env\nnode_modules');
    writeFile(dir, 'SECURITY.md', '# Security Policy');

    const result = collectGovernanceFindings(makeCtx(dir));
    const ruleFinding = result.findings.find(f =>
      f.message.includes('No AI coding rules'),
    );
    expect(ruleFinding).toBeUndefined();
    expect(result.score).toBeGreaterThanOrEqual(70);

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags minimal CLAUDE.md', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Short');
    writeFile(dir, '.gitignore', '.env');

    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('minimal'),
    );
    expect(finding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags .env not in .gitignore', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
    writeFile(dir, '.gitignore', 'node_modules');

    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('.env not in .gitignore'),
    );
    expect(finding).toBeTruthy();
    expect(finding!.severity).toBe('high');

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags missing SECURITY.md', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
    writeFile(dir, '.gitignore', '.env');

    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('SECURITY.md'),
    );
    expect(finding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags secrets in .mcp.json', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
    writeFile(dir, '.gitignore', '.env');
    writeFile(dir, '.mcp.json', '{"env": {"API_KEY": "sk-123"}}');

    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('hardcoded secrets'),
    );
    expect(finding).toBeTruthy();
    expect(finding!.severity).toBe('critical');

    rmSync(dir, { recursive: true, force: true });
  });

  it('flags missing secret scanning in CI', () => {
    const dir = makeTmpDir();
    writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
    writeFile(dir, '.gitignore', '.env');
    writeFile(dir, 'SECURITY.md', '# Security');
    writeFile(dir, '.github/workflows/ci.yml', 'name: CI\non: push');

    const result = collectGovernanceFindings(makeCtx(dir));
    const finding = result.findings.find(f =>
      f.message.includes('secret scanning'),
    );
    expect(finding).toBeTruthy();

    rmSync(dir, { recursive: true, force: true });
  });
});
