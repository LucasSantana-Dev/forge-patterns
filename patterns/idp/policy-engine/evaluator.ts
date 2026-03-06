import { evaluateCondition, resolveFieldPath } from './builtin-functions.js';
import type {
  Policy,
  PolicyEvaluationResult,
  PolicyRule,
  PolicyViolation,
} from './schema.js';

export class PolicyEvaluator {
  private policies: Policy[] = [];

  loadPolicies(policies: Policy[]): void {
    this.policies = policies;
  }

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
  }

  evaluate(
    context: Record<string, unknown>
  ): PolicyEvaluationResult {
    const violations: PolicyViolation[] = [];
    const warnings: PolicyViolation[] = [];
    const logs: PolicyViolation[] = [];
    let shouldBlock = false;

    for (const policy of this.policies) {
      for (const rule of policy.rules) {
        if (!rule.enabled) continue;

        const triggered = this.evaluateRule(rule, context);
        if (!triggered) continue;

        for (const action of rule.actions) {
          const violation: PolicyViolation = {
            ruleId: rule.id,
            ruleName: rule.name,
            action,
            context,
          };

          switch (action.type) {
            case 'block':
              shouldBlock = true;
              violations.push(violation);
              break;
            case 'warn':
              warnings.push(violation);
              break;
            case 'log':
              logs.push(violation);
              break;
            case 'notify':
              warnings.push(violation);
              break;
          }
        }
      }
    }

    return { shouldBlock, violations, warnings, logs };
  }

  private evaluateRule(
    rule: PolicyRule,
    context: Record<string, unknown>
  ): boolean {
    return rule.conditions.every((cond) => {
      const actual = resolveFieldPath(context, cond.field);
      return evaluateCondition(cond.operator, actual, cond.value);
    });
  }
}
