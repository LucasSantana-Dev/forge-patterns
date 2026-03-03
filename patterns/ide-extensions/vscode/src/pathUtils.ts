import * as path from 'path';

/**
 * Asserts that `resolved` is within `base` (or equals it). Throws if path traversal would escape.
 * Same contract as `safeResolve` in src/mcp-context-server/store.ts.
 */
export function assertWithinBase(resolved: string, base: string): void {
  const normalizedResolved = path.resolve(resolved);
  const normalizedBase = path.resolve(base);
  const rel = path.relative(normalizedBase, normalizedResolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(
      `Path traversal detected: "${resolved}" escapes base "${base}".`
    );
  }
}

/**
 * Joins base with segments, rejecting any segment containing `..`. Returns normalized path.
 */
export function safeJoin(base: string, ...segments: string[]): string {
  for (const seg of segments) {
    if (seg.includes('..')) {
      throw new Error(
        `Path traversal detected: segment "${seg}" contains "..".`
      );
    }
  }
  const joined = path.join(base, ...segments);
  return path.normalize(joined);
}
