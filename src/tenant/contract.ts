export interface TenantQualityPolicy {
  min_quality_score: number;
  block_on_critical: boolean;
  block_on_high: boolean;
}

export interface TenantCiPolicy {
  require_sonar: boolean;
  require_security_scan: boolean;
  enforce_pr_checks: boolean;
}

export interface TenantProfile {
  tenant_id: string;
  github_owner: string;
  sonar_org: string;
  npm_scope: string;
  quality_policy: TenantQualityPolicy;
  ci_policy: TenantCiPolicy;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBool(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isQualityPolicy(value: unknown): value is TenantQualityPolicy {
  if (!isRecord(value)) return false;
  return (
    typeof value['min_quality_score'] === 'number' &&
    isBool(value['block_on_critical']) &&
    isBool(value['block_on_high'])
  );
}

function isCiPolicy(value: unknown): value is TenantCiPolicy {
  if (!isRecord(value)) return false;
  return (
    isBool(value['require_sonar']) &&
    isBool(value['require_security_scan']) &&
    isBool(value['enforce_pr_checks'])
  );
}

export function validateTenantProfile(value: unknown): value is TenantProfile {
  if (!isRecord(value)) return false;
  return (
    isText(value['tenant_id']) &&
    isText(value['github_owner']) &&
    isText(value['sonar_org']) &&
    isText(value['npm_scope']) &&
    isQualityPolicy(value['quality_policy']) &&
    isCiPolicy(value['ci_policy'])
  );
}

export function assertTenantProfile(value: unknown): asserts value is TenantProfile {
  if (validateTenantProfile(value)) return;
  throw new Error(
    [
      'Invalid tenant profile: required keys are',
      'tenant_id, github_owner, sonar_org, npm_scope, quality_policy, ci_policy.'
    ].join(' ')
  );
}
