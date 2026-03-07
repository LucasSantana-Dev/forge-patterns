import {
  BaseCollector,
  type CollectorResult
} from './base-collector.js';

export class PerformanceCollector extends BaseCollector {
  get name(): string {
    return 'performance';
  }

  protected async doCollect(
    context: Record<string, unknown>
  ): Promise<CollectorResult> {
    const violations: string[] = [];
    const breakdown: Record<string, number> = {};
    let total = 0;

    const latencyMs = (context['generation_latency_ms'] as
      | number
      | undefined) ?? 0;
    const latencyScore =
      latencyMs <= 2000
        ? 100
        : latencyMs <= 5000
          ? 70
          : latencyMs <= 10000
            ? 40
            : 10;
    breakdown['latency'] = latencyScore;
    if (latencyMs > 5000) {
      violations.push(
        `Generation latency ${latencyMs}ms exceeds 5s threshold`
      );
    }
    total += latencyScore;

    const cacheHitRate = (context['cache_hit_rate'] as
      | number
      | undefined) ?? 0;
    breakdown['cache'] = Math.min(100, Math.round(cacheHitRate));
    if (cacheHitRate < 50) {
      violations.push(
        `Cache hit rate ${cacheHitRate}% is below 50% threshold`
      );
    }
    total += breakdown['cache'];

    const errorRate = (context['error_rate_percent'] as
      | number
      | undefined) ?? 0;
    breakdown['reliability'] = Math.max(
      0,
      Math.round(100 - errorRate * 10)
    );
    if (errorRate > 5) {
      violations.push(
        `Error rate ${errorRate}% exceeds 5% threshold`
      );
    }
    total += breakdown['reliability'];

    const score = Math.round(total / 3);

    return { score, breakdown, violations };
  }
}
