"""
Shared Logging Utilities for UIForge Ecosystem - Python Version
Provides unified logging across all projects with service identification
"""

import uuid
import json
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from enum import Enum

import structlog
from supabase import create_client, Client

try:
    import sentry_sdk
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False


class LogLevel(Enum):
    TRACE = "trace"
    DEBUG = "debug"
    INFO = "info"
    WARN = "warn"
    ERROR = "error"
    FATAL = "fatal"


@dataclass
class SharedLogEntry:
    id: Optional[str] = None
    timestamp: Optional[str] = None
    service_name: str = ""
    service_version: Optional[str] = None
    environment: str = ""
    level: LogLevel = LogLevel.INFO
    message: str = ""
    context: Optional[Dict[str, Any]] = None
    correlation_id: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    request_id: Optional[str] = None
    trace_id: Optional[str] = None
    span_id: Optional[str] = None
    tags: Optional[Dict[str, str]] = None


@dataclass
class SharedLoggerConfig:
    service_name: str
    service_version: Optional[str] = None
    environment: str = "development"
    supabase_url: str = ""
    supabase_key: str = ""
    enable_sentry: bool = False
    sentry_dsn: Optional[str] = None


class SharedLogger:
    def __init__(self, config: SharedLoggerConfig):
        self.config = config
        self.supabase: Optional[Client] = None
        self.logger = structlog.get_logger()

        # Initialize Supabase client
        if config.supabase_url and config.supabase_key:
            try:
                self.supabase = create_client(config.supabase_url, config.supabase_key)
            except Exception as e:
                self.logger.error("Failed to initialize Supabase client", error=str(e))

        # Initialize Sentry if enabled
        if config.enable_sentry and config.sentry_dsn and SENTRY_AVAILABLE:
            try:
                sentry_sdk.init(
                    dsn=config.sentry_dsn,
                    environment=config.environment,
                    release=f"{config.service_name}@{config.service_version or 'unknown'}",
                )
                self.logger.info("Sentry initialized for shared logging")
            except Exception as e:
                self.logger.error("Failed to initialize Sentry", error=str(e))

    async def log(self, entry: SharedLogEntry) -> None:
        """Log an entry to the shared logging table"""
        # Set timestamp and service info
        entry.timestamp = datetime.now(timezone.utc).isoformat()
        entry.service_name = self.config.service_name
        entry.environment = self.config.environment
        entry.service_version = self.config.service_version

        try:
            # Store in Supabase
            if self.supabase:
                await self._store_in_supabase(entry)

            # Send to Sentry if enabled
            if self.config.enable_sentry and SENTRY_AVAILABLE:
                await self._send_to_sentry(entry)

            # Also log to console for development
            if self.config.environment == "development":
                self.logger.info(
                    f"[{self.config.service_name}] {entry.level.value.upper()}: {entry.message}",
                    extra=entry.context or {},
                )

        except Exception as e:
            self.logger.error("Failed to log entry", error=str(e))

    async def _store_in_supabase(self, entry: SharedLogEntry) -> None:
        """Store log entry in Supabase shared_logs table"""
        try:
            # Convert dataclass to dict and handle UUID serialization
            log_data = asdict(entry)
            
            # Convert enum to string
            if isinstance(log_data.get("level"), LogLevel):
                log_data["level"] = log_data["level"].value

            result = self.supabase.table("shared_logs").insert(log_data).execute()
            
            if hasattr(result, 'error') and result.error:
                self.logger.error("Failed to log to shared_logs table", error=result.error)
                
        except Exception as e:
            self.logger.error("Failed to store in Supabase", error=str(e))

    async def _send_to_sentry(self, entry: SharedLogEntry) -> None:
        """Send log entry to Sentry"""
        try:
            # Add breadcrumb
            sentry_sdk.add_breadcrumb(
                category="shared_log",
                message=entry.message,
                level=entry.level.value,
                data=entry.context or {},
                tags={
                    "service": entry.service_name,
                    **(entry.tags or {}),
                },
            )

            # If it's an error or fatal level, capture as exception
            if entry.level in [LogLevel.ERROR, LogLevel.FATAL]:
                sentry_sdk.capture_exception(
                    Exception(entry.message),
                    tags={
                        "service": entry.service_name,
                        **(entry.tags or {}),
                    },
                    extra=entry.context or {},
                )

        except Exception as e:
            self.logger.error("Failed to send to Sentry", error=str(e))

    # Convenience methods for different log levels
    async def trace(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.TRACE, message=message, context=context))

    async def debug(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.DEBUG, message=message, context=context))

    async def info(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.INFO, message=message, context=context))

    async def warn(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.WARN, message=message, context=context))

    async def error(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.ERROR, message=message, context=context))

    async def fatal(self, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        await self.log(SharedLogEntry(level=LogLevel.FATAL, message=message, context=context))

    async def log_with_correlation(
        self,
        correlation_id: str,
        level: LogLevel,
        message: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log with correlation ID for request tracing"""
        await self.log(
            SharedLogEntry(
                level=level,
                message=message,
                context=context,
                correlation_id=correlation_id,
            )
        )

    async def log_with_trace(
        self,
        trace_id: str,
        span_id: str,
        level: LogLevel,
        message: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log with Sentry trace context"""
        await self.log(
            SharedLogEntry(
                level=level,
                message=message,
                context=context,
                trace_id=trace_id,
                span_id=span_id,
            )
        )

    async def log_user_activity(
        self,
        user_id: str,
        session_id: str,
        action: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log user activity"""
        await self.log(
            SharedLogEntry(
                level=LogLevel.INFO,
                message=f"User action: {action}",
                context={
                    "action": action,
                    **(context or {}),
                },
                user_id=user_id,
                session_id=session_id,
                tags={
                    "category": "user_activity",
                    "action": action,
                },
            )
        )

    async def log_api_request(
        self,
        request_id: str,
        method: str,
        endpoint: str,
        status_code: int,
        duration: Optional[float] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log API request"""
        await self.log(
            SharedLogEntry(
                level=LogLevel.ERROR if status_code >= 400 else LogLevel.INFO,
                message=f"{method} {endpoint} - {status_code}",
                context={
                    "method": method,
                    "endpoint": endpoint,
                    "status_code": status_code,
                    "duration": duration,
                    **(context or {}),
                },
                request_id=request_id,
                tags={
                    "category": "api_request",
                    "method": method,
                    "endpoint": endpoint.split("/")[1] if "/" in endpoint else "unknown",
                    "status_code": str(status_code),
                },
            )
        )

    async def log_database_operation(
        self,
        operation: str,
        table: str,
        success: bool,
        duration: Optional[float] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log database operation"""
        await self.log(
            SharedLogEntry(
                level=LogLevel.INFO if success else LogLevel.ERROR,
                message=f"Database {operation} on {table}",
                context={
                    "operation": operation,
                    "table": table,
                    "success": success,
                    "duration": duration,
                    **(context or {}),
                },
                tags={
                    "category": "database_operation",
                    "operation": operation,
                    "table": table,
                    "success": str(success),
                },
            )
        )

    async def log_mcp_tool_execution(
        self,
        tool_name: str,
        success: bool,
        duration: Optional[float] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log MCP tool execution"""
        await self.log(
            SharedLogEntry(
                level=LogLevel.INFO if success else LogLevel.ERROR,
                message=f"MCP tool execution: {tool_name}",
                context={
                    "tool_name": tool_name,
                    "success": success,
                    "duration": duration,
                    **(context or {}),
                },
                tags={
                    "category": "mcp_tool_execution",
                    "tool_name": tool_name,
                    "success": str(success),
                },
            )
        )

    async def query_logs(
        self,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[SharedLogEntry]:
        """Query logs from the shared table"""
        try:
            if not self.supabase:
                return []

            query = self.supabase.table("shared_logs").select("*").order("timestamp", desc=True)

            # Apply filters
            if filters:
                if "service_name" in filters:
                    query = query.eq("service_name", filters["service_name"])
                if "level" in filters:
                    query = query.eq("level", filters["level"])
                if "correlation_id" in filters:
                    query = query.eq("correlation_id", filters["correlation_id"])
                if "user_id" in filters:
                    query = query.eq("user_id", filters["user_id"])
                if "limit" in filters:
                    query = query.limit(filters["limit"])
                if "offset" in filters:
                    query = query.range(filters["offset"], filters["offset"] + filters.get("limit", 10) - 1)

            result = query.execute()

            if hasattr(result, 'error') and result.error:
                self.logger.error("Failed to query logs", error=result.error)
                return []

            # Convert results to SharedLogEntry objects
            logs = []
            for item in result.data or []:
                # Convert level string back to enum
                level = LogLevel.INFO
                try:
                    level = LogLevel(item.get("level", "info"))
                except ValueError:
                    pass

                log_entry = SharedLogEntry(
                    id=item.get("id"),
                    timestamp=item.get("timestamp"),
                    service_name=item.get("service_name", ""),
                    service_version=item.get("service_version"),
                    environment=item.get("environment", ""),
                    level=level,
                    message=item.get("message", ""),
                    context=item.get("context"),
                    correlation_id=item.get("correlation_id"),
                    user_id=item.get("user_id"),
                    session_id=item.get("session_id"),
                    request_id=item.get("request_id"),
                    trace_id=item.get("trace_id"),
                    span_id=item.get("span_id"),
                    tags=item.get("tags"),
                )
                logs.append(log_entry)

            return logs

        except Exception as e:
            self.logger.error("Failed to query logs", error=str(e))
            return []

    async def get_logs_by_correlation_id(self, correlation_id: str) -> List[SharedLogEntry]:
        """Get logs by correlation ID (useful for tracing requests)"""
        return await self.query_logs({"correlation_id": correlation_id})

    async def get_logs_by_trace_id(self, trace_id: str) -> List[SharedLogEntry]:
        """Get logs by trace ID (useful for Sentry integration)"""
        try:
            if not self.supabase:
                return []

            result = (
                self.supabase.table("shared_logs")
                .select("*")
                .eq("trace_id", trace_id)
                .order("timestamp", desc=True)
                .execute()
            )

            if hasattr(result, 'error') and result.error:
                self.logger.error("Failed to get logs by trace ID", error=result.error)
                return []

            # Convert results to SharedLogEntry objects
            logs = []
            for item in result.data or []:
                level = LogLevel.INFO
                try:
                    level = LogLevel(item.get("level", "info"))
                except ValueError:
                    pass

                log_entry = SharedLogEntry(
                    id=item.get("id"),
                    timestamp=item.get("timestamp"),
                    service_name=item.get("service_name", ""),
                    service_version=item.get("service_version"),
                    environment=item.get("environment", ""),
                    level=level,
                    message=item.get("message", ""),
                    context=item.get("context"),
                    correlation_id=item.get("correlation_id"),
                    user_id=item.get("user_id"),
                    session_id=item.get("session_id"),
                    request_id=item.get("request_id"),
                    trace_id=item.get("trace_id"),
                    span_id=item.get("span_id"),
                    tags=item.get("tags"),
                )
                logs.append(log_entry)

            return logs

        except Exception as e:
            self.logger.error("Failed to get logs by trace ID", error=str(e))
            return []


# Global logger instance
_global_logger: Optional[SharedLogger] = None


def initialize_shared_logger(config: SharedLoggerConfig) -> SharedLogger:
    """Initialize the shared logger"""
    global _global_logger
    _global_logger = SharedLogger(config)
    return _global_logger


def get_shared_logger() -> Optional[SharedLogger]:
    """Get the global shared logger"""
    return _global_logger


def create_correlation_id() -> str:
    """Create a correlation ID for request tracing"""
    return f"corr_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:8]}"


def get_or_create_correlation_id(headers: Optional[Dict[str, str]] = None) -> str:
    """Extract correlation ID from headers or create new one"""
    if headers and "x-correlation-id" in headers:
        return headers["x-correlation-id"]
    return create_correlation_id()


def add_correlation_to_headers(headers: Dict[str, str], correlation_id: str) -> Dict[str, str]:
    """Add correlation ID to headers"""
    return {
        **headers,
        "x-correlation-id": correlation_id,
    }


# Structlog processor for shared logging
def shared_logging_processor(logger, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Structlog processor that also sends to shared logging table"""
    global_logger = get_shared_logger()
    
    if global_logger and method_name in ["info", "debug", "warning", "error", "critical"]:
        # Map structlog levels to our levels
        level_mapping = {
            "debug": LogLevel.DEBUG,
            "info": LogLevel.INFO,
            "warning": LogLevel.WARN,
            "error": LogLevel.ERROR,
            "critical": LogLevel.FATAL,
        }
        
        level = level_mapping.get(method_name, LogLevel.INFO)
        message = event_dict.get("event", "")
        
        # Remove the event from context since it's the message
        context = {k: v for k, v in event_dict.items() if k != "event"}
        
        # Send to shared logger asynchronously
        try:
            asyncio.create_task(global_logger.log(SharedLogEntry(
                level=level,
                message=message,
                context=context
            )))
        except Exception:
            # If we're not in an async context, just log the error
            import traceback
            print(f"Failed to send to shared logger: {traceback.format_exc()}")
    
    return event_dict