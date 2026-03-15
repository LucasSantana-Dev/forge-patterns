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

// ─── EXPANDED COVERAGE TESTS ─────────────────────────────────────────────────

describe('collectSecurityFindings — rule patterns', () => {
  it('detects eval() usage', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/bad.js', 'eval(userInput)');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('eval()'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('detects dangerouslySetInnerHTML XSS risk', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/bad.tsx', '<div dangerouslySetInnerHTML={{ __html: x }} />');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('dangerouslySetInnerHTML'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('detects innerHTML assignment XSS risk', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/bad.js', 'el.innerHTML = userInput;');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('innerHTML'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('detects SQL string concatenation', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/db.js', "const q = 'SELECT * FROM users WHERE id = ' + id;");
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('SQL'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('detects unrestricted CORS', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/server.js', 'app.use(cors())');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('CORS'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('detects AWS access key pattern', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/config.ts', 'const key = "AKIAIOSFODNN7EXAMPLE";');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('AWS access key'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('critical');
    });
  });

  it('detects child_process exec command injection', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/run.js', 'child_process.exec(cmd)');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('exec()'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('detects private key in source', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      writeFile(dir, 'src/key.ts', '-----BEGIN RSA PRIVATE KEY-----\nMIIE...');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Private key'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('critical');
    });
  });

  it('flags no .env file but no .gitignore present', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.env', 'SECRET=xxx');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No .gitignore but .env'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('critical');
    });
  });

  it('flags missing SECURITY.md', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env');
      const result = collectSecurityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No SECURITY.md'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('low');
    });
  });

  it('scores 100 for clean project', () => {
    withTmpDir((dir) => {
      writeFile(dir, '.gitignore', '.env\nnode_modules');
      writeFile(dir, 'SECURITY.md', '# Security');
      writeFile(dir, 'src/clean.ts', 'export const x = 1;');
      const result = collectSecurityFindings(makeCtx(dir));
      expect(result.score).toBe(100);
      expect(result.grade).toBe('A');
    });
  });
});

