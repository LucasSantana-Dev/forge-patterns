/**
 * MCP / JSON-RPC protocol constants shared across the Forge ecosystem.
 */

export const JSONRPC_VERSION = '2.0' as const;

export type JsonRpcVersion = typeof JSONRPC_VERSION;

export const MCP_SERVER_VERSION = '0.1.0';

export const MCP_GATEWAY_CLIENT_NAME = 'forge-mcp-gateway-client';

/** @deprecated Use MCP_UI_SERVER_NAME instead */
export const MCP_UIFORGE_SERVER_NAME = 'uiforge';

/** Canonical name for the UI generation MCP server (ui-mcp) */
export const MCP_UI_SERVER_NAME = 'forge-ui';

export const MCP_PROTOCOL_METHODS = {
  TOOLS_LIST: 'tools/list',
  TOOLS_CALL: 'tools/call',
  RESOURCES_LIST: 'resources/list',
  RESOURCES_READ: 'resources/read',
  PROMPTS_LIST: 'prompts/list',
  PROMPTS_GET: 'prompts/get'
} as const;

export type McpProtocolMethod = (typeof MCP_PROTOCOL_METHODS)[keyof typeof MCP_PROTOCOL_METHODS];
