# Docker Sleep Architecture Patterns

## Purpose
Serena's reference for the three-state serverless-like sleep/wake architecture when editing Docker and infrastructure code.

## Key Files
- `patterns/shared-infrastructure/sleep-architecture/README.md` — Sleep state management
- `patterns/docker/high-efficiency-standards.md` — Docker efficiency standards

## Three-State Service Model

**Service States**
1. **RUNNING**: Actively serving requests, full resource allocation
2. **SLEEPING**: Paused (Docker pause), minimal resource usage, 100-200ms wake time
3. **STOPPED**: Completely shut down, zero resource usage, 2-5s cold start

**State Transitions**
```
STOPPED → (start) → RUNNING
RUNNING → (idle timeout) → SLEEPING  
SLEEPING → (wake trigger) → RUNNING
RUNNING → (explicit stop) → STOPPED
SLEEPING → (explicit stop) → STOPPED
```

## Sleep State Manager (`sleep-state-manager.ts`)

**Service Configuration**
- `ServiceConfig`: name, idleTimeout (ms), minSleepTime, maxSleepTime, priority (high/normal/low), memoryReservation, cpuReservation
- **Idle Timeout**: Time before auto-sleep (default 300s = 5 minutes)
- **Min Sleep Time**: Minimum time in sleep before wake (default 60s)
- **Priority**: High (never sleep), Normal (standard timeout), Low (aggressive sleep)

**Service Metrics**
- `ServiceMetrics`: state, lastActivity, wakeCount, sleepCount, totalUptime, averageResponseTime, resourceUsage{memory, cpu, network}
- **Wake Count**: Number of wake events since service start
- **Sleep Count**: Number of sleep events since service start
- **Total Uptime**: Cumulative running time in milliseconds

**Sleep Operations**
- `putToSleep()`: Pause container, update state, clear idle timeout, emit event
- `wakeService()`: Resume container, update state, restart idle timeout, emit event
- `stopService()`: Stop container, update state, clear timeout, emit event

**Docker Container Operations**
- `startContainer()`: Docker run with config
- `pauseContainer()`: Docker pause (SIGSTOP)
- `resumeContainer()`: Docker unpause (SIGCONT)
- `stopContainer()`: Docker stop (SIGTERM then SIGKILL)

## Resource Management

**Memory Optimization**
- **Running**: Full allocation (e.g., 512MB)
- **Sleep**: 50-70% reduction via memory_reservation (e.g., 128MB)
- **Stopped**: Zero allocation

**CPU Optimization**
- **Running**: Normal CPU allocation (e.g., 0.5 cores)
- **Sleep**: Near-zero CPU (Docker pause)
- **Stopped**: No CPU usage

**Network Connection Management**
- **Running**: Active connections, connection pooling
- **Sleep**: Connections paused (not closed)
- **Stopped**: All connections closed

## Service Classification

**High-Priority Services (Never Sleep)**
```yaml
sleep_policy:
  enabled: false
  priority: "high"
auto_start: true
```
Examples: databases, auth services, core infrastructure

**On-Demand Services (Sleep-Enabled)**
```yaml
sleep_policy:
  enabled: true
  idle_timeout: 300  # 5 minutes
  min_sleep_time: 60
  memory_reservation: "128MB"
  priority: "normal"
auto_start: false
```
Examples: APIs, file processing, data analysis

**Resource-Intensive Services (Aggressive Sleep)**
```yaml
sleep_policy:
  enabled: true
  idle_timeout: 180  # 3 minutes
  min_sleep_time: 120
  memory_reservation: "256MB"
  priority: "low"
auto_start: false
```
Examples: browser automation, web scraping, ML inference

## Docker Compose Standards

**Resource Constraints (REQUIRED)**
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.1'
      memory: 256M
```

**Sleep Policy Configuration**
```yaml
labels:
  - "sleep.enabled=true"
  - "sleep.idle_timeout=300"
  - "sleep.min_sleep_time=60"
  - "sleep.priority=normal"
```

**Minimal Core Services**
- Only include services that MUST be always running
- Move on-demand services to `services.yml` for dynamic management
- Use service manager with Docker-in-Docker capability

## Performance Targets

**Wake Time Requirements**
- High Priority: < 50ms
- Normal Priority: < 200ms
- Low Priority: < 500ms
- Cold Start: 2-5s (avoid when possible)

**Resource Efficiency**
- **Sleeping Services**: < 5% CPU, < 30% memory of running state
- **Overall System**: < 2GB total memory, < 2 cores CPU
- **Service Density**: 3-4x more services per resource unit
- **Cost Reduction**: 50-70% lower infrastructure costs

**Availability Standards**
- Running Services: 99.9% availability
- Sleeping Services: 99.8% effective availability (with <200ms wake)
- State Transitions: 99.9% successful sleep/wake operations

## Critical Constraints
1. **Three States Only**: Services MUST use RUNNING, SLEEPING, or STOPPED (no other states)
2. **Docker Pause**: Use Docker pause (SIGSTOP) for sleep, NOT graceful shutdown
3. **Wake Time**: Wake time MUST be < 200ms for normal priority services
4. **Idle Timeout**: MUST monitor last activity and auto-sleep after timeout
5. **Resource Limits**: ALWAYS set memory/CPU limits AND reservations
6. **Health Checks**: Implement health checks for all service states
7. **State Persistence**: Track state in metrics for monitoring and debugging
8. **Event Emission**: Emit events on all state transitions for observability
