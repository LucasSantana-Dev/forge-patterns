import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type {
  AssessmentFinding,
  AssessmentContext,
  CategoryScore
} from '../types.js';

const SOURCE_EXTS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.go', '.rs', '.java', '.vue', '.svelte'
]);

const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'build', '.next', '.nuxt',
  '__pycache__', '.git', 'target', 'vendor',
  'coverage', '.cache'
]);

interface FileInfo {
  path: string;
  lines: number;
  imports: number;
  functions: number;
}

export function collectArchitectureFindings(
  ctx: AssessmentContext,
  maxFiles = 500
): CategoryScore {
  const findings: AssessmentFinding[] = [];
  const files = walkSourceFiles(ctx.dir, maxFiles);

  let totalLines = 0;
  let godFileCount = 0;
  let highCouplingCount = 0;
  let sprawlCount = 0;

  for (const f of files) {
    totalLines += f.lines;

    if (f.lines > 1000) {
      findings.push({
        category: 'architecture',
        severity: 'critical',
        message: `God file: ${f.lines} lines`,
        file: f.path
      });
      godFileCount++;
    } else if (f.lines > 500) {
      findings.push({
        category: 'architecture',
        severity: 'high',
        message: `Large file: ${f.lines} lines`,
        file: f.path
      });
      godFileCount++;
    }

    if (f.imports > 15) {
      findings.push({
        category: 'architecture',
        severity: 'medium',
        message: `High coupling: ${f.imports} imports`,
        file: f.path
      });
      highCouplingCount++;
    }

    if (f.functions > 20) {
      findings.push({
        category: 'architecture',
        severity: 'medium',
        message: `Function sprawl: ${f.functions} functions`,
        file: f.path
      });
      sprawlCount++;
    }
  }

  const avgFileSize = files.length > 0
    ? Math.round(totalLines / files.length)
    : 0;
  if (avgFileSize > 200 && files.length > 5) {
    findings.push({
      category: 'architecture',
      severity: 'medium',
      message: `High avg file size: ${avgFileSize} lines`
    });
  }

  const topDirs = new Set(
    files.map(f => f.path.split('/')[0]).filter(Boolean)
  );
  if (files.length > 20 && topDirs.size <= 2) {
    findings.push({
      category: 'architecture',
      severity: 'low',
      message: 'Flat project structure'
    });
  }

  return scoreCategory(findings);
}

function walkSourceFiles(
  dir: string,
  maxFiles: number
): FileInfo[] {
  const result: FileInfo[] = [];
  const stack = [dir];

  while (stack.length > 0 && result.length < maxFiles) {
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
        const info = analyzeFile(fullPath, dir);
        if (info) result.push(info);
        if (result.length >= maxFiles) break;
      }
    }
  }

  return result;
}

function analyzeFile(
  filePath: string,
  baseDir: string
): FileInfo | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    const importMatches = content.match(
      /^(import |from |require\(|const .* = require)/gm
    );
    const fnMatches = content.match(
      /^(export )?(async )?(function |const \w+ = (?:async )?(?:\(|=>))/gm
    );
    return {
      path: filePath.replace(baseDir + '/', ''),
      lines,
      imports: importMatches?.length ?? 0,
      functions: fnMatches?.length ?? 0
    };
  } catch {
    return null;
  }
}

function scoreCategory(
  findings: AssessmentFinding[]
): CategoryScore {
  let penalty = 0;
  for (const f of findings) {
    switch (f.severity) {
      case 'critical': penalty += 25; break;
      case 'high': penalty += 15; break;
      case 'medium': penalty += 8; break;
      case 'low': penalty += 3; break;
    }
  }
  const score = Math.max(0, 100 - penalty);
  const grade = score >= 90 ? 'A'
    : score >= 75 ? 'B'
    : score >= 60 ? 'C'
    : score >= 40 ? 'D' : 'F';
  return { category: 'architecture', score, grade, findings };
}
