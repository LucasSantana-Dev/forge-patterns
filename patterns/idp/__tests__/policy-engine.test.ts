import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PolicyEvaluator } from '../policy-engine/evaluator.js';
import {
  evaluateCondition,
  resolveFieldPath
} from '../policy-engine/builtin-functions.js';
import {
  loadPolicyFromFile,
  loadPoliciesFromDir
} from '../policy-engine/loader.js';
import type {
  Policy,
  PolicyRule,
  Condition
} from '../policy-engine/schema.js';

describe('PolicyEngine', () => {
  describe('evaluateCondition', () => {
    describe('eq operator', () => {
      it('should match equal values', () => {
        expect(evaluateCondition('eq', 'test', 'test')).toBe(true);
        expect(evaluateCondition('eq', 42, 42)).toBe(true);
        expect(evaluateCondition('eq', true, true)).toBe(true);
        expect(evaluateCondition('eq', null, null)).toBe(true);
      });

      it('should not match unequal values', () => {
        expect(evaluateCondition('eq', 'test', 'other')).toBe(false);
        expect(evaluateCondition('eq', 42, 43)).toBe(false);
        expect(evaluateCondition('eq', true, false)).toBe(false);
      });
    });

    describe('ne operator', () => {
      it('should match unequal values', () => {
        expect(evaluateCondition('ne', 'test', 'other')).toBe(true);
        expect(evaluateCondition('ne', 42, 43)).toBe(true);
        expect(evaluateCondition('ne', true, false)).toBe(true);
      });

      it('should not match equal values', () => {
        expect(evaluateCondition('ne', 'test', 'test')).toBe(false);
        expect(evaluateCondition('ne', 42, 42)).toBe(false);
        expect(evaluateCondition('ne', true, true)).toBe(false);
      });
    });

    describe('gt operator', () => {
      it('should match greater numbers', () => {
        expect(evaluateCondition('gt', 10, 5)).toBe(true);
        expect(evaluateCondition('gt', 100, 99)).toBe(true);
      });

      it('should not match lesser or equal numbers', () => {
        expect(evaluateCondition('gt', 5, 10)).toBe(false);
        expect(evaluateCondition('gt', 5, 5)).toBe(false);
      });

      it('should handle string numbers', () => {
        expect(evaluateCondition('gt', '10', '5')).toBe(true);
        expect(evaluateCondition('gt', '5', '10')).toBe(false);
      });

      it('should return false for non-numeric values', () => {
        expect(evaluateCondition('gt', 'abc', 'def')).toBe(false);
        expect(evaluateCondition('gt', true, false)).toBe(false);
      });
    });

    describe('gte operator', () => {
      it('should match greater or equal numbers', () => {
        expect(evaluateCondition('gte', 10, 5)).toBe(true);
        expect(evaluateCondition('gte', 5, 5)).toBe(true);
      });

      it('should not match lesser numbers', () => {
        expect(evaluateCondition('gte', 5, 10)).toBe(false);
      });

      it('should handle string numbers', () => {
        expect(evaluateCondition('gte', '10', '10')).toBe(true);
        expect(evaluateCondition('gte', '5', '10')).toBe(false);
      });
    });

    describe('lt operator', () => {
      it('should match lesser numbers', () => {
        expect(evaluateCondition('lt', 5, 10)).toBe(true);
        expect(evaluateCondition('lt', 99, 100)).toBe(true);
      });

      it('should not match greater or equal numbers', () => {
        expect(evaluateCondition('lt', 10, 5)).toBe(false);
        expect(evaluateCondition('lt', 5, 5)).toBe(false);
      });

      it('should handle string numbers', () => {
        expect(evaluateCondition('lt', '5', '10')).toBe(true);
        expect(evaluateCondition('lt', '10', '5')).toBe(false);
      });
    });

    describe('lte operator', () => {
      it('should match lesser or equal numbers', () => {
        expect(evaluateCondition('lte', 5, 10)).toBe(true);
        expect(evaluateCondition('lte', 5, 5)).toBe(true);
      });

      it('should not match greater numbers', () => {
        expect(evaluateCondition('lte', 10, 5)).toBe(false);
      });

      it('should handle string numbers', () => {
        expect(evaluateCondition('lte', '10', '10')).toBe(true);
        expect(evaluateCondition('lte', '10', '5')).toBe(false);
      });
    });

    describe('contains operator', () => {
      it('should match substring in string', () => {
        expect(evaluateCondition('contains', 'hello world', 'world')).toBe(
          true
        );
        expect(evaluateCondition('contains', 'test', 'es')).toBe(true);
      });

      it('should not match non-substring', () => {
        expect(evaluateCondition('contains', 'hello', 'world')).toBe(false);
      });

      it('should match element in array', () => {
        expect(evaluateCondition('contains', ['a', 'b', 'c'], 'b')).toBe(
          true
        );
        expect(evaluateCondition('contains', [1, 2, 3], 2)).toBe(true);
      });

      it('should not match non-element in array', () => {
        expect(evaluateCondition('contains', ['a', 'b', 'c'], 'd')).toBe(
          false
        );
        expect(evaluateCondition('contains', [1, 2, 3], 4)).toBe(false);
      });

      it('should return false for non-string/non-array values', () => {
        expect(evaluateCondition('contains', 42, 4)).toBe(false);
        expect(evaluateCondition('contains', true, 'true')).toBe(false);
      });
    });

    describe('matches operator', () => {
      it('should match regex pattern', () => {
        expect(evaluateCondition('matches', 'hello123', '\\d+')).toBe(true);
        expect(evaluateCondition('matches', 'test@example.com', '.+@.+\\..+')).toBe(
          true
        );
      });

      it('should not match non-matching pattern', () => {
        expect(evaluateCondition('matches', 'hello', '\\d+')).toBe(false);
        expect(evaluateCondition('matches', 'test', '.+@.+\\..+')).toBe(false);
      });

      it('should handle invalid regex gracefully', () => {
        expect(evaluateCondition('matches', 'test', '[')).toBe(false);
        expect(evaluateCondition('matches', 'test', '*invalid')).toBe(false);
      });

      it('should return false for non-string values', () => {
        expect(evaluateCondition('matches', 42, '\\d+')).toBe(false);
        expect(evaluateCondition('matches', 'test', 123 as any)).toBe(false);
      });
    });
  });

  describe('resolveFieldPath', () => {
    it('should resolve top-level fields', () => {
      const obj = { name: 'test', age: 30 };
      expect(resolveFieldPath(obj, 'name')).toBe('test');
      expect(resolveFieldPath(obj, 'age')).toBe(30);
    });

    it('should resolve nested fields', () => {
      const obj = {
        user: {
          profile: {
            name: 'John',
            age: 25
          }
        }
      };
      expect(resolveFieldPath(obj, 'user.profile.name')).toBe('John');
      expect(resolveFieldPath(obj, 'user.profile.age')).toBe(25);
    });

    it('should resolve deeply nested fields', () => {
      const obj = {
        security: {
          scan: {
            results: {
              injection_risk: 'high'
            }
          }
        }
      };
      expect(
        resolveFieldPath(obj, 'security.scan.results.injection_risk')
      ).toBe('high');
    });

    it('should return undefined for missing fields', () => {
      const obj = { name: 'test' };
      expect(resolveFieldPath(obj, 'missing')).toBeUndefined();
      expect(resolveFieldPath(obj, 'name.missing')).toBeUndefined();
    });

    it('should return undefined for null/undefined intermediate values', () => {
      const obj = { user: null };
      expect(resolveFieldPath(obj, 'user.name')).toBeUndefined();
    });

    it('should handle arrays and objects', () => {
      const obj = {
        items: [{ id: 1 }, { id: 2 }],
        meta: { count: 2 }
      };
      expect(resolveFieldPath(obj, 'meta.count')).toBe(2);
    });
  });

  describe('PolicyEvaluator', () => {
    let evaluator: PolicyEvaluator;

    beforeEach(() => {
      evaluator = new PolicyEvaluator();
    });

    describe('loadPolicies', () => {
      it('should load policies', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: []
        };
        evaluator.loadPolicies([policy]);
        expect(evaluator.evaluate({})).toEqual({
          shouldBlock: false,
          violations: [],
          warnings: [],
          logs: []
        });
      });

      it('should replace existing policies', () => {
        const policy1: Policy = {
          id: 'policy-1',
          name: 'Policy 1',
          version: '1.0.0',
          rules: [
            {
              id: 'rule-1',
              name: 'Rule 1',
              enabled: true,
              conditions: [{ field: 'test', operator: 'eq', value: true }],
              actions: [{ type: 'block', message: 'Blocked' }]
            }
          ]
        };
        const policy2: Policy = {
          id: 'policy-2',
          name: 'Policy 2',
          version: '1.0.0',
          rules: []
        };

        evaluator.loadPolicies([policy1]);
        let result = evaluator.evaluate({ test: true });
        expect(result.shouldBlock).toBe(true);

        evaluator.loadPolicies([policy2]);
        result = evaluator.evaluate({ test: true });
        expect(result.shouldBlock).toBe(false);
      });
    });

    describe('addPolicy', () => {
      it('should add policy to existing list', () => {
        const policy1: Policy = {
          id: 'policy-1',
          name: 'Policy 1',
          version: '1.0.0',
          rules: []
        };
        const policy2: Policy = {
          id: 'policy-2',
          name: 'Policy 2',
          version: '1.0.0',
          rules: [
            {
              id: 'rule-2',
              name: 'Rule 2',
              enabled: true,
              conditions: [{ field: 'test', operator: 'eq', value: true }],
              actions: [{ type: 'warn', message: 'Warning' }]
            }
          ]
        };

        evaluator.loadPolicies([policy1]);
        evaluator.addPolicy(policy2);

        const result = evaluator.evaluate({ test: true });
        expect(result.warnings).toHaveLength(1);
      });
    });

    describe('evaluate', () => {
      it('should return empty result for empty policies', () => {
        const result = evaluator.evaluate({});
        expect(result).toEqual({
          shouldBlock: false,
          violations: [],
          warnings: [],
          logs: []
        });
      });

      it('should skip disabled rules', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'disabled-rule',
              name: 'Disabled Rule',
              enabled: false,
              conditions: [{ field: 'test', operator: 'eq', value: true }],
              actions: [{ type: 'block', message: 'Should not trigger' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ test: true });

        expect(result.shouldBlock).toBe(false);
        expect(result.violations).toHaveLength(0);
      });

      it('should enforce AND logic for conditions', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'and-rule',
              name: 'AND Rule',
              enabled: true,
              conditions: [
                { field: 'test1', operator: 'eq', value: true },
                { field: 'test2', operator: 'eq', value: true }
              ],
              actions: [{ type: 'block', message: 'Both conditions met' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);

        const result1 = evaluator.evaluate({ test1: true, test2: true });
        expect(result1.shouldBlock).toBe(true);

        const result2 = evaluator.evaluate({ test1: true, test2: false });
        expect(result2.shouldBlock).toBe(false);

        const result3 = evaluator.evaluate({ test1: false, test2: true });
        expect(result3.shouldBlock).toBe(false);
      });

      it('should set shouldBlock for block actions', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'block-rule',
              name: 'Block Rule',
              enabled: true,
              conditions: [{ field: 'blocked', operator: 'eq', value: true }],
              actions: [{ type: 'block', message: 'Access blocked' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ blocked: true });

        expect(result.shouldBlock).toBe(true);
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].ruleId).toBe('block-rule');
        expect(result.violations[0].action.message).toBe('Access blocked');
      });

      it('should add warn actions to warnings', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'warn-rule',
              name: 'Warn Rule',
              enabled: true,
              conditions: [{ field: 'warning', operator: 'eq', value: true }],
              actions: [{ type: 'warn', message: 'Warning message' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ warning: true });

        expect(result.shouldBlock).toBe(false);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0].ruleId).toBe('warn-rule');
        expect(result.warnings[0].action.message).toBe('Warning message');
      });

      it('should add log actions to logs', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'log-rule',
              name: 'Log Rule',
              enabled: true,
              conditions: [{ field: 'log', operator: 'eq', value: true }],
              actions: [{ type: 'log', message: 'Log message' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ log: true });

        expect(result.shouldBlock).toBe(false);
        expect(result.logs).toHaveLength(1);
        expect(result.logs[0].ruleId).toBe('log-rule');
        expect(result.logs[0].action.message).toBe('Log message');
      });

      it('should add notify actions to warnings', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'notify-rule',
              name: 'Notify Rule',
              enabled: true,
              conditions: [{ field: 'notify', operator: 'eq', value: true }],
              actions: [{ type: 'notify', message: 'Notify message' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ notify: true });

        expect(result.shouldBlock).toBe(false);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0].action.type).toBe('notify');
      });

      it('should handle multiple actions in a single rule', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'multi-action-rule',
              name: 'Multi Action Rule',
              enabled: true,
              conditions: [{ field: 'trigger', operator: 'eq', value: true }],
              actions: [
                { type: 'log', message: 'Logging event' },
                { type: 'warn', message: 'Warning user' },
                { type: 'block', message: 'Blocking access' }
              ]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ trigger: true });

        expect(result.shouldBlock).toBe(true);
        expect(result.logs).toHaveLength(1);
        expect(result.warnings).toHaveLength(1);
        expect(result.violations).toHaveLength(1);
      });

      it('should handle multiple rules', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'rule-1',
              name: 'Rule 1',
              enabled: true,
              conditions: [{ field: 'test1', operator: 'eq', value: true }],
              actions: [{ type: 'warn', message: 'Warning 1' }]
            },
            {
              id: 'rule-2',
              name: 'Rule 2',
              enabled: true,
              conditions: [{ field: 'test2', operator: 'eq', value: true }],
              actions: [{ type: 'log', message: 'Log 2' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ test1: true, test2: true });

        expect(result.warnings).toHaveLength(1);
        expect(result.logs).toHaveLength(1);
      });

      it('should include context in violations', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'context-rule',
              name: 'Context Rule',
              enabled: true,
              conditions: [{ field: 'check', operator: 'eq', value: true }],
              actions: [{ type: 'block', message: 'Blocked' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const context = { check: true, user: 'test-user', timestamp: 123456 };
        const result = evaluator.evaluate(context);

        expect(result.violations[0].context).toEqual(context);
      });

      it('should handle action metadata', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'metadata-rule',
              name: 'Metadata Rule',
              enabled: true,
              conditions: [{ field: 'test', operator: 'eq', value: true }],
              actions: [
                {
                  type: 'warn',
                  message: 'Warning',
                  metadata: { severity: 'high', category: 'security' }
                }
              ]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({ test: true });

        expect(result.warnings[0].action.metadata).toEqual({
          severity: 'high',
          category: 'security'
        });
      });

      it('should handle nested field conditions', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          rules: [
            {
              id: 'nested-rule',
              name: 'Nested Rule',
              enabled: true,
              conditions: [
                {
                  field: 'security.injection_risk',
                  operator: 'eq',
                  value: 'high'
                }
              ],
              actions: [{ type: 'block', message: 'High injection risk' }]
            }
          ]
        };

        evaluator.loadPolicies([policy]);
        const result = evaluator.evaluate({
          security: { injection_risk: 'high' }
        });

        expect(result.shouldBlock).toBe(true);
        expect(result.violations[0].action.message).toBe(
          'High injection risk'
        );
      });
    });
  });

  describe('Policy Loader', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = mkdtempSync(join(tmpdir(), 'policy-test-'));
    });

    afterEach(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });

    describe('loadPolicyFromFile', () => {
      it('should load policy from JSON file', () => {
        const policy: Policy = {
          id: 'test-policy',
          name: 'Test Policy',
          version: '1.0.0',
          description: 'A test policy',
          rules: [
            {
              id: 'rule-1',
              name: 'Rule 1',
              enabled: true,
              conditions: [{ field: 'test', operator: 'eq', value: true }],
              actions: [{ type: 'block', message: 'Blocked' }]
            }
          ]
        };

        const filePath = join(tempDir, 'test.policy.json');
        writeFileSync(filePath, JSON.stringify(policy, null, 2));

        const loaded = loadPolicyFromFile(filePath);

        expect(loaded).toEqual(policy);
        expect(loaded.id).toBe('test-policy');
        expect(loaded.rules).toHaveLength(1);
      });

      it('should load policy with all fields', () => {
        const policy: Policy = {
          id: 'comprehensive-policy',
          name: 'Comprehensive Policy',
          version: '2.0.0',
          description: 'A comprehensive test policy',
          rules: [
            {
              id: 'rule-1',
              name: 'Security Rule',
              description: 'Checks security',
              enabled: true,
              conditions: [
                { field: 'security.level', operator: 'gte', value: 5 }
              ],
              actions: [
                {
                  type: 'warn',
                  message: 'Security level warning',
                  metadata: { priority: 'high' }
                }
              ]
            }
          ]
        };

        const filePath = join(tempDir, 'comprehensive.policy.json');
        writeFileSync(filePath, JSON.stringify(policy, null, 2));

        const loaded = loadPolicyFromFile(filePath);

        expect(loaded.description).toBe('A comprehensive test policy');
        expect(loaded.rules[0].description).toBe('Checks security');
        expect(loaded.rules[0].actions[0].metadata).toEqual({
          priority: 'high'
        });
      });
    });

    describe('loadPoliciesFromDir', () => {
      it('should load all policy files from directory', async () => {
        const policy1: Policy = {
          id: 'policy-1',
          name: 'Policy 1',
          version: '1.0.0',
          rules: []
        };
        const policy2: Policy = {
          id: 'policy-2',
          name: 'Policy 2',
          version: '1.0.0',
          rules: []
        };

        writeFileSync(
          join(tempDir, 'policy1.policy.json'),
          JSON.stringify(policy1)
        );
        writeFileSync(
          join(tempDir, 'policy2.policy.json'),
          JSON.stringify(policy2)
        );

        const policies = await loadPoliciesFromDir(tempDir);

        expect(policies).toHaveLength(2);
        expect(policies.map((p) => p.id).sort()).toEqual([
          'policy-1',
          'policy-2'
        ]);
      });

      it('should ignore non-policy files', async () => {
        const policy: Policy = {
          id: 'policy-1',
          name: 'Policy 1',
          version: '1.0.0',
          rules: []
        };

        writeFileSync(
          join(tempDir, 'policy1.policy.json'),
          JSON.stringify(policy)
        );
        writeFileSync(join(tempDir, 'other.json'), '{}');
        writeFileSync(join(tempDir, 'readme.txt'), 'readme');

        const policies = await loadPoliciesFromDir(tempDir);

        expect(policies).toHaveLength(1);
        expect(policies[0].id).toBe('policy-1');
      });

      it('should return empty array for empty directory', async () => {
        const policies = await loadPoliciesFromDir(tempDir);
        expect(policies).toEqual([]);
      });

      it('should handle directory with only non-policy files', async () => {
        writeFileSync(join(tempDir, 'config.json'), '{}');
        writeFileSync(join(tempDir, 'readme.md'), '# README');

        const policies = await loadPoliciesFromDir(tempDir);
        expect(policies).toEqual([]);
      });
    });
  });
});