describe('collectQualityFindings — expanded paths', () => {
  it('flags missing linter', () => {
    withTmpDir((dir) => {
      const result = collectQualityFindings(makeCtx(dir, { hasLinting: false }));
      const f = result.findings.find(f => f.message.includes('No linter'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('flags missing type checking', () => {
    withTmpDir((dir) => {
      const result = collectQualityFindings(makeCtx(dir, { hasTypeChecking: false }));
      const f = result.findings.find(f => f.message.includes('No type checking'));
      expect(f).toBeTruthy();
    });
  });

  it('flags missing code formatter', () => {
    withTmpDir((dir) => {
      const result = collectQualityFindings(makeCtx(dir, { hasFormatting: false }));
      const f = result.findings.find(f => f.message.includes('No code formatter'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('low');
    });
  });

  it('flags no CI pipeline', () => {
    withTmpDir((dir) => {
      const result = collectQualityFindings(makeCtx(dir, { hasCi: false }));
      const f = result.findings.find(f => f.message.includes('No CI'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('flags high empty catch count as high severity', () => {
    withTmpDir((dir) => {
      const catches = Array(7).fill('try { x() } catch(e) {}').join('\n');
      writeFile(dir, 'src/bad.ts', catches);
      const result = collectQualityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('empty catch'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('flags many TODO comments', () => {
    withTmpDir((dir) => {
      const todos = Array(12).fill('// TODO: fix this').join('\n');
      writeFile(dir, 'src/messy.ts', todos);
      const result = collectQualityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('TODO'));
      expect(f).toBeTruthy();
    });
  });

  it('flags low test ratio', () => {
    withTmpDir((dir) => {
      // 12 source files, 1 test → ratio = 1/12 ≈ 0.083 < 0.1
      for (let i = 0; i < 12; i++) {
        writeFile(dir, `src/module${i}.ts`, `export const x${i} = ${i};`);
      }
      writeFile(dir, 'src/module0.test.ts', 'test("x",()=>{})');
      const result = collectQualityFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Low test ratio'));
      expect(f).toBeTruthy();
    });
  });

  it('returns clean result for well-configured project', () => {
    withTmpDir((dir) => {
      const result = collectQualityFindings(makeCtx(dir));
      expect(result.score).toBe(100);
      expect(result.grade).toBe('A');
    });
  });
});

describe('collectArchitectureFindings — expanded paths', () => {
  it('detects god file over 1000 lines as critical', () => {
    withTmpDir((dir) => {
      const bigContent = Array(1001).fill('const x = 1;').join('\n');
      writeFile(dir, 'src/giant.ts', bigContent);
      const result = collectArchitectureFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('God file'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('critical');
    });
  });

  it('detects high coupling from many imports', () => {
    withTmpDir((dir) => {
      const imports = Array(16)
        .fill(null)
        .map((_, i) => `import { x${i} } from './mod${i}.js';`)
        .join('\n');
      writeFile(dir, 'src/coupled.ts', imports + '\nconst x = 1;');
      const result = collectArchitectureFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('High coupling'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('detects function sprawl over 20 functions', () => {
    withTmpDir((dir) => {
      const fns = Array(21)
        .fill(null)
        .map((_, i) => `export function fn${i}() { return ${i}; }`)
        .join('\n');
      writeFile(dir, 'src/sprawl.ts', fns);
      const result = collectArchitectureFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Function sprawl'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('flags flat project structure with many files in ≤2 top dirs', () => {
    withTmpDir((dir) => {
      // 21+ files all in the same single subdirectory → topDirs.size = 1
      for (let i = 0; i < 22; i++) {
        writeFile(dir, `src/file${i}.ts`, `export const x${i} = ${i};`);
      }
      const result = collectArchitectureFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Flat project'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('low');
    });
  });

  it('flags high average file size', () => {
    withTmpDir((dir) => {
      // 6 files each with 201 lines
      for (let i = 0; i < 6; i++) {
        writeFile(dir, `src/big${i}.ts`, Array(201).fill(`const x${i} = 1;`).join('\n'));
      }
      const result = collectArchitectureFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('High avg file size'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('scores 100 for clean small project', () => {
    withTmpDir((dir) => {
      writeFile(dir, 'src/index.ts', 'export const x = 1;');
      const result = collectArchitectureFindings(makeCtx(dir));
      expect(result.score).toBe(100);
    });
  });
});

describe('collectReadinessFindings — expanded paths', () => {
  it('flags TypeScript-less JavaScript project', () => {
    withTmpDir((dir) => {
      mkdirSync(join(dir, 'src'), { recursive: true });
      const ctx = makeCtx(dir, {
        language: 'javascript',
        hasTypeChecking: false
      });
      const result = collectReadinessFindings(ctx);
      const f = result.findings.find(f => f.message.includes('JavaScript without TypeScript'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('skips TypeScript check for non-JS languages', () => {
    withTmpDir((dir) => {
      const ctx = makeCtx(dir, { language: 'python', hasTypeChecking: false });
      const result = collectReadinessFindings(ctx);
      const f = result.findings.find(f => f.message.includes('JavaScript without TypeScript'));
      expect(f).toBeUndefined();
    });
  });

  it('flags missing documentation', () => {
    withTmpDir((dir) => {
      const result = collectReadinessFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No documentation'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('passes when docs/ directory exists', () => {
    withTmpDir((dir) => {
      mkdirSync(join(dir, 'docs'), { recursive: true });
      const result = collectReadinessFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No documentation'));
      expect(f).toBeUndefined();
    });
  });

  it('flags global state pollution over 3 assignments', () => {
    withTmpDir((dir) => {
      const globalCode = [
        'window.myApp = {};',
        'window.config = {};',
        'window.utils = {};',
        'window.state = {};'
      ].join('\n');
      writeFile(dir, 'src/globals.js', globalCode);
      const result = collectReadinessFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Global state pollution'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('flags missing CI pipeline', () => {
    withTmpDir((dir) => {
      const result = collectReadinessFindings(makeCtx(dir, { hasCi: false }));
      const f = result.findings.find(f => f.message.includes('No CI pipeline'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('high');
    });
  });

  it('flags missing test framework as critical', () => {
    withTmpDir((dir) => {
      const result = collectReadinessFindings(makeCtx(dir, { testFramework: undefined }));
      const f = result.findings.find(f => f.message.includes('No test framework'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('critical');
    });
  });

  it('grades A for well-configured project with README', () => {
    withTmpDir((dir) => {
      writeFile(dir, 'README.md', '# My Project');
      const result = collectReadinessFindings(makeCtx(dir));
      expect(result.grade).toBe('A');
      expect(result.score).toBe(100);
    });
  });
});

describe('collectDependencyFindings — expanded paths', () => {
  it('handles missing package.json gracefully', () => {
    withTmpDir((dir) => {
      const result = collectDependencyFindings(makeCtx(dir));
      expect(result.score).toBe(100);
      expect(result.findings).toHaveLength(0);
    });
  });

  it('flags excessive deps (50-100) as medium', () => {
    withTmpDir((dir) => {
      const deps: Record<string, string> = {};
      for (let i = 0; i < 55; i++) deps[`pkg-${i}`] = '^1.0.0';
      writePackageJson(dir, {
        dependencies: deps,
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'package-lock.json', '{}');
      const result = collectDependencyFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('Excessive dependencies'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('flags excessive deps (>100) as high', () => {
    withTmpDir((dir) => {
      const deps: Record<string, string> = {};
      for (let i = 0; i < 105; i++) deps[`pkg-${i}`] = '^1.0.0';
      writePackageJson(dir, {
        dependencies: deps,
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'package-lock.json', '{}');
      const result = collectDependencyFindings(makeCtx(dir));
      const f = result.findings.find(
        f => f.message.includes('Excessive') && f.severity === 'high'
      );
      expect(f).toBeTruthy();
    });
  });

  it('flags no engine constraint', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: {},
        devDependencies: { jest: '^29.0.0' }
      });
      writeFile(dir, 'package-lock.json', '{}');
      const result = collectDependencyFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No engine constraint'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('low');
    });
  });

  it('flags missing devDependencies', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { express: '^4.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'package-lock.json', '{}');
      const result = collectDependencyFindings(makeCtx(dir));
      const f = result.findings.find(f => f.message.includes('No devDependencies'));
      expect(f).toBeTruthy();
      expect(f!.severity).toBe('medium');
    });
  });

  it('accepts yarn.lock as valid lockfile', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: {},
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'yarn.lock', '# yarn lockfile');
      const result = collectDependencyFindings(makeCtx(dir));
      const lockFinding = result.findings.find(f => f.message.includes('No lockfile'));
      expect(lockFinding).toBeUndefined();
    });
  });

  it('accepts pnpm-lock.yaml as valid lockfile', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: {},
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'pnpm-lock.yaml', 'lockfileVersion: 6.0');
      const result = collectDependencyFindings(makeCtx(dir));
      const lockFinding = result.findings.find(f => f.message.includes('No lockfile'));
      expect(lockFinding).toBeUndefined();
    });
  });

  it('detects multiple legacy packages', () => {
    withTmpDir((dir) => {
      writePackageJson(dir, {
        dependencies: { grunt: '^1.0.0', gulp: '^4.0.0', bower: '^1.8.0' },
        devDependencies: { jest: '^29.0.0' },
        engines: { node: '>=18' }
      });
      writeFile(dir, 'package-lock.json', '{}');
      const result = collectDependencyFindings(makeCtx(dir));
      const legacyFindings = result.findings.filter(f => f.message.includes('Legacy package'));
      expect(legacyFindings).toHaveLength(3);
      expect(legacyFindings.every(f => f.severity === 'high')).toBe(true);
    });
  });
});
