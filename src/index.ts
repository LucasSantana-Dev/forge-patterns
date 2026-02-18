/**
 * Forge Patterns - Main entry point
 *
 * This is the main entry point for the @uiforge/forge-patterns package.
 * It provides easy access to all patterns and utilities.
 */

// Version information
export const VERSION = '1.0.0';

// Main Forge Patterns class
export class ForgePatterns {
  private static instance: ForgePatterns;

  static getInstance(): ForgePatterns {
    if (!ForgePatterns.instance) {
      ForgePatterns.instance = new ForgePatterns();
    }
    return ForgePatterns.instance;
  }

  /**
   * Get all available patterns
   */
  getPatterns() {
    return {
      mcpGateway: {
        routing: 'patterns/mcp-gateway/routing',
        security: 'patterns/mcp-gateway/security',
        performance: 'patterns/mcp-gateway/performance',
        authentication: 'patterns/mcp-gateway/authentication',
      },
      mcpServers: {
        aiProviders: 'patterns/mcp-servers/ai-providers',
        templates: 'patterns/mcp-servers/templates',
        uiGeneration: 'patterns/mcp-servers/ui-generation',
      },
      sharedInfrastructure: {
        sleepArchitecture: 'patterns/shared-infrastructure/sleep-architecture',
      },
      codeQuality: {
        eslint: 'patterns/code-quality/eslint',
        prettier: 'patterns/code-quality/prettier',
        typescript: 'patterns/code-quality/typescript',
      },
    };
  }

  /**
   * Get pattern path by name
   */
  getPatternPath(category: string, name: string): string {
    const patterns = this.getPatterns();
    const categoryPatterns = patterns[category as keyof typeof patterns];

    if (!categoryPatterns) {
      throw new Error(`Category not found: ${category}`);
    }

    const patternPath = (categoryPatterns as any)[name];
    if (!patternPath) {
      throw new Error(`Pattern not found: ${category}.${name}`);
    }

    return patternPath;
  }

  /**
   * Validate pattern installation
   */
  validateInstallation(): boolean {
    try {
      const patterns = this.getPatterns();
      return Object.keys(patterns).length > 0;
    } catch (error) {
      return false;
    }
  }
}

// Export default instance
export default ForgePatterns.getInstance();
