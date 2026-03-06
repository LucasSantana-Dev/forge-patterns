import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Policy } from './schema.js';

export function loadPolicyFromFile(filePath: string): Policy {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Policy;
}

export async function loadPoliciesFromDir(
  dirPath: string
): Promise<Policy[]> {
  const entries = await readdir(dirPath);
  const policyFiles = entries.filter(
    (f) => f.endsWith('.policy.json')
  );

  return policyFiles.map((f) =>
    loadPolicyFromFile(join(dirPath, f))
  );
}
