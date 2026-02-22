/**
 * Docker and container-orchestration constants shared across the Forge ecosystem.
 *
 * Centralises health-check timings, restart policies, and resource limits
 * used in docker-compose.dev.yml, docker-compose.prod.yml, and CI pipelines.
 *
 * @example
 * ```ts
 * import { HEALTH_CHECK_DEFAULTS } from '@forgespace/core/shared-constants';
 * ```
 */

/** Health-check timing defaults for Docker containers. */
export const HEALTH_CHECK_DEFAULTS = {
  /** Interval between health checks in seconds */
  INTERVAL_S: 30,
  /** Maximum time to wait for a health check response in seconds */
  TIMEOUT_S: 10,
  /** Number of consecutive failures before marking unhealthy */
  RETRIES: 3,
  /** Grace period before first health check in seconds */
  START_PERIOD_S: 10
} as const;

/** Standard restart policies. */
export const RESTART_POLICIES = {
  DEV: 'unless-stopped',
  PROD: 'always',
  ONE_SHOT: 'on-failure'
} as const;

export type RestartPolicy = (typeof RESTART_POLICIES)[keyof typeof RESTART_POLICIES];

/** Default database credentials for local development (NOT for production). */
export const DEV_DATABASE = {
  USER: 'forge_dev',
  /** Placeholder — must be overridden via env variable in production */
  PASSWORD: 'REPLACE_WITH_DEV_PASSWORD',
  NAME: 'uiforge_dev',
  PROD_NAME: 'uiforge_prod'
} as const;
