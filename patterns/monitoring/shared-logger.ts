/**
 * Shared Logging Utilities for UIForge Ecosystem
 * Provides unified logging across all projects with service identification
 */

export interface SharedLogEntry {
  id?: string;
  timestamp: string;
  serviceName: string;
  serviceVersion?: string;
  environment: string;
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, any>;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  tags?: Record<string, string>;
}

export interface SharedLoggerConfig {
  serviceName: string;
  serviceVersion?: string;
  environment: string;
  supabaseUrl: string;
  supabaseKey: string;
  enableSentry?: boolean;
  sentryDsn?: string;
}

export class SharedLogger {
  private config: SharedLoggerConfig;
  private supabase: any;

  constructor(config: SharedLoggerConfig) {
    this.config = config;

    // Initialize Supabase client
    if (typeof window !== 'undefined' && window.supabase) {
      this.supabase = window.supabase;
    } else {
      // Node.js environment - use dynamic import
      try {
        const { createClient } = await import('@supabase/supabase-js');
        this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
      } catch (error) {
        console.warn('Failed to initialize Supabase client:', error);
      }
    }
  }

  /**
   * Log an entry to the shared logging table
   */
  async log(
    entry: Omit<SharedLogEntry, 'timestamp' | 'serviceName' | 'environment'>
  ): Promise<void> {
    const logEntry: SharedLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      serviceName: this.config.serviceName,
      environment: this.config.environment,
      serviceVersion: this.config.serviceVersion
    };

