export { PolicyEvaluator } from './evaluator.js';
export { loadPolicyFromFile, loadPoliciesFromDir } from './loader.js';
export {
  evaluateCondition,
  resolveFieldPath
} from './builtin-functions.js';
export type {
  Action,
  ActionType,
  Condition,
  ConditionOperator,
  Policy,
  PolicyEvaluationResult,
  PolicyRule,
  PolicyViolation
} from './schema.js';
