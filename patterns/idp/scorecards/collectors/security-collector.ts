import {
  BaseCollector,
  type CollectorResult,
} from './base-collector.js';

export class SecurityCollector extends BaseCollector {
  get name(): string {
    return 'security';
  }

  protected async doCollect(
    context: Record<string, unknown>
  ): Promise<CollectorResult> {
    const violations: string[] = [];
    const breakdown: Record<string, number> = {};
    let total = 0;

    const secretsScan = context['secrets_scan_passed'] as
      | boolean
      | undefined;
    breakdown['secrets'] = secretsScan === false ? 0 : 100;
    if (secretsScan === false) {
      violations.push('Secret scanning detected exposed credentials');
    }
    total += breakdown['secrets'];

    const depVulns = (context['dependency_vulnerabilities'] as
      | number
      | undefined) ?? 0;
    breakdown['dependencies'] =
      depVulns === 0 ? 100 : Math.max(0, 100 - depVulns * 10);
    if (depVulns > 0) {
      violations.push(
        `${depVulns} dependency vulnerabilities found`
      );
    }
    total += breakdown['dependencies'];

    const authEnabled = context['auth_enabled'] as
      | boolean
      | undefined;
    breakdown['authentication'] = authEnabled === false ? 0 : 100;
    if (authEnabled === false) {
      violations.push('Authentication is not enabled');
    }
    total += breakdown['authentication'];

    const rlsEnabled = context['rls_enabled'] as
      | boolean
      | undefined;
    breakdown['rls'] = rlsEnabled === false ? 0 : 100;
    if (rlsEnabled === false) {
      violations.push('Row-level security is not enabled');
    }
    total += breakdown['rls'];

    const score = Math.round(total / 4);

    return { score, breakdown, violations };
  }
}
