import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { AssessmentFinding, AssessmentContext, CategoryScore } from '../types.js';

const LEGACY_STACKS = [
  'jquery',
  'backbone',
  'angularjs',
  'ember',
  'knockout',
  'prototype',
  'mootools'
];

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

export function collectReadinessFindings(ctx: AssessmentContext, maxFiles = 500): CategoryScore {
  const findings: AssessmentFinding[] = [];

  checkLegacyStack(ctx, findings);
  checkTypeScriptAdoption(ctx, findings);

  if (!ctx.testFramework) {
    findings.push({
      category: 'migration-readiness',
      severity: 'critical',
      message: 'No test framework — migration unsafe'
    });
  }

  if (!ctx.hasCi) {
    findings.push({
      category: 'migration-readiness',
      severity: 'high',
      message: 'No CI pipeline — no safety net'
    });
  }

  if (!existsSync(join(ctx.dir, 'README.md')) && !existsSync(join(ctx.dir, 'docs'))) {
    findings.push({
      category: 'migration-readiness',
      severity: 'medium',
      message: 'No documentation found'
    });
  }

  checkGlobalState(ctx.dir, findings, maxFiles);

  return scoreCategory(findings);
}

function checkLegacyStack(ctx: AssessmentContext, findings: AssessmentFinding[]): void {
  const pkgPath = join(ctx.dir, 'package.json');
  if (!existsSync(pkgPath)) return;

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
  const deps = pkg['dependencies'] as Record<string, string> | undefined;
  if (!deps) return;

  for (const name of Object.keys(deps)) {
    const lower = name.toLowerCase();
    if (LEGACY_STACKS.some(s => lower.includes(s))) {
      findings.push({
        category: 'migration-readiness',
        severity: 'high',
        message: `Legacy stack dependency: ${name}`,
        file: 'package.json'
      });
    }
  }
}

function checkTypeScriptAdoption(ctx: AssessmentContext, findings: AssessmentFinding[]): void {
  if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
    return;
  }

  if (!ctx.hasTypeChecking) {
    const hasJsFiles = existsSync(join(ctx.dir, 'src'));
    if (hasJsFiles) {
      findings.push({
        category: 'migration-readiness',
        severity: 'medium',
        message: 'JavaScript without TypeScript'
      });
    }
  }
}

function checkGlobalState(dir: string, findings: AssessmentFinding[], maxFiles: number): void {
  const stack = [dir];
  let count = 0;
  let globalAssignments = 0;

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
        try {
          const content = readFileSync(fullPath, 'utf-8');
          const matches = content.match(/(?:window|global|globalThis)\.\w+\s*=/g);
          globalAssignments += matches?.length ?? 0;
        } catch {
          // skip unreadable files
        }
        count++;
        if (count >= maxFiles) break;
      }
    }
  }

  if (globalAssignments > 3) {
    findings.push({
      category: 'migration-readiness',
      severity: 'high',
      message: `Global state pollution: ${globalAssignments} assignments`
    });
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
  return {
    category: 'migration-readiness',
    score,
    grade,
    findings
  };
}
