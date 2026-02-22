#!/usr/bin/env node

/**
 * Shared Constants Validation Test
 * Validates all exports from patterns/shared-constants/
 */

'use strict';

const path = require('path');
const fs = require('fs');

class SharedConstantsValidator {
  constructor() {
    this.results = { passed: 0, failed: 0, tests: [] };
  }

  log(message, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  async test(testName, testFn) {
    try {
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name: testName, status: 'passed' });
      this.log(`${testName}`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'failed', error: error.message });
      this.log(`${testName} — ${error.message}`, 'error');
    }
  }

  async validateFiles() {
    const base = path.join(__dirname, '../patterns/shared-constants');
    const required = [
      'index.ts', 'network.ts', 'mcp-protocol.ts', 'environments.ts',
      'ai-providers.ts', 'feature-flags.ts', 'storage.ts',
      'ports.ts', 'performance.ts', 'error-handling.ts', 'docker.ts', 'security.ts',
      'README.md'
    ];
    for (const file of required) {
      await this.test(`File exists: ${file}`, async () => {
        this.assert(fs.existsSync(path.join(base, file)), `Missing file: ${file}`);
      });
    }
  }

  async validateNetworkConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/network.ts'), 'utf8'
    );
    await this.test('network.ts: DEFAULT_TIMEOUT_MS = 120_000', async () => {
      this.assert(content.includes('DEFAULT_TIMEOUT_MS') && content.includes('120_000'), 'Wrong value');
    });
    await this.test('network.ts: MAX_RETRIES = 3', async () => {
      this.assert(content.includes('MAX_RETRIES') && content.includes('= 3'), 'Wrong value');
    });
    await this.test('network.ts: RETRY_DELAY_MS = 2_000', async () => {
      this.assert(content.includes('RETRY_DELAY_MS') && content.includes('2_000'), 'Wrong value');
    });
    await this.test('network.ts: GATEWAY_DEFAULT_URL', async () => {
      this.assert(content.includes('GATEWAY_DEFAULT_URL') && content.includes('http://gateway:4444'), 'Wrong URL');
    });
    await this.test('network.ts: AI_ROUTER_DEFAULT_WEIGHT = 0.7', async () => {
      this.assert(content.includes('AI_ROUTER_DEFAULT_WEIGHT') && content.includes('0.7'), 'Wrong value');
    });
    await this.test('network.ts: MAX_TOOLS_SEARCH = 10', async () => {
      this.assert(content.includes('MAX_TOOLS_SEARCH') && content.includes('= 10'), 'Wrong value');
    });
  }

  async validateMcpProtocolConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/mcp-protocol.ts'), 'utf8'
    );
    await this.test('mcp-protocol.ts: JSONRPC_VERSION = "2.0"', async () => {
      this.assert(content.includes('JSONRPC_VERSION') && content.includes("'2.0'"), 'Wrong version');
    });
    await this.test('mcp-protocol.ts: MCP_SERVER_VERSION = "0.1.0"', async () => {
      this.assert(content.includes('MCP_SERVER_VERSION') && content.includes("'0.1.0'"), 'Wrong version');
    });
    await this.test('mcp-protocol.ts: all protocol methods present', async () => {
      for (const m of ['tools/list','tools/call','resources/list','resources/read','prompts/list','prompts/get']) {
        this.assert(content.includes(m), `Missing: ${m}`);
      }
    });
  }

  async validateEnvironmentsConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/environments.ts'), 'utf8'
    );
    await this.test('environments.ts: NODE_ENVS has all three values', async () => {
      for (const v of ['NODE_ENVS','development','production','test']) this.assert(content.includes(v), `Missing: ${v}`);
    });
    await this.test('environments.ts: LOG_LEVELS has all four values', async () => {
      for (const v of ['LOG_LEVELS','debug','info','warn','error']) this.assert(content.includes(v), `Missing: ${v}`);
    });
    await this.test('environments.ts: DEFAULT_NODE_ENV = "production"', async () => {
      this.assert(content.includes('DEFAULT_NODE_ENV') && content.includes("'production'"), 'Wrong default');
    });
    await this.test('environments.ts: DEFAULT_LOG_LEVEL = "info"', async () => {
      this.assert(content.includes('DEFAULT_LOG_LEVEL') && content.includes("'info'"), 'Wrong default');
    });
    await this.test('environments.ts: guard functions exported', async () => {
      this.assert(content.includes('isValidNodeEnv') && content.includes('isValidLogLevel'), 'Missing guards');
    });
  }

  async validateAiProvidersConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/ai-providers.ts'), 'utf8'
    );
    await this.test('ai-providers.ts: all three providers', async () => {
      for (const p of ["'openai'","'anthropic'","'google'"]) this.assert(content.includes(p), `Missing: ${p}`);
    });
    await this.test('ai-providers.ts: AI_PROVIDERS registry', async () => {
      this.assert(content.includes('AI_PROVIDERS'), 'Missing AI_PROVIDERS');
    });
    await this.test('ai-providers.ts: correct base URLs', async () => {
      this.assert(/['"`]https:\/\/api\.openai\.com\/v1['"`]/.test(content), 'Wrong OpenAI URL');
      this.assert(/['"`]https:\/\/api\.anthropic\.com\/v1['"`]/.test(content), 'Wrong Anthropic URL');
      this.assert(/['"`]https:\/\/generativelanguage\.googleapis\.com\/v1beta['"`]/.test(content), 'Wrong Google URL');
    });
    await this.test('ai-providers.ts: API_KEY_EXPIRY_DAYS = 90', async () => {
      this.assert(content.includes('API_KEY_EXPIRY_DAYS') && content.includes('= 90'), 'Wrong value');
    });
    await this.test('ai-providers.ts: helper functions', async () => {
      this.assert(content.includes('isValidAIProvider') && content.includes('getAIProviderConfig'), 'Missing helpers');
    });
  }

  async validateFeatureFlagsPattern() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/feature-flags.ts'), 'utf8'
    );
    await this.test('feature-flags.ts: FeatureFlagCategory type', async () => {
      this.assert(content.includes('FeatureFlagCategory'), 'Missing type');
      for (const c of ['auth','ui','generation','storage','analytics','system']) {
        this.assert(content.includes(`'${c}'`), `Missing category: ${c}`);
      }
    });
    await this.test('feature-flags.ts: FeatureFlag interface', async () => {
      this.assert(content.includes('interface FeatureFlag'), 'Missing interface');
      for (const f of ['name:','enabled:','description:','category:']) this.assert(content.includes(f), `Missing: ${f}`);
    });
    await this.test('feature-flags.ts: createFeatureFlags factory', async () => {
      this.assert(content.includes('createFeatureFlags'), 'Missing factory');
    });
    await this.test('feature-flags.ts: resolveFeatureFlag helper', async () => {
      this.assert(content.includes('resolveFeatureFlag'), 'Missing helper');
    });
    await this.test('feature-flags.ts: no product-specific flag names', async () => {
      for (const f of ['ENABLE_GOOGLE_SSO','ENABLE_GITHUB_SSO','ENABLE_COMPONENT_GENERATION']) {
        this.assert(!content.includes(f), `Product flag found: ${f}`);
      }
    });
  }

  async validateStoragePattern() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/storage.ts'), 'utf8'
    );
    await this.test('storage.ts: DEFAULT_DB_VERSION = 1', async () => {
      this.assert(content.includes('DEFAULT_DB_VERSION') && content.includes('= 1'), 'Wrong value');
    });
    await this.test('storage.ts: IndexedDBStoreConfig interface', async () => {
      this.assert(content.includes('IndexedDBStoreConfig'), 'Missing interface');
    });
    await this.test('storage.ts: createStorageConfig factory', async () => {
      this.assert(content.includes('createStorageConfig'), 'Missing factory');
    });
    await this.test('storage.ts: COMMON_STORE_NAMES', async () => {
      this.assert(content.includes('COMMON_STORE_NAMES') && content.includes('api_keys') && content.includes('user_preferences'), 'Missing store names');
    });
  }

  async validatePortsConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/ports.ts'), 'utf8'
    );
    await this.test('ports.ts: PORTS object with standard service ports', async () => {
      this.assert(content.includes('PORTS'), 'Missing PORTS');
      for (const p of ['APP_DEFAULT', 'GATEWAY', 'POSTGRES', 'REDIS', 'UNLEASH', 'PROMETHEUS']) {
        this.assert(content.includes(p), `Missing port: ${p}`);
      }
    });
    await this.test('ports.ts: localUrl helper function', async () => {
      this.assert(content.includes('localUrl'), 'Missing localUrl helper');
    });
    await this.test('ports.ts: UNLEASH_URLS derived constants', async () => {
      this.assert(content.includes('UNLEASH_URLS'), 'Missing UNLEASH_URLS');
    });
  }

  async validatePerformanceConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/performance.ts'), 'utf8'
    );
    await this.test('performance.ts: CACHE_DEFAULTS', async () => {
      this.assert(content.includes('CACHE_DEFAULTS'), 'Missing CACHE_DEFAULTS');
      this.assert(content.includes('MAX_SIZE') && content.includes('DEFAULT_TTL_MS'), 'Missing cache fields');
    });
    await this.test('performance.ts: POOL_DEFAULTS', async () => {
      this.assert(content.includes('POOL_DEFAULTS'), 'Missing POOL_DEFAULTS');
    });
    await this.test('performance.ts: BATCH_DEFAULTS', async () => {
      this.assert(content.includes('BATCH_DEFAULTS'), 'Missing BATCH_DEFAULTS');
    });
    await this.test('performance.ts: ALERT_THRESHOLDS', async () => {
      this.assert(content.includes('ALERT_THRESHOLDS'), 'Missing ALERT_THRESHOLDS');
    });
    await this.test('performance.ts: FILE_SIZE_LIMITS', async () => {
      this.assert(content.includes('FILE_SIZE_LIMITS'), 'Missing FILE_SIZE_LIMITS');
    });
  }

  async validateErrorHandlingConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/error-handling.ts'), 'utf8'
    );
    await this.test('error-handling.ts: RETRYABLE_STATUS_CODES', async () => {
      this.assert(content.includes('RETRYABLE_STATUS_CODES'), 'Missing RETRYABLE_STATUS_CODES');
      for (const c of ['429', '500', '502', '503', '504']) {
        this.assert(content.includes(c), `Missing status code: ${c}`);
      }
    });
    await this.test('error-handling.ts: RETRY_DEFAULTS', async () => {
      this.assert(content.includes('RETRY_DEFAULTS'), 'Missing RETRY_DEFAULTS');
      this.assert(content.includes('MAX_ATTEMPTS') && content.includes('BACKOFF_FACTOR'), 'Missing retry fields');
    });
    await this.test('error-handling.ts: CIRCUIT_BREAKER_DEFAULTS', async () => {
      this.assert(content.includes('CIRCUIT_BREAKER_DEFAULTS'), 'Missing CIRCUIT_BREAKER_DEFAULTS');
    });
    await this.test('error-handling.ts: ERROR_CATEGORIES', async () => {
      this.assert(content.includes('ERROR_CATEGORIES'), 'Missing ERROR_CATEGORIES');
    });
  }

  async validateDockerConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/docker.ts'), 'utf8'
    );
    await this.test('docker.ts: HEALTH_CHECK_DEFAULTS', async () => {
      this.assert(content.includes('HEALTH_CHECK_DEFAULTS'), 'Missing HEALTH_CHECK_DEFAULTS');
      this.assert(content.includes('INTERVAL_S') && content.includes('RETRIES'), 'Missing fields');
    });
    await this.test('docker.ts: RESTART_POLICIES', async () => {
      this.assert(content.includes('RESTART_POLICIES'), 'Missing RESTART_POLICIES');
    });
    await this.test('docker.ts: DEV_DATABASE uses placeholder password', async () => {
      this.assert(content.includes('DEV_DATABASE'), 'Missing DEV_DATABASE');
      this.assert(content.includes('REPLACE_WITH'), 'Must use REPLACE_WITH placeholder');
    });
  }

  async validateSecurityConstants() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/security.ts'), 'utf8'
    );
    await this.test('security.ts: RATE_LIMIT_DEFAULTS', async () => {
      this.assert(content.includes('RATE_LIMIT_DEFAULTS'), 'Missing RATE_LIMIT_DEFAULTS');
    });
    await this.test('security.ts: HSTS_DEFAULTS', async () => {
      this.assert(content.includes('HSTS_DEFAULTS'), 'Missing HSTS_DEFAULTS');
    });
    await this.test('security.ts: REDACTED_FIELDS', async () => {
      this.assert(content.includes('REDACTED_FIELDS'), 'Missing REDACTED_FIELDS');
      for (const f of ['password', 'token', 'secret', 'apiKey']) {
        this.assert(content.includes(`'${f}'`), `Missing redacted field: ${f}`);
      }
    });
    await this.test('security.ts: DEV_CORS_ORIGINS', async () => {
      this.assert(content.includes('DEV_CORS_ORIGINS'), 'Missing DEV_CORS_ORIGINS');
    });
  }

  async validateNetworkExtensions() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/network.ts'), 'utf8'
    );
    await this.test('network.ts: HEALTH_CHECK_INTERVAL_MS', async () => {
      this.assert(content.includes('HEALTH_CHECK_INTERVAL_MS') && content.includes('30_000'), 'Wrong value');
    });
    await this.test('network.ts: METRICS_INTERVAL_MS', async () => {
      this.assert(content.includes('METRICS_INTERVAL_MS') && content.includes('60_000'), 'Wrong value');
    });
    await this.test('network.ts: CLIENT_INIT_TIMEOUT_MS', async () => {
      this.assert(content.includes('CLIENT_INIT_TIMEOUT_MS') && content.includes('10_000'), 'Wrong value');
    });
    await this.test('network.ts: CONNECTION_TIMEOUT_MS', async () => {
      this.assert(content.includes('CONNECTION_TIMEOUT_MS') && content.includes('30_000'), 'Wrong value');
    });
  }

  async validateBarrelIndex() {
    const content = fs.readFileSync(
      path.join(__dirname, '../patterns/shared-constants/index.ts'), 'utf8'
    );
    await this.test('index.ts: re-exports all modules', async () => {
      for (const m of [
        'network','mcp-protocol','environments','ai-providers','feature-flags','storage',
        'ports','performance','error-handling','docker','security'
      ]) {
        this.assert(content.includes(`./${m}`), `Missing re-export: ${m}`);
      }
    });
  }

  async validateNoSecrets() {
    const base = path.join(__dirname, '../patterns/shared-constants');
    const files = fs.readdirSync(base).filter(f => f.endsWith('.ts'));
    const secretPatterns = [
      /sk-[a-zA-Z0-9]{20,}/,
      /AIza[0-9A-Za-z-_]{35}/,
      /Bearer\s+[a-zA-Z0-9._-]{20,}/,
      /password\s*=\s*['"'][^'"]+['"]/i
    ];
    for (const file of files) {
      await this.test(`BR-001 Zero-Secrets: ${file}`, async () => {
        const content = fs.readFileSync(path.join(base, file), 'utf8');
        for (const pattern of secretPatterns) {
          this.assert(!pattern.test(content), `Potential secret in ${file}`);
        }
      });
    }
  }

  async runAllTests() {
    this.log('Starting Shared Constants Validation');
    this.log('='.repeat(60));
    await this.validateFiles();
    await this.validateNetworkConstants();
    await this.validateMcpProtocolConstants();
    await this.validateEnvironmentsConstants();
    await this.validateAiProvidersConstants();
    await this.validateFeatureFlagsPattern();
    await this.validateStoragePattern();
    await this.validatePortsConstants();
    await this.validatePerformanceConstants();
    await this.validateErrorHandlingConstants();
    await this.validateDockerConstants();
    await this.validateSecurityConstants();
    await this.validateNetworkExtensions();
    await this.validateBarrelIndex();
    await this.validateNoSecrets();
    this.log('='.repeat(60));
    this.log(`Test Results: ${this.results.passed} passed, ${this.results.failed} failed`);
    if (this.results.failed > 0) {
      this.log('Validation failed — see errors above', 'error');
      process.exit(1);
    } else {
      this.log('All shared-constants validation tests passed!', 'success');
    }
  }
}

if (require.main === module) {
  const validator = new SharedConstantsValidator();
  validator.runAllTests().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = SharedConstantsValidator;
