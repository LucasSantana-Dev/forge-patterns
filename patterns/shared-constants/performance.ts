/**
 * Performance, caching, and threshold constants shared across the Forge ecosystem.
 *
 * Covers response-cache sizes, TTLs, connection pool limits, batch sizes,
 * and alerting thresholds used by mcp-gateway, uiforge-mcp, and UIForge.
 *
 * @example
 * ```ts
 * import { CACHE_DEFAULTS, POOL_DEFAULTS } from '@forgespace/core/shared-constants';
 *
 * const cache = new ResponseCache({
 *   maxSize: CACHE_DEFAULTS.MAX_SIZE,
 *   defaultTTL: CACHE_DEFAULTS.DEFAULT_TTL_MS,
 * });
 * ```
 */

/** Response-cache defaults used by gateway and MCP servers. */
export const CACHE_DEFAULTS = {
  /** Maximum number of cached entries */
  MAX_SIZE: 1000,
  /** Default time-to-live in milliseconds (5 minutes) */
  DEFAULT_TTL_MS: 300_000,
  /** Cleanup sweep interval in milliseconds (1 minute) */
  CLEANUP_INTERVAL_MS: 60_000
} as const;

/** Connection-pool sizing defaults. */
export const POOL_DEFAULTS = {
  MIN_CONNECTIONS: 5,
  MAX_CONNECTIONS: 20
} as const;

/** Batch processing defaults. */
export const BATCH_DEFAULTS = {
  /** Default batch size for bulk operations */
  SIZE: 10,
  /** Flush interval for buffered writes in milliseconds (5 seconds) */
  FLUSH_INTERVAL_MS: 5_000
} as const;

/** Alerting thresholds used by observability and monitoring. */
export const ALERT_THRESHOLDS = {
  /** Latency above this value (ms) triggers a performance alert */
  LATENCY_WARNING_MS: 1_000,
  /** Error rate above this percentage triggers an availability alert */
  ERROR_RATE_PERCENT: 5
} as const;

/** File size limits used across services. */
export const FILE_SIZE_LIMITS = {
  /** 1 MB */
  SMALL: 1 * 1024 * 1024,
  /** 10 MB — default max log file size */
  MEDIUM: 10 * 1024 * 1024,
  /** 25 MB */
  LARGE: 25 * 1024 * 1024,
  /** 50 MB */
  XLARGE: 50 * 1024 * 1024,
  /** 100 MB */
  MAX: 100 * 1024 * 1024
} as const;
