import { resolve, sep } from 'path';

const SAFE_PROJECT_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Validates a project slug is safe lowercase kebab-case.
 * Throws if the slug contains invalid characters.
 */
export function validateProjectSlug(project: string): void {
  if (!SAFE_PROJECT_SLUG.test(project)) {
    throw new Error(
      `Invalid project slug "${project}". ` +
        'Slugs must be lowercase kebab-case (e.g. "my-project").'
    );
  }
}

/**
 * Checks whether a candidate path stays within the given base directory.
 * Returns false if path traversal is detected.
 */
export function isSafePathWithinBase(base: string, candidate: string): boolean {
  if (candidate.includes('..') || candidate.includes('/') || candidate.includes('\\')) {
    return false;
  }
  const resolved = resolve(base, candidate);
  return resolved === base || resolved.startsWith(base + sep);
}

/**
 * Resolves a filename within a base directory, throwing on path traversal.
 */
export function safeResolve(base: string, filename: string): string {
  if (!isSafePathWithinBase(base, filename)) {
    throw new Error(`Path traversal detected: "${filename}" is not safe within "${base}".`);
  }
  return resolve(base, filename);
}
