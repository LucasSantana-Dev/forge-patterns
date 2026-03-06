import {
  BaseCollector,
  type CollectorResult,
} from './base-collector.js';

export class ComplianceCollector extends BaseCollector {
  get name(): string {
    return 'compliance';
  }

  protected async doCollect(
    context: Record<string, unknown>
  ): Promise<CollectorResult> {
    const violations: string[] = [];
    const breakdown: Record<string, number> = {};
    let total = 0;

    const rlsEnabled = context['rls_enabled'] as
      | boolean
      | undefined;
    breakdown['rls'] = rlsEnabled === false ? 0 : 100;
    if (rlsEnabled === false) {
      violations.push('Row-level security not enabled');
    }
    total += breakdown['rls'];

    const encryptionEnabled = context[
      'encryption_at_rest'
    ] as boolean | undefined;
    breakdown['encryption'] =
      encryptionEnabled === false ? 0 : 100;
    if (encryptionEnabled === false) {
      violations.push('Encryption at rest not enabled');
    }
    total += breakdown['encryption'];

    const retentionDays = (context['log_retention_days'] as
      | number
      | undefined) ?? 0;
    breakdown['retention'] =
      retentionDays >= 90
        ? 100
        : retentionDays >= 30
          ? 70
          : retentionDays > 0
            ? 40
            : 0;
    if (retentionDays < 90) {
      violations.push(
        `Log retention ${retentionDays} days is below 90 day requirement`
      );
    }
    total += breakdown['retention'];

    const auditLogging = context['audit_logging'] as
      | boolean
      | undefined;
    breakdown['audit'] = auditLogging === false ? 0 : 100;
    if (auditLogging === false) {
      violations.push('Audit logging not enabled');
    }
    total += breakdown['audit'];

    const score = Math.round(total / 4);

    return { score, breakdown, violations };
  }
}
