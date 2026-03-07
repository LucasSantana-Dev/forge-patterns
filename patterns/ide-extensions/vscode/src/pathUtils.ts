import * as path from 'path';

/**
 * Asserts that `resolved` is within `base` (or equals it). Throws if path traversal would escape.
 * Same contract as `safeResolve` in src/mcp-context-server/store.ts.
 */
export function assertWithinBase(resolved: string, base: string): void {
  const normalizedResolved = path.resolve(resolved);
  const normalizedBase = path.resolve(base);
  const rel = path.relative(normalizedBase, normalizedResolved);
  const { sep } = path;
  if (path.isAbsolute(rel) || rel === '..' || rel.startsWith('..' + sep)) {
    throw new Error(`Path traversal detected: "${resolved}" escapes base "${base}".`);
  }
}

/**
 * Joins base with segments, rejecting `..` and absolute segments. Returns normalized path.
 */
export function safeJoin(base: string, ...segments: string[]): string {
  const resolvedBase = path.resolve(base);
  for (const seg of segments) {
    if (path.isAbsolute(seg) || seg.includes('..')) {
      throw new Error(`Path traversal detected: segment "${seg}" contains invalid path.`);
    }
  }
  const joined = path.resolve(resolvedBase, ...segments);
  assertWithinBase(joined, resolvedBase);
  return path.normalize(joined);
}
