/**
 * Security constants shared across the Forge ecosystem.
 *
 * Centralises rate-limit windows, CORS defaults, security-header values,
 * and field-redaction lists used by mcp-gateway security middleware,
 * authentication patterns, and the shared logger.
 *
 * @example
 * ```ts
 * import { RATE_LIMIT_DEFAULTS, REDACTED_FIELDS } from '@forgespace/core/shared-constants';
 * ```
 */

/** Rate-limiting defaults. */
export const RATE_LIMIT_DEFAULTS = {
  /** Sliding window size in milliseconds (15 minutes) */
  WINDOW_MS: 900_000,
  /** Maximum requests per window */
  MAX_REQUESTS: 100
} as const;

/** Strict-Transport-Security header defaults. */
export const HSTS_DEFAULTS = {
  /** max-age in seconds (1 year) */
  MAX_AGE_S: 31_536_000,
  INCLUDE_SUBDOMAINS: true,
  PRELOAD: true
} as const;

/**
 * Fields that must be redacted from logs and error responses.
 * Used by the shared logger's `redactFields` option and error serializers.
 */
export const REDACTED_FIELDS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'authorization',
  'cookie',
  'apiKey',
  'api_key',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token'
] as const;

export type RedactedField = (typeof REDACTED_FIELDS)[number];

/** Default CORS origins for local development. */
export const DEV_CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:8080'] as const;
