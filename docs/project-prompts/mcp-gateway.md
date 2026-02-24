# MCP Gateway - Enhanced Development Prompts

**Current Status**: Production ready with advanced AI features (v1.35.1)

**Architecture**: FastAPI + Docker with sleep/wake architecture  
**Features**: 20+ integrated MCP servers, 79 virtual server configurations  
**Performance**: 60-80% memory reduction, wake times <200ms  
**Tests**: 70.57% coverage for RAG Manager

---

## 🚨 Problem Resolution Prompt

You are a systems architecture and Docker specialist working on the MCP Gateway. The project is facing [describe the specific problem].

### **Enhanced Approach with Skills Integration**

🧠 **Brainstorming Phase**:
- Use design thinking to explore multiple solution approaches
- Consider Docker optimization patterns and service management strategies
- Validate approach against sleep/wake architecture constraints

🔧 **Technical Analysis**:
- Apply @[/api-design-principles] for API design issues
- Use @[/systematic-debugging] methodology for root cause analysis
- Leverage @[/skill-creator] patterns for custom tool development

🎨 **Interface Enhancement**:
- Apply @[/theme-factory] for professional monitoring interfaces
- Use @[/frontend-design] for distinctive dashboard aesthetics
- Implement @[/shadcn-ui] for production-ready components

### **Critical Context**
- Sleep/wake architecture with Docker pause/unpause
- Service Manager with FastAPI + Docker SDK
- AI Router with Ollama + keyword fallback
- 79 virtual servers configured
- Test coverage: 70.57% (target: 80%+)

### **Required Analysis**
1. **Systematic Debugging**: Apply four-phase methodology
   - Read error messages carefully
   - Reproduce issue consistently
   - Check recent changes
   - Trace data flow through system
2. **API Design Review**: Validate REST patterns and error handling
3. **Performance Analysis**: Monitor Docker metrics and service response times
4. **Architecture Assessment**: Verify service layer integrity
5. **Security Validation**: Ensure no secrets exposure

### **Specific Actions**
- Run `docker compose logs gateway tool-router` for diagnostics
- Use `curl http://localhost:4444/tools` to test API endpoints
- Check `make test` for regressions
- Analyze `docker stats` for resource usage
- Review `PROJECT_CONTEXT.md` for architecture
- Apply professional themes to monitoring dashboards

### **Deliverables**
- Complete diagnosis with systematic root cause analysis
- Implemented solution with comprehensive testing
- Enhanced monitoring interfaces with professional themes
- Updated documentation with API design patterns
- Custom skills developed for domain-specific issues

---

## 🔄 Pull Request Completion Prompt

You are reviewing and finalizing a pull request for the MCP Gateway. PR # [number] affects [affected modules].

### **Enhanced Review with Skills Integration**

🧠 **Brainstorming Review Approach**:
- Explore multiple validation strategies
- Consider impact on all dependent systems
- Validate architectural decisions

🔧 **Technical Excellence**:
- Apply @[/api-design-principles] for API design validation
- Use @[/systematic-debugging] for comprehensive testing
- Leverage @[/skill-creator] patterns for extensibility

🎨 **Interface Quality**:
- Apply @[/theme-factory] for consistent visual identity
- Use @[/frontend-design] for monitoring interface improvements
- Implement @[/shadcn-ui] for dashboard component quality

### **Mandatory Quality Checklist**

✅ **Technical Verification**:
- [ ] All tests pass (`make test`)
- [ ] Linting/formatting error-free (`make lint format`)
- [ ] Type checking passes
- [ ] Build successful (`make build`)
- [ ] Docker containers start correctly
- [ ] API endpoints respond in <200ms
- [ ] API design follows REST principles
- [ ] Error handling comprehensive and consistent

✅ **Architecture Verification**:
- [ ] Follows service layer patterns
- [ ] Maintains sleep/wake compatibility
- [ ] No breaking changes introduced
- [ ] Appropriate resource limits
- [ ] Consistent error handling
- [ ] Custom skills properly structured

✅ **Security Verification**:
- [ ] No secrets exposed
- [ ] Adequate input validation
- [ ] Rate limiting maintained
- [ ] JWT authentication intact
- [ ] API security best practices applied

✅ **Performance Verification**:
- [ ] No performance regression
- [ ] Memory usage within limits
- [ ] Wake times <200ms maintained
- [ ] CPU usage optimized
- [ ] Database queries optimized

