/**
 * Unit tests for Forge Patterns main entry point
 */

/* global describe, it, expect, beforeEach, jest */

const { VERSION, createProjectConfig, ForgePatterns } = require('./index');

describe('Forge Patterns Main Module', () => {
  describe('VERSION', () => {
    it('should have a valid version string', () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe('string');
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('createProjectConfig', () => {
    it('should create a project config with default values', () => {
      const config = createProjectConfig('test-project');
      
      expect(config).toEqual({
        name: 'test-project',
        patterns: ['code-quality', 'security', 'docker'],
        features: {
          'feature-toggles': true,
          monitoring: true
        },
        options: {}
      });
    });

    it('should merge custom options', () => {
      const customOptions = { customOption: true, anotherOption: 'value' };
      const config = createProjectConfig('test-project', customOptions);
      
      expect(config.options).toEqual(customOptions);
    });

    it('should handle empty options object', () => {
      const config = createProjectConfig('test-project', {});
      
      expect(config.options).toEqual({});
    });

    it('should handle null/undefined options', () => {
      const config1 = createProjectConfig('test-project', null);
      const config2 = createProjectConfig('test-project', undefined);
      
      expect(config1.options).toEqual({});
      expect(config2.options).toEqual({});
    });
  });

  describe('ForgePatterns', () => {
    let forgePatterns;

    beforeEach(() => {
      forgePatterns = ForgePatterns.getInstance();
    });

    it('should return the same instance (singleton)', () => {
      const instance1 = ForgePatterns.getInstance();
      const instance2 = ForgePatterns.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    describe('getPatterns', () => {
      it('should return all available pattern categories', () => {
        const patterns = forgePatterns.getPatterns();
        
        expect(patterns).toHaveProperty('mcpGateway');
        expect(patterns).toHaveProperty('mcpServers');
        expect(patterns).toHaveProperty('sharedInfrastructure');
        expect(patterns).toHaveProperty('codeQuality');
      });

      it('should return mcpGateway patterns', () => {
        const patterns = forgePatterns.getPatterns();
        const {mcpGateway} = patterns;
        
        expect(mcpGateway).toHaveProperty('routing');
        expect(mcpGateway).toHaveProperty('security');
        expect(mcpGateway).toHaveProperty('performance');
        expect(mcpGateway).toHaveProperty('authentication');
        
        expect(typeof mcpGateway.routing).toBe('string');
        expect(typeof mcpGateway.security).toBe('string');
      });

      it('should return mcpServers patterns', () => {
        const patterns = forgePatterns.getPatterns();
        const {mcpServers} = patterns;
        
        expect(mcpServers).toHaveProperty('aiProviders');
        expect(mcpServers).toHaveProperty('templates');
        expect(mcpServers).toHaveProperty('uiGeneration');
      });

      it('should return codeQuality patterns', () => {
        const patterns = forgePatterns.getPatterns();
        const {codeQuality} = patterns;
        
        expect(codeQuality).toHaveProperty('eslint');
        expect(codeQuality).toHaveProperty('prettier');
        expect(codeQuality).toHaveProperty('typescript');
      });
    });

    describe('getPatternPath', () => {
      it('should return valid pattern path for existing category and name', () => {
        const path = forgePatterns.getPatternPath('mcpGateway', 'routing');
        
        expect(typeof path).toBe('string');
        expect(path).toBe('patterns/mcp-gateway/routing');
      });

      it('should throw error for non-existent category', () => {
        expect(() => {
          forgePatterns.getPatternPath('nonExistent', 'routing');
        }).toThrow('Category not found: nonExistent');
      });

      it('should throw error for non-existent pattern name', () => {
        expect(() => {
          forgePatterns.getPatternPath('mcpGateway', 'nonExistent');
        }).toThrow('Pattern not found: mcpGateway.nonExistent');
      });

      it('should work for all valid categories', () => {
        const validCombinations = [
          ['mcpGateway', 'security'],
          ['mcpGateway', 'performance'],
          ['mcpServers', 'aiProviders'],
          ['sharedInfrastructure', 'sleepArchitecture'],
          ['codeQuality', 'eslint']
        ];

        validCombinations.forEach(([category, name]) => {
          const path = forgePatterns.getPatternPath(category, name);
          expect(typeof path).toBe('string');
          expect(path.length).toBeGreaterThan(0);
        });
      });
    });

    describe('validateInstallation', () => {
      it('should return true for valid installation', () => {
        const isValid = forgePatterns.validateInstallation();
        
        expect(isValid).toBe(true);
      });

      it('should handle errors gracefully', () => {
        // Mock getPatterns to throw an error
        const originalGetPatterns = forgePatterns.getPatterns;
        forgePatterns.getPatterns = jest.fn().mockImplementation(() => {
          throw new Error('Test error');
        });

        const isValid = forgePatterns.validateInstallation();
        expect(isValid).toBe(false);

        // Restore original method
        forgePatterns.getPatterns = originalGetPatterns;
      });
    });
  });
});
