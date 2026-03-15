import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
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
  return mkdtempSync(join(tmpdir(), 'forge-test-'));
}

function writeFile(dir: string, path: string, content: string): void {
  const full = join(dir, path);
  const parent = dirname(full);
  mkdirSync(parent, { recursive: true });
  writeFileSync(full, content, 'utf-8');
}

function writePackageJson(dir: string, content: Record<string, unknown>): void {
  writeFile(dir, 'package.json', JSON.stringify(content));
}

function writeGovernancePrereqs(dir: string, gitignore = '.env'): void {
  writeFile(dir, 'CLAUDE.md', '# Project\n' + 'x'.repeat(300));
  writeFile(dir, '.gitignore', gitignore);
}

function withTmpDir(run: (dir: string) => void): void {
  const dir = makeTmpDir();
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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

describe('assessProject', () => {
  it('returns a complete report with 6 categories', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { express: '^4.0.0' },
        devDependencies: { jest: '^29.0.0' },
      });
      writeFile(dir, '.gitignore', '.env\nnode_modules');

      const ctx = makeCtx(dir);
      const report = assessProject(ctx);

      expect(report.categories).toHaveLength(6);
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
      expect(['A', 'B', 'C', 'D', 'F']).toContain(report.grade);
      expect(['ready', 'needs-work', 'high-risk']).toContain(report.readiness);
      expect(report.timestamp).toBeTruthy();
    });
  });

  it('sorts findings by severity', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { jquery: '^3.0.0' },
      });
      writeFile(dir, 'src/bad.js', 'eval("code");\nconst x = "password: abc123";');

      const ctx = makeCtx(dir, { hasLinting: false, hasCi: false });
      const report = assessProject(ctx);

      const severities = report.findings.map(f => f.severity);
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      for (let i = 1; i < severities.length; i++) {
        expect(order[severities[i]!]).toBeGreaterThanOrEqual(order[severities[i - 1]!]);
      }
    });
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
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { jquery: '^3.0.0', moment: '^2.0.0' },
        devDependencies: { jest: '^29.0.0' },
      });

      const result = collectDependencyFindings(makeCtx(dir));
      const legacyFindings = result.findings.filter(f =>
        f.message.includes('Legacy package'),
      );
      expect(legacyFindings.length).toBeGreaterThanOrEqual(2);
      expect(result.score).toBeLessThan(100);
    });
  });

  it('detects missing lockfile', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: {},
        devDependencies: { jest: '^29.0.0' },
      });

      const result = collectDependencyFindings(makeCtx(dir));
      const lockFinding = result.findings.find(f =>
        f.message.includes('No lockfile'),
      );
      expect(lockFinding).toBeTruthy();
    });
  });

  it('scores 100 for clean project', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { express: '^4.0.0' },
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' },
      });
      writeFile(dir, 'package-lock.json', '{}');

      const result = collectDependencyFindings(makeCtx(dir));
      expect(result.score).toBe(100);
      expect(result.findings).toHaveLength(0);
    });
  });
});

describe('collectArchitectureFindings', () => {
  it('detects god files', () => {
    withTmpDir((dir) => {
      const bigContent = Array(600).fill('const x = 1;').join('\n');
      writeFile(dir, 'src/god.ts', bigContent);

      const result = collectArchitectureFindings(makeCtx(dir));
      const godFinding = result.findings.find(f =>
        f.message.includes('Large file') || f.message.includes('God file'),
      );
      expect(godFinding).toBeTruthy();
    });
  });
});

describe('collectSecurityFindings', () => {
  it('detects missing .env in gitignore', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', 'node_modules');
      writePackageJson(dir, {});

      const result = collectSecurityFindings(makeCtx(dir));
      const envFinding = result.findings.find(f =>
        f.message.includes('.env not in .gitignore'),
      );
      expect(envFinding).toBeTruthy();
    });
  });

  it('detects hardcoded secrets', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/config.ts', 'const password = "super_secret_123";');

      const result = collectSecurityFindings(makeCtx(dir));
      const secretFinding = result.findings.find(f =>
        f.message.includes('secret'),
      );
      expect(secretFinding).toBeTruthy();
    });
  });
});

