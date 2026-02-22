/**
 * Error-handling, retry, and circuit-breaker constants shared across the Forge ecosystem.
 *
 * Centralises retry strategies, back-off parameters, and retryable status codes
 * used by mcp-gateway routing, MCP server clients, and shared infrastructure.
 *
 * @example
 * ```ts
 * import { RETRY_DEFAULTS, RETRYABLE_STATUS_CODES } from '@forgespace/core/shared-constants';
 *
 * if (RETRYABLE_STATUS_CODES.includes(response.status)) {
 *   await sleep(RETRY_DEFAULTS.INITIAL_DELAY_MS);
 * }
 * ```
 */

/** HTTP status codes that should trigger an automatic retry. */
export const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504] as const;

export type RetryableStatusCode = (typeof RETRYABLE_STATUS_CODES)[number];

/** Default retry strategy parameters. */
export const RETRY_DEFAULTS = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,
  /** Initial back-off delay in milliseconds */
  INITIAL_DELAY_MS: 2_000,
  /** Multiplier applied to delay on each subsequent retry */
  BACKOFF_FACTOR: 2,
  /** Maximum delay cap in milliseconds (16 seconds) */
  MAX_DELAY_MS: 16_000
} as const;

/** Circuit-breaker defaults for service-to-service calls. */
export const CIRCUIT_BREAKER_DEFAULTS = {
  /** Number of failures before opening the circuit */
  FAILURE_THRESHOLD: 5,
  /** Time in milliseconds before attempting to half-open (30 seconds) */
  RESET_TIMEOUT_MS: 30_000,
  /** Number of successful probes required to fully close the circuit */
  SUCCESS_THRESHOLD: 3
} as const;

/** Standard error categories for structured error responses. */
export const ERROR_CATEGORIES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  TIMEOUT: 'TIMEOUT_ERROR',
  UPSTREAM: 'UPSTREAM_ERROR',
  INTERNAL: 'INTERNAL_ERROR'
} as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];
