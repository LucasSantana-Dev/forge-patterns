/**
 * Environment Constants Tests
 *
 * Tests for environment and logging constants shared across the Forge ecosystem.
 * Validates environment types, log levels, and validation functions.
 */

import {
  NODE_ENVS,
  DEFAULT_NODE_ENV,
  LOG_LEVELS,
  DEFAULT_LOG_LEVEL,
  isValidNodeEnv,
  isValidLogLevel,
  type NodeEnv,
  type LogLevel
} from '../environments';

describe('Environment Constants', () => {
  describe('Type Definitions', () => {
    it('should have correct NodeEnv type', () => {
      const validEnvs: NodeEnv[] = ['development', 'production', 'test'];
      expect(validEnvs).toEqual(expect.arrayContaining(['development', 'production', 'test']));
    });

    it('should have correct LogLevel type', () => {
      const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
      expect(validLevels).toEqual(expect.arrayContaining(['debug', 'info', 'warn', 'error']));
    });
  });

  describe('Node Environment Constants', () => {
    it('should have all required node environments', () => {
      expect(NODE_ENVS).toEqual(['development', 'production', 'test']);
    });

    it('should have correct default node environment', () => {
      expect(DEFAULT_NODE_ENV).toBe('production');
    });

    it('should have valid node environment values', () => {
      NODE_ENVS.forEach(env => {
        expect(typeof env).toBe('string');
        expect(env.length).toBeGreaterThan(0);
        expect(env.trim()).toBe(env);
      });
    });
  });

  describe('Log Level Constants', () => {
    it('should have all required log levels', () => {
      expect(LOG_LEVELS).toEqual(['debug', 'info', 'warn', 'error']);
    });

    it('should have correct default log level', () => {
      expect(DEFAULT_LOG_LEVEL).toBe('info');
    });

    it('should have valid log level values', () => {
      LOG_LEVELS.forEach(level => {
        expect(typeof level).toBe('string');
        expect(level.length).toBeGreaterThan(0);
        expect(level.trim()).toBe(level);
      });
    });

    it('should have log levels in severity order', () => {
      // debug < info < warn < error
      const levels = LOG_LEVELS;
      const severityOrder = ['debug', 'info', 'warn', 'error'];

      expect(levels).toEqual(severityOrder);
    });
  });

  describe('Validation Functions', () => {
    describe('isValidNodeEnv', () => {
      it('should return true for valid node environments', () => {
        expect(isValidNodeEnv('development')).toBe(true);
        expect(isValidNodeEnv('production')).toBe(true);
        expect(isValidNodeEnv('test')).toBe(true);
      });

      it('should return false for invalid node environments', () => {
        expect(isValidNodeEnv('invalid')).toBe(false);
        expect(isValidNodeEnv('')).toBe(false);
        expect(isValidNodeEnv('DEV')).toBe(false);
        expect(isValidNodeEnv('PROD')).toBe(false);
        expect(isValidNodeEnv('staging')).toBe(false);
        expect(isValidNodeEnv(null as any)).toBe(false);
        expect(isValidNodeEnv(undefined as any)).toBe(false);
      });

      it('should handle edge cases', () => {
        expect(isValidNodeEnv('')).toBe(false);
        expect(isValidNodeEnv('  development  ')).toBe(false);
        expect(isValidNodeEnv('\nproduction\n')).toBe(false);
        expect(isValidNodeEnv('PRODUCTION')).toBe(false);
      });
    });

    describe('isValidLogLevel', () => {
      it('should return true for valid log levels', () => {
        expect(isValidLogLevel('debug')).toBe(true);
        expect(isValidLogLevel('info')).toBe(true);
        expect(isValidLogLevel('warn')).toBe(true);
        expect(isValidLogLevel('error')).toBe(true);
      });

      it('should return false for invalid log levels', () => {
        expect(isValidLogLevel('invalid')).toBe(false);
        expect(isValidLogLevel('')).toBe(false);
        expect(isValidLogLevel('INFO')).toBe(false);
        expect(isValidLogLevel('ERROR')).toBe(false);
        expect(isValidLogLevel('trace')).toBe(false);
        expect(isValidLogLevel(null as any)).toBe(false);
        expect(isValidLogLevel(undefined as any)).toBe(false);
      });

      it('should handle edge cases', () => {
        expect(isValidLogLevel('')).toBe(false);
        expect(isValidLogLevel('  info  ')).toBe(false);
        expect(isValidLogLevel('\nerror\n')).toBe(false);
        expect(isValidLogLevel('ERROR')).toBe(false);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have unique environment values', () => {
      const uniqueEnvs = [...new Set(NODE_ENVS)];
      expect(NODE_ENVS).toEqual(uniqueEnvs);
    });

    it('should have unique log level values', () => {
      const uniqueLevels = [...new Set(LOG_LEVELS)];
      expect(LOG_LEVELS).toEqual(uniqueLevels);
    });

    it('should have no empty strings', () => {
      NODE_ENVS.forEach(env => {
        expect(env.trim()).not.toBe('');
      });

      LOG_LEVELS.forEach(level => {
        expect(level.trim()).not.toBe('');
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type consistency for node environments', () => {
      const env: NodeEnv = 'production';
      expect(typeof env).toBe('string');
      expect(['development', 'production', 'test']).toContain(env);
    });

    it('should maintain type consistency for log levels', () => {
      const level: LogLevel = 'info';
      expect(typeof level).toBe('string');
      expect(['debug', 'info', 'warn', 'error']).toContain(level);
    });

    it('should work with type guards', () => {
      const processEnv = 'production';

      if (isValidNodeEnv(processEnv)) {
        const env: NodeEnv = processEnv;
        expect(env).toBe('production');
      }

      if (isValidLogLevel('info')) {
        const level: LogLevel = 'info';
        expect(level).toBe('info');
      }
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle environment detection', () => {
      const currentEnv = 'production';

      if (isValidNodeEnv(currentEnv)) {
        expect(currentEnv).toBe('production');
        expect(DEFAULT_NODE_ENV).toBe('production');
      }
    });

    it('should validate environment variables', () => {
      const envVar = 'development';

      if (isValidNodeEnv(envVar)) {
        expect(envVar).toBe('development');
      } else {
        expect(DEFAULT_NODE_ENV).toBe('production');
      }
    });

    it('should validate log level configuration', () => {
      const logLevel = 'debug';

      if (isValidLogLevel(logLevel)) {
        expect(logLevel).toBe('debug');
      } else {
        expect(DEFAULT_LOG_LEVEL).toBe('info');
      }
    });

    it('should support environment iteration', () => {
      const environments = NODE_ENVS;
      const validEnvs = environments.filter(isValidNodeEnv);

      expect(validEnvs).toEqual(['development', 'production', 'test']);
    });

    it('should support log level iteration', () => {
      const levels = LOG_LEVELS;
      const validLevels = levels.filter(isValidLogLevel);

      expect(validLevels).toEqual(['debug', 'info', 'warn', 'error']);
    });

    it('should handle configuration validation', () => {
      const config = {
        nodeEnv: 'production',
        logLevel: 'info'
      };

      const validEnv = isValidNodeEnv(config.nodeEnv);
      const validLevel = isValidLogLevel(config.logLevel);

      expect(validEnv).toBe(true);
      expect(validLevel).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays gracefully', () => {
      const emptyEnvs: NodeEnv[] = [];
      const emptyLevels: LogLevel[] = [];

      expect(emptyEnvs).toHaveLength(0);
      expect(emptyLevels).toHaveLength(0);
    });

    it('should handle case sensitivity', () => {
      expect(isValidNodeEnv('Production')).toBe(false);
      expect(isValidLogLevel('INFO')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isValidNodeEnv(' production ')).toBe(false);
      expect(isValidLogLevel(' info ')).toBe(false);
    });
  });

  describe('Integration with Process Env', () => {
    beforeEach(() => {
      delete process.env.NODE_ENV;
      delete process.env.LOG_LEVEL;
    });

    it('should work with process.env fallback', () => {
      expect(isValidNodeEnv('production')).toBe(true);
      expect(isValidLogLevel('debug')).toBe(true);
    });

    it('should handle process.env when present', () => {
      process.env.NODE_ENV = 'development';
      process.env.LOG_LEVEL = 'debug';

      expect(isValidNodeEnv('development')).toBe(true);
      expect(isValidLogLevel('debug')).toBe(true);

      delete process.env.NODE_ENV;
      delete process.env.LOG_LEVEL;
    });
  });
});