    try {
      // Store in Supabase
      if (this.supabase) {
        const { error } = await this.supabase.from('shared_logs').insert(logEntry);

        if (error) {
          console.error('Failed to log to shared_logs table:', error);
        }
      }

      // Send to Sentry if enabled
      if (this.config.enableSentry && this.config.sentryDsn) {
        await this.sendToSentry(logEntry);
      }

      // Also log to console for development
      if (this.config.environment === 'development') {
        console.log(
          `[${this.config.serviceName}] ${logEntry.level.toUpperCase()}:`,
          logEntry.message,
          logEntry.context
        );
      }
    } catch (error) {
      console.error('Failed to log entry:', error);
    }
  }

  /**
   * Convenience methods for different log levels
   */
  async trace(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'trace', message, context });
  }

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'debug', message, context });
  }

  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'info', message, context });
  }

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'warn', message, context });
  }

  async error(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'error', message, context });
  }

  async fatal(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'fatal', message, context });
  }

  /**
   * Log with correlation ID for request tracing
   */
  async logWithCorrelation(
    correlationId: string,
    level: SharedLogEntry['level'],
    message: string,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level,
      message,
      context,
      correlationId
    });
  }

  /**
   * Log with Sentry trace context
   */
  async logWithTrace(
    traceId: string,
    spanId: string,
    level: SharedLogEntry['level'],
    message: string,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level,
      message,
      context,
      traceId,
      spanId
    });
  }

  /**
   * Log user activity
   */
  async logUserActivity(
    userId: string,
    sessionId: string,
    action: string,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: 'info',
      message: `User action: ${action}`,
      context: {
        action,
        ...context
      },
      userId,
      sessionId,
      tags: {
        category: 'user_activity',
        action
      }
    });
  }

  /**
   * Log API request
   */
  async logApiRequest(
    requestId: string,
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${method} ${endpoint} - ${statusCode}`,
      context: {
        method,
        endpoint,
        statusCode,
        duration,
        ...context
      },
      requestId,
      tags: {
        category: 'api_request',
        method,
        endpoint: endpoint.split('/')[1] || 'unknown',
        status_code: statusCode.toString()
      }
    });
  }

  /**
   * Log database operation
   */
  async logDatabaseOperation(
    operation: string,
    table: string,
    success: boolean,
    duration?: number,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: success ? 'info' : 'error',
      message: `Database ${operation} on ${table}`,
      context: {
        operation,
        table,
        success,
        duration,
        ...context
      },
      tags: {
        category: 'database_operation',
        operation,
        table,
        success: success.toString()
      }
    });
  }

  /**
   * Log MCP tool execution
   */
  async logMcpToolExecution(
    toolName: string,
    success: boolean,
    duration?: number,
    context?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: success ? 'info' : 'error',
      message: `MCP tool execution: ${toolName}`,
      context: {
        toolName,
        success,
        duration,
        ...context
      },
      tags: {
        category: 'mcp_tool_execution',
        tool_name: toolName,
        success: success.toString()
      }
    });
  }

  private async sendToSentry(entry: SharedLogEntry): Promise<void> {
    if (typeof window === 'undefined') {
      // Server-side - use Node.js Sentry
      try {
        const Sentry = await import('@sentry/node');

        // Add breadcrumb
        Sentry.addBreadcrumb({
          category: 'shared_log',
          message: entry.message,
          level: entry.level,
          data: entry.context,
          tags: {
            service: entry.serviceName,
            ...entry.tags
          }
        });

        // If it's an error or fatal level, capture as exception
        if (entry.level === 'error' || entry.level === 'fatal') {
          Sentry.captureException(new Error(entry.message), {
            tags: {
              service: entry.serviceName,
              ...entry.tags
            },
            extra: entry.context
          });
        }
      } catch (error) {
        console.error('Failed to send to Sentry:', error);
      }
    } else {
      // Client-side - use browser Sentry
      try {
        if (window.Sentry) {
          window.Sentry.addBreadcrumb({
            category: 'shared_log',
            message: entry.message,
            level: entry.level,
            data: entry.context,
            tags: {
              service: entry.serviceName,
              ...entry.tags
            }
          });

          if (entry.level === 'error' || entry.level === 'fatal') {
            window.Sentry.captureException(new Error(entry.message), {
              tags: {
                service: entry.serviceName,
                ...entry.tags
              },
              extra: entry.context
            });
          }
        }
      } catch (error) {
        console.error('Failed to send to Sentry:', error);
      }
    }
  }

  /**
   * Query logs from the shared table
   */
  async queryLogs(filters?: {
    serviceName?: string;
    level?: string;
    correlationId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<SharedLogEntry[]> {
    try {
      let query = this.supabase
        .from('shared_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filters?.serviceName) {
        query = query.eq('service_name', filters.serviceName);
      }
      if (filters?.level) {
        query = query.eq('level', filters.level);
      }
      if (filters?.correlationId) {
        query = query.eq('correlation_id', filters.correlationId);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to query logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to query logs:', error);
      return [];
    }
  }

  /**
   * Get logs by correlation ID (useful for tracing requests)
   */
  async getLogsByCorrelationId(correlationId: string): Promise<SharedLogEntry[]> {
    return this.queryLogs({ correlationId });
  }

  /**
   * Get logs by trace ID (useful for Sentry integration)
   */
  async getLogsByTraceId(traceId: string): Promise<SharedLogEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from('shared_logs')
        .select('*')
        .eq('trace_id', traceId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Failed to get logs by trace ID:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get logs by trace ID:', error);
      return [];
    }
  }
}

// Global logger instance
let globalLogger: SharedLogger | null = null;

/**
 * Initialize the shared logger
 */
export function initializeSharedLogger(config: SharedLoggerConfig): SharedLogger {
  globalLogger = new SharedLogger(config);
  return globalLogger;
}

/**
 * Get the global shared logger
 */
export function getSharedLogger(): SharedLogger | null {
  return globalLogger;
}

/**
 * Create a correlation ID for request tracing
 */
export function createCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract correlation ID from headers or create new one
 */
export function getOrCreateCorrelationId(headers?: Record<string, string>): string {
  if (headers?.['x-correlation-id']) {
    return headers['x-correlation-id'];
  }
  return createCorrelationId();
}

/**
 * Add correlation ID to headers
 */
export function addCorrelationToHeaders(
  headers: Record<string, string>,
  correlationId: string
): Record<string, string> {
  return {
    ...headers,
    'x-correlation-id': correlationId
  };
}