describe('collectQualityFindings', () => {
  it('flags missing test framework', () => {
    withTmpDir((dir) => {
      const ctx = makeCtx(dir, { testFramework: undefined });
      const result = collectQualityFindings(ctx);
      const finding = result.findings.find(f =>
        f.message.includes('No test framework'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('detects empty catch blocks', () => {
    withTmpDir((dir) => {
      writeFile(dir, 'src/bad.ts', 'try { x() } catch(e) {}');

      const result = collectQualityFindings(makeCtx(dir));
      const catchFinding = result.findings.find(f =>
        f.message.includes('empty catch'),
      );
      expect(catchFinding).toBeTruthy();
    });
  });
});

describe('collectReadinessFindings', () => {
  it('flags legacy stack dependencies', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { jquery: '^3.0.0' },
      });

      const result = collectReadinessFindings(makeCtx(dir));
      const legacyFinding = result.findings.find(f =>
        f.message.includes('Legacy stack'),
      );
      expect(legacyFinding).toBeTruthy();
    });
  });

  it('flags no tests as critical for migration', () => {
    withTmpDir((dir) => {
      const ctx = makeCtx(dir, { testFramework: undefined });
      const result = collectReadinessFindings(ctx);
      const finding = result.findings.find(f =>
        f.severity === 'critical',
      );
      expect(finding).toBeTruthy();
      expect(finding!.message).toContain('migration unsafe');
    });
  });

  it('reports ready for well-configured project', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { express: '^4.0.0' },
        devDependencies: { jest: '^29.0.0' },
      });
      writeFile(dir, 'README.md', '# Project');
      writeFile(dir, '.gitignore', '.env');

      const ctx = makeCtx(dir);
      const result = collectReadinessFindings(ctx);
      expect(result.score).toBeGreaterThanOrEqual(80);
    });
  });
});

describe('collectGovernanceFindings', () => {
  it('flags missing AI coding rules', () => {
    withTmpDir((dir) => {
      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('No AI coding rules'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('critical');
    });
  });

  it('passes when CLAUDE.md exists with content', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir, '.env\nnode_modules');
      writeFile(dir, 'SECURITY.md', '# Security Policy');

      const result = collectGovernanceFindings(makeCtx(dir));
      const ruleFinding = result.findings.find(f =>
        f.message.includes('No AI coding rules'),
      );
      expect(ruleFinding).toBeUndefined();
      expect(result.score).toBeGreaterThanOrEqual(70);
    });
  });

  it('flags minimal CLAUDE.md', () => {
    withTmpDir((dir) => {
      writeFile(dir, 'CLAUDE.md', '# Short');
      writeFile(dir, '.gitignore', '.env');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('minimal'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('flags .env not in .gitignore', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir, 'node_modules');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('.env not in .gitignore'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('high');
    });
  });

  it('flags missing SECURITY.md', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('SECURITY.md'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('flags secrets in .mcp.json', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, '.mcp.json', '{"env": {"API_KEY": "sk-123"}}');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('hardcoded secrets'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('critical');
    });
  });

  it('flags missing secret scanning in CI', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.github/workflows/ci.yml', 'name: CI\non: push');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('secret scanning'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('accepts .cursorrules as valid AI coding rules', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.cursorrules', 'Always write tests');
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'SECURITY.md', '# Security');

      const result = collectGovernanceFindings(makeCtx(dir));
      const ruleFinding = result.findings.find(f =>
        f.message.includes('No AI coding rules'),
      );
      expect(ruleFinding).toBeUndefined();
    });
  });

  it('accepts .github/copilot-instructions.md as valid AI coding rules', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.github/copilot-instructions.md', '# Copilot instructions');
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'SECURITY.md', '# Security');

      const result = collectGovernanceFindings(makeCtx(dir));
      const ruleFinding = result.findings.find(f =>
        f.message.includes('No AI coding rules'),
      );
      expect(ruleFinding).toBeUndefined();
    });
  });

  it('flags missing CLAUDE.md even when cursorrules present', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.cursorrules', 'rules here');
      writeFile(dir, '.gitignore', '.env');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('Missing CLAUDE.md'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('medium');
    });
  });

  it('flags missing .claude/skills directory', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('No .claude/skills/'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('low');
    });
  });

  it('flags .claude/skills/ with no skill files', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      mkdirSync(join(dir, '.claude', 'skills'), { recursive: true });

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('no skill files'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('passes when .claude/skills/ has skill files', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.claude/skills/my-skill.md', '# My Skill');
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog\nsemgrep');

      const result = collectGovernanceFindings(makeCtx(dir));
      const skillFinding = result.findings.find(f =>
        f.message.includes('skill'),
      );
      expect(skillFinding).toBeUndefined();
    });
  });

  it('flags missing .claude/settings.json hooks', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('settings.json'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('medium');
    });
  });

  it('flags settings.json with no hooks configured', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.claude/settings.json', JSON.stringify({ hooks: {} }));

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('no hooks'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('low');
    });
  });

  it('flags invalid settings.json JSON', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.claude/settings.json', '{bad json}');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('not valid JSON'),
      );
      expect(finding).toBeTruthy();
    });
  });

  it('passes with PreToolUse hooks configured', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.claude/skills/skill.md', '# Skill');
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog\nsemgrep');
      writeFile(
        dir,
        '.claude/settings.json',
        JSON.stringify({ hooks: { PreToolUse: ['npm run lint'] } })
      );

      const result = collectGovernanceFindings(makeCtx(dir));
      const hookFinding = result.findings.find(f =>
        f.message.includes('hooks'),
      );
      expect(hookFinding).toBeUndefined();
    });
  });

  it('flags missing SAST tool in CI', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.github/workflows/ci.yml', 'name: CI\ntrufflehog: yes');

      const result = collectGovernanceFindings(makeCtx(dir));
      const finding = result.findings.find(f =>
        f.message.includes('SAST'),
      );
      expect(finding).toBeTruthy();
      expect(finding!.severity).toBe('medium');
    });
  });

  it('accepts semgrep as SAST tool', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.claude/skills/skill.md', '# Skill');
      writeFile(
        dir,
        '.claude/settings.json',
        JSON.stringify({ hooks: { PreToolUse: ['lint'] } })
      );
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog: true\nsemgrep: true');

      const result = collectGovernanceFindings(makeCtx(dir));
      const sastFinding = result.findings.find(f =>
        f.message.includes('SAST'),
      );
      expect(sastFinding).toBeUndefined();
    });
  });

  it('accepts codeql as SAST tool', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog: true\ncodeql: true');

      const result = collectGovernanceFindings(makeCtx(dir));
      const sastFinding = result.findings.find(f =>
        f.message.includes('SAST'),
      );
      expect(sastFinding).toBeUndefined();
    });
  });

  it('accepts snyk as SAST tool', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog: true\nsnyk: true');

      const result = collectGovernanceFindings(makeCtx(dir));
      const sastFinding = result.findings.find(f =>
        f.message.includes('SAST'),
      );
      expect(sastFinding).toBeUndefined();
    });
  });

  it('accepts gitguardian as secret scanning tool', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir);
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, '.github/workflows/ci.yml', 'gitguardian: true\nsemgrep: true');

      const result = collectGovernanceFindings(makeCtx(dir));
      const secretFinding = result.findings.find(f =>
        f.message.includes('secret scanning'),
      );
      expect(secretFinding).toBeUndefined();
    });
  });

  it('grades poorly for project with critical findings', () => {
    withTmpDir((dir) => {
      // No CLAUDE.md (critical, 25) + no .gitignore (high, 15) + more = score < 60
      const result = collectGovernanceFindings(makeCtx(dir));
      expect(['D', 'F']).toContain(result.grade);
      expect(result.score).toBeLessThan(60);
    });
  });

  it('grades A for fully compliant project', () => {
    withTmpDir((dir) => {
      writeGovernancePrereqs(dir, '.env\nnode_modules');
      writeFile(dir, 'SECURITY.md', '# Security Policy');
      writeFile(dir, '.claude/skills/skill.md', '# Skill');
      writeFile(
        dir,
        '.claude/settings.json',
        JSON.stringify({ hooks: { PostToolUse: ['npm run format'] } })
      );
      writeFile(dir, '.github/workflows/ci.yml', 'trufflehog: true\nsemgrep: true');

      const result = collectGovernanceFindings(makeCtx(dir));
      expect(result.grade).toBe('A');
      expect(result.score).toBeGreaterThanOrEqual(90);
    });
  });
});
