/**
 * Feature Flags Constants Tests
 *
 * Tests for feature flag structural pattern shared across the Forge ecosystem.
 * Validates feature flag interfaces, factory functions, and resolution logic.
 */

import {
  FeatureFlagCategory,
  FeatureFlag,
  FeatureFlagsConfig,
  createFeatureFlags,
  resolveFeatureFlag,
  resolveAllFeatureFlags,
  type FeatureFlagCategory as FeatureFlagCategoryType
} from '../feature-flags';

describe('Feature Flags Constants', () => {
  describe('Type Definitions', () => {
    it('should have correct FeatureFlagCategory type', () => {
      const validCategories: FeatureFlagCategoryType[] = ['auth', 'ui', 'generation', 'storage', 'analytics', 'system'];
      expect(validCategories).toEqual(expect.arrayContaining(['auth', 'ui', 'generation', 'storage', 'analytics', 'system']));
    });

    it('should have FeatureFlag interface', () => {
      const flag: FeatureFlag = {
        name: 'TEST_FLAG',
        enabled: true,
        description: 'Test flag',
        category: 'system'
      };

      expect(flag.name).toBe('TEST_FLAG');
      expect(flag.enabled).toBe(true);
      expect(flag.description).toBe('Test flag');
      expect(flag.category).toBe('system');
    });

    it('should have FeatureFlagsConfig interface', () => {
      const config: FeatureFlagsConfig = {
        flags: [
          { name: 'TEST_FLAG', enabled: true, description: 'Test flag', category: 'system' }
        ],
        defaults: { TEST_FLAG: true }
      };

      expect(Array.isArray(config.flags)).toBe(true);
      expect(typeof config.defaults).toBe('object');
    });
  });

  describe('createFeatureFlags', () => {
    it('should create feature flags from definitions', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Enable dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta features', category: 'system' }
      ];

      const result = createFeatureFlags(definitions);

      expect(result).toEqual({
        DARK_MODE: true,
        BETA_FEATURES: false
      });
    });

    it('should apply overrides when provided', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Enable dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta features', category: 'system' }
      ];

      const overrides = { DARK_MODE: false, BETA_FEATURES: true };
      const result = createFeatureFlags(definitions, overrides);

      expect(result).toEqual({
        DARK_MODE: false,
        BETA_FEATURES: true
      });
    });

    it('should handle partial overrides', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Enable dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta features', category: 'system' }
      ];

      const overrides = { DARK_MODE: false };
      const result = createFeatureFlags(definitions, overrides);

      expect(result).toEqual({
        DARK_MODE: false,
        BETA_FEATURES: false
      });
    });

    it('should handle empty definitions', () => {
      const result = createFeatureFlags([]);
      expect(result).toEqual({});
    });

    it('should handle empty overrides', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Enable dark mode', category: 'ui' }
      ];

      const result = createFeatureFlags(definitions, {});
      expect(result).toEqual({
        DARK_MODE: true
      });
    });

    it('should maintain type safety', () => {
      type MyFlags = 'ENABLE_DARK_MODE' | 'ENABLE_BETA';

      const definitions: FeatureFlag<MyFlags>[] = [
        { name: 'ENABLE_DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'ENABLE_BETA', enabled: false, description: 'Beta', category: 'system' }
      ];

      const result: Record<MyFlags, boolean> = createFeatureFlags(definitions);

      expect(typeof result.ENABLE_DARK_MODE).toBe('boolean');
      expect(typeof result.ENABLE_BETA).toBe('boolean');
    });
  });

  describe('resolveFeatureFlag', () => {
    beforeEach(() => {
      // Clear environment variables before each test
      delete process.env.ENABLE_DARK_MODE;
      delete process.env.BETA_FEATURES;
    });

    afterEach(() => {
      // Clean up environment variables after each test
      delete process.env.ENABLE_DARK_MODE;
      delete process.env.BETA_FEATURES;
    });

    it('should return default value when env var is absent', () => {
      const result = resolveFeatureFlag('ENABLE_DARK_MODE', true);
      expect(result).toBe(true);

      const result2 = resolveFeatureFlag('BETA_FEATURES', false);
      expect(result2).toBe(false);
    });

    it('should return env var value when present', () => {
      process.env.ENABLE_DARK_MODE = 'true';
      const result = resolveFeatureFlag('ENABLE_DARK_MODE', false);
      expect(result).toBe(true);

      process.env.BETA_FEATURES = 'false';
      const result2 = resolveFeatureFlag('BETA_FEATURES', true);
      expect(result2).toBe(false);
    });

    it('should handle env prefix correctly', () => {
      process.env.APP_ENABLE_DARK_MODE = 'true';
      process.env.APP_BETA_FEATURES = 'false';

      const result1 = resolveFeatureFlag('ENABLE_DARK_MODE', false, 'APP_');
      const result2 = resolveFeatureFlag('BETA_FEATURES', true, 'APP_');

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    it('should handle invalid env var values', () => {
      const flags = createFeatureFlags([
        { name: 'test_flag', defaultValue: false, category: 'general' }
      ]);

      // Set env var to empty string
      process.env.ENABLE_DARK_MODE = '';
      process.env.BETA_FEATURES = '';

      const result1 = resolveFeatureFlag('test_flag', false);
      const result2 = resolveFeatureFlag('test_flag', false, 'ENABLE_');

      expect(result1).toBe(false);
      expect(result2).toBe(false);

      // Clean up
      delete process.env.ENABLE_DARK_MODE;
      delete process.env.BETA_FEATURES;
    });

    it('should handle case-insensitive env var values', () => {
      process.env.ENABLE_DARK_MODE = 'TRUE';
      process.env.BETA_FEATURES = 'FALSE';

      const result1 = resolveFeatureFlag('ENABLE_DARK_MODE', false);
      const result2 = resolveFeatureFlag('BETA_FEATURES', true);

      expect(result1).toBe(false); // Only 'true' is considered true
      expect(result2).toBe(false);
    });
  });

  describe('resolveAllFeatureFlags', () => {
    beforeEach(() => {
      delete process.env.ENABLE_DARK_MODE;
      delete process.env.BETA_FEATURES;
      delete process.env.DEBUG_MODE;
    });

    afterEach(() => {
      delete process.env.ENABLE_DARK_MODE;
      delete process.env.BETA_FEATURES;
      delete process.env.DEBUG_MODE;
    });

    it('should resolve all flags from definitions', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta', category: 'system' }
      ];

      const result = resolveAllFeatureFlags(definitions);

      expect(result).toEqual({
        DARK_MODE: true,
        BETA_FEATURES: false
      });
    });

    it('should apply env var overrides', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta', category: 'system' }
      ];

      process.env.DARK_MODE = 'false';
      process.env.BETA_FEATURES = 'true';

      const result = resolveAllFeatureFlags(definitions);

      expect(result).toEqual({
        DARK_MODE: false,
        BETA_FEATURES: true
      });
    });

    it('should handle env prefix', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta', category: 'system' }
      ];

      process.env.APP_DARK_MODE = 'false';
      process.env.APP_BETA_FEATURES = 'true';

      const result = resolveAllFeatureFlags(definitions, 'APP_');

      expect(result).toEqual({
        DARK_MODE: false,
        BETA_FEATURES: true
      });
    });

    it('should handle mixed env var presence', () => {
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Beta', category: 'system' },
        { name: 'DEBUG_MODE', enabled: false, description: 'Debug', category: 'system' }
      ];

      process.env.DARK_MODE = 'false';
      // BETA_FEATURES not set
      process.env.DEBUG_MODE = 'true';

      const result = resolveAllFeatureFlags(definitions);

      expect(result).toEqual({
        DARK_MODE: false,
        BETA_FEATURES: false,
        DEBUG_MODE: true
      });
    });

    it('should handle empty definitions', () => {
      const result = resolveAllFeatureFlags([]);
      expect(result).toEqual({});
    });

    it('should maintain type safety', () => {
      type MyFlags = 'ENABLE_DARK_MODE' | 'ENABLE_BETA';

      const definitions: FeatureFlag<MyFlags>[] = [
        { name: 'ENABLE_DARK_MODE', enabled: true, description: 'Dark mode', category: 'ui' },
        { name: 'ENABLE_BETA', enabled: false, description: 'Beta', category: 'system' }
      ];

      const result: Record<MyFlags, boolean> = resolveAllFeatureFlags(definitions);

      expect(typeof result.ENABLE_DARK_MODE).toBe('boolean');
      expect(typeof result.ENABLE_BETA).toBe('boolean');
    });
  });

  describe('Data Integrity', () => {
    it('should have valid category values', () => {
      const validCategories: FeatureFlagCategoryType[] = ['auth', 'ui', 'generation', 'storage', 'analytics', 'system'];

      validCategories.forEach(category => {
        expect(typeof category).toBe('string');
        expect(['auth', 'ui', 'generation', 'storage', 'analytics', 'system']).toContain(category);
      });
    });

    it('should handle flag name validation', () => {
      const validFlag: FeatureFlag = {
        name: 'VALID_FLAG_NAME',
        enabled: true,
        description: 'Valid flag',
        category: 'system'
      };

      expect(typeof validFlag.name).toBe('string');
      expect(validFlag.name.length).toBeGreaterThan(0);
      expect(typeof validFlag.enabled).toBe('boolean');
      expect(typeof validFlag.description).toBe('string');
      expect(['auth', 'ui', 'generation', 'storage', 'analytics', 'system']).toContain(validFlag.category);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical feature flag workflow', () => {
      // Define feature flags
      const definitions: FeatureFlag[] = [
        { name: 'DARK_MODE', enabled: true, description: 'Enable dark mode UI', category: 'ui' },
        { name: 'BETA_FEATURES', enabled: false, description: 'Show beta features', category: 'system' },
        { name: 'ADVANCED_SEARCH', enabled: false, description: 'Enable advanced search', category: 'generation' }
      ];

      // Create base configuration
      const baseFlags = createFeatureFlags(definitions);

      // Apply runtime overrides
      const runtimeOverrides = { BETA_FEATURES: true };
      const runtimeFlags = createFeatureFlags(definitions, runtimeOverrides);

      // Resolve with environment variables
      process.env.DARK_MODE = 'false';
      const envFlags = resolveAllFeatureFlags(definitions);

      expect(baseFlags.DARK_MODE).toBe(true);
      expect(baseFlags.BETA_FEATURES).toBe(false);
      expect(runtimeFlags.BETA_FEATURES).toBe(true);
      expect(envFlags.DARK_MODE).toBe(false);

      delete process.env.DARK_MODE;
    });

    it('should handle feature flag categories', () => {
      const definitions: FeatureFlag[] = [
        { name: 'OAUTH_ENABLED', enabled: true, description: 'OAuth authentication', category: 'auth' },
        { name: 'DARK_MODE', enabled: true, description: 'Dark mode UI', category: 'ui' },
        { name: 'AI_GENERATION', enabled: false, description: 'AI content generation', category: 'generation' },
        { name: 'LOCAL_STORAGE', enabled: true, description: 'Local storage', category: 'storage' },
        { name: 'ANALYTICS', enabled: false, description: 'Analytics tracking', category: 'analytics' },
        { name: 'DEBUG_MODE', enabled: false, description: 'Debug mode', category: 'system' }
      ];

      const flags = createFeatureFlags(definitions);

      // Verify all categories are represented
      expect(flags.OAUTH_ENABLED).toBe(true);
      expect(flags.DARK_MODE).toBe(true);
      expect(flags.AI_GENERATION).toBe(false);
      expect(flags.LOCAL_STORAGE).toBe(true);
      expect(flags.ANALYTICS).toBe(false);
      expect(flags.DEBUG_MODE).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined overrides gracefully', () => {
      const definitions: FeatureFlag[] = [
        { name: 'TEST_FLAG', enabled: true, description: 'Test flag', category: 'system' }
      ];

      const result1 = createFeatureFlags(definitions, undefined);
      const result2 = createFeatureFlags(definitions, null as any);

      expect(result1).toEqual({ TEST_FLAG: true });
      expect(result2).toEqual({ TEST_FLAG: true });
    });

    it('should handle empty env prefix', () => {
      const definitions: FeatureFlag[] = [
        { name: 'TEST_FLAG', enabled: true, description: 'Test flag', category: 'system' }
      ];

      process.env.TEST_FLAG = 'false';

      const result1 = resolveFeatureFlag('TEST_FLAG', true, '');
      const result2 = resolveAllFeatureFlags(definitions, '');

      expect(result1).toBe(false);
      expect(result2).toEqual({ TEST_FLAG: false });

      delete process.env.TEST_FLAG;
    });

    it('should handle special characters in flag names', () => {
      const definitions: FeatureFlag[] = [
        { name: 'FEATURE_FLAG_123', enabled: true, description: 'Feature with numbers', category: 'system' },
        { name: 'FEATURE-FLAG', enabled: false, description: 'Feature with dash', category: 'system' }
      ];

      const result = createFeatureFlags(definitions);

      expect(result['FEATURE_FLAG_123']).toBe(true);
      expect(result['FEATURE-FLAG']).toBe(false);
    });
  });
});
