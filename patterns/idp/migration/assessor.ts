import type {
  AssessmentContext,
  AssessmentReport,
  MigrationStrategy,
  MigrationReadiness,
  Grade
} from './types.js';
import { collectDependencyFindings } from './collectors/dependency-assessor.js';
import { collectArchitectureFindings } from './collectors/architecture-assessor.js';
import { collectSecurityFindings } from './collectors/security-assessor.js';
import { collectQualityFindings } from './collectors/quality-assessor.js';
import { collectReadinessFindings } from './collectors/readiness-assessor.js';

export function assessProject(
  ctx: AssessmentContext,
  maxFiles = 500
): AssessmentReport {
  const categories = [
    collectDependencyFindings(ctx),
    collectArchitectureFindings(ctx, maxFiles),
    collectSecurityFindings(ctx, maxFiles),
    collectQualityFindings(ctx, maxFiles),
    collectReadinessFindings(ctx, maxFiles)
  ];

  const allFindings = categories.flatMap(c => c.findings);
  allFindings.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  const totalScore = categories.reduce(
    (sum, c) => sum + c.score,
    0
  );
  const overallScore = Math.round(totalScore / categories.length);
  const grade = scoreToGrade(overallScore);
  const readiness = determineReadiness(overallScore, categories);
  const strategy = detectStrategy(ctx);

  let fileCount = 0;
  const archCat = categories.find(
    c => c.category === 'architecture'
  );
  if (archCat?.findings) {
    const fileFinding = archCat.findings.filter(f =>
      f.file !== undefined
    );
    fileCount = fileFinding.length;
  }

  return {
    overallScore,
    grade,
    readiness,
    strategy,
    categories,
    findings: allFindings,
    fileCount,
    timestamp: new Date().toISOString()
  };
}

function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function determineReadiness(
  score: number,
  categories: { category: string; findings: { severity: string }[] }[]
): MigrationReadiness {
  const criticals = categories
    .flatMap(c => c.findings)
    .filter(f => f.severity === 'critical').length;

  if (criticals > 3 || score < 30) return 'high-risk';
  if (score >= 60 && criticals === 0) return 'ready';
  return 'needs-work';
}

export function detectStrategy(
  ctx: AssessmentContext
): MigrationStrategy {
  const fw = ctx.framework;
  if (
    fw === 'express' ||
    fw === 'fastapi' ||
    fw === 'django' ||
    fw === 'flask' ||
    fw === 'nestjs'
  ) {
    return 'strangler-fig';
  }
  if (
    fw === 'react' ||
    fw === 'vue' ||
    fw === 'nextjs' ||
    fw === 'svelte'
  ) {
    return 'branch-by-abstraction';
  }
  if (ctx.language === 'java') {
    return 'parallel-run';
  }
  return 'strangler-fig';
}
