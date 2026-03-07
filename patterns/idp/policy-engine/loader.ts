import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Policy } from './schema.js';

const VALID_OPERATORS = new Set(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'contains', 'matches']);
const VALID_ACTIONS = new Set(['block', 'warn', 'log', 'notify']);

function validatePolicy(data: unknown): Policy {
  if (!data || typeof data !== 'object') {
    throw new Error('Policy must be an object');
  }
  const p = data as Record<string, unknown>;
  if (typeof p.id !== 'string' || !p.id) {
    throw new Error('Policy must have a string id');
  }
  if (typeof p.name !== 'string' || !p.name) {
    throw new Error('Policy must have a string name');
  }
  if (!Array.isArray(p.rules)) {
    throw new Error('Policy must have a rules array');
  }
  for (const rule of p.rules) {
    validateRule(rule as Record<string, unknown>);
  }
  return data as Policy;
}

function validateRule(r: Record<string, unknown>): void {
  if (typeof r.id !== 'string') {
    throw new Error('Rule must have a string id');
  }
  if (!Array.isArray(r.conditions)) {
    throw new Error(`Rule ${r.id}: must have conditions array`);
  }
  for (const c of r.conditions as Record<string, unknown>[]) {
    if (!VALID_OPERATORS.has(c.operator as string)) {
      throw new Error(`Rule ${r.id}: invalid operator "${c.operator}"`);
    }
    if (typeof c.field !== 'string' || !c.field) {
      throw new Error(`Rule ${r.id}: condition missing field`);
    }
  }
  if (!Array.isArray(r.actions)) {
    throw new Error(`Rule ${r.id}: must have actions array`);
  }
  for (const a of r.actions as Record<string, unknown>[]) {
    if (!VALID_ACTIONS.has(a.type as string)) {
      throw new Error(`Rule ${r.id}: invalid action type "${a.type}"`);
    }
  }
}

export function loadPolicyFromFile(filePath: string): Policy {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed: unknown = JSON.parse(raw);
  return validatePolicy(parsed);
}

export async function loadPoliciesFromDir(dirPath: string): Promise<Policy[]> {
  const entries = await readdir(dirPath);
  const policyFiles = entries.filter(f => f.endsWith('.policy.json'));

  return policyFiles.map(f => loadPolicyFromFile(join(dirPath, f)));
}
