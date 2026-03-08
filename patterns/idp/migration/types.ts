export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type AssessmentCategory =
  | 'dependencies'
  | 'architecture'
  | 'security'
  | 'quality'
  | 'migration-readiness'
  | 'ai-governance';

export type MigrationStrategy =
  | 'strangler-fig'
  | 'branch-by-abstraction'
  | 'parallel-run'
  | 'lift-and-shift';

export type MigrationReadiness = 'ready' | 'needs-work' | 'high-risk';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface AssessmentFinding {
  category: AssessmentCategory;
  severity: Severity;
  message: string;
  file?: string;
  line?: number;
}

export interface CategoryScore {
  category: AssessmentCategory;
  score: number;
  grade: Grade;
  findings: AssessmentFinding[];
}

export interface AssessmentReport {
  overallScore: number;
  grade: Grade;
  readiness: MigrationReadiness;
  strategy: MigrationStrategy;
  categories: CategoryScore[];
  findings: AssessmentFinding[];
  fileCount: number;
  timestamp: string;
}

export interface AssessmentContext {
  dir: string;
  language?: string;
  framework?: string;
  packageManager?: string;
  testFramework?: string;
  hasLinting?: boolean;
  hasTypeChecking?: boolean;
  hasCi?: boolean;
  hasFormatting?: boolean;
}
