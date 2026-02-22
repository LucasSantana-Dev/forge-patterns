/**
 * Service port constants shared across the Forge ecosystem.
 *
 * Canonical values used by docker-compose files, feature-toggle configs,
 * and application bootstrapping across mcp-gateway, uiforge-mcp, and UIForge.
 *
 * @example
 * ```ts
 * import { PORTS } from '@forgespace/core/shared-constants';
 *
 * app.listen(PORTS.APP_DEFAULT);
 * ```
 */

/** Well-known service ports used across the ecosystem. */
export const PORTS = {
  /** Default application server port (Next.js, Express) */
  APP_DEFAULT: 3000,
  /** Secondary app instance / Grafana dashboard */
  APP_SECONDARY: 3001,
  /** Unleash feature-toggle server */
  UNLEASH: 4242,
  /** MCP Gateway */
  GATEWAY: 4444,
  /** PostgreSQL database */
  POSTGRES: 5432,
  /** Redis cache */
  REDIS: 6379,
  /** General HTTP / LocalStack Web UI */
  HTTP: 8080,
  /** Prometheus metrics */
  PROMETHEUS: 9090
} as const;

export type ServicePort = (typeof PORTS)[keyof typeof PORTS];

/**
 * Build a localhost URL for a given port.
 *
 * @param port - One of the well-known `PORTS` values
 * @param protocol - URL protocol (default: `"http"`)
 */
export function localUrl(port: ServicePort | number, protocol: string = 'http'): string {
  return `${protocol}://localhost:${port}`;
}

/** Default Unleash server URLs derived from `PORTS.UNLEASH`. */
export const UNLEASH_URLS = {
  BASE: `http://localhost:${PORTS.UNLEASH}`,
  API: `http://localhost:${PORTS.UNLEASH}/api`,
  ADMIN: `http://localhost:${PORTS.UNLEASH}/admin`
} as const;
