// Export all types and interfaces
export * from './src/types.js';

// Export main logger implementation
export { Logger, LoggerFactory } from './src/logger.js';

// Export transports
export {
  ConsoleTransport,
  JsonTransport,
  FileTransport,
  RemoteTransport,
  FilteredTransport,
  MultiTransport
} from './src/transports.js';

// Export observability features
export {
  MetricsCollector,
  DistributedTracer,
  HealthChecker,
  AlertManager,
  type TracingSpan,
  type TracingEvent,
  type HealthCheck,
  type HealthCheckResult,
  type HealthReport,
  type AlertRule,
  type Alert
} from './src/observability.js';

// Export configuration utilities
export {
  ConfigLoader,
  ConfigValidator,
  DefaultConfigs,
  ConfigBuilder,
  ConfigUtils
} from './config/index.js';
