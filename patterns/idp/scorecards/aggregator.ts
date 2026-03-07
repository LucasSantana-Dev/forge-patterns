import type { BaseCollector, CollectorResult } from './collectors/base-collector.js';

export interface ScorecardWeights {
  security: number;
  quality: number;
  performance: number;
  compliance: number;
}

export interface AggregatedScorecard {
  overallScore: number;
  categories: Record<string, CollectorResult>;
  recommendations: string[];
  timestamp: string;
}

const DEFAULT_WEIGHTS: ScorecardWeights = {
  security: 0.3,
  quality: 0.3,
  performance: 0.2,
  compliance: 0.2
};

export class ScorecardAggregator {
  private collectors: BaseCollector[] = [];
  private weights: ScorecardWeights;

  constructor(weights?: Partial<ScorecardWeights>) {
    const merged = { ...DEFAULT_WEIGHTS, ...weights };
    for (const [key, val] of Object.entries(merged)) {
      if (typeof val !== 'number' || val < 0 || !Number.isFinite(val)) {
        throw new Error(`Invalid weight for ${key}: must be a positive finite number`);
      }
    }
    this.weights = merged;
  }

  addCollector(collector: BaseCollector): void {
    this.collectors.push(collector);
  }

  async aggregate(context: Record<string, unknown>): Promise<AggregatedScorecard> {
    const results = await Promise.all(
      this.collectors.map(async c => ({
        name: c.name,
        result: await c.collect(context)
      }))
    );

    const categories: Record<string, CollectorResult> = {};
    let weightedTotal = 0;
    let weightSum = 0;

    for (const { name, result } of results) {
      categories[name] = result;
      const w = (this.weights as Record<string, number>)[name] ?? 0.1;
      weightedTotal += result.score * w;
      weightSum += w;
    }

    const overallScore = weightSum > 0 ? Math.round(weightedTotal / weightSum) : 0;

    const allViolations = results.flatMap(({ name, result }) =>
      result.violations.map(v => `[${name}] ${v}`)
    );

    const recommendations = this.generateRecommendations(allViolations);

    return {
      overallScore,
      categories,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private generateRecommendations(violations: string[]): string[] {
    const recs: string[] = [];

    if (violations.some(v => v.includes('secret'))) {
      recs.push('Enable secret scanning in CI and remove exposed credentials');
    }
    if (violations.some(v => v.includes('coverage'))) {
      recs.push('Increase test coverage to meet the 80% threshold');
    }
    if (violations.some(v => v.includes('RLS') || v.includes('rls'))) {
      recs.push('Enable row-level security on all user-facing database tables');
    }
    if (violations.some(v => v.includes('latency'))) {
      recs.push('Investigate generation latency — consider caching or provider optimization');
    }
    if (violations.some(v => v.includes('audit'))) {
      recs.push('Enable audit logging for compliance traceability');
    }
    if (violations.some(v => v.includes('retention'))) {
      recs.push('Extend log retention to at least 90 days for compliance');
    }

    return recs;
  }
}
