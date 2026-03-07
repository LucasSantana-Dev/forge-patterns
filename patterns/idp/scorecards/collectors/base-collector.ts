export interface CollectorResult {
  score: number;
  breakdown: Record<string, number>;
  violations: string[];
  metadata?: Record<string, unknown>;
}

export abstract class BaseCollector {
  protected cacheTtlMs: number;
  private cache: { result: CollectorResult; expiry: number } | null =
    null;
  private inflight: Promise<CollectorResult> | null = null;

  constructor(cacheTtlMs = 60_000) {
    this.cacheTtlMs = cacheTtlMs;
  }

  async collect(
    context: Record<string, unknown>
  ): Promise<CollectorResult> {
    if (this.cache && Date.now() < this.cache.expiry) {
      return this.cache.result;
    }

    if (this.inflight) return this.inflight;

    this.inflight = this.doCollect(context);
    try {
      const result = await this.inflight;
      this.cache = {
        result,
        expiry: Date.now() + this.cacheTtlMs
      };
      return result;
    } finally {
      this.inflight = null;
    }
  }

  invalidateCache(): void {
    this.cache = null;
  }

  abstract get name(): string;

  protected abstract doCollect(
    context: Record<string, unknown>
  ): Promise<CollectorResult>;
}
