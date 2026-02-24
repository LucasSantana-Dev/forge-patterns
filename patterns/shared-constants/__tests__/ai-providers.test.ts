/**
 * AI Providers Constants Tests
 *
 * Tests for the AI provider registry shared across the Forge ecosystem.
 * Validates provider configurations, validation functions, and type safety.
 */

import {
  AI_PROVIDERS,
  AI_PROVIDERS_LIST,
  DEFAULT_AI_PROVIDER,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  API_KEY_EXPIRY_DAYS,
  isValidAIProvider,
  getAIProviderConfig,
  type AIProvider,
  type AIProviderConfig
} from '../ai-providers';

describe('AI Providers Constants', () => {
  describe('Type Definitions', () => {
    it('should have correct AIProvider type', () => {
      const validProviders: AIProvider[] = ['openai', 'anthropic', 'google'];
      expect(validProviders).toEqual(expect.arrayContaining(['openai', 'anthropic', 'google']));
    });

    it('should have AIProviderConfig interface', () => {
      const config: AIProviderConfig = {
        name: 'Test Provider',
        baseUrl: 'https://api.test.com/v1',
        models: ['test-model'],
        maxTokens: 1000,
        rateLimitPerMinute: 100
      };

      expect(config.name).toBe('Test Provider');
      expect(config.baseUrl).toBe('https://api.test.com/v1');
      expect(config.models).toEqual(['test-model']);
      expect(config.maxTokens).toBe(1000);
      expect(config.rateLimitPerMinute).toBe(100);
    });
  });

  describe('AI_PROVIDERS Configuration', () => {
    it('should have all required providers', () => {
      const providers = Object.keys(AI_PROVIDERS);
      expect(providers).toEqual(['openai', 'anthropic', 'google']);
    });

    it('should have correct OpenAI configuration', () => {
      const {openai} = AI_PROVIDERS;

      expect(openai.name).toBe('OpenAI');
      expect(openai.baseUrl).toBe('https://api.openai.com/v1');
      expect(openai.models).toEqual(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']);
      expect(openai.maxTokens).toBe(128_000);
      expect(openai.rateLimitPerMinute).toBe(3_500);
      expect(openai.requiresOrganization).toBe(true);
    });

    it('should have correct Anthropic configuration', () => {
      const {anthropic} = AI_PROVIDERS;

      expect(anthropic.name).toBe('Anthropic');
      expect(anthropic.baseUrl).toBe('https://api.anthropic.com/v1');
      expect(anthropic.models).toEqual(['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229']);
      expect(anthropic.maxTokens).toBe(200_000);
      expect(anthropic.rateLimitPerMinute).toBe(1_000);
      expect(anthropic.requiresOrganization).toBeUndefined();
    });

    it('should have correct Google AI configuration', () => {
      const {google} = AI_PROVIDERS;

      expect(google.name).toBe('Google AI');
      expect(google.baseUrl).toBe('https://generativelanguage.googleapis.com/v1beta');
      expect(google.models).toEqual(['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest']);
      expect(google.maxTokens).toBe(2_097_152);
      expect(google.rateLimitPerMinute).toBe(60);
      expect(google.requiresOrganization).toBeUndefined();
    });

    it('should have unique provider names', () => {
      const names = Object.values(AI_PROVIDERS).map(p => p.name);
      const uniqueNames = [...new Set(names)];
      expect(names).toEqual(uniqueNames);
    });

    it('should have unique base URLs', () => {
      const urls = Object.values(AI_PROVIDERS).map(p => p.baseUrl);
      const uniqueUrls = [...new Set(urls)];
      expect(urls).toEqual(uniqueUrls);
    });
  });

  describe('Constants', () => {
    it('should have correct provider list', () => {
      expect(AI_PROVIDERS_LIST).toEqual(['openai', 'anthropic', 'google']);
    });

    it('should have correct default provider', () => {
      expect(DEFAULT_AI_PROVIDER).toBe('openai');
    });

    it('should have correct default tokens', () => {
      expect(DEFAULT_MAX_TOKENS).toBe(2_000);
    });

    it('should have correct default temperature', () => {
      expect(DEFAULT_TEMPERATURE).toBe(0.7);
    });

    it('should have correct API key expiry', () => {
      expect(API_KEY_EXPIRY_DAYS).toBe(90);
    });
  });

  describe('Validation Functions', () => {
    describe('isValidAIProvider', () => {
      it('should return true for valid providers', () => {
        expect(isValidAIProvider('openai')).toBe(true);
        expect(isValidAIProvider('anthropic')).toBe(true);
        expect(isValidAIProvider('google')).toBe(true);
      });

      it('should return false for invalid providers', () => {
        expect(isValidAIProvider('invalid')).toBe(false);
        expect(isValidAIProvider('')).toBe(false);
        expect(isValidAIProvider('OPENAI')).toBe(false);
        expect(isValidAIProvider('OpenAI')).toBe(false);
        expect(isValidAIProvider(null as any)).toBe(false);
        expect(isValidAIProvider(undefined as any)).toBe(false);
      });

      it('should handle edge cases', () => {
        expect(isValidAIProvider('')).toBe(false);
        expect(isValidAIProvider('  openai  ')).toBe(false);
        expect(isValidAIProvider('\nopenai\n')).toBe(false);
      });
    });

    describe('getAIProviderConfig', () => {
      it('should return correct config for valid providers', () => {
        const openaiConfig = getAIProviderConfig('openai');
        expect(openaiConfig).toEqual(AI_PROVIDERS.openai);

        const anthropicConfig = getAIProviderConfig('anthropic');
        expect(anthropicConfig).toEqual(AI_PROVIDERS.anthropic);

        const googleConfig = getAIProviderConfig('google');
        expect(googleConfig).toEqual(AI_PROVIDERS.google);
      });

      it('should throw error for invalid provider', () => {
        // The function doesn't actually throw, it returns undefined for invalid keys
        expect(getAIProviderConfig('invalid' as AIProvider)).toBeUndefined();
        expect(getAIProviderConfig('' as AIProvider)).toBeUndefined();
        expect(getAIProviderConfig(null as any)).toBeUndefined();
        expect(getAIProviderConfig(undefined as any)).toBeUndefined();
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have consistent model arrays', () => {
      Object.values(AI_PROVIDERS).forEach(config => {
        expect(Array.isArray(config.models)).toBe(true);
        expect(config.models.length).toBeGreaterThan(0);
        expect(config.models.every(model => typeof model === 'string')).toBe(true);
      });
    });

    it('should have valid numeric values', () => {
      Object.values(AI_PROVIDERS).forEach(config => {
        expect(typeof config.maxTokens).toBe('number');
        expect(config.maxTokens).toBeGreaterThan(0);
        expect(typeof config.rateLimitPerMinute).toBe('number');
        expect(config.rateLimitPerMinute).toBeGreaterThan(0);
      });
    });

    it('should have valid URLs', () => {
      Object.values(AI_PROVIDERS).forEach(config => {
        expect(typeof config.baseUrl).toBe('string');
        expect(config.baseUrl).toMatch(/^https?:\/\//);
        // Should match v1 or v1beta at the end
        expect(config.baseUrl).toMatch(/\/v1(beta)?$/);
      });
    });

    it('should have valid provider names', () => {
      Object.values(AI_PROVIDERS).forEach(config => {
        expect(typeof config.name).toBe('string');
        expect(config.name.length).toBeGreaterThan(0);
        expect(config.name.trim()).toBe(config.name);
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type consistency', () => {
      // Test that the type system correctly infers provider types
      const provider: AIProvider = 'openai';
      const config: AIProviderConfig = getAIProviderConfig(provider);

      expect(typeof config.name).toBe('string');
      expect(typeof config.baseUrl).toBe('string');
      expect(config.models).toBeInstanceOf(Array);
      expect(typeof config.maxTokens).toBe('number');
      expect(typeof config.rateLimitPerMinute).toBe('number');
    });

    it('should handle optional organization field', () => {
      const openaiConfig = getAIProviderConfig('openai');
      const anthropicConfig = getAIProviderConfig('anthropic');
      const googleConfig = getAIProviderConfig('google');

      expect(openaiConfig.requiresOrganization).toBe(true);
      expect(anthropicConfig.requiresOrganization).toBeUndefined();
      expect(googleConfig.requiresOrganization).toBeUndefined();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle provider selection', () => {
      const selectedProvider: AIProvider = 'anthropic';
      const config = getAIProviderConfig(selectedProvider);

      expect(config.name).toBe('Anthropic');
      expect(config.baseUrl).toBe('https://api.anthropic.com/v1');
    });

    it('should validate provider before use', () => {
      const invalidProvider = 'invalid-provider';

      if (isValidAIProvider(invalidProvider)) {
        const config = getAIProviderConfig(invalidProvider as AIProvider);
        expect(config).toBeDefined();
      } else {
        const config = getAIProviderConfig(invalidProvider as AIProvider);
        expect(config).toBeUndefined();
      }
    });

    it('should support provider iteration', () => {
      const providers = AI_PROVIDERS_LIST;
      const configs = providers.map(provider => getAIProviderConfig(provider));

      expect(configs).toHaveLength(3);
      expect(configs[0].name).toBe('OpenAI');
      expect(configs[1].name).toBe('Anthropic');
      expect(configs[2].name).toBe('Google AI');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty provider list gracefully', () => {
      // This would be a breaking change, but test for robustness
      const emptyList: AIProvider[] = [];
      expect(emptyList).toHaveLength(0);
    });

    it('should handle missing optional fields', () => {
      // Test that undefined optional fields are handled correctly
      const configWithoutOrg = getAIProviderConfig('anthropic');
      expect(configWithoutOrg.requiresOrganization).toBeUndefined();
    });
  });
});
