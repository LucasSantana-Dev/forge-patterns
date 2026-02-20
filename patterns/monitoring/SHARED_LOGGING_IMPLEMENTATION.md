# Shared Logging Implementation for UIForge Ecosystem

This document provides comprehensive guidance for implementing shared logging across the UIForge ecosystem with Sentry integration and service identification.

## Overview

The shared logging system provides:
- **Centralized Logging**: All services log to a single Supabase table
- **Service Identification**: Each log entry includes service metadata for filtering
- **Sentry Integration**: Automatic error tracking and performance monitoring
- **Correlation Tracking**: Request tracing across microservices
- **Real-time Monitoring**: Live dashboard with filtering and search capabilities

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   mcp-gateway     │    │   uiforge-mcp     │    │   uiforge-webapp   │
│   (Python)         │    │   (Node.js)       │    │   (Next.js)       │
└─────────┬────────┘    └─────────┬────────┘    └─────────┬────────┘
         │                        │                        │
         └─────────────────────┴─────────────────────┘
                    ┌─────────────────┐
                    │  Shared Logs Table │
                    │   (Supabase)      │
                    └─────────────────┘
                           │
                    ┌─────────────────┐
                    │   Sentry Dashboard │
                    │   (Self-hosted)    │
                    └─────────────────┘
```

## Database Schema

### shared_logs Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `timestamp` | TIMESTAMPTZ | Log timestamp |
| `service_name` | VARCHAR(50) | Service that generated the log |
| `service_version` | VARCHAR(20) | Version of the service |
| `environment` | VARCHAR(20) | Environment (development/staging/production) |
| `level` | VARCHAR(10) | Log level (trace/debug/info/warn/error/fatal) |
| `message` | TEXT | Log message |
| `context` | JSONB | Additional context data |
| `correlation_id` | UUID | Correlation ID for request tracing |
| `user_id` | UUID | User identifier |
| `session_id` | UUID | Session identifier |
| `request_id` | VARCHAR(255) | Request identifier |
| `trace_id` | VARCHAR(255) | Sentry trace ID |
| `span_id` | VARCHAR(255) | Sentry span ID |
| `tags` | JSONB | Additional tags for filtering |

## Implementation Details

### mcp-gateway (Python)

#### Files Created:
- `tool_router/sentry_integration_shared.py` - Enhanced Sentry integration with shared logging
- `tool_router/shared_logger.py` - Shared logging utilities

#### Key Features:
- Structured logging with structlog integration
- Supabase database operations monitoring
- MCP tool execution tracking
- Service lifecycle monitoring
- Correlation ID propagation

#### Usage:
```python
from tool_router.sentry_integration_shared import init_sentry, monitor_mcp_tool_execution
from tool_router.shared_logger import get_shared_logger

# Initialize Sentry with shared logging
init_sentry(
    dsn=os.getenv('SENTRY_DSN'),
    environment=os.getenv('NODE_ENV', 'development'),
    service_name='mcp-gateway',
    enable_supabase=True,
    supabase_url=os.getenv('SUPABASE_URL'),
    supabase_key=os.getenv('SUPABASE_KEY')
)

# Monitor MCP tool execution
await monitor_mcp_tool_execution('tool_name', success=True, duration=1500)
```

### uiforge-mcp (Node.js)

#### Files Created:
- `src/lib/sentry-shared.ts` - Enhanced Sentry integration with shared logging
- `src/lib/shared-logger.ts` - Shared logging utilities

#### Key Features:
- Browser and server-side Sentry integration
- Supabase integration for database operations
- AI model monitoring
- Figma API tracking
- User interaction tracking

#### Usage:
```typescript
import { initSentry, monitorMcpToolExecution } from './lib/sentry-shared';
import { getSharedLogger } from './lib/shared-logger';

// Initialize Sentry with shared logging
initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  serviceName: 'uiforge-mcp',
  enableSupabase: true,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY
});

// Monitor MCP tool execution
await monitorMcpToolExecution('tool_name', success=True, duration=1500);
```

### uiforge-webapp (Next.js)

#### Files Created:
- `apps/web/src/lib/sentry-shared.ts` - Enhanced Sentry integration with shared logging
- `apps/web/src/lib/shared-logger.ts` - Shared logging utilities
- `apps/web/src/components/monitoring/MonitoringDashboard.tsx` - Real-time monitoring dashboard

#### Key Features:
- Client and server-side Sentry integration
- Page performance monitoring
- User interaction tracking
- API request monitoring
- Real-time dashboard with filtering

#### Usage:
```typescript
import { initClientSentry, initServerSentry, monitorUserInteraction } from './lib/sentry-shared';
import { getSharedLoggerClient } from './lib/shared-logger';

