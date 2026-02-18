const { UnleashClient } = require('unleash-client-node');

/**
 * Centralized UIForge Feature Toggles Library
 * Provides cross-project feature management capabilities for the UIForge ecosystem
 */
class UIForgeFeatureToggles {
  constructor(config = {}) {
    this.config = {
      appName: config.appName || 'uiforge-app',
      unleashUrl: config.unleashUrl || 'http://localhost:4242/api',
      clientKey: config.clientKey || 'uiforge-token',
      refreshInterval: config.refreshInterval || 60000,
      metricsInterval: config.metricsInterval || 60000,
      projectNamespace: config.projectNamespace || 'global',
      crossProject: config.crossProject || false
    };

    this.client = new UnleashClient({
      appName: this.config.appName,
      url: this.config.unleashUrl,
      clientKey: this.config.clientKey,
      refreshInterval: this.config.refreshInterval,
      metricsInterval: this.config.metricsInterval
    });

    this.context = {
      userId: null,
      sessionId: null,
      properties: {},
      projectName: this.config.projectNamespace
    };

    this.globalFeatures = config.globalFeatures || [];
    this.projectFeatures = config.projectFeatures || {};
  }

  /**
   * Initialize the feature toggle client
   */
  async initialize() {
    await this.client.start();
    console.log(`✅ Feature toggles initialized for ${this.config.projectNamespace}`);
  }

  /**
   * Check if a feature is enabled (supports cross-project namespacing)
   */
  isEnabled(featureName, defaultValue = false) {
    const namespacedFeature = this.getNamespacedFeature(featureName);
    return this.client.isEnabled(namespacedFeature, defaultValue, this.context);
  }

  /**
   * Get feature variant (supports cross-project namespacing)
   */
  getVariant(featureName, defaultValue = { enabled: false, name: 'disabled' }) {
    const namespacedFeature = this.getNamespacedFeature(featureName);
    return this.client.getVariant(namespacedFeature, defaultValue, this.context);
  }

  /**
   * Set user context
   */
  setContext(context) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Update context with user information
   */
  updateUserContext(userId, properties = {}) {
    this.context = {
      ...this.context,
      userId,
      properties: { ...this.context.properties, ...properties }
    };
  }

  /**
   * Get namespaced feature name for cross-project support
   */
  getNamespacedFeature(featureName) {
    if (this.config.crossProject && this.isGlobalFeature(featureName)) {
      return `global.${featureName}`;
    }
    return `${this.config.projectNamespace}.${featureName}`;
  }

  /**
   * Check if a feature is global
   */
  isGlobalFeature(featureName) {
    return this.globalFeatures.includes(featureName);
  }

  /**
   * Get all enabled features for the current project
   */
  getEnabledFeatures() {
    const features = [];

    // Check global features
    this.globalFeatures.forEach(feature => {
      if (this.isEnabled(feature)) {
        features.push(`global.${feature}`);
      }
    });

    // Check project-specific features
    const projectFeatures = this.projectFeatures[this.config.projectNamespace] || [];
    projectFeatures.forEach(feature => {
      if (this.isEnabled(feature)) {
        features.push(`${this.config.projectNamespace}.${feature}`);
      }
    });

    return features;
  }

  /**
   * Get feature statistics
   */
  getFeatureStats() {
    const enabledFeatures = this.getEnabledFeatures();

    return {
      context: this.context,
      clientReady: this.client.isReady(),
      lastUpdate: this.client.lastUpdate || new Date().toISOString(),
      projectNamespace: this.config.projectNamespace,
      crossProject: this.config.crossProject,
      enabledFeatures,
      globalFeaturesEnabled: enabledFeatures.filter(f => f.startsWith('global.')).length,
      projectFeaturesEnabled: enabledFeatures.filter(f => f.startsWith(`${this.config.projectNamespace}.`)).length
    };
  }

  /**
   * Enable cross-project feature management
   */
  enableGlobalFeature(featureName) {
    if (!this.globalFeatures.includes(featureName)) {
      this.globalFeatures.push(featureName);
    }
  }

  /**
   * Disable cross-project feature management
   */
  disableGlobalFeature(featureName) {
    const index = this.globalFeatures.indexOf(featureName);
    if (index > -1) {
      this.globalFeatures.splice(index, 1);
    }
  }

  /**
   * Add project-specific feature
   */
  addProjectFeature(featureName) {
    if (!this.projectFeatures[this.config.projectNamespace]) {
      this.projectFeatures[this.config.projectNamespace] = [];
    }
    if (!this.projectFeatures[this.config.projectNamespace].includes(featureName)) {
      this.projectFeatures[this.config.projectNamespace].push(featureName);
    }
  }

  /**
   * Remove project-specific feature
   */
  removeProjectFeature(featureName) {
    const features = this.projectFeatures[this.config.projectNamespace];
    if (features) {
      const index = features.indexOf(featureName);
      if (index > -1) {
        features.splice(index, 1);
      }
    }
  }

  /**
   * Get feature configuration
   */
  getFeatureConfig() {
    return {
      globalFeatures: this.globalFeatures,
      projectFeatures: this.projectFeatures,
      config: this.config
    };
  }
}

// Export the class
module.exports = UIForgeFeatureToggles;
  getFeatureStats() {
    return {
      context: this.context,
      clientReady: this.client.isReady(),
      lastUpdate: this.client.lastUpdate
    };
  }

  /**
   * Destroy the client and clean up resources
   */
  async destroy() {
    await this.client.stop();
  }
}

module.exports = UIForgeFeatureToggles;
