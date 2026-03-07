import { BaseCollector, type CollectorResult } from './base-collector.js';

export class QualityCollector extends BaseCollector {
  get name(): string {
    return 'quality';
  }

  protected async doCollect(context: Record<string, unknown>): Promise<CollectorResult> {
    const violations: string[] = [];
    const breakdown: Record<string, number> = {};
    let total = 0;

    const lintPassed = context['lint_passed'] as boolean | undefined;
    breakdown['lint'] = lintPassed === false ? 0 : 100;
    if (lintPassed === false) {
      violations.push('Lint check failed');
    }
    total += breakdown['lint'];

    const typeCheckPassed = context['type_check_passed'] as boolean | undefined;
    breakdown['type_check'] = typeCheckPassed === false ? 0 : 100;
    if (typeCheckPassed === false) {
      violations.push('TypeScript type check failed');
    }
    total += breakdown['type_check'];

    const coverage = (context['coverage_percent'] as number | undefined) ?? 0;
    breakdown['coverage'] = Math.min(100, coverage);
    if (coverage < 80) {
      violations.push(`Test coverage ${coverage}% is below 80% threshold`);
    }
    total += breakdown['coverage'];

    const hasTests = context['has_tests'] as boolean | undefined;
    breakdown['tests'] = hasTests === false ? 0 : 100;
    if (hasTests === false) {
      violations.push('No tests found');
    }
    total += breakdown['tests'];

    const a11yPassed = context['accessibility_passed'] as boolean | undefined;
    breakdown['accessibility'] = a11yPassed === false ? 0 : 100;
    if (a11yPassed === false) {
      violations.push('Accessibility check failed');
    }
    total += breakdown['accessibility'];

    const score = Math.round(total / 5);

    return { score, breakdown, violations };
  }
}