// Initialize Sentry (client-side)
initClientSentry({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  serviceName: 'uiforge-webapp',
  enableSupababase: true,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

// Monitor user interactions
monitorUserInteraction('button_click', 'component_name', success=True, duration=500);
```

## Configuration

### Environment Variables

#### Required Variables:
- `SENTRY_DSN` - Sentry Data Source Name
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key

#### Optional Variables:
- `SENTRY_ORG` - Sentry organization
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_ENVIRONMENT` - Environment (development/staging/production)
- `SENTRY_SAMPLE_RATE` - Transaction sampling rate (0-1)
- `SENTRY_PROFILES_SAMPLE_RATE` - Profiling sampling rate (0-1)

#### Shared Logging Variables:
- `SHARED_LOGGING_ENABLED` - Enable shared logging (default: true)
- `SHARED_LOGGING_SERVICE_NAME` - Service name for identification
- `SHARED_LOGGING_SERVICE_VERSION` - Service version
- `SHARED_LOGGING_ENVIRONMENT` - Environment for shared logs

### Environment Templates

Each project includes an `.env.sentry-shared.example` file with the complete configuration.

## Usage Patterns

### 1. Request Tracing

```python
# Python (mcp-gateway)
from tool_router.sentry_integration_shared import correlation_context

async def handle_request(request):
    correlation_id = get_correlation_id_from_request(request)
    
    async with correlation_context(correlation_id):
        # Your request handling logic here
        pass
```

```typescript
// Node.js (uiforge-mcp)
import { createCorrelationContext } from './lib/sentry-shared';

const { correlationId, cleanup } = createCorrelationId();
try {
  // Your request handling logic here
} finally {
  cleanup();
}
```

```typescript
// Next.js (uiforge-webapp)
import { createCorrelationContext } from './lib/sentry-shared';

const { correlationId, cleanup } = createCorrelationContext();
try {
  // Your request handling logic here
} finally {
  cleanup();
}
```

### 2. Service-Specific Logging

```python
# Database operations
await shared_logger.log_database_operation('select', 'users', True, 120.5)

# User activities
await shared_logger.log_user_activity('user-123', 'session-456', 'login')

# API requests
await shared_logger.log_api_request('req-789', 'GET', '/api/users', 200, 450)
```

### 3. Error Handling

```python
# Python
try:
    # Your code here
    pass
except Exception as e:
    await shared_logger.error('Operation failed', {
        operation: 'database_query',
        error: str(e),
        table: 'users'
    })
    capture_supabase_error(e, 'select', 'users', 'SELECT * FROM users')
```

```typescript
// Node.js/Next.js
try {
  // Your code here
} catch (error) {
  await sharedLogger.error('Operation failed', {
    operation: 'database_query',
    error: error.message
  });
  captureSupabaseError(error, 'select', 'users', 'SELECT * FROM users');
}
```

## Monitoring Dashboard

The monitoring dashboard provides:

### Features:
- **Real-time Log Viewing**: Live stream of logs from all services
- **Advanced Filtering**: Filter by service, level, time range, correlation ID
- **Search Functionality**: Search through log messages and context
- **Log Statistics**: Overview of error rates and service health
- **Export Capabilities**: Export logs to CSV for analysis
- **Correlation Tracing**: View all logs for a specific request
- **Sentry Integration**: Direct links to Sentry traces

### Access:
- Navigate to `/monitoring` in the uiforge-webapp
- View real-time logs from all three services
- Filter and search for specific events
- Export data for analysis

## Best Practices

### 1. Service Identification
- Always include service name and version in log entries
- Use consistent naming conventions
- Include environment information

### 2. Correlation Tracking
- Generate correlation IDs for all incoming requests
- Propagate correlation IDs across service calls
- Use correlation IDs to trace request flows

### 3. Context Enrichment
- Include relevant context data in log entries
- Use structured data for better searching
- Add tags for categorization

### 4. Error Handling
- Log errors with full context
- Include stack traces when available
- Use appropriate log levels

### 5. Performance Considerations
- Use appropriate sampling rates for production
- Filter out noisy logs in development
- Monitor shared logging table size

## Troubleshooting

### Common Issues

#### 1. Logs not appearing in dashboard
- Check environment variables are set correctly
- Verify Supabase connection
- Ensure shared logger is initialized

#### 2. Sentry integration not working
- Verify Sentry DSN is correct
- Check Sentry initialization order
- Review Sentry error logs

#### 3. Correlation tracking broken
- Verify correlation ID propagation
- Check header passing between services
- Review correlation ID generation

### 4. Performance issues
- Adjust sampling rates for production
- Monitor database query performance
- Review log filtering efficiency

## Security Considerations

### Data Protection
- Sanitize sensitive data before logging
- Use environment variables for credentials
- Implement proper access controls

### Access Control
- Use Row Level Security (RLS) on shared logs table
- Implement service-specific access policies
- Regular user access reviews

### Compliance
- Follow data protection regulations
- Implement data retention policies
- Regular security audits

## Migration Guide

### From Individual Logging to Shared Logging

1. **Install Dependencies**: Add shared logging packages
2. **Update Configuration**: Set up environment variables
3. **Initialize Shared Logger**: Replace existing logger initialization
4. **Update Log Calls**: Replace logging calls with shared logger methods
5. **Test Integration**: Verify logs appear in dashboard

### Integration Steps

1. **Database Migration**: Run the shared logs table migration
2. **Environment Setup**: Configure environment variables
3. **Code Integration**: Update existing logging code
4. **Testing**: Verify end-to-end functionality
5. **Monitoring**: Set up alerts and dashboards

## Maintenance

### Regular Tasks
- Monitor shared logs table size
- Review error patterns and trends
- Update service versions as needed
- Clean up old log data periodically

### Performance Optimization
- Adjust sampling rates based on traffic
- Optimize database indexes
- Implement log retention policies
- Monitor query performance

## Support

For issues with the shared logging implementation:

1. Check the shared logging documentation
2. Review Sentry integration guides
3. Check Supabase connection status
4. Review environment configuration
5. Create issues in the appropriate project repository

## Future Enhancements

### Planned Features
- Log aggregation and analytics
- Automated alerting based on log patterns
- Enhanced correlation visualization
- Integration with additional monitoring tools
- Machine learning for anomaly detection

### Extension Points
- Additional service integrations
- Custom log processors
- Enhanced filtering options
- Third-party monitoring integrations