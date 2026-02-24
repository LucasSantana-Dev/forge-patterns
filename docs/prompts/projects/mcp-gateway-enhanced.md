# MCP Gateway Enhanced Prompts

Skill-enhanced prompt templates for MCP Gateway development, integrating systematic debugging, MCP docs search, and brainstorming capabilities.

## 🐳 Docker & Service Management Prompts

### **Docker Service Optimization**
```markdown
# Docker Service Optimization
You are a Docker specialist working on the MCP Gateway. The [service] is experiencing [performance/resource issues].

DOCKER-OPTIMIZED APPROACH:
- Use @[/systematic-debugging] to trace the issue
- Apply @[/get-context] for current service state
- Use @[/skill-mcp-docs-search] for Docker best practices

SYSTEMATIC DEBUGGING WORKFLOW:
1. Read error messages completely and identify patterns
2. Reproduce the issue consistently with test cases
3. Check recent changes that could cause the issue
4. Use @[/mcp-docs-and-tools] to verify Docker configurations
5. Apply systematic fixes based on root cause analysis

DOCKER SPECIFICS:
✅ CONTAINER ANALYSIS:
- [ ] Check container resource usage with `docker stats`
- [ ] Analyze service logs with `docker compose logs [service]`
- [ ] Verify container health checks and restart policies
- [ ] Examine Dockerfile optimization opportunities

✅ PERFORMANCE INVESTIGATION:
- [ ] Monitor memory usage patterns and leaks
- [ ] Check CPU utilization and throttling
- [ ] Analyze network I/O and connection handling
- [ ] Review volume mounting and I/O performance

✅ CONFIGURATION VALIDATION:
- [ ] Verify Docker Compose service definitions
- [ ] Check environment variable configuration
- [ ] Validate resource limits and constraints
- [ ] Test scaling and load balancing configurations

MCP ENHANCEMENT:
- Use @[/get-context] to analyze current gateway state
- Apply @[/skill-mcp-docs-search] for MCP-specific Docker patterns
- Validate solutions with @[/mcp-docs-and-tools]
```

### **FastAPI Service Debugging**
```markdown
# FastAPI Service Debugging
You are a FastAPI specialist working on the MCP Gateway. The [endpoint/service] is experiencing [error/issue].

FASTAPI-SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for API troubleshooting
- Apply @[/get-context] for current API state
- Use @[/skill-mcp-docs-search] for FastAPI patterns

SYSTEMATIC API DEBUGGING:
1. Read error messages completely and identify error types
2. Reproduce the issue with consistent test cases
3. Check recent code changes that could cause the issue
4. Trace data flow through the API stack
5. Test minimal fixes before full implementation

FASTAPI SPECIFICS:
✅ ENDPOINT ANALYSIS:
- [ ] Check request/response models and validation
- [ ] Verify dependency injection and service initialization
- [ ] Analyze async/await patterns and concurrency
- [ ] Review error handling and exception management

✅ PERFORMANCE INVESTIGATION:
- [ ] Monitor response times and throughput
- [ ] Check database query performance
- [ ] Analyze memory usage and garbage collection
- [ ] Review logging and monitoring setup

✅ INTEGRATION VALIDATION:
- [ ] Test MCP tool integration points
- [ ] Verify AI router communication
- [ ] Check service manager interactions
- [ ] Validate Docker service orchestration

MCP ENHANCEMENT:
- Use @[/get-context] for current MCP gateway state
- Apply @[/skill-mcp-docs-search] for MCP API patterns
- Validate with @[/mcp-docs-and-tools] for best practices
```

## 🤖 AI Router & Tool Selection Prompts

### **AI Router Optimization**
```markdown
# AI Router Optimization
You are working on the MCP Gateway AI router. The [routing/selection] system needs [optimization/enhancement].

AI ROUTER SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for router troubleshooting
- Apply @[/brainstorming] for routing strategy exploration
- Use @[/skill-mcp-docs-search] for AI routing patterns

BRAINSTORMING ROUTING STRATEGIES:
1. Explore current routing challenges and bottlenecks
2. Ask clarifying questions about performance requirements
3. Present 2-3 routing approaches with trade-offs:
   - Enhanced NLP semantic analysis
   - Hybrid AI + keyword matching
   - Context-aware routing with learning
4. Get user approval before implementation

ROUTER SPECIFICS:
✅ SELECTION LOGIC:
- [ ] Analyze current tool selection algorithms
- [ ] Evaluate confidence scoring mechanisms
- [ ] Test semantic matching vs keyword matching
- [ ] Review context integration and history tracking

✅ PERFORMANCE OPTIMIZATION:
- [ ] Monitor routing latency and throughput
- [ ] Check AI model response times
- [ ] Analyze cache hit rates and effectiveness
- [ ] Review resource utilization and scaling

✅ INTEGRATION ENHANCEMENT:
- [ ] Test Ollama model integration
- [ ] Verify fallback mechanism reliability
- [ ] Check tool registry and discovery
- [ ] Validate error handling and recovery

MCP ENHANCEMENT:
- Use @[/get-context] for current AI router state
- Apply @[/skill-mcp-docs-search] for routing best practices
- Validate with @[/mcp-docs-and-tools] for AI patterns
```

### **Tool Selection Enhancement**
```markdown
# Tool Selection Enhancement
You are enhancing the MCP Gateway tool selection system. The [selection/matching] process needs [improvement/optimization].

TOOL SELECTION SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for selection logic analysis
- Apply @[/brainstorming] for selection strategy innovation
- Use @[/skill-mcp-docs-search] for tool selection patterns

BRAINSTORMING SELECTION IMPROVEMENTS:
1. Analyze current selection accuracy and failure modes
2. Explore enhancement opportunities:
   - Intent recognition improvements
   - Context-aware selection
   - Learning from user feedback
   - Multi-tool orchestration
3. Design enhanced selection algorithms
4. Plan implementation strategy with testing

SELECTION SPECIFICS:
✅ ALGORITHM ANALYSIS:
- [ ] Review current NLP processing and intent extraction
- [ ] Evaluate tool description matching and similarity
- [ ] Test confidence scoring and threshold tuning
- [ ] Analyze context integration and history tracking

✅ DATA FLOW OPTIMIZATION:
- [ ] Monitor selection latency and processing time
- [ ] Check cache utilization and hit rates
- [ ] Analyze memory usage and garbage collection
- [ ] Review logging and debugging capabilities

✅ ENHANCEMENT IMPLEMENTATION:
- [ ] Implement improved intent recognition
- [ ] Add context-aware selection logic
- [ ] Create feedback learning mechanisms
- [ ] Build comprehensive testing framework

MCP ENHANCEMENT:
- Use @[/get-context] for current tool selection state
- Apply @[/skill-mcp-docs-search] for selection algorithms
- Validate with @[/mcp-docs-and-tools] for MCP tool patterns
```

## 🔧 Service Manager Prompts

