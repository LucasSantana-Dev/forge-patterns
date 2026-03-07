export type ConditionOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'matches';

export type ActionType = 'block' | 'warn' | 'log' | 'notify';

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
}

export interface Action {
  type: ActionType;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface PolicyRule {
  id: string;
  name: string;
  description?: string;
  conditions: Condition[];
  actions: Action[];
  enabled: boolean;
}

export interface Policy {
  id: string;
  name: string;
  version: string;
  description?: string;
  rules: PolicyRule[];
}

export interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  action: Action;
  context: Record<string, unknown>;
}

export interface PolicyEvaluationResult {
  shouldBlock: boolean;
  violations: PolicyViolation[];
  warnings: PolicyViolation[];
  logs: PolicyViolation[];
}
