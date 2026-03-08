export { assessProject, detectStrategy } from './assessor.js';
export type {
  AssessmentContext,
  AssessmentReport,
  AssessmentFinding,
  CategoryScore,
  AssessmentCategory,
  Severity,
  Grade,
  MigrationStrategy,
  MigrationReadiness,
} from './types.js';
export { collectDependencyFindings } from './collectors/dependency-assessor.js';
export { collectArchitectureFindings } from './collectors/architecture-assessor.js';
export { collectSecurityFindings } from './collectors/security-assessor.js';
export { collectQualityFindings } from './collectors/quality-assessor.js';
export { collectReadinessFindings } from './collectors/readiness-assessor.js';
