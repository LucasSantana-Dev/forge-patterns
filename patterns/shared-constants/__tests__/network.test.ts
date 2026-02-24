/**
 * Network Constants Tests
 * 
 * Tests for network and retry constants shared across the Forge ecosystem.
 * Validates timeout values, retry logic, and network configuration.
 */

import {
  DEFAULT_TIMEOUT_MS,
  MIN_TIMEOUT_MS,
  MAX_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  GATEWAY_DEFAULT_URL,
  AI_ROUTER_DEFAULT_TIMEOUT_MS,
  AI_ROUTER_DEFAULT_WEIGHT,
  MAX_TOOLS_SEARCH,
  DEFAULT_TOP_N
} from '../network';

describe('Network Constants', () => {
  describe('Timeout Constants', () => {
    it('should have reasonable default timeout', () => {
      expect(DEFAULT_TIMEOUT_MS).toBe(120000);
      expect(DEFAULT_TIMEOUT_MS).toBeGreaterThan(0);
      expect(typeof DEFAULT_TIMEOUT_MS).toBe('number');
    });

    it('should have appropriate timeout bounds', () => {
      expect(MIN_TIMEOUT_MS).toBe(1000);
      expect(MAX_TIMEOUT_MS).toBe(600000);
      
      expect(MIN_TIMEOUT_MS).toBeLessThan(DEFAULT_TIMEOUT_MS);
      expect(DEFAULT_TIMEOUT_MS).toBeLessThan(MAX_TIMEOUT_MS);
    });

    it('should have appropriate retry limits', () => {
      expect(MAX_RETRIES).toBe(3);
      expect(MAX_RETRIES).toBeGreaterThan(0);
      expect(MAX_RETRIES).toBeLessThan(10);
      expect(typeof MAX_RETRIES).toBe('number');
    });

    it('should have reasonable retry delay', () => {
      expect(RETRY_DELAY_MS).toBe(2000);
      expect(RETRY_DELAY_MS).toBeGreaterThan(0);
      expect(RETRY_DELAY_MS).toBeLessThan(10000);
      expect(typeof RETRY_DELAY_MS).toBe('number');
    });
  });

  describe('URL Constants', () => {
    it('should have valid gateway URL', () => {
      expect(GATEWAY_DEFAULT_URL).toBe('http://gateway:4444');
      expect(GATEWAY_DEFAULT_URL).toMatch(/^https?:\/\//);
      expect(typeof GATEWAY_DEFAULT_URL).toBe('string');
    });

    it('should use gateway service name', () => {
      expect(GATEWAY_DEFAULT_URL).toContain('gateway');
      expect(GATEWAY_DEFAULT_URL).toContain('4444');
    });

    it('should use HTTP for development', () => {
      expect(GATEWAY_DEFAULT_URL).toMatch(/^http:/);
    });
  });

  describe('AI Router Constants', () => {
    it('should have reasonable AI router timeout', () => {
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBe(2000);
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeGreaterThan(0);
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeLessThan(10000);
      expect(typeof AI_ROUTER_DEFAULT_TIMEOUT_MS).toBe('number');
    });

    it('should have reasonable AI router weight', () => {
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBe(0.7);
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeGreaterThan(0);
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeLessThanOrEqual(1);
      expect(typeof AI_ROUTER_DEFAULT_WEIGHT).toBe('number');
    });
  });

  describe('Search Constants', () => {
    it('should have reasonable search limits', () => {
      expect(MAX_TOOLS_SEARCH).toBe(10);
      expect(DEFAULT_TOP_N).toBe(1);
      
      expect(MAX_TOOLS_SEARCH).toBeGreaterThan(0);
      expect(MAX_TOOLS_SEARCH).toBeLessThan(100);
      expect(DEFAULT_TOP_N).toBeGreaterThan(0);
      expect(DEFAULT_TOP_N).toBeLessThanOrEqual(MAX_TOOLS_SEARCH);
    });

    it('should have correct types', () => {
      expect(typeof MAX_TOOLS_SEARCH).toBe('number');
      expect(typeof DEFAULT_TOP_N).toBe('number');
    });
  });

  describe('Data Integrity', () => {
    it('should have valid ranges for timeout values', () => {
      expect(DEFAULT_TIMEOUT_MS).toBeGreaterThan(MIN_TIMEOUT_MS);
      expect(DEFAULT_TIMEOUT_MS).toBeLessThan(MAX_TIMEOUT_MS);
      
      expect(MIN_TIMEOUT_MS).toBeGreaterThan(0);
      expect(MAX_TIMEOUT_MS).toBeGreaterThan(MIN_TIMEOUT_MS);
    });

    it('should have valid ranges for numeric values', () => {
      expect(MAX_RETRIES).toBeGreaterThan(0);
      expect(MAX_RETRIES).toBeLessThan(10);
      
      expect(RETRY_DELAY_MS).toBeGreaterThan(0);
      expect(RETRY_DELAY_MS).toBeLessThan(10000);
      
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeGreaterThan(0);
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeLessThanOrEqual(1);
      
      expect(MAX_TOOLS_SEARCH).toBeGreaterThan(0);
      expect(MAX_TOOLS_SEARCH).toBeLessThan(100);
      
      expect(DEFAULT_TOP_N).toBeGreaterThan(0);
      expect(DEFAULT_TOP_N).toBeLessThanOrEqual(MAX_TOOLS_SEARCH);
    });

    it('should have reasonable value relationships', () => {
      // AI router timeout should be much shorter than gateway timeout
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeLessThan(DEFAULT_TIMEOUT_MS / 10);
      
      // Retry delay should be reasonable compared to timeouts
      expect(RETRY_DELAY_MS).toBeLessThan(DEFAULT_TIMEOUT_MS / 10);
      
      // Default top N should be reasonable for search results
      expect(DEFAULT_TOP_N).toBeLessThan(MAX_TOOLS_SEARCH);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle timeout configuration', () => {
      const timeout = DEFAULT_TIMEOUT_MS;
      const retries = MAX_RETRIES;
      const delay = RETRY_DELAY_MS;
      
      expect(timeout).toBe(120000);
      expect(retries).toBe(3);
      expect(delay).toBe(2000);
      
      // Calculate total timeout with retries
      const totalTimeout = timeout + (retries * delay);
      expect(totalTimeout).toBe(126000);
    });

    it('should handle AI router configuration', () => {
      const aiTimeout = AI_ROUTER_DEFAULT_TIMEOUT_MS;
      const aiWeight = AI_ROUTER_DEFAULT_WEIGHT;
      
      expect(aiTimeout).toBe(2000);
      expect(aiWeight).toBe(0.7);
      
      // AI router should be fast and weighted appropriately
      expect(aiTimeout).toBeLessThan(5000);
      expect(aiWeight).toBeGreaterThan(0.5);
    });

    it('should handle search configuration', () => {
      const maxSearch = MAX_TOOLS_SEARCH;
      const topN = DEFAULT_TOP_N;
      
      expect(maxSearch).toBe(10);
      expect(topN).toBe(1);
      
      // Should return reasonable number of results
      expect(maxSearch).toBeLessThan(50);
      expect(topN).toBeLessThanOrEqual(maxSearch);
    });

    it('should handle gateway URL configuration', () => {
      const gatewayUrl = GATEWAY_DEFAULT_URL;
      
      expect(gatewayUrl).toBe('http://gateway:4444');
      
      // Should use standard port for gateway
      expect(gatewayUrl).toContain(':4444');
      expect(gatewayUrl).toMatch(/^http:/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values gracefully', () => {
      expect(DEFAULT_TIMEOUT_MS).not.toBe(0);
      expect(MAX_RETRIES).not.toBe(0);
      expect(RETRY_DELAY_MS).not.toBe(0);
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).not.toBe(0);
      expect(AI_ROUTER_DEFAULT_WEIGHT).not.toBe(0);
      expect(MAX_TOOLS_SEARCH).not.toBe(0);
      expect(DEFAULT_TOP_N).not.toBe(0);
    });

    it('should handle negative values gracefully', () => {
      expect(DEFAULT_TIMEOUT_MS).toBeGreaterThan(0);
      expect(MAX_RETRIES).toBeGreaterThan(0);
      expect(RETRY_DELAY_MS).toBeGreaterThan(0);
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeGreaterThan(0);
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeGreaterThan(0);
      expect(MAX_TOOLS_SEARCH).toBeGreaterThan(0);
      expect(DEFAULT_TOP_N).toBeGreaterThan(0);
    });

    it('should handle extreme values gracefully', () => {
      expect(DEFAULT_TIMEOUT_MS).toBeLessThan(Number.MAX_SAFE_INTEGER);
      expect(MAX_RETRIES).toBeLessThan(100);
      expect(RETRY_DELAY_MS).toBeLessThan(Number.MAX_SAFE_INTEGER);
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeLessThan(Number.MAX_SAFE_INTEGER);
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBeLessThanOrEqual(1);
      expect(MAX_TOOLS_SEARCH).toBeLessThan(1000);
      expect(DEFAULT_TOP_N).toBeLessThan(1000);
    });
  });

  describe('Network Configuration', () => {
    it('should support different environments', () => {
      // Gateway URL uses service name for container networking
      expect(GATEWAY_DEFAULT_URL).toContain('gateway');
      expect(GATEWAY_DEFAULT_URL).toContain('4444');
      
      // Should be HTTP for internal service communication
      expect(GATEWAY_DEFAULT_URL).toMatch(/^http:/);
    });

    it('should have reasonable defaults for production', () => {
      // These would be overridden by environment variables in production
      expect(DEFAULT_TIMEOUT_MS).toBe(120000); // 2 minutes
      expect(MAX_RETRIES).toBe(3); // 3 retries
      expect(RETRY_DELAY_MS).toBe(2000); // 2 second delay
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBe(2000); // 2 seconds for AI
      expect(AI_ROUTER_DEFAULT_WEIGHT).toBe(0.7); // 70% weight
      expect(MAX_TOOLS_SEARCH).toBe(10); // 10 tools max
      expect(DEFAULT_TOP_N).toBe(1); // Top 1 result
    });

    it('should handle timeout hierarchies', () => {
      // Gateway timeout should be the longest
      expect(DEFAULT_TIMEOUT_MS).toBeGreaterThan(AI_ROUTER_DEFAULT_TIMEOUT_MS);
      
      // AI router timeout should be much shorter
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeLessThan(DEFAULT_TIMEOUT_MS / 10);
      
      // Retry delay should be reasonable
      expect(RETRY_DELAY_MS).toBeLessThan(DEFAULT_TIMEOUT_MS / 50);
    });

    it('should support container networking', () => {
      // Gateway URL uses service name for Docker/Kubernetes networking
      expect(GATEWAY_DEFAULT_URL).toBe('http://gateway:4444');
      expect(GATEWAY_DEFAULT_URL).not.toContain('localhost');
      expect(GATEWAY_DEFAULT_URL).not.toContain('127.0.0.1');
    });
  });

  describe('Performance Considerations', () => {
    it('should have timeouts that prevent hanging', () => {
      // All timeouts should be reasonable to prevent hanging requests
      expect(DEFAULT_TIMEOUT_MS).toBeLessThan(300000); // Less than 5 minutes
      expect(AI_ROUTER_DEFAULT_TIMEOUT_MS).toBeLessThan(10000); // Less than 10 seconds
    });

    it('should have retry logic that prevents excessive retries', () => {
      // Should retry but not too many times
      expect(MAX_RETRIES).toBeGreaterThan(0);
      expect(MAX_RETRIES).toBeLessThan(5);
      
      // Retry delay should increase total time but not too much
      const maxRetryTime = MAX_RETRIES * RETRY_DELAY_MS;
      expect(maxRetryTime).toBeLessThan(DEFAULT_TIMEOUT_MS / 2);
    });

    it('should have search limits that prevent overload', () => {
      // Search should be limited to prevent performance issues
      expect(MAX_TOOLS_SEARCH).toBeLessThan(50);
      expect(DEFAULT_TOP_N).toBeLessThan(10);
      
      // Should return focused results
      expect(DEFAULT_TOP_N).toBeLessThanOrEqual(5);
    });
  });
});
