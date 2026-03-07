import fc from 'fast-check';
import { evaluateCondition, resolveFieldPath } from '../policy-engine/builtin-functions.js';

describe('evaluateCondition — property tests', () => {
  describe('eq/ne are complementary', () => {
    it('eq and ne always produce opposite results for same inputs', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (a, b) => {
          const eq = evaluateCondition('eq', a, b);
          const ne = evaluateCondition('ne', a, b);
          expect(eq).toBe(!ne);
        })
      );
    });
  });

  describe('numeric comparisons are consistent', () => {
    it('gt and lte are complementary for valid numbers', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          const gt = evaluateCondition('gt', a, b);
          const lte = evaluateCondition('lte', a, b);
          expect(gt).toBe(!lte);
        })
      );
    });

    it('lt and gte are complementary for valid numbers', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          const lt = evaluateCondition('lt', a, b);
          const gte = evaluateCondition('gte', a, b);
          expect(lt).toBe(!gte);
        })
      );
    });

    it('gt is transitive: a > b && b > c implies a > c', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const ab = evaluateCondition('gt', a, b);
          const bc = evaluateCondition('gt', b, c);
          if (ab && bc) {
            expect(evaluateCondition('gt', a, c)).toBe(true);
          }
        })
      );
    });

    it('eq is reflexive: a eq a is always true for numbers', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(evaluateCondition('eq', a, a)).toBe(true);
        })
      );
    });

    it('numeric string coercion: "5" gt 3 should be true', () => {
      fc.assert(
        fc.property(fc.integer({ min: -1000, max: 1000 }), (n) => {
          const strN = String(n);
          expect(evaluateCondition('eq', n, n)).toBe(true);
          expect(evaluateCondition('gt', strN, n - 1)).toBe(true);
          expect(evaluateCondition('lt', strN, n + 1)).toBe(true);
        })
      );
    });
  });

  describe('non-numeric inputs return false for comparisons', () => {
    it('gt/gte/lt/lte return false for non-numeric values', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.boolean(), fc.constant(null), fc.constant(undefined)),
          fc.integer(),
          (nonNum, num) => {
            expect(evaluateCondition('gt', nonNum, num)).toBe(false);
            expect(evaluateCondition('gte', nonNum, num)).toBe(false);
            expect(evaluateCondition('lt', nonNum, num)).toBe(false);
            expect(evaluateCondition('lte', nonNum, num)).toBe(false);
          }
        )
      );
    });
  });

  describe('contains', () => {
    it('string always contains itself', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          expect(evaluateCondition('contains', s, s)).toBe(true);
        })
      );
    });

    it('string always contains empty string', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          expect(evaluateCondition('contains', s, '')).toBe(true);
        })
      );
    });

    it('array contains its own elements', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 1 }),
          (arr) => {
            const idx = Math.floor(Math.random() * arr.length);
            expect(evaluateCondition('contains', arr, arr[idx])).toBe(true);
          }
        )
      );
    });
  });

  describe('matches', () => {
    it('returns false for non-string inputs', () => {
      fc.assert(
        fc.property(fc.integer(), fc.string(), (num, pattern) => {
          expect(evaluateCondition('matches', num, pattern)).toBe(false);
        })
      );
    });

    it('rejects patterns longer than 200 chars', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.string({ minLength: 201, maxLength: 300 }),
          (input, longPattern) => {
            expect(evaluateCondition('matches', input, longPattern)).toBe(false);
          }
        )
      );
    });
  });
});

describe('resolveFieldPath — property tests', () => {
  it('resolves single-level paths', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0 && !s.includes('.') && !['__proto__', 'constructor', 'prototype'].includes(s)),
        fc.anything(),
        (key, value) => {
          const obj: Record<string, unknown> = { [key]: value };
          expect(resolveFieldPath(obj, key)).toBe(value);
        }
      )
    );
  });

  it('returns undefined for missing paths', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }).filter(s => s !== 'existing'), (key) => {
        expect(resolveFieldPath({ existing: 1 }, key)).toBeUndefined();
      })
    );
  });

  it('blocks prototype pollution paths', () => {
    const dangerousPaths = ['__proto__', 'constructor', 'prototype'];
    for (const path of dangerousPaths) {
      expect(resolveFieldPath({ [path]: 'evil' }, path)).toBeUndefined();
    }
    expect(resolveFieldPath({ a: { __proto__: 'evil' } }, 'a.__proto__')).toBeUndefined();
  });

  it('rejects paths deeper than MAX_DEPTH (10)', () => {
    const deepPath = Array.from({ length: 11 }, (_, i) => `k${i}`).join('.');
    let obj: Record<string, unknown> = { value: true };
    for (let i = 10; i >= 0; i--) {
      obj = { [`k${i}`]: obj };
    }
    expect(resolveFieldPath(obj, deepPath)).toBeUndefined();
  });

  it('resolves nested paths correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => !s.includes('.') && !['__proto__', 'constructor', 'prototype'].includes(s)),
        fc.string({ minLength: 1 }).filter(s => !s.includes('.') && !['__proto__', 'constructor', 'prototype'].includes(s)),
        fc.anything(),
        (k1, k2, value) => {
          const obj = { [k1]: { [k2]: value } };
          expect(resolveFieldPath(obj, `${k1}.${k2}`)).toBe(value);
        }
      )
    );
  });
});
