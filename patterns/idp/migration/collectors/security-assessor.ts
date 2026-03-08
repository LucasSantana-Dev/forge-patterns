import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { AssessmentFinding, AssessmentContext, CategoryScore } from '../types.js';

const SOURCE_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.py',
  '.go',
  '.rs',
  '.java',
  '.vue',
  '.svelte'
]);

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.next',
  '__pycache__',
  '.git',
  'target',
  'vendor',
  'coverage',
  '.cache'
]);

interface SecurityRule {
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium';
  message: string;
}

const RULES: SecurityRule[] = [
  {
    pattern: /(?:password|secret|apiKey|api_key|token)\s*[:=]\s*['"][^'"]{4,}/i,
    severity: 'critical',
    message: 'Potential hardcoded secret'
  },
  {
    pattern: /AKIA[0-9A-Z]{16}/,
    severity: 'critical',
    message: 'AWS access key detected'
  },
  {
    pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
    severity: 'critical',
    message: 'Private key detected'
  },
  {
    pattern: /\beval\s*\(/,
    severity: 'high',
    message: 'eval() usage — code injection risk'
  },
  {
    pattern: /dangerouslySetInnerHTML/,
    severity: 'high',
    message: 'dangerouslySetInnerHTML — XSS risk'
  },
  {
    pattern: /\.innerHTML\s*=/,
    severity: 'high',
    message: 'innerHTML assignment — XSS risk'
  },
  {
    pattern: /['"`]\s*(?:SELECT|INSERT|UPDATE|DELETE)\s.*\+\s*(?:\w+|['"`])/i,
    severity: 'high',
    message: 'SQL string concatenation — injection risk'
  },
  {
    pattern: /child_process.*exec\s*\(/,
    severity: 'high',
    message: 'exec() with child_process — command injection'
  },
  {
    pattern: /cors\(\s*\)/,
    severity: 'medium',
    message: 'Unrestricted CORS — allows all origins'
  }
];

export function collectSecurityFindings(ctx: AssessmentContext, maxFiles = 500): CategoryScore {
  const findings: AssessmentFinding[] = [];

  const gitignorePath = join(ctx.dir, '.gitignore');
  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf-8');
    if (!content.includes('.env')) {
      findings.push({
        category: 'security',
        severity: 'high',
        message: '.env not in .gitignore',
        file: '.gitignore'
      });
    }
  } else if (existsSync(join(ctx.dir, '.env'))) {
    findings.push({
      category: 'security',
      severity: 'critical',
      message: 'No .gitignore but .env exists'
    });
  }

  if (!existsSync(join(ctx.dir, 'SECURITY.md'))) {
    findings.push({
      category: 'security',
      severity: 'low',
      message: 'No SECURITY.md policy'
    });
  }

  scanSourceFiles(ctx.dir, findings, maxFiles);

  return scoreCategory(findings);
}

function scanSourceFiles(dir: string, findings: AssessmentFinding[], maxFiles: number): void {
  const stack = [dir];
  let count = 0;

  while (stack.length > 0 && count < maxFiles) {
    const current = stack.pop();
    if (!current) break;
    let entries: string[];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry)) continue;
      const fullPath = join(current, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        stack.push(fullPath);
      } else if (SOURCE_EXTS.has(extname(entry))) {
        scanFile(fullPath, dir, findings);
        count++;
        if (count >= maxFiles) break;
      }
    }
  }
}

function scanFile(filePath: string, baseDir: string, findings: AssessmentFinding[]): void {
  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  const relPath = filePath.replace(baseDir + '/', '');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        findings.push({
          category: 'security',
          severity: rule.severity,
          message: rule.message,
          file: relPath,
          line: i + 1
        });
      }
    }
  }
}

function scoreCategory(findings: AssessmentFinding[]): CategoryScore {
  let penalty = 0;
  for (const f of findings) {
    switch (f.severity) {
      case 'critical':
        penalty += 25;
        break;
      case 'high':
        penalty += 15;
        break;
      case 'medium':
        penalty += 8;
        break;
      case 'low':
        penalty += 3;
        break;
    }
  }
  const score = Math.max(0, 100 - penalty);
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';
  return { category: 'security', score, grade, findings };
}
