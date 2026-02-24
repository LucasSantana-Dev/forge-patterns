/**
 * MCP Protocol Constants Tests
 *
 * Tests for MCP / JSON-RPC protocol constants shared across the Forge ecosystem.
 * Validates protocol versions, method names, and type definitions.
 */

import {
  JSONRPC_VERSION,
  JsonRpcVersion,
  MCP_SERVER_VERSION,
  MCP_GATEWAY_CLIENT_NAME,
  MCP_UIFORGE_SERVER_NAME,
  MCP_PROTOCOL_METHODS,
  type McpProtocolMethod
} from '../mcp-protocol';

describe('MCP Protocol Constants', () => {
  describe('Version Constants', () => {
    it('should have correct JSON-RPC version', () => {
      expect(JSONRPC_VERSION).toBe('2.0');
      expect(JSONRPC_VERSION).toBe('2.0' as const);
    });

    it('should have correct MCP server version', () => {
      expect(MCP_SERVER_VERSION).toBe('0.1.0');
      expect(typeof MCP_SERVER_VERSION).toBe('string');
    });

    it('should have correct client names', () => {
      expect(MCP_GATEWAY_CLIENT_NAME).toBe('forge-mcp-gateway-client');
      expect(MCP_UIFORGE_SERVER_NAME).toBe('uiforge');
      expect(typeof MCP_GATEWAY_CLIENT_NAME).toBe('string');
      expect(typeof MCP_UIFORGE_SERVER_NAME).toBe('string');
    });
  });

  describe('Protocol Methods', () => {
    it('should have all required protocol methods', () => {
      const methods = Object.values(MCP_PROTOCOL_METHODS);
      expect(methods).toContain('tools/list');
      expect(methods).toContain('tools/call');
      expect(methods).toContain('resources/list');
      expect(methods).toContain('resources/read');
      expect(methods).toContain('prompts/list');
      expect(methods).toContain('prompts/get');
    });

    it('should have correct method values', () => {
      expect(MCP_PROTOCOL_METHODS.TOOLS_LIST).toBe('tools/list');
      expect(MCP_PROTOCOL_METHODS.TOOLS_CALL).toBe('tools/call');
      expect(MCP_PROTOCOL_METHODS.RESOURCES_LIST).toBe('resources/list');
      expect(MCP_PROTOCOL_METHODS.RESOURCES_READ).toBe('resources/read');
      expect(MCP_PROTOCOL_METHODS.PROMPTS_LIST).toBe('prompts/list');
      expect(MCP_PROTOCOL_METHODS.PROMPTS_GET).toBe('prompts/get');
    });

    it('should have method type consistency', () => {
      Object.values(MCP_PROTOCOL_METHODS).forEach(method => {
        expect(typeof method).toBe('string');
        expect(method.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Type Definitions', () => {
    it('should have correct JsonRpcVersion type', () => {
      const version: JsonRpcVersion = JSONRPC_VERSION;
      expect(version).toBe('2.0');
    });

    it('should have McpProtocolMethod type', () => {
      const method: McpProtocolMethod = MCP_PROTOCOL_METHODS.TOOLS_LIST;
      expect(method).toBe('tools/list');
    });

    it('should have all method types', () => {
      const methods = Object.values(MCP_PROTOCOL_METHODS);
      methods.forEach(method => {
        expect(['tools/list', 'tools/call', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get']).toContain(method);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have unique method values', () => {
      const methods = Object.values(MCP_PROTOCOL_METHODS);
      const uniqueMethods = [...new Set(methods)];
      expect(methods).toEqual(uniqueMethods);
    });

    it('should have valid method names', () => {
      Object.values(MCP_PROTOCOL_METHODS).forEach(method => {
        expect(typeof method).toBe('string');
        expect(method).toMatch(/^[a-z_\/]+$/);
        expect(method.length).toBeGreaterThan(0);
      });
    });

    it('should follow naming convention', () => {
      Object.values(MCP_PROTOCOL_METHODS).forEach(method => {
        expect(method).toMatch(/^[a-z_\/]+$/);
        expect(method.includes('/')).toBe(true);
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle method iteration', () => {
      const methods = Object.values(MCP_PROTOCOL_METHODS);
      expect(methods).toHaveLength(6);
      expect(methods[0]).toBe('tools/list');
      expect(methods[5]).toBe('prompts/get');
    });

    it('should validate method existence', () => {
      const validMethod = MCP_PROTOCOL_METHODS.TOOLS_LIST;
      expect(validMethod).toBeDefined();
      expect(['tools/list', 'tools/call', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get']).toContain(validMethod);
    });

    it('should handle type checking', () => {
      const method: McpProtocolMethod = 'tools/list';
      expect(typeof method).toBe('string');
      expect(['tools/list', 'tools/call', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get']).toContain(method);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty method object', () => {
      const emptyMethods = {};
      expect(Object.keys(emptyMethods)).toHaveLength(0);
    });

    it('should handle undefined method access', () => {
      const invalidMethod = 'invalid_method' as keyof typeof MCP_PROTOCOL_METHODS;
      expect(invalidMethod).toBe('invalid_method');
      expect(MCP_PROTOCOL_METHODS[invalidMethod]).toBeUndefined();
    });
  });
});

describe('Protocol Versioning', () => {
  describe('JSON-RPC Version', () => {
    it('should be stable version 2.0', () => {
      expect(JSONRPC_VERSION).toBe('2.0');
      expect(JSONRPC_VERSION).toBe('2.0' as const);
    });

    it('should be string type', () => {
      expect(typeof JSONRPC_VERSION).toBe('string');
    });
  });

  describe('MCP Server Version', () => {
    it('should follow semantic versioning', () => {
      expect(MCP_SERVER_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
      expect(typeof MCP_SERVER_VERSION).toBe('string');
    });

    it('should be version 0.1.0', () => {
      expect(MCP_SERVER_VERSION).toBe('0.1.0');
    });
  });

  describe('Client Names', () => {
    it('should have descriptive names', () => {
      expect(MCP_GATEWAY_CLIENT_NAME).toContain('gateway');
      expect(MCP_UIFORGE_SERVER_NAME).toContain('uiforge');
      expect(MCP_GATEWAY_CLIENT_NAME).toMatch(/^[a-z-]+-[\w-]+$/);
      expect(MCP_UIFORGE_SERVER_NAME).toMatch(/^[a-z-]+$/); // uiforge doesn't have hyphens
    });

    it('should be lowercase with hyphens', () => {
      expect(MCP_GATEWAY_CLIENT_NAME).toBe(MCP_GATEWAY_CLIENT_NAME.toLowerCase());
      expect(MCP_UIFORGE_SERVER_NAME).toBe(MCP_UIFORGE_SERVER_NAME.toLowerCase());
    });
  });
});

describe('Protocol Methods Usage', () => {
  it('should support all MCP operations', () => {
    const requiredOperations = [
      'tools/list',
      'tools/call',
      'resources/list',
      'resources/read',
      'prompts/list',
      'prompts/get'
    ];

    const availableMethods = Object.values(MCP_PROTOCOL_METHODS);

    requiredOperations.forEach(operation => {
      expect(availableMethods).toContain(operation);
    });
  });

  it('should categorize methods correctly', () => {
    const toolMethods = ['tools/list', 'tools/call'];
    const resourceMethods = ['resources/list', 'resources/read'];
    const promptMethods = ['prompts/list', 'prompts/get'];

    const availableMethods = Object.values(MCP_PROTOCOL_METHODS);

    toolMethods.forEach(method => {
      expect(availableMethods).toContain(method);
    });

    resourceMethods.forEach(method => {
      expect(availableMethods).toContain(method);
    });

    promptMethods.forEach(method => {
      expect(availableMethods).toContain(method);
    });
  });
});
