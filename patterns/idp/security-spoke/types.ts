export type SecuritySpokeSchemaVersion = 'v1';

export type SecuritySpokeSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type SecuritySpokeCategory =
  | 'secrets'
  | 'dependencies'
  | 'injection'
  | 'auth'
  | 'transport'
  | 'config'
  | 'dast'
  | 'other';

export type SecuritySpokeRiskLevel = 'high' | 'medium' | 'low';

export type SecuritySpokeDastStatus =
  | 'not_executed'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed';

export type SecuritySpokeDastMode = 'hooks_only_v1' | 'full';

export interface SecuritySpokeEvidence {
  kind: 'file' | 'dependency' | 'code' | 'request' | 'other';
  value: string;
  file?: string;
  line?: number;
}

export interface SecuritySpokeFinding {
  rule_id: string;
  severity: SecuritySpokeSeverity;
  category: SecuritySpokeCategory;
  title: string;
  evidence: SecuritySpokeEvidence[];
  recommendation: string;
  risk_level: SecuritySpokeRiskLevel;
}

export interface SecuritySpokeSummary {
  total_findings: number;
  by_severity: Record<SecuritySpokeSeverity, number>;
  by_risk_level: Record<SecuritySpokeRiskLevel, number>;
}

export interface SecuritySpokeDast {
  status: SecuritySpokeDastStatus;
  mode: SecuritySpokeDastMode;
  reason: string;
}

export interface SecuritySpokeScanner {
  name: string;
  version: string;
  execution: 'success' | 'error';
  error_message?: string;
}

export interface SecuritySpokeReportV1 {
  version: SecuritySpokeSchemaVersion;
  generated_at: string;
  scanner: SecuritySpokeScanner;
  summary: SecuritySpokeSummary;
  findings: SecuritySpokeFinding[];
  dast: SecuritySpokeDast;
}

export interface SecuritySpokeRule {
  rule_id: string;
  title: string;
  description: string;
  severity: SecuritySpokeSeverity;
  category: SecuritySpokeCategory;
  recommendation: string;
  risk_level: SecuritySpokeRiskLevel;
  tags: string[];
}

export interface SecuritySpokeRuleCatalogV1 {
  version: SecuritySpokeSchemaVersion;
  updated_at: string;
  rules: SecuritySpokeRule[];
}
