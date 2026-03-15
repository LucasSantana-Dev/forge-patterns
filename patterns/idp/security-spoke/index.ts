import fs from 'node:fs';
import path from 'node:path';
import type {
  SecuritySpokeCategory,
  SecuritySpokeDast,
  SecuritySpokeEvidence,
  SecuritySpokeFinding,
  SecuritySpokeReportV1,
  SecuritySpokeRiskLevel,
  SecuritySpokeRuleCatalogV1,
  SecuritySpokeScanner,
  SecuritySpokeSeverity,
  SecuritySpokeSummary
} from './types.js';

export * from './types.js';

export const SECURITY_SPOKE_SEVERITIES: SecuritySpokeSeverity[] = [
  'critical',
  'high',
  'medium',
  'low',
  'info'
];

export const SECURITY_SPOKE_CATEGORIES: SecuritySpokeCategory[] = [
  'secrets',
  'dependencies',
  'injection',
  'auth',
  'transport',
  'config',
  'dast',
  'other'
];

export const SECURITY_SPOKE_RISK_LEVELS: SecuritySpokeRiskLevel[] = ['high', 'medium', 'low'];

const baseDir = __dirname;

export const SECURITY_SPOKE_REPORT_V1_SCHEMA_PATH = path.join(
  baseDir,
  'schema',
  'security-spoke-report-v1.schema.json'
);

export const SECURITY_SPOKE_RULE_CATALOG_V1_PATH = path.join(
  baseDir,
  'rules',
  'security-spoke-rules-v1.json'
);

function parseJsonFile(pathname: string): unknown {
  const content = fs.readFileSync(pathname, 'utf-8');
  return JSON.parse(content) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isStringEnumValue<T extends string>(value: unknown, enumValues: T[]): value is T {
  return typeof value === 'string' && enumValues.includes(value as T);
}

function isEvidence(value: unknown): value is SecuritySpokeEvidence {
  if (!isRecord(value)) {
    return false;
  }

  const { kind, file, line } = value;

  if (!isString(value.value)) {
    return false;
  }

  if (!isStringEnumValue(kind, ['file', 'dependency', 'code', 'request', 'other'])) {
    return false;
  }

  if (file !== undefined && typeof file !== 'string') {
    return false;
  }

  if (line !== undefined && !Number.isInteger(line)) {
    return false;
  }

  return true;
}

function isFinding(value: unknown): value is SecuritySpokeFinding {
  if (!isRecord(value) || !Array.isArray(value.evidence)) {
    return false;
  }

  if (!isString(value.rule_id) || !isString(value.title)) {
    return false;
  }

  if (!isString(value.recommendation)) {
    return false;
  }

  if (!isStringEnumValue(value.severity, SECURITY_SPOKE_SEVERITIES)) {
    return false;
  }

  if (!isStringEnumValue(value.category, SECURITY_SPOKE_CATEGORIES)) {
    return false;
  }

  if (!isStringEnumValue(value.risk_level, SECURITY_SPOKE_RISK_LEVELS)) {
    return false;
  }

  return value.evidence.every(isEvidence);
}

function isSummary(value: unknown): value is SecuritySpokeSummary {
  if (!isRecord(value) || !isRecord(value.by_severity) || !isRecord(value.by_risk_level)) {
    return false;
  }

  const summary = value as {
    total_findings: unknown;
    by_severity: Record<string, unknown>;
    by_risk_level: Record<string, unknown>;
  };

  if (!Number.isInteger(summary.total_findings)) {
    return false;
  }

  if ((summary.total_findings as number) < 0) {
    return false;
  }

  const bySeverityValid = SECURITY_SPOKE_SEVERITIES.every(severity =>
    Number.isInteger(summary.by_severity[severity])
  );
  const byRiskValid = SECURITY_SPOKE_RISK_LEVELS.every(risk =>
    Number.isInteger(summary.by_risk_level[risk])
  );

  return bySeverityValid && byRiskValid;
}

function isScanner(value: unknown): value is SecuritySpokeScanner {
  if (!isRecord(value) || !isString(value.name) || !isString(value.version)) {
    return false;
  }

  if (!isStringEnumValue(value.execution, ['success', 'error'])) {
    return false;
  }

  if (value.error_message !== undefined && typeof value.error_message !== 'string') {
    return false;
  }

  return true;
}

function isDast(value: unknown): value is SecuritySpokeDast {
  if (!isRecord(value) || !isString(value.reason)) {
    return false;
  }

  if (
    !isStringEnumValue(value.status, [
      'not_executed',
      'scheduled',
      'running',
      'completed',
      'failed'
    ])
  ) {
    return false;
  }

  return isStringEnumValue(value.mode, ['hooks_only_v1', 'full']);
}

export function isSecuritySpokeReportV1(value: unknown): value is SecuritySpokeReportV1 {
  if (!isRecord(value) || value.version !== 'v1' || !Array.isArray(value.findings)) {
    return false;
  }

  if (!isString(value.generated_at)) {
    return false;
  }

  if (!isScanner(value.scanner) || !isSummary(value.summary) || !isDast(value.dast)) {
    return false;
  }

  return value.findings.every(isFinding);
}

export function readSecuritySpokeReportV1Schema(): Record<string, unknown> {
  const schema = parseJsonFile(SECURITY_SPOKE_REPORT_V1_SCHEMA_PATH);
  return (isRecord(schema) ? schema : {}) as Record<string, unknown>;
}

export function readSecuritySpokeRuleCatalogV1(): SecuritySpokeRuleCatalogV1 {
  const catalog = parseJsonFile(SECURITY_SPOKE_RULE_CATALOG_V1_PATH);
  return (catalog as SecuritySpokeRuleCatalogV1) ?? { version: 'v1', updated_at: '', rules: [] };
}
