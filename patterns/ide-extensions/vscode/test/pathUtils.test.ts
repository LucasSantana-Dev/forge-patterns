import * as path from 'path';
import * as os from 'os';
import { assertWithinBase, safeJoin } from '../src/pathUtils';

describe('pathUtils', () => {
  describe('assertWithinBase', () => {
    it('should allow path within base', () => {
      const base = path.join(os.tmpdir(), 'base');
      const resolved = path.join(base, 'sub', 'file.txt');
      expect(() => assertWithinBase(resolved, base)).not.toThrow();
    });

    it('should allow path equal to base', () => {
      const base = path.join(os.tmpdir(), 'base');
      expect(() => assertWithinBase(base, base)).not.toThrow();
    });

    it('should reject path that escapes base via ..', () => {
      const base = path.join(os.tmpdir(), 'base');
      const resolved = path.join(base, 'sub', '..', '..', 'etc', 'passwd');
      expect(() => assertWithinBase(resolved, base)).toThrow(/Path traversal detected/);
    });

    it('should reject path that escapes base via .. in resolved string', () => {
      const base = '/allowed/base';
      const resolved = '/allowed/base/../etc/passwd';
      expect(() => assertWithinBase(resolved, base)).toThrow(/Path traversal detected/);
    });

    it('should reject path outside base (sibling directory)', () => {
      const base = path.join(os.tmpdir(), 'base');
      const resolved = path.join(os.tmpdir(), 'other', 'file.txt');
      expect(() => assertWithinBase(resolved, base)).toThrow(/Path traversal detected/);
    });
  });

  describe('safeJoin', () => {
    it('should join valid segments', () => {
      const result = safeJoin('/base', 'sub', 'file.txt');
      expect(result).toBe(path.normalize('/base/sub/file.txt'));
    });

    it('should reject segment containing ..', () => {
      expect(() => safeJoin('/base', 'sub', '..', 'file.txt')).toThrow(
        /Path traversal detected/
      );
    });

    it('should reject segment that is ..', () => {
      expect(() => safeJoin('/base', '..')).toThrow(/Path traversal detected/);
    });

    it('should reject segment containing .. in middle', () => {
      expect(() => safeJoin('/base', 'sub/../evil')).toThrow(/Path traversal detected/);
    });

    it('should return normalized path for valid segments', () => {
      const result = safeJoin('/base', 'sub', '.', 'file.txt');
      expect(result).toBe(path.normalize('/base/sub/file.txt'));
    });

    it('should reject absolute path segments', () => {
      expect(() => safeJoin('/base', '/etc/passwd')).toThrow(/Path traversal detected/);
    });
  });
});