### **Service Lifecycle Management**
```markdown
# Service Lifecycle Management
You are working on the MCP Gateway service manager. The [sleep/wake/lifecycle] system needs [enhancement/optimization].

SERVICE MANAGER SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for lifecycle troubleshooting
- Apply @[/brainstorming] for service management innovation
- Use @[/skill-mcp-docs-search] for Docker service patterns

BRAINSTORMING LIFECYCLE IMPROVEMENTS:
1. Analyze current service management challenges
2. Explore enhancement opportunities:
   - Improved Docker SDK integration
   - Enhanced monitoring and health checks
   - Automated scaling and resource management
   - Advanced error recovery mechanisms
3. Design enhanced lifecycle management
4. Plan implementation with testing strategy

LIFECYCLE SPECIFICS:
✅ DOCKER INTEGRATION:
- [ ] Review Docker SDK usage and API interactions
- [ ] Test container pause/unpause operations
- [ ] Verify resource monitoring and statistics
- [ ] Check service discovery and registration

✅ MONITORING ENHANCEMENT:
- [ ] Implement comprehensive health checks
- [ ] Add performance metrics and alerting
- [ ] Create service dependency tracking
- [ ] Build automated recovery mechanisms

✅ AUTOMATION IMPROVEMENT:
- [ ] Design intelligent scaling policies
- [ ] Create automated resource optimization
- [ ] Implement predictive failure detection
- [ ] Build self-healing capabilities

MCP ENHANCEMENT:
- Use @[/get-context] for current service manager state
- Apply @[/skill-mcp-docs-search] for Docker service patterns
- Validate with @[/mcp-docs-and-tools] for service management best practices
```

## 📊 Monitoring & Performance Prompts

### **Performance Optimization**
```markdown
# Performance Optimization
You are optimizing the MCP Gateway performance. The [metric/component] shows [performance issue/degradation].

PERFORMANCE SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for performance analysis
- Apply @[/brainstorming] for optimization strategies
- Use @[/skill-mcp-docs-search] for performance patterns

BRAINSTORMING PERFORMANCE IMPROVEMENTS:
1. Analyze performance bottlenecks and degradation patterns
2. Explore optimization opportunities:
   - Caching strategies and implementation
   - Database query optimization
   - AI model inference acceleration
   - Network and I/O optimization
3. Design comprehensive performance improvement plan
4. Prioritize optimizations based on impact

PERFORMANCE SPECIFICS:
✅ METRICS ANALYSIS:
- [ ] Monitor response times and latency percentiles
- [ ] Track throughput and request rates
- [ ] Analyze memory usage and garbage collection
- [ ] Review CPU utilization and scaling patterns

✅ BOTTLENECK IDENTIFICATION:
- [ ] Profile application performance with tools
- [ ] Identify database query bottlenecks
- [ ] Analyze AI model inference delays
- [ ] Check network I/O and serialization overhead

✅ OPTIMIZATION IMPLEMENTATION:
- [ ] Implement intelligent caching strategies
- [ ] Optimize database queries and connections
- [ ] Enhance AI model caching and batching
- [ ] Improve error handling and retry logic

MCP ENHANCEMENT:
- Use @[/get-context] for current performance state
- Apply @[/skill-mcp-docs-search] for performance optimization
- Validate with @[/mcp-docs-and-tools] for monitoring best practices
```

## 🛠️ Development & Troubleshooting Prompts

### **Systematic Debugging Framework**
```markdown
# Systematic Debugging Framework
You are troubleshooting the MCP Gateway. The [component/service] is experiencing [specific issue/error].

SYSTEMATIC DEBUGGING APPROACH:
- Use @[/systematic-debugging] for comprehensive troubleshooting
- Apply @[/get-context] for current system state
- Use @[/skill-mcp-docs-search] for debugging patterns

DEBUGGING METHODOLOGY:
1. READ ERROR MESSAGES COMPLETELY
   - Capture full error stack traces
   - Identify error types and patterns
   - Note timestamps and sequence
   - Document error context and conditions

2. REPRODUCE THE ISSUE CONSISTENTLY
   - Create minimal reproduction case
   - Document exact steps to reproduce
   - Identify variables that affect the issue
   - Test edge cases and variations

3. CHECK RECENT CHANGES
   - Review recent commits and deployments
   - Identify configuration changes
   - Check dependency updates
   - Analyze environmental changes

4. TRACE DATA FLOW
   - Map request/response flow
   - Identify failure points in the pipeline
   - Check data transformation and validation
   - Verify integration points

5. TEST MINIMAL FIXES
   - Implement smallest possible change
   - Test fix in isolation
   - Verify fix doesn't break other functionality
   - Document fix and root cause

MCP GATEWAY SPECIFICS:
✅ COMPONENT ANALYSIS:
- [ ] Check AI router and tool selection
- [ ] Verify service manager operations
- [ ] Test Docker service orchestration
- [ ] Analyze API endpoint functionality

✅ INTEGRATION POINTS:
- [ ] Test MCP tool connections
- [ ] Verify AI model interactions
- [ ] Check database connectivity
- [ ] Validate external service integrations

✅ ENVIRONMENT VALIDATION:
- [ ] Check configuration and environment variables
- [ ] Verify resource availability and limits
- [ ] Test network connectivity and ports
- [ ] Validate security and authentication

MCP ENHANCEMENT:
- Use @[/get-context] for comprehensive system analysis
- Apply @[/skill-mcp-docs-search] for debugging best practices
- Validate solutions with @[/mcp-docs-and-tools]
```

