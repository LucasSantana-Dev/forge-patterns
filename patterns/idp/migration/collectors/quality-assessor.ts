import { readFileSync, readdirSync, statSync } from 'node:fs';
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

export function collectQualityFindings(ctx: AssessmentContext, maxFiles = 500): CategoryScore {
  const findings: AssessmentFinding[] = [];

  if (!ctx.testFramework) {
    findings.push({
      category: 'quality',
      severity: 'high',
      message: 'No test framework detected'
    });
  }

  if (!ctx.hasLinting) {
    findings.push({
      category: 'quality',
      severity: 'medium',
      message: 'No linter configured'
    });
  }

  if (!ctx.hasTypeChecking) {
    findings.push({
      category: 'quality',
      severity: 'medium',
      message: 'No type checking configured'
    });
  }

  if (!ctx.hasFormatting) {
    findings.push({
      category: 'quality',
      severity: 'low',
      message: 'No code formatter configured'
    });
  }

  if (!ctx.hasCi) {
    findings.push({
      category: 'quality',
      severity: 'high',
      message: 'No CI/CD pipeline detected'
    });
  }

  const codeFindings = scanCodeQuality(ctx.dir, maxFiles);
  findings.push(...codeFindings);

  const testRatio = computeTestRatio(ctx.dir);
  if (testRatio !== null && testRatio < 0.1) {
    findings.push({
      category: 'quality',
      severity: 'medium',
      message: `Low test ratio: ${Math.round(testRatio * 100)}%`
    });
  }

  return scoreCategory(findings);
}

function scanCodeQuality(dir: string, maxFiles: number): AssessmentFinding[] {
  const findings: AssessmentFinding[] = [];
  const stack = [dir];
  let count = 0;
  let emptyCatches = 0;
  let todoCount = 0;

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
        const result = scanFileQuality(fullPath, dir);
        emptyCatches += result.emptyCatches;
        todoCount += result.todos;
        count++;
        if (count >= maxFiles) break;
      }
    }
  }

  if (emptyCatches > 0) {
    findings.push({
      category: 'quality',
      severity: emptyCatches > 5 ? 'high' : 'medium',
      message: `${emptyCatches} empty catch blocks`
    });
  }

  if (todoCount > 10) {
    findings.push({
      category: 'quality',
      severity: 'low',
      message: `${todoCount} TODO/FIXME comments`
    });
  }

  return findings;
}

function scanFileQuality(
  filePath: string,
  _baseDir: string
): { emptyCatches: number; todos: number } {
  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return { emptyCatches: 0, todos: 0 };
  }

  const emptyCatchRegex = /catch\s*\([^)]*\)\s*\{\s*\}/g;
  const todoRegex = /\b(TODO|FIXME|HACK|XXX)\b/g;

  const emptyCatches = (content.match(emptyCatchRegex) ?? []).length;
  const todos = (content.match(todoRegex) ?? []).length;

  return { emptyCatches, todos };
}

function computeTestRatio(dir: string): number | null {
  let srcFiles = 0;
  let testFiles = 0;
  const stack = [dir];

  while (stack.length > 0) {
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
        if (entry.includes('.test.') || entry.includes('.spec.') || entry.includes('_test.')) {
          testFiles++;
        } else {
          srcFiles++;
        }
      }
    }
  }

  if (srcFiles === 0) return null;
  return testFiles / srcFiles;
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
  return { category: 'quality', score, grade, findings };
}
