import * as SharedConstants from '../index';

describe('Shared Constants Index', () => {
  describe('Module Exports', () => {
    it('should export network constants', () => {
      expect(SharedConstants.DEFAULT_TIMEOUT_MS).toBeDefined();
      expect(SharedConstants.MAX_RETRIES).toBeDefined();
      expect(SharedConstants.GATEWAY_DEFAULT_URL).toBeDefined();
      expect(SharedConstants.AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeDefined();
      expect(SharedConstants.MAX_TOOLS_SEARCH).toBeDefined();
    });

    it('should export MCP protocol constants', () => {
      expect(SharedConstants.JSONRPC_VERSION).toBeDefined();
      expect(SharedConstants.MCP_SERVER_VERSION).toBeDefined();
      expect(SharedConstants.MCP_PROTOCOL_METHODS).toBeDefined();
      expect(SharedConstants.MCP_GATEWAY_CLIENT_NAME).toBeDefined();
    });

    it('should export environment constants', () => {
      expect(SharedConstants.NODE_ENVS).toBeDefined();
      expect(SharedConstants.LOG_LEVELS).toBeDefined();
      expect(SharedConstants.DEFAULT_NODE_ENV).toBeDefined();
      expect(SharedConstants.isValidNodeEnv).toBeDefined();
      expect(SharedConstants.isValidLogLevel).toBeDefined();
    });

    it('should export AI provider constants', () => {
      expect(SharedConstants.AI_PROVIDERS).toBeDefined();
      expect(SharedConstants.AI_PROVIDERS_LIST).toBeDefined();
      expect(SharedConstants.DEFAULT_AI_PROVIDER).toBeDefined();
      expect(SharedConstants.isValidAIProvider).toBeDefined();
      expect(SharedConstants.getAIProviderConfig).toBeDefined();
    });

    it('should export feature flag utilities', () => {
      expect(SharedConstants.createFeatureFlags).toBeDefined();
      expect(SharedConstants.resolveFeatureFlag).toBeDefined();
      expect(SharedConstants.resolveAllFeatureFlags).toBeDefined();
    });

    it('should export storage constants', () => {
      expect(SharedConstants.DEFAULT_DB_VERSION).toBeDefined();
      expect(SharedConstants.COMMON_STORE_NAMES).toBeDefined();
      expect(SharedConstants.createStorageConfig).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should maintain correct types for exported values', () => {
      expect(typeof SharedConstants.DEFAULT_TIMEOUT_MS).toBe('number');
      expect(typeof SharedConstants.JSONRPC_VERSION).toBe('string');
      expect(typeof SharedConstants.DEFAULT_NODE_ENV).toBe('string');
      expect(typeof SharedConstants.isValidNodeEnv).toBe('function');
      expect(typeof SharedConstants.createFeatureFlags).toBe('function');
      expect(Array.isArray(SharedConstants.AI_PROVIDERS_LIST)).toBe(true);
    });
  });

  describe('Complete Module Coverage', () => {
    it('should export all network constants', () => {
      expect(SharedConstants.MIN_TIMEOUT_MS).toBeDefined();
      expect(SharedConstants.MAX_TIMEOUT_MS).toBeDefined();
      expect(SharedConstants.RETRY_DELAY_MS).toBeDefined();
      expect(SharedConstants.AI_ROUTER_DEFAULT_WEIGHT).toBeDefined();
      expect(SharedConstants.DEFAULT_TOP_N).toBeDefined();
    });

    it('should export all AI provider constants', () => {
      expect(SharedConstants.DEFAULT_MAX_TOKENS).toBeDefined();
      expect(SharedConstants.DEFAULT_TEMPERATURE).toBeDefined();
      expect(SharedConstants.API_KEY_EXPIRY_DAYS).toBeDefined();
    });

    it('should export all MCP protocol constants', () => {
      expect(SharedConstants.MCP_UIFORGE_SERVER_NAME).toBeDefined();
    });

    it('should export all environment constants', () => {
      expect(SharedConstants.DEFAULT_LOG_LEVEL).toBeDefined();
    });
  });
});
