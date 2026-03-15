/** Canonical Forge Space namespaces. Legacy 'uiforge-mcp'/'uiforge-webapp' kept for backwards compat. */
export type ToggleNamespace =
  | 'global'
  | 'mcp-gateway'
  | 'ui-mcp'
  | 'siza'
  | 'uiforge-mcp' // @deprecated — use 'ui-mcp'
  | 'uiforge-webapp'; // @deprecated — use 'siza'

export type ToggleStrategy = 'default' | 'gradual-rollout' | 'user-ids';

export interface ToggleStrategyConfig {
  name: ToggleStrategy;
  parameters?: Record<string, unknown>;
}

export interface FeatureToggle {
  name: string;
  namespace: ToggleNamespace;
  enabled: boolean;
  description?: string;
  strategies: ToggleStrategyConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface FeatureToggleStore {
  version: 1;
  toggles: FeatureToggle[];
}

export interface ToggleEvaluationContext {
  userId?: string;
  environment?: string;
  properties?: Record<string, string>;
}

export interface ToggleListOptions {
  namespace?: ToggleNamespace;
  enabled?: boolean;
}
