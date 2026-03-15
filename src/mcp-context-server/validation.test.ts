import { validateProjectSlug, isSafePathWithinBase, safeResolve } from './validation.js';
import { resolve } from 'path';

describe('mcp-context-server/validation', () => {
  describe('validateProjectSlug', () => {
    it('accepts valid single-word slugs', () => {
      expect(() => validateProjectSlug('siza')).not.toThrow();
      expect(() => validateProjectSlug('core')).not.toThrow();
      expect(() => validateProjectSlug('abc123')).not.toThrow();
    });

    it('accepts valid kebab-case slugs', () => {
      expect(() => validateProjectSlug('forge-patterns')).not.toThrow();
      expect(() => validateProjectSlug('mcp-gateway')).not.toThrow();
      expect(() => validateProjectSlug('siza-gen')).not.toThrow();
      expect(() => validateProjectSlug('my-project-v2')).not.toThrow();
    });

    it('rejects uppercase letters', () => {
      expect(() => validateProjectSlug('MyProject')).toThrow('Invalid project slug');
      expect(() => validateProjectSlug('CORE')).toThrow();
    });

    it('rejects leading or trailing hyphens', () => {
      expect(() => validateProjectSlug('-siza')).toThrow();
      expect(() => validateProjectSlug('siza-')).toThrow();
    });

    it('rejects consecutive hyphens', () => {
      expect(() => validateProjectSlug('siza--gen')).toThrow();
    });

    it('rejects empty string', () => {
      expect(() => validateProjectSlug('')).toThrow();
    });

    it('rejects path separators', () => {
      expect(() => validateProjectSlug('siza/gen')).toThrow();
      expect(() => validateProjectSlug('siza\\gen')).toThrow();
    });

    it('rejects dots', () => {
      expect(() => validateProjectSlug('siza.gen')).toThrow();
      expect(() => validateProjectSlug('../etc')).toThrow();
    });

    it('rejects spaces', () => {
      expect(() => validateProjectSlug('my project')).toThrow();
    });

    it('rejects special characters', () => {
      expect(() => validateProjectSlug('siza_gen')).toThrow();
      expect(() => validateProjectSlug('siza@1.0')).toThrow();
      expect(() => validateProjectSlug('siza#1')).toThrow();
    });

    it('rejects null-byte injection', () => {
      expect(() => validateProjectSlug('siza\x00gen')).toThrow();
    });

    it('includes the invalid slug in the error message', () => {
      expect(() => validateProjectSlug('My/Bad/Slug')).toThrow('"My/Bad/Slug"');
    });

    it('mentions kebab-case in the error message', () => {
      expect(() => validateProjectSlug('BadSlug')).toThrow('kebab-case');
    });
  });

  describe('isSafePathWithinBase', () => {
    const BASE = '/safe/base/dir';

    it('returns true for a simple filename within base', () => {
      expect(isSafePathWithinBase(BASE, 'project.md')).toBe(true);
      expect(isSafePathWithinBase(BASE, 'my-project.meta.json')).toBe(true);
    });

    it('returns false for path traversal with ..', () => {
      expect(isSafePathWithinBase(BASE, '../escape')).toBe(false);
      expect(isSafePathWithinBase(BASE, '../../etc/passwd')).toBe(false);
    });

    it('returns false for forward slash in candidate', () => {
      expect(isSafePathWithinBase(BASE, 'sub/file')).toBe(false);
    });

    it('returns false for backslash in candidate', () => {
      expect(isSafePathWithinBase(BASE, 'sub\\file')).toBe(false);
    });

    it('returns true for file that stays within base when resolved', () => {
      const base = resolve('/tmp/store');
      expect(isSafePathWithinBase(base, 'forge-patterns.md')).toBe(true);
    });
  });

  describe('safeResolve', () => {
    const BASE = resolve('/tmp/test-store');

    it('resolves a safe filename within base', () => {
      const result = safeResolve(BASE, 'my-project.md');
      expect(result).toBe(resolve(BASE, 'my-project.md'));
    });

    it('throws for path traversal with ..', () => {
      expect(() => safeResolve(BASE, '../escape.md')).toThrow('Path traversal detected');
    });

    it('throws for forward slash in filename', () => {
      expect(() => safeResolve(BASE, 'sub/file.md')).toThrow('Path traversal detected');
    });

    it('throws for backslash in filename', () => {
      expect(() => safeResolve(BASE, 'sub\\file.md')).toThrow('Path traversal detected');
    });

    it('error message includes the problematic filename', () => {
      expect(() => safeResolve(BASE, '../evil')).toThrow('"../evil"');
    });
  });
});
