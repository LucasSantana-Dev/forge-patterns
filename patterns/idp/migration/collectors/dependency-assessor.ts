import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
  AssessmentFinding,
  AssessmentContext,
  CategoryScore
} from '../types.js';

const LEGACY_PACKAGES = [
  'jquery', 'moment', 'backbone', 'angular',
  'grunt', 'gulp', 'bower', 'coffeescript',
  'request', 'underscore'
];

export function collectDependencyFindings(
  ctx: AssessmentContext
): CategoryScore {
  const findings: AssessmentFinding[] = [];
  const pkgPath = join(ctx.dir, 'package.json');

  if (!existsSync(pkgPath)) {
    return scoreCategory(findings);
  }

  const pkg = JSON.parse(
    readFileSync(pkgPath, 'utf-8')
  ) as Record<string, unknown>;
  const deps = pkg['dependencies'] as Record<string, string> | undefined;
  const devDeps = pkg['devDependencies'] as Record<string, string> | undefined;
  const allDeps = { ...deps, ...devDeps };
  const depCount = Object.keys(allDeps).length;

  for (const name of Object.keys(allDeps)) {
    if (LEGACY_PACKAGES.includes(name)) {
      findings.push({
        category: 'dependencies',
        severity: 'high',
        message: `Legacy package: ${name}`,
        file: 'package.json'
      });
    }
  }

  if (depCount > 50) {
    findings.push({
      category: 'dependencies',
      severity: depCount > 100 ? 'high' : 'medium',
      message: `Excessive dependencies: ${depCount}`,
      file: 'package.json'
    });
  }

  const lockFiles = [
    'package-lock.json', 'yarn.lock',
    'pnpm-lock.yaml', 'bun.lockb'
  ];
  const hasLock = lockFiles.some(f => existsSync(join(ctx.dir, f)));
  if (!hasLock) {
    findings.push({
      category: 'dependencies',
      severity: 'medium',
      message: 'No lockfile found'
    });
  }

  const engines = pkg['engines'] as Record<string, string> | undefined;
  if (!engines) {
    findings.push({
      category: 'dependencies',
      severity: 'low',
      message: 'No engine constraint in package.json',
      file: 'package.json'
    });
  }

  if (!devDeps || Object.keys(devDeps).length === 0) {
    findings.push({
      category: 'dependencies',
      severity: 'medium',
      message: 'No devDependencies — missing dev tooling',
      file: 'package.json'
    });
  }

  return scoreCategory(findings);
}

function scoreCategory(
  findings: AssessmentFinding[]
): CategoryScore {
  let penalty = 0;
  for (const f of findings) {
    penalty += severityWeight(f.severity);
  }
  const score = Math.max(0, 100 - penalty);
  return {
    category: 'dependencies',
    score,
    grade: scoreToGrade(score),
    findings
  };
}

function severityWeight(s: string): number {
  switch (s) {
    case 'critical': return 25;
    case 'high': return 15;
    case 'medium': return 8;
    case 'low': return 3;
    default: return 0;
  }
}

function scoreToGrade(
  score: number
): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