✅ **Interface Quality**:
- [ ] Professional theme consistency
- [ ] shadcn/ui components properly implemented
- [ ] Monitoring interfaces enhanced
- [ ] Accessibility compliance (WCAG AAA)
- [ ] Responsive design maintained

✅ **Documentation**:
- [ ] CHANGELOG.md updated
- [ ] Comments in critical code
- [ ] README.md if necessary
- [ ] PROJECT_CONTEXT.md if architecture changed
- [ ] API documentation updated
- [ ] Custom skill documentation provided

### **Standard Commit Message**
```
[scope]: [concise description]

- [main implementation]
- [secondary improvement]
- [bug fix if applicable]

Closes #[issue_number]
```

### **Final Actions**
1. Execute complete verification
2. Apply fixes if necessary
3. Update documentation
4. Approve PR with complete checklist

---

## 🚀 Next Phases Prompt

You are planning the next development phases for the MCP Gateway. The project is at v1.35.1 with all phases 1-8 complete.

### **Current Status**
- ✅ Production ready with enterprise features
- ✅ AI-driven optimization implemented
- ✅ Predictive scaling functional
- ✅ Self-healing capabilities
- ✅ Comprehensive monitoring

### **Priority Next Phases**

**PHASE 9: MONITORING ENHANCEMENT** (2-3 weeks)
- Real-time metrics dashboard
- Intelligent ML-based alerting
- Advanced performance analytics
- Automated capacity planning

**PHASE 10: MULTI-CLOUD EXPANSION** (3-4 weeks)
- AWS EKS support
- Azure AKS support
- Google GKE support
- Cloud-agnostic deployment

**PHASE 11: ADVANCED AI FEATURES** (4-6 weeks)
- Multi-model AI routing
- Custom model training
- Advanced prompt engineering
- AI-driven auto-scaling

### **Required Resources**
- Developers: 2-3 senior
- Infrastructure: Multi-cloud accounts
- Tools: Advanced monitoring stack
- Budget: $0 (using free tiers)

### **Risks and Mitigation**
- Multi-cloud complexity → Start with single provider
- Performance scaling → Extensive load testing
- AI model costs → Use local models/Ollama

### **Implementation Plan**
1. Prioritize Phase 9 (monitoring)
2. Evaluate actual multi-cloud need
3. Implement features based on actual usage
4. Maintain zero-cost architecture

---

## 🛠️ Quality Assurance Integration

### **Pre-Commit Validation**
- [ ] @[/quality-checks] completed successfully
- [ ] @[/testing-quality] ≥85% coverage maintained
- [ ] @[/pattern-compliance] validation passed
- [ ] @[/trunk-based-development] branch naming correct
- [ ] @[/safety-shell-commands] scripts validated

### **Technical Excellence**
- [ ] @[/pattern] SOLID principles followed
- [ ] @[/code-patterns] boilerplate eliminated
- [ ] @[/api-design-principles] contracts validated
- [ ] @[/error-handling] boundaries implemented
- [ ] @[/systematic-debugging] methodology applied

### **Documentation & Automation**
- [ ] @[/generate-docs] comprehensive docs created
- [ ] @[/generate-prompts] agent patterns defined
- [ ] @[/train-ai] model optimizations applied
- [ ] @[/use-mcp] tools integrated
- [ ] @[/use-skills] skills properly utilized

### **Ecosystem Integration**
- [ ] Cross-project compatibility verified
- [ ] @[/trunk-based-development] release workflow followed
- [ ] @[/pattern-compliance] ecosystem standards met
- [ ] @[/quality-checks] ecosystem validation passed

---

## 📊 Success Metrics

### **Quality Metrics**
- **85%+ test coverage** across all modules
- **Zero pattern compliance violations**
- **100% trunk-based development adherence**
- **Systematic debugging applied** to all issues

### **Productivity Metrics**
- **50% reduction** in boilerplate code
- **30% faster issue resolution** with systematic debugging
- **40% improvement** in code review quality
- **25% reduction** in technical debt

### **Ecosystem Metrics**
- **100% workflow standardization**
- **Zero breaking changes** between projects
- **Complete documentation coverage**
- **Optimized AI model performance**

---

This enhanced prompt framework provides comprehensive, intelligent, and context-aware development guidance that leverages advanced skills integration to deliver high-quality, secure, and performant MCP Gateway solutions.