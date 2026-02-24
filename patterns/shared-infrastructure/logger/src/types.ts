/**
 * Logger Level Enum
 * Defines the severity levels for logging
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

// Export log levels for external use to avoid unused warnings
export const LOG_LEVELS = {
  TRACE: LogLevel.TRACE,
  DEBUG: LogLevel.DEBUG,
  INFO: LogLevel.INFO,
  WARN: LogLevel.WARN,
  ERROR: LogLevel.ERROR,
  FATAL: LogLevel.FATAL
} as const;

/**
 * Log Entry Interface
 * Structure for a single log entry
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  correlationId?: string;
  service?: string;
  version?: string;
  environment?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  stackTrace?: string;
  duration?: number;
  tags?: string[];
}

/**
 * Logger Transport Interface
 * Defines how log entries are output
 */
export interface LoggerTransport {
  name: string;
  level: LogLevel;
  format(_entry: LogEntry): string;
  write(_entry: LogEntry): Promise<void> | void;
}

/**
 * Logger Configuration Interface
 */
export interface LoggerConfig {
  level: LogLevel;
  service: string;
  version: string;
  environment: string;
  enableConsole: boolean;
  enableFile: boolean;
  enableStructured: boolean;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  enableCorrelationIds: boolean;
  enableMetrics: boolean;
  enableTracing: boolean;
  transports?: LoggerTransport[];
  redactFields?: string[];
  defaultContext?: Record<string, unknown>;
}

/**
 * Logger Metrics Interface
 */
export interface LoggerMetrics {
  totalLogs: number;
  logsByLevel: Record<LogLevel, number>;
  errorRate: number;
  averageLogSize: number;
  transportErrors: Record<string, number>;
}

/**
 * Performance Tracking Interface
 */
export interface PerformanceTracker {
  start(_operation: string, _context?: Record<string, unknown>): string;
  end(_trackingId: string, _context?: Record<string, unknown>): void;
  track<T>(_operation: string, _fn: () => T, _context?: Record<string, unknown>): T;
  trackAsync<T>(
    _operation: string,
    _fn: () => Promise<T>,
    _context?: Record<string, unknown>
  ): Promise<T>;
}

/**
 * Correlation Context Interface
 */
export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
}

/**
 * Logger Interface
 * Main logger contract
 */
export interface ILogger {
  trace(_message: string, _context?: Record<string, unknown>): void;
  debug(_message: string, _context?: Record<string, unknown>): void;
  info(_message: string, _context?: Record<string, unknown>): void;
  warn(_message: string, _context?: Record<string, unknown>): void;
  error(
    _message: string,
    _error?: Error | Record<string, unknown>,
    _context?: Record<string, unknown>
  ): void;
  fatal(
    _message: string,
    _error?: Error | Record<string, unknown>,
    _context?: Record<string, unknown>
  ): void;

  // Performance tracking
  startTimer(_operation: string, _context?: Record<string, unknown>): string;
  endTimer(_trackingId: string, _context?: Record<string, unknown>): void;

  // Context management
  setContext(_context: Record<string, unknown>): void;
  getContext(): Record<string, unknown>;
  clearContext(): void;

  // Correlation management
  setCorrelation(_correlation: Partial<CorrelationContext>): void;
  getCorrelation(): CorrelationContext;
  clearCorrelation(): void;

  // Child logger with context
  child(_context: Record<string, unknown>): ILogger;

  // Metrics and health
  getMetrics(): LoggerMetrics;
  health(): Promise<boolean>;

  // Lifecycle
  close(): Promise<void>;
}
