import type { ConditionOperator } from './schema.js';

type MatcherFn = (actual: unknown, expected: unknown) => boolean;

function toNumber(val: unknown): number | null {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

const matchers: Record<ConditionOperator, MatcherFn> = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,

  gt: (a, b) => {
    const na = toNumber(a);
    const nb = toNumber(b);
    return na !== null && nb !== null && na > nb;
  },
  gte: (a, b) => {
    const na = toNumber(a);
    const nb = toNumber(b);
    return na !== null && nb !== null && na >= nb;
  },
  lt: (a, b) => {
    const na = toNumber(a);
    const nb = toNumber(b);
    return na !== null && nb !== null && na < nb;
  },
  lte: (a, b) => {
    const na = toNumber(a);
    const nb = toNumber(b);
    return na !== null && nb !== null && na <= nb;
  },

  contains: (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.includes(b);
    }
    if (Array.isArray(a)) {
      return a.includes(b);
    }
    return false;
  },

  matches: (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (b.length > 200) return false;
    try {
      return new RegExp(b).test(a.slice(0, 10_000));
    } catch {
      return false;
    }
  }
};

export function evaluateCondition(
  operator: ConditionOperator,
  actual: unknown,
  expected: unknown
): boolean {
  const fn = matchers[operator];
  if (!fn) return false;
  return fn(actual, expected);
}

const BLOCKED_PROPS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_DEPTH = 10;

export function resolveFieldPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  if (parts.length > MAX_DEPTH) return undefined;

  let current: unknown = obj;
  for (const part of parts) {
    if (BLOCKED_PROPS.has(part)) return undefined;
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    if (!Object.hasOwn(current as object, part)) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
