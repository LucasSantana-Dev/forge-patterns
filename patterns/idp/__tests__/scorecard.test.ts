import { BaseCollector } from '../scorecards/collectors/base-collector.js';
import { SecurityCollector } from '../scorecards/collectors/security-collector.js';
import { QualityCollector } from '../scorecards/collectors/quality-collector.js';
import { PerformanceCollector } from '../scorecards/collectors/performance-collector.js';
import { ComplianceCollector } from '../scorecards/collectors/compliance-collector.js';
import { ScorecardAggregator } from '../scorecards/aggregator.js';
import type { CollectorResult } from '../scorecards/collectors/base-collector.js';

class TestCollector extends BaseCollector {
  private score: number;

  constructor(score: number, cacheTtlMs = 60_000) {
    super(cacheTtlMs);
    this.score = score;
  }

  get name(): string {
    return 'test';
  }

  protected async doCollect(): Promise<CollectorResult> {
    return {
      score: this.score,
      breakdown: { test: this.score },
      violations: this.score < 100 ? ['Test violation'] : []
    };
  }
}

describe('Scorecards', () => {
  describe('BaseCollector', () => {
    it('should cache results within TTL', async () => {
      let callCount = 0;

      class CountingCollector extends BaseCollector {
        get name(): string {
          return 'counting';
        }

        protected async doCollect(): Promise<CollectorResult> {
          callCount++;
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const collector = new CountingCollector(60_000);

      await collector.collect({});
      await collector.collect({});
      await collector.collect({});

      expect(callCount).toBe(1);
    });

    it('should expire cache after TTL', async () => {
      let callCount = 0;

      class CountingCollector extends BaseCollector {
        get name(): string {
          return 'counting';
        }

        protected async doCollect(): Promise<CollectorResult> {
          callCount++;
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const collector = new CountingCollector(100);

      await collector.collect({});
      expect(callCount).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 150));

      await collector.collect({});
      expect(callCount).toBe(2);
    });

    it('should invalidate cache manually', async () => {
      let callCount = 0;

      class CountingCollector extends BaseCollector {
        get name(): string {
          return 'counting';
        }

        protected async doCollect(): Promise<CollectorResult> {
          callCount++;
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const collector = new CountingCollector(60_000);

      await collector.collect({});
      expect(callCount).toBe(1);

      collector.invalidateCache();

      await collector.collect({});
      expect(callCount).toBe(2);
    });

    it('should use default cache TTL', async () => {
      class DefaultTTLCollector extends BaseCollector {
        get name(): string {
          return 'default';
        }

        protected async doCollect(): Promise<CollectorResult> {
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const collector = new DefaultTTLCollector();
      const result = await collector.collect({});
      expect(result.score).toBe(100);
    });
  });

  describe('SecurityCollector', () => {
    let collector: SecurityCollector;

    beforeEach(() => {
      collector = new SecurityCollector();
    });

    it('should have correct name', () => {
      expect(collector.name).toBe('security');
    });

    it('should return perfect score for perfect context', async () => {
      const context = {
        secrets_scan_passed: true,
        dependency_vulnerabilities: 0,
        auth_enabled: true,
        rls_enabled: true
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(100);
      expect(result.violations).toHaveLength(0);
      expect(result.breakdown).toEqual({
        secrets: 100,
        dependencies: 100,
        authentication: 100,
        rls: 100
      });
    });

    it('should return low score for failing context', async () => {
      const context = {
        secrets_scan_passed: false,
        dependency_vulnerabilities: 5,
        auth_enabled: false,
        rls_enabled: false
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(13);
      expect(result.violations).toHaveLength(4);
      expect(result.violations).toContain(
        'Secret scanning detected exposed credentials'
      );
      expect(result.violations).toContain(
        '5 dependency vulnerabilities found'
      );
      expect(result.violations).toContain('Authentication is not enabled');
      expect(result.violations).toContain('Row-level security is not enabled');
    });

    it('should handle missing fields gracefully', async () => {
      const context = {};

      const result = await collector.collect(context);

      expect(result.score).toBe(100);
      expect(result.breakdown.secrets).toBe(100);
      expect(result.breakdown.dependencies).toBe(100);
      expect(result.breakdown.authentication).toBe(100);
      expect(result.breakdown.rls).toBe(100);
    });

    it('should calculate dependency vulnerability score correctly', async () => {
      const context1 = { dependency_vulnerabilities: 1 };
      const result1 = await collector.collect(context1);
      expect(result1.breakdown.dependencies).toBe(90);

      collector.invalidateCache();

      const context2 = { dependency_vulnerabilities: 5 };
      const result2 = await collector.collect(context2);
      expect(result2.breakdown.dependencies).toBe(50);

      collector.invalidateCache();

      const context3 = { dependency_vulnerabilities: 10 };
      const result3 = await collector.collect(context3);
      expect(result3.breakdown.dependencies).toBe(0);
    });

    it('should populate violations only for failing checks', async () => {
      const context = {
        secrets_scan_passed: true,
        dependency_vulnerabilities: 0,
        auth_enabled: false,
        rls_enabled: true
      };

      const result = await collector.collect(context);

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]).toBe('Authentication is not enabled');
    });
  });

  describe('QualityCollector', () => {
    let collector: QualityCollector;

    beforeEach(() => {
      collector = new QualityCollector();
    });

    it('should have correct name', () => {
      expect(collector.name).toBe('quality');
    });

    it('should return perfect score for perfect context', async () => {
      const context = {
        lint_passed: true,
        type_check_passed: true,
        coverage_percent: 95,
        has_tests: true,
        accessibility_passed: true
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(99);
      expect(result.violations).toHaveLength(0);
      expect(result.breakdown).toEqual({
        lint: 100,
        type_check: 100,
        coverage: 95,
        tests: 100,
        accessibility: 100
      });
    });

    it('should return low score for failing context', async () => {
      const context = {
        lint_passed: false,
        type_check_passed: false,
        coverage_percent: 30,
        has_tests: false,
        accessibility_passed: false
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(6);
      expect(result.violations).toHaveLength(5);
      expect(result.violations).toContain('Lint check failed');
      expect(result.violations).toContain('TypeScript type check failed');
      expect(result.violations).toContain(
        'Test coverage 30% is below 80% threshold'
      );
      expect(result.violations).toContain('No tests found');
      expect(result.violations).toContain('Accessibility check failed');
    });

    it('should handle missing fields gracefully', async () => {
      const context = {};

      const result = await collector.collect(context);

      expect(result.score).toBe(80);
      expect(result.breakdown.lint).toBe(100);
      expect(result.breakdown.type_check).toBe(100);
      expect(result.breakdown.coverage).toBe(0);
      expect(result.breakdown.tests).toBe(100);
      expect(result.breakdown.accessibility).toBe(100);
    });

    it('should cap coverage at 100', async () => {
      const context = { coverage_percent: 150 };

      const result = await collector.collect(context);

      expect(result.breakdown.coverage).toBe(100);
    });

    it('should warn when coverage below 80%', async () => {
      const context = { coverage_percent: 75 };

      const result = await collector.collect(context);

      expect(result.violations).toContain(
        'Test coverage 75% is below 80% threshold'
      );
    });

    it('should not warn when coverage at or above 80%', async () => {
      const context = { coverage_percent: 80 };

      const result = await collector.collect(context);

      expect(result.violations).not.toContain(
        expect.stringContaining('below 80%')
      );
    });
  });

  describe('PerformanceCollector', () => {
    let collector: PerformanceCollector;

    beforeEach(() => {
      collector = new PerformanceCollector();
    });

    it('should have correct name', () => {
      expect(collector.name).toBe('performance');
    });

    it('should return perfect score for perfect context', async () => {
      const context = {
        generation_latency_ms: 1500,
        cache_hit_rate: 85,
        error_rate_percent: 0.5
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(93);
      expect(result.violations).toHaveLength(0);
      expect(result.breakdown.latency).toBe(100);
      expect(result.breakdown.cache).toBe(85);
      expect(result.breakdown.reliability).toBe(95);
    });

    it('should return low score for failing context', async () => {
      const context = {
        generation_latency_ms: 15000,
        cache_hit_rate: 20,
        error_rate_percent: 10
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(10);
      expect(result.violations).toHaveLength(3);
      expect(result.violations).toContain(
        'Generation latency 15000ms exceeds 5s threshold'
      );
      expect(result.violations).toContain(
        'Cache hit rate 20% is below 50% threshold'
      );
      expect(result.violations).toContain(
        'Error rate 10% exceeds 5% threshold'
      );
    });

    it('should handle missing fields gracefully', async () => {
      const context = {};

      const result = await collector.collect(context);

      expect(result.breakdown.latency).toBe(100);
      expect(result.breakdown.cache).toBe(0);
      expect(result.breakdown.reliability).toBe(100);
    });

    it('should calculate latency score in tiers', async () => {
      const context1 = { generation_latency_ms: 1000 };
      const result1 = await collector.collect(context1);
      expect(result1.breakdown.latency).toBe(100);

      collector.invalidateCache();

      const context2 = { generation_latency_ms: 3000 };
      const result2 = await collector.collect(context2);
      expect(result2.breakdown.latency).toBe(70);

      collector.invalidateCache();

      const context3 = { generation_latency_ms: 7000 };
      const result3 = await collector.collect(context3);
      expect(result3.breakdown.latency).toBe(40);

      collector.invalidateCache();

      const context4 = { generation_latency_ms: 15000 };
      const result4 = await collector.collect(context4);
      expect(result4.breakdown.latency).toBe(10);
    });

    it('should cap cache hit rate at 100', async () => {
      const context = { cache_hit_rate: 150 };

      const result = await collector.collect(context);

      expect(result.breakdown.cache).toBe(100);
    });

    it('should calculate reliability from error rate', async () => {
      const context1 = { error_rate_percent: 0 };
      const result1 = await collector.collect(context1);
      expect(result1.breakdown.reliability).toBe(100);

      collector.invalidateCache();

      const context2 = { error_rate_percent: 5 };
      const result2 = await collector.collect(context2);
      expect(result2.breakdown.reliability).toBe(50);

      collector.invalidateCache();

      const context3 = { error_rate_percent: 10 };
      const result3 = await collector.collect(context3);
      expect(result3.breakdown.reliability).toBe(0);
    });
  });

  describe('ComplianceCollector', () => {
    let collector: ComplianceCollector;

    beforeEach(() => {
      collector = new ComplianceCollector();
    });

    it('should have correct name', () => {
      expect(collector.name).toBe('compliance');
    });

    it('should return perfect score for perfect context', async () => {
      const context = {
        rls_enabled: true,
        encryption_at_rest: true,
        log_retention_days: 90,
        audit_logging: true
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(100);
      expect(result.violations).toHaveLength(0);
      expect(result.breakdown).toEqual({
        rls: 100,
        encryption: 100,
        retention: 100,
        audit: 100
      });
    });

    it('should return low score for failing context', async () => {
      const context = {
        rls_enabled: false,
        encryption_at_rest: false,
        log_retention_days: 0,
        audit_logging: false
      };

      const result = await collector.collect(context);

      expect(result.score).toBe(0);
      expect(result.violations).toHaveLength(4);
      expect(result.violations).toContain('Row-level security not enabled');
      expect(result.violations).toContain('Encryption at rest not enabled');
      expect(result.violations).toContain(
        'Log retention 0 days is below 90 day requirement'
      );
      expect(result.violations).toContain('Audit logging not enabled');
    });

    it('should handle missing fields gracefully', async () => {
      const context = {};

      const result = await collector.collect(context);

      expect(result.breakdown.rls).toBe(100);
      expect(result.breakdown.encryption).toBe(100);
      expect(result.breakdown.retention).toBe(0);
      expect(result.breakdown.audit).toBe(100);
    });

    it('should calculate retention score in tiers', async () => {
      const context1 = { log_retention_days: 90 };
      const result1 = await collector.collect(context1);
      expect(result1.breakdown.retention).toBe(100);

      collector.invalidateCache();

      const context2 = { log_retention_days: 60 };
      const result2 = await collector.collect(context2);
      expect(result2.breakdown.retention).toBe(70);

      collector.invalidateCache();

      const context3 = { log_retention_days: 15 };
      const result3 = await collector.collect(context3);
      expect(result3.breakdown.retention).toBe(40);

      collector.invalidateCache();

      const context4 = { log_retention_days: 0 };
      const result4 = await collector.collect(context4);
      expect(result4.breakdown.retention).toBe(0);
    });

    it('should warn for retention below 90 days', async () => {
      const context = { log_retention_days: 30 };

      const result = await collector.collect(context);

      expect(result.violations).toContain(
        'Log retention 30 days is below 90 day requirement'
      );
    });

    it('should not warn for retention at or above 90 days', async () => {
      const context = { log_retention_days: 90 };

      const result = await collector.collect(context);

      expect(result.violations).not.toContain(
        expect.stringContaining('below 90 day')
      );
    });
  });

  describe('ScorecardAggregator', () => {
    it('should aggregate collectors with default weights', async () => {
      const aggregator = new ScorecardAggregator();

      aggregator.addCollector(new TestCollector(100));
      aggregator.addCollector(new TestCollector(80));

      const result = await aggregator.aggregate({});

      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.categories).toHaveProperty('test');
      expect(result.recommendations).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should use custom weights', async () => {
      const weights = {
        security: 0.5,
        quality: 0.2,
        performance: 0.2,
        compliance: 0.1
      };

      const aggregator = new ScorecardAggregator(weights);

      const securityCollector = new SecurityCollector();
      const qualityCollector = new QualityCollector();

      aggregator.addCollector(securityCollector);
      aggregator.addCollector(qualityCollector);

      const context = {
        secrets_scan_passed: true,
        dependency_vulnerabilities: 0,
        auth_enabled: true,
        rls_enabled: true,
        lint_passed: true,
        type_check_passed: true,
        coverage_percent: 90,
        has_tests: true,
        accessibility_passed: true
      };

      const result = await aggregator.aggregate(context);

      expect(result.overallScore).toBeGreaterThan(90);
    });

    it('should calculate weighted average correctly', async () => {
      class FixedCollector extends BaseCollector {
        private fixedScore: number;
        private fixedName: string;

        constructor(name: string, score: number) {
          super();
          this.fixedName = name;
          this.fixedScore = score;
        }

        get name(): string {
          return this.fixedName;
        }

        protected async doCollect(): Promise<CollectorResult> {
          return {
            score: this.fixedScore,
            breakdown: {},
            violations: []
          };
        }
      }

      const aggregator = new ScorecardAggregator({
        security: 0.5,
        quality: 0.5,
        performance: 0,
        compliance: 0
      });

      aggregator.addCollector(new FixedCollector('security', 100));
      aggregator.addCollector(new FixedCollector('quality', 80));

      const result = await aggregator.aggregate({});

      expect(result.overallScore).toBe(90);
    });

    it('should run collectors in parallel', async () => {
      const startTime = Date.now();

      class DelayedCollector extends BaseCollector {
        private delayMs: number;
        private collectorName: string;

        constructor(name: string, delayMs: number) {
          super();
          this.collectorName = name;
          this.delayMs = delayMs;
        }

        get name(): string {
          return this.collectorName;
        }

        protected async doCollect(): Promise<CollectorResult> {
          await new Promise((resolve) => setTimeout(resolve, this.delayMs));
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new DelayedCollector('collector1', 100));
      aggregator.addCollector(new DelayedCollector('collector2', 100));
      aggregator.addCollector(new DelayedCollector('collector3', 100));

      await aggregator.aggregate({});

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(200);
    });

    it('should populate categories correctly', async () => {
      const aggregator = new ScorecardAggregator();

      const securityCollector = new SecurityCollector();
      const qualityCollector = new QualityCollector();

      aggregator.addCollector(securityCollector);
      aggregator.addCollector(qualityCollector);

      const context = {
        secrets_scan_passed: true,
        lint_passed: false
      };

      const result = await aggregator.aggregate(context);

      expect(result.categories).toHaveProperty('security');
      expect(result.categories).toHaveProperty('quality');
      expect(result.categories.security.score).toBeGreaterThan(0);
      expect(result.categories.quality.score).toBeGreaterThan(0);
    });

    it('should generate recommendations from violations', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new QualityCollector());

      const context = {
        coverage_percent: 50,
        lint_passed: true,
        type_check_passed: true,
        has_tests: true,
        accessibility_passed: true
      };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toContain(
        'Increase test coverage to meet the 80% threshold'
      );
    });

    it('should generate coverage recommendation', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new QualityCollector());

      const context = { coverage_percent: 50 };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toContain(
        'Increase test coverage to meet the 80% threshold'
      );
    });

    it('should generate latency recommendation', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new PerformanceCollector());

      const context = { generation_latency_ms: 10000 };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toContain(
        'Investigate generation latency — consider caching or provider optimization'
      );
    });

    it('should handle empty violations gracefully', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new SecurityCollector());

      const context = {
        secrets_scan_passed: true,
        dependency_vulnerabilities: 0,
        auth_enabled: true,
        rls_enabled: true
      };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toHaveLength(0);
      expect(result.categories.security.violations).toHaveLength(0);
    });

    it('should generate retention recommendation', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new ComplianceCollector());

      const context = { log_retention_days: 30 };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toContain(
        'Extend log retention to at least 90 days for compliance'
      );
    });

    it('should handle empty collectors list', async () => {
      const aggregator = new ScorecardAggregator();

      const result = await aggregator.aggregate({});

      expect(result.overallScore).toBe(0);
      expect(result.categories).toEqual({});
      expect(result.recommendations).toEqual([]);
    });

    it('should include timestamp in ISO format', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new TestCollector(100));

      const result = await aggregator.aggregate({});

      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it('should handle collectors with unknown weights', async () => {
      class CustomCollector extends BaseCollector {
        get name(): string {
          return 'custom';
        }

        protected async doCollect(): Promise<CollectorResult> {
          return { score: 100, breakdown: {}, violations: [] };
        }
      }

      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new CustomCollector());

      const result = await aggregator.aggregate({});

      expect(result.overallScore).toBeGreaterThan(0);
    });

    it('should generate multiple recommendations', async () => {
      const aggregator = new ScorecardAggregator();
      aggregator.addCollector(new QualityCollector());
      aggregator.addCollector(new PerformanceCollector());

      const context = {
        coverage_percent: 50,
        generation_latency_ms: 10000,
        lint_passed: true,
        type_check_passed: true,
        has_tests: true,
        accessibility_passed: true
      };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations).toContain(
        'Increase test coverage to meet the 80% threshold'
      );
      expect(result.recommendations).toContain(
        'Investigate generation latency — consider caching or provider optimization'
      );
    });

    it('should format violations with category prefix', async () => {
      const aggregator = new ScorecardAggregator();

      const qualityCollector = new QualityCollector();
      const performanceCollector = new PerformanceCollector();

      aggregator.addCollector(qualityCollector);
      aggregator.addCollector(performanceCollector);

      const context = {
        coverage_percent: 50,
        generation_latency_ms: 10000,
        lint_passed: true,
        type_check_passed: true,
        has_tests: true,
        accessibility_passed: true,
        cache_hit_rate: 80,
        error_rate_percent: 1
      };

      const result = await aggregator.aggregate(context);

      expect(result.recommendations).toContain(
        'Increase test coverage to meet the 80% threshold'
      );
      expect(result.recommendations).toContain(
        'Investigate generation latency — consider caching or provider optimization'
      );
    });
  });
});