## 🚀 Deployment & CI/CD Prompts

### **Deployment Automation**
```markdown
# Deployment Automation Enhancement
You are enhancing the MCP Gateway deployment automation. The [deployment/CI/CD] process needs [improvement/optimization].

DEPLOYMENT SYSTEMATIC APPROACH:
- Use @[/systematic-debugging] for deployment troubleshooting
- Apply @[/brainstorming] for deployment strategy innovation
- Use @[/skill-mcp-docs-search] for deployment patterns

BRAINSTORMING DEPLOYMENT IMPROVEMENTS:
1. Analyze current deployment challenges and bottlenecks
2. Explore enhancement opportunities:
   - Automated testing and validation
   - Blue-green deployment strategies
   - Rollback and recovery mechanisms
   - Monitoring and alerting integration
3. Design comprehensive deployment automation
4. Plan implementation with safety measures

DEPLOYMENT SPECIFICS:
✅ AUTOMATION ENHANCEMENT:
- [ ] Implement comprehensive pre-deployment checks
- [ ] Create automated testing pipelines
- [ ] Build deployment verification scripts
- [ ] Design rollback and recovery procedures

✅ DOCKER OPTIMIZATION:
- [ ] Optimize Docker build processes
- [ ] Implement multi-stage builds
- [ ] Create efficient container images
- [ ] Design scaling and load balancing

✅ MONITORING INTEGRATION:
- [ ] Implement deployment health checks
- [ ] Create performance monitoring
- [ ] Build alerting and notification systems
- [ ] Design logging and debugging capabilities

MCP ENHANCEMENT:
- Use @[/get-context] for current deployment state
- Apply @[/skill-mcp-docs-search] for deployment best practices
- Validate with @[/mcp-docs-and-tools] for CI/CD patterns
```

## 📝 Usage Guidelines

### **For MCP Gateway Development**
1. **Select Appropriate Template**: Choose the template that matches your task type
2. **Apply Systematic Debugging**: Always use the systematic debugging methodology
3. **Leverage MCP Tools**: Use @[/get-context], @[/skill-mcp-docs-search], and @[/mcp-docs-and-tools]
4. **Follow Best Practices**: Adhere to Docker, FastAPI, and Python best practices

### **For Troubleshooting**
1. **Use Systematic Approach**: Follow the 5-step systematic debugging methodology
2. **Document Everything**: Keep detailed records of issues and solutions
3. **Test Thoroughly**: Validate fixes in isolation and integration
4. **Learn from Patterns**: Identify recurring issues and preventive measures

### **For Enhancement Projects**
1. **Apply Brainstorming**: Use structured brainstorming for design decisions
2. **Consider Trade-offs**: Evaluate multiple approaches with pros/cons
3. **Plan Incrementally**: Break large changes into manageable steps
4. **Validate Continuously**: Test and validate at each step

These enhanced prompts leverage systematic debugging, brainstorming, and MCP-specific knowledge to provide comprehensive, context-aware guidance for MCP Gateway development and maintenance.