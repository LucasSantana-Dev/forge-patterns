# Unified Problem Resolution Prompts

Cross-project troubleshooting approaches with MCP-enhanced intelligent analysis
and context-aware solutions.

## 🎯 Purpose

Provide standardized, intelligent problem resolution strategies that leverage
MCP tools for context analysis, documentation search, and automated verification
across all Forge ecosystem projects.

## 🔄 MCP Integration

- **@[/get-context]**: Real-time project state analysis and issue identification
- **@[/mcp-docs-and-tools]**: API verification and best practice validation
- **@[/skill-mcp-docs-search]**: Intelligent documentation and troubleshooting
  guide search
- **@[/update-docs]**: Automated solution documentation and knowledge base
  updates

## 📋 Universal Problem Resolution Framework

### Phase 1: Intelligent Issue Assessment

```
# Systematic Issue Analysis with MCP Enhancement

You are a systems architecture specialist working on the Forge ecosystem. The project is currently experiencing [describe the specific problem].

MCP-ENHANCED CONTEXT ANALYSIS:
1. Run @[/get-context] to analyze current project state:
   - Service status and health metrics
   - Recent changes and deployments
   - Configuration and environment details
   - Error patterns and logs

2. Use @[/skill-mcp-docs-search] to find relevant troubleshooting documentation:
   - Search for specific error messages and symptoms
   - Find similar issue resolutions in project history
   - Identify best practices for the problem domain
   - Locate relevant API documentation and guides

3. Apply @[/mcp-docs-and-tools] for verification:
   - Validate API usage and configurations
   - Check current best practices compliance
   - Verify solution compatibility with project stack
   - Ensure security and performance considerations

SYSTEMATIC DIAGNOSTICS:
- **Environment Analysis**: Development, staging, or production context
- **Impact Assessment**: User experience, system performance, data integrity
- **Urgency Classification**: Critical, high, medium, or low priority
- **Dependency Mapping**: Affected services, components, and data flows
```

### Phase 2: Context-Aware Solution Development

```
# Intelligent Solution Design with MCP Verification

Based on the analysis from Phase 1, develop context-aware solutions:

MCP-POWERED SOLUTION DESIGN:
1. **Context-Specific Approach**:
   - Use @[/get-context] results to tailor solutions
   - Consider project-specific constraints and requirements
   - Align with current architecture and technology stack
   - Ensure compatibility with existing workflows

2. **Best Practice Integration**:
   - Apply findings from @[/skill-mcp-docs-search]
   - Implement proven patterns and solutions
   - Follow project-specific coding standards
   - Maintain consistency with ecosystem guidelines

3. **API and Configuration Verification**:
   - Use @[/mcp-docs-and-tools] to validate implementations
   - Ensure proper API usage and error handling
   - Verify configuration correctness and security
   - Test solution compatibility and performance

SOLUTION CATEGORIES:
- **Quick Fixes**: Immediate resolution with minimal impact (< 30 minutes)
- **Structured Solutions**: Comprehensive fixes with proper testing (1-4 hours)
- **Architectural Improvements**: Long-term solutions with refactoring (1-3 days)
- **Preventive Measures**: Future-proofing and monitoring enhancements
```

### Phase 3: Implementation and Validation

```
# Automated Implementation with MCP Validation

Execute solutions with intelligent verification:

MCP-ENHANCED IMPLEMENTATION:
1. **Automated Testing**:
   - Use @[/get-context] to determine appropriate test suites
   - Run relevant unit, integration, and end-to-end tests
   - Validate solution effectiveness and side effects
   - Monitor performance and resource usage

2. **Documentation Updates**:
   - Use @[/update-docs] to document the solution
   - Update troubleshooting guides and knowledge base
   - Record lessons learned and best practices
   - Create preventive measures for similar issues

3. **Quality Assurance**:
   - Apply @[/mcp-docs-and-tools] for final verification
   - Ensure solution meets quality standards
   - Validate security and compliance requirements
   - Confirm user experience improvements

VALIDATION CHECKLIST:
✅ **Functionality**: Solution resolves the original issue
✅ **Performance**: No degradation in system performance
✅ **Security**: No new vulnerabilities introduced
✅ **Compatibility**: Works with existing ecosystem components
✅ **Documentation**: Solution properly documented and shared
```

## 🎯 Project-Specific Problem Resolution

### MCP Gateway Issues

```
# MCP Gateway Troubleshooting with Docker/FastAPI Expertise

You are a Docker and FastAPI specialist working on the MCP Gateway. The service is experiencing [specific issue: performance degradation, API errors, container failures].

MCP-ENHANCED DIAGNOSTICS:
1. **Container Analysis**:
   - Run `docker compose ps` to check service status
   - Use `docker compose logs gateway tool-router` for error analysis
   - Check `docker stats` for resource usage patterns
   - Verify network connectivity with `docker network ls`

2. **API Health Verification**:
   - Use @[/mcp-docs-and-tools] to verify FastAPI endpoint configurations
   - Test `curl http://localhost:4444/tools` for API availability
   - Check `curl http://localhost:4444/health` for service health
   - Validate tool registration and functionality

3. **Performance Analysis**:
   - Apply @[/skill-mcp-docs-search] for performance optimization guides
   - Analyze response times and throughput metrics
   - Check database connection pooling and query performance
   - Monitor memory and CPU usage patterns

INTELLIGENT SOLUTIONS:
- **Container Issues**: Restart services, rebuild images, check configurations
- **API Problems**: Verify endpoints, check authentication, validate payloads
- **Performance**: Optimize queries, scale services, tune configurations
- **Network**: Check DNS, verify ports, troubleshoot connectivity
```

### UIForge WebApp Issues

```
# Next.js + Supabase Integration Troubleshooting

You are a Next.js and Supabase specialist working on the UIForge WebApp. The application is experiencing [specific issue: build failures, database errors, UI problems].

MCP-INTEGRATED APPROACH:
1. **Application State Analysis**:
   - Use @[/get-context] to understand current Next.js configuration
   - Check `npm run dev` startup and error logs
   - Verify Supabase connection and authentication
   - Analyze browser console errors and network requests

2. **Build and Deployment Issues**:
   - Test `npm run build` for compilation errors
   - Check TypeScript and ESLint configurations
   - Verify environment variables and configurations
   - Validate dependency versions and compatibility

3. **Database and API Issues**:
   - Use @[/mcp-docs-and-tools] to verify Supabase API usage
   - Check database schema and RLS policies
   - Test authentication flows and user sessions
   - Validate API routes and data fetching

ENHANCED SOLUTIONS:
- **Build Errors**: Fix TypeScript issues, resolve dependencies, update configurations
- **Database Problems**: Check connections, verify schemas, test queries
- **UI Issues**: Debug components, check styles, verify state management
- **Performance**: Optimize bundles, implement caching, monitor metrics
```

### UIForge MCP Server Issues

```
# MCP Server and ML Integration Troubleshooting

You are an MCP server and machine learning specialist working on UIForge MCP. The server is experiencing [specific issue: tool failures, ML model errors, performance problems].

MCP-POWERED ANALYSIS:
1. **Server Health Assessment**:
   - Use @[/get-context] to analyze MCP server status
   - Check tool registration and availability
   - Monitor ML model performance and predictions
   - Verify resource usage and scaling

2. **Tool and Integration Issues**:
   - Apply @[/skill-mcp-docs-search] for MCP server troubleshooting
   - Test individual tool functionality and responses
   - Check external API integrations and dependencies
   - Validate data processing and transformation pipelines

3. **ML Model Performance**:
   - Monitor model accuracy and prediction quality
   - Check training data quality and preprocessing
   - Verify model versioning and deployment
   - Analyze inference latency and resource usage

SPECIALIZED SOLUTIONS:
- **Tool Failures**: Debug tool implementations, check configurations, test integrations
- **ML Issues**: Retrain models, improve data quality, optimize hyperparameters
- **Performance**: Scale resources, optimize algorithms, implement caching
- **Integration**: Fix API connections, verify data formats, test workflows
```

## 🔧 Advanced Troubleshooting Techniques

### Performance Optimization

```
# Systematic Performance Enhancement with MCP Analysis

You are a performance optimization specialist. The [project] is experiencing [performance issue: slow responses, high latency, resource exhaustion].

MCP-ENHANCED PERFORMANCE ANALYSIS:
1. **Baseline Establishment**:
   - Use @[/get-context] to establish current performance metrics
   - Measure response times, throughput, and resource usage
   - Identify bottlenecks and performance constraints
   - Document performance regression points

2. **Intelligent Optimization**:
   - Apply @[/skill-mcp-docs-search] for performance optimization guides
   - Implement caching strategies and query optimization
   - Optimize database operations and API calls
   - Enhance frontend rendering and bundle sizes

3. **Continuous Monitoring**:
   - Set up performance monitoring and alerting
   - Use @[/update-docs] to document optimization strategies
   - Establish performance baselines and SLAs
   - Create automated performance regression tests
```

### Security and Compliance

```
# Security Issue Resolution with Compliance Verification

You are a security specialist addressing [security issue: vulnerability, compliance gap, access control problem].

MCP-SECURITY ENHANCEMENT:
1. **Security Assessment**:
   - Use @[/mcp-docs-and-tools] to verify security configurations
   - Scan for vulnerabilities and misconfigurations
   - Check authentication and authorization implementations
   - Validate data protection and privacy measures

2. **Compliance Verification**:
   - Apply @[/skill-mcp-docs-search] for security best practices
   - Ensure compliance with relevant standards and regulations
   - Document security policies and procedures
   - Implement security monitoring and incident response

3. **Remediation and Prevention**:
   - Address identified vulnerabilities and gaps
   - Implement security controls and monitoring
   - Use @[/update-docs] to document security measures
   - Create security awareness and training programs
```

## 📊 Success Metrics and KPIs

### Problem Resolution Effectiveness

- **Mean Time to Resolution (MTTR)**: < 4 hours for critical issues
- **First Contact Resolution**: > 80% of issues resolved on first attempt
- **Customer Satisfaction**: > 4.5/5 for resolution quality
- **Knowledge Base Growth**: +50 new solutions documented monthly

### MCP Integration Benefits

- **Context Accuracy**: 95% relevance in prompt recommendations
- **Documentation Utilization**: 90% effective search and retrieval
- **Automation Level**: 80% of resolutions include automated components
- **Quality Assurance**: 95% validation success rate

## 🔄 Continuous Improvement

### Learning and Adaptation

- **Solution Analytics**: Track effectiveness of different resolution approaches
- **Pattern Recognition**: Identify common issues and preventive measures
- **Knowledge Evolution**: Update troubleshooting guides based on new insights
- **Skill Development**: Enhance team capabilities through documented solutions

### Automation Enhancement

- **Intelligent Routing**: Automatically categorize and route issues to
  specialists
- **Predictive Analysis**: Identify potential issues before they impact users
- **Self-Healing**: Implement automated resolution for common problems
- **Knowledge Integration**: Continuously update prompt repository with new
  solutions

---

This unified problem resolution framework provides intelligent, context-aware
troubleshooting strategies that leverage MCP tools to deliver effective,
documented, and continuously improving solutions across the entire Forge
ecosystem.
