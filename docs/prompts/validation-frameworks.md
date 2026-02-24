# Technology-Specific Validation Frameworks

Comprehensive validation frameworks for ensuring prompt effectiveness and code quality across different technology stacks in the Forge ecosystem.

## 🔍 Validation Framework Architecture

### **Core Validation Engine**
```typescript
interface ValidationFramework {
  validatePrompt(prompt: string, context: ValidationContext): ValidationResult;
  validateCode(code: string, language: string, standards: CodeStandards): CodeValidationResult;
  validateArchitecture(design: ArchitectureDesign, patterns: PatternLibrary): ArchitectureValidationResult;
  generateReport(results: ValidationResult[]): ValidationReport;
}

class TechnologyValidator implements ValidationFramework {
  private validators: Map<string, TechnologySpecificValidator>;
  private ruleEngine: ValidationRuleEngine;
  private metrics: ValidationMetrics;

  constructor() {
    this.initializeValidators();
    this.ruleEngine = new ValidationRuleEngine();
    this.metrics = new ValidationMetrics();
  }

  validatePrompt(prompt: string, context: ValidationContext): ValidationResult {
    const validator = this.getValidator(context.technology);
    const rules = this.ruleEngine.getRules(context.technology, context.category);
    
    const result = validator.validate(prompt, rules, context);
    this.metrics.recordValidation(result);
    
    return result;
  }

  validateCode(code: string, language: string, standards: CodeStandards): CodeValidationResult {
    const validator = this.getValidator(language);
    const result = validator.validateCode(code, standards);
    
    this.metrics.recordCodeValidation(result);
    return result;
  }

  validateArchitecture(
    design: ArchitectureDesign, 
    patterns: PatternLibrary
  ): ArchitectureValidationResult {
    const validator = this.getValidator('architecture');
    const result = validator.validateArchitecture(design, patterns);
    
    this.metrics.recordArchitectureValidation(result);
    return result;
  }

  private getValidator(technology: string): TechnologySpecificValidator {
    const validator = this.validators.get(technology);
    if (!validator) {
      throw new Error(`No validator found for technology: ${technology}`);
    }
    return validator;
  }

  generateReport(results: ValidationResult[]): ValidationReport {
    return {
      summary: this.generateSummary(results),
      details: this.generateDetails(results),
      recommendations: this.generateRecommendations(results),
      metrics: this.metrics.getMetrics(),
      timestamp: new Date()
    };
  }
}
```

## 🐳 MCP Gateway Validation Framework

### **Python/FastAPI Validation**
```typescript
class MCPGatewayValidator implements TechnologySpecificValidator {
  private pythonRules: PythonValidationRules;
  private fastAPIRules: FastAPIValidationRules;
  private dockerRules: DockerValidationRules;

  constructor() {
    this.pythonRules = new PythonValidationRules();
    this.fastAPIRules = new FastAPIValidationRules();
    this.dockerRules = new DockerValidationRules();
  }

  validate(prompt: string, rules: ValidationRule[], context: ValidationContext): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Validate Python best practices
    const pythonIssues = this.validatePythonPractices(prompt, context);
    issues.push(...pythonIssues);
    score -= pythonIssues.length * 5;

    // Validate FastAPI patterns
    const fastAPIIssues = this.validateFastAPIPatterns(prompt, context);
    issues.push(...fastAPIIssues);
    score -= fastAPIIssues.length * 3;

    // Validate Docker practices
    const dockerIssues = this.validateDockerPractices(prompt, context);
    issues.push(...dockerIssues);
    score -= dockerIssues.length * 4;

    // Validate systematic debugging approach
    const debuggingIssues = this.validateSystematicDebugging(prompt, context);
    issues.push(...debuggingIssues);
    score -= debuggingIssues.length * 6;

    return {
      isValid: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations: this.generateRecommendations(issues),
      category: 'mcp-gateway'
    };
  }

  private validatePythonPractices(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check for Python-specific best practices
    if (!prompt.includes('type hints') && context.involvesFunctions) {
      issues.push({
        severity: 'medium',
        message: 'Missing type hints in function definitions',
        suggestion: 'Add type hints to improve code clarity and IDE support',
        rule: 'python-type-hints'
      });
    }

    if (!prompt.includes('error handling') && context.involvesAPI) {
      issues.push({
        severity: 'high',
        message: 'Missing error handling in API endpoints',
        suggestion: 'Implement proper try-catch blocks and error responses',
        rule: 'python-error-handling'
      });
    }

    if (!prompt.includes('async/await') && context.involvesAsync) {
      issues.push({
        severity: 'high',
        message: 'Missing async/await patterns for asynchronous operations',
        suggestion: 'Use async/await for I/O operations and API calls',
        rule: 'python-async-patterns'
      });
    }

    return issues;
  }

  private validateFastAPIPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check FastAPI-specific patterns
    if (!prompt.includes('Pydantic') && context.involvesDataValidation) {
      issues.push({
        severity: 'high',
        message: 'Missing Pydantic models for data validation',
        suggestion: 'Use Pydantic models for request/response validation',
        rule: 'fastapi-pydantic'
      });
    }

    if (!prompt.includes('dependency injection') && context.involvesServices) {
      issues.push({
        severity: 'medium',
        message: 'Missing dependency injection pattern',
        suggestion: 'Use FastAPI dependency injection for service management',
        rule: 'fastapi-dependency-injection'
      });
    }

    if (!prompt.includes('middleware') && context.involvesSecurity) {
      issues.push({
        severity: 'medium',
        message: 'Missing middleware for security and logging',
        suggestion: 'Implement middleware for CORS, authentication, and logging',
        rule: 'fastapi-middleware'
      });
    }

    return issues;
  }

  private validateDockerPractices(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check Docker-specific patterns
    if (!prompt.includes('multi-stage') && context.involvesOptimization) {
      issues.push({
        severity: 'medium',
        message: 'Missing multi-stage Docker build optimization',
        suggestion: 'Use multi-stage builds to reduce final image size',
        rule: 'docker-multi-stage'
      });
    }

    if (!prompt.includes('health check') && context.involvesDeployment) {
      issues.push({
        severity: 'high',
        message: 'Missing health check configuration',
        suggestion: 'Implement health checks for container monitoring',
        rule: 'docker-health-check'
      });
    }

    if (!prompt.includes('resource limits') && context.involvesProduction) {
      issues.push({
        severity: 'high',
        message: 'Missing resource limits configuration',
        suggestion: 'Set CPU and memory limits for production containers',
        rule: 'docker-resource-limits'
      });
    }

    return issues;
  }

  private validateSystematicDebugging(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check systematic debugging methodology
    if (!prompt.includes('reproduce issue') && context.involvesTroubleshooting) {
      issues.push({
        severity: 'high',
        message: 'Missing issue reproduction step',
        suggestion: 'Always include steps to reproduce the issue consistently',
        rule: 'systematic-reproduction'
      });
    }

    if (!prompt.includes('recent changes') && context.involvesDebugging) {
      issues.push({
        severity: 'medium',
        message: 'Missing recent changes analysis',
        suggestion: 'Check recent commits and changes that could cause the issue',
        rule: 'systematic-recent-changes'
      });

    if (!prompt.includes('minimal fix') && context.involvesProblemSolving) {
      issues.push({
        severity: 'medium',
        message: 'Missing minimal fix approach',
        suggestion: 'Test minimal fixes before implementing full solutions',
        rule: 'systematic-minimal-fix'
      });
    }

    return issues;
  }
}
```

## 🚀 UIForge WebApp Validation Framework

### **Next.js/React Validation**
```typescript
class UIForgeWebAppValidator implements TechnologySpecificValidator {
  private nextJSLRules: NextJSValidationRules;
  private reactRules: ReactValidationRules;
  private supabaseRules: SupabaseValidationRules;
  private uxRules: UXValidationRules;

  constructor() {
    this.nextJSLRules = new NextJSValidationRules();
    this.reactRules = new ReactValidationRules();
    this.supabaseRules = new SupabaseValidationRules();
    this.uxRules = new UXValidationRules();
  }

  validate(prompt: string, rules: ValidationRule[], context: ValidationContext): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Validate Next.js best practices
    const nextJSIssues = this.validateNextJSPatterns(prompt, context);
    issues.push(...nextJSIssues);
    score -= nextJSIssues.length * 4;

    // Validate React patterns
    const reactIssues = this.validateReactPatterns(prompt, context);
    issues.push(...reactIssues);
    score -= reactIssues.length * 3;

    // Validate Supabase integration
    const supabaseIssues = this.validateSupabasePatterns(prompt, context);
    issues.push(...supabaseIssues);
    score -= supabaseIssues.length * 5;

    // Validate UI/UX principles
    const uxIssues = this.validateUXPrinciples(prompt, context);
    issues.push(...uxIssues);
    score -= uxIssues.length * 6;

    return {
      isValid: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations: this.generateRecommendations(issues),
      category: 'uiforge-webapp'
    };
  }

  private validateNextJSPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check Next.js 16 App Router patterns
    if (!prompt.includes('Server Component') && context.involvesDataFetching) {
      issues.push({
        severity: 'high',
        message: 'Missing Server Component usage for data fetching',
        suggestion: 'Use Server Components by default for data fetching',
        rule: 'nextjs-server-components'
      });
    }

    if (!prompt.includes('parallel data fetching') && context.involvesPerformance) {
      issues.push({
        severity: 'medium',
        message: 'Missing parallel data fetching optimization',
        suggestion: 'Use Promise.all() for parallel data fetching',
        rule: 'nextjs-parallel-fetching'
      });
    }

    if (!prompt.includes('Suspense') && context.involvesLoading) {
      issues.push({
        severity: 'medium',
        message: 'Missing Suspense boundaries for loading states',
        suggestion: 'Implement Suspense boundaries for better UX',
        rule: 'nextjs-suspense'
      });
    }

    if (!prompt.includes('dynamic import') && context.involvesLargeComponents) {
      issues.push({
        severity: 'medium',
        message: 'Missing dynamic imports for code splitting',
        suggestion: 'Use next/dynamic for large components',
        rule: 'nextjs-dynamic-imports'
      });
    }

    return issues;
  }

  private validateReactPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check React best practices
    if (!prompt.includes('useMemo') && context.involvesExpensiveComputations) {
      issues.push({
        severity: 'medium',
        message: 'Missing useMemo for expensive computations',
        suggestion: 'Use useMemo to prevent unnecessary recalculations',
        rule: 'react-usememo'
      });
    }

    if (!prompt.includes('useCallback') && context.involvesCallbacks) {
      issues.push({
        severity: 'medium',
        message: 'Missing useCallback for stable function references',
        suggestion: 'Use useCallback to prevent unnecessary re-renders',
        rule: 'react-usecallback'
      });
    }

    if (!prompt.includes('error boundary') && context.involvesErrorHandling) {
      issues.push({
        severity: 'high',
        message: 'Missing error boundary implementation',
        suggestion: 'Implement error boundaries for graceful error handling',
        rule: 'react-error-boundary'
      });
    }

    return issues;
  }

  private validateSupabasePatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check Supabase integration patterns
    if (!prompt.includes('RLS policy') && context.involvesDataSecurity) {
      issues.push({
        severity: 'high',
        message: 'Missing Row Level Security (RLS) policy',
        suggestion: 'Implement RLS policies for data security',
        rule: 'supabase-rls'
      });
    }

    if (!prompt.includes('realtime subscription') && context.involvesRealTime) {
      issues.push({
        severity: 'medium',
        message: 'Missing realtime subscription pattern',
        suggestion: 'Use Supabase realtime for live data updates',
        rule: 'supabase-realtime'
      });
    }

    if (!prompt.includes('optimistic update') && context.involvesUserExperience) {
      issues.push({
        severity: 'medium',
        message: 'Missing optimistic update pattern',
        suggestion: 'Implement optimistic updates for better UX',
        rule: 'supabase-optimistic-updates'
      });
    }

    return issues;
  }

  private validateUXPrinciples(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check UI/UX principles
    if (!prompt.includes('WCAG') && context.involvesAccessibility) {
      issues.push({
        severity: 'high',
        message: 'Missing WCAG accessibility compliance',
        suggestion: 'Ensure WCAG AAA compliance for accessibility',
        rule: 'ux-wcag-compliance'
      });
    }

    if (!prompt.includes('responsive design') && context.involvesMobile) {
      issues.push({
        severity: 'high',
        message: 'Missing responsive design considerations',
        suggestion: 'Design for mobile-first responsive layouts',
        rule: 'ux-responsive-design'
      });
    }

    if (!prompt.includes('loading state') && context.involvesAsync) {
      issues.push({
        severity: 'medium',
        message: 'Missing loading state design',
        suggestion: 'Design comprehensive loading states for async operations',
        rule: 'ux-loading-states'
      });
    }

    if (!prompt.includes('micro-interactions') && context.involvesUI) {
      issues.push({
        severity: 'low',
        message: 'Missing micro-interaction design',
        suggestion: 'Add subtle animations and transitions for better UX',
        rule: 'ux-micro-interactions'
      });
    }

    return issues;
  }
}
```

## 🔧 UIForge MCP Validation Framework

### **Node.js/TypeScript Validation**
```typescript
class UIForgeMCPValidator implements TechnologySpecificValidator {
  private nodeJSLRules: NodeJSValidationRules;
  private typeScriptRules: TypeScriptValidationRules;
  private mcpRules: MCPValidationRules;
  private compositionRules: CompositionValidationRules;

  constructor() {
    this.nodeJSLRules = new NodeJSValidationRules();
    this.typeScriptRules = new TypeScriptValidationRules();
    this.mcpRules = new MCPValidationRules();
    this.compositionRules = new CompositionValidationRules();
  }

  validate(prompt: string, rules: ValidationRule[], context: ValidationContext): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Validate Node.js patterns
    const nodeJSIssues = this.validateNodeJSPatterns(prompt, context);
    issues.push(...nodeJSIssues);
    score -= nodeJSIssues.length * 3;

    // Validate TypeScript patterns
    const typeScriptIssues = this.validateTypeScriptPatterns(prompt, context);
    issues.push(...typeScriptIssues);
    score -= typeScriptIssues.length * 4;

    // Validate MCP patterns
    const mcpIssues = this.validateMCPPatterns(prompt, context);
    issues.push(...mcpIssues);
    score -= mcpIssues.length * 5;

    // Validate composition patterns
    const compositionIssues = this.validateCompositionPatterns(prompt, context);
    issues.push(...compositionIssues);
    score -= compositionIssues.length * 4;

    return {
      isValid: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations: this.generateRecommendations(issues),
      category: 'uiforge-mcp'
    };
  }

  private validateNodeJSPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check Node.js best practices
    if (!prompt.includes('async/await') && context.involvesAsync) {
      issues.push({
        severity: 'high',
        message: 'Missing async/await patterns for asynchronous operations',
        suggestion: 'Use async/await instead of callbacks for better code readability',
        rule: 'nodejs-async-patterns'
      });
    }

    if (!prompt.includes('error handling') && context.involvesAPI) {
      issues.push({
        severity: 'high',
        message: 'Missing proper error handling',
        suggestion: 'Implement try-catch blocks and error propagation',
        rule: 'nodejs-error-handling'
      });
    }

    if (!prompt.includes('stream') && context.involvesLargeData) {
      issues.push({
        severity: 'medium',
        message: 'Missing stream processing for large data',
        suggestion: 'Use Node.js streams for memory-efficient data processing',
        rule: 'nodejs-streams'
      });
    }

    return issues;
  }

  private validateTypeScriptPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check TypeScript best practices
    if (!prompt.includes('interface') && context.involvesDataStructures) {
      issues.push({
        severity: 'medium',
        message: 'Missing TypeScript interface definitions',
        suggestion: 'Define interfaces for data structures and API contracts',
        rule: 'typescript-interfaces'
      });
    }

    if (!prompt.includes('generic') && context.involvesReusableCode) {
      issues.push({
        severity: 'medium',
        message: 'Missing generic type parameters',
        suggestion: 'Use generics for reusable and type-safe code',
        rule: 'typescript-generics'
      });
    }

    if (!prompt.includes('strict mode') && context.involvesTypeSafety) {
      issues.push({
        severity: 'high',
        message: 'Missing TypeScript strict mode configuration',
        suggestion: 'Enable strict mode for better type safety',
        rule: 'typescript-strict-mode'
      });
    }

    return issues;
  }

  private validateMCPPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check MCP-specific patterns
    if (!prompt.includes('tool validation') && context.involvesToolDevelopment) {
      issues.push({
        severity: 'high',
        message: 'Missing tool parameter validation',
        suggestion: 'Implement comprehensive parameter validation for MCP tools',
        rule: 'mcp-tool-validation'
      });
    }

    if (!prompt.includes('error handling') && context.involvesMCPService) {
      issues.push({
        severity: 'high',
        message: 'Missing MCP service error handling',
        suggestion: 'Implement proper error handling for MCP service operations',
        rule: 'mcp-error-handling'
      });
    }

    if (!prompt.includes('resource management') && context.involvesResources) {
      issues.push({
        severity: 'medium',
        message: 'Missing resource management patterns',
        suggestion: 'Implement proper resource cleanup and management',
        rule: 'mcp-resource-management'
      });
    }

    return issues;
  }

  private validateCompositionPatterns(prompt: string, context: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check composition patterns
    if (!prompt.includes('dependency injection') && context.involvesServices) {
      issues.push({
        severity: 'medium',
        message: 'Missing dependency injection pattern',
        suggestion: 'Use dependency injection for better testability and modularity',
        rule: 'composition-dependency-injection'
      });
    }

    if (!prompt.includes('factory pattern') && context.involvesObjectCreation) {
      issues.push({
        severity: 'medium',
        message: 'Missing factory pattern for object creation',
        suggestion: 'Use factory pattern for flexible object creation',
        rule: 'composition-factory-pattern'
      });
    }

    if (!prompt.includes('compound components') && context.involvesUI) {
      issues.push({
        severity: 'low',
        message: 'Missing compound component pattern',
        suggestion: 'Use compound components instead of boolean props',
        rule: 'composition-compound-components'
      });
    }

    return issues;
  }
}
```

## 📊 Validation Metrics and Reporting

### **Validation Metrics System**
```typescript
class ValidationMetrics {
  private validationHistory: ValidationRecord[] = [];
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();
  private trendData: TrendData[] = [];

  recordValidation(result: ValidationResult): void {
    const record: ValidationRecord = {
      id: this.generateId(),
      timestamp: new Date(),
      category: result.category,
      score: result.score,
      issueCount: result.issues.length,
      severityBreakdown: this.calculateSeverityBreakdown(result.issues),
      processingTime: result.processingTime
    };

    this.validationHistory.push(record);
    this.updatePerformanceMetrics(result);
    this.updateTrendData(record);
  }

  generateMetricsReport(): ValidationMetricsReport {
    return {
      overview: this.generateOverviewMetrics(),
      performance: this.generatePerformanceReport(),
      trends: this.generateTrendReport(),
      recommendations: this.generateMetricsRecommendations(),
      timestamp: new Date()
    };
  }

  private generateOverviewMetrics(): OverviewMetrics {
    const recentRecords = this.validationHistory.slice(-100); // Last 100 validations
    
    return {
      totalValidations: this.validationHistory.length,
      averageScore: this.calculateAverageScore(recentRecords),
      passRate: this.calculatePassRate(recentRecords),
      averageIssuesPerValidation: this.calculateAverageIssues(recentRecords),
      topIssueCategories: this.getTopIssueCategories(recentRecords),
      validationTrend: this.calculateValidationTrend(recentRecords)
    };
  }

  private generatePerformanceReport(): PerformanceReport {
    const performanceData = Array.from(this.performanceMetrics.values());
    
    return {
      averageProcessingTime: this.calculateAverageProcessingTime(performanceData),
      slowestValidations: this.getSlowestValidations(performanceData),
      fastestValidations: this.getFastestValidations(performanceData),
      performanceTrends: this.calculatePerformanceTrends(performanceData),
      optimizationOpportunities: this.identifyOptimizationOpportunities(performanceData)
    };
  }

  private generateTrendReport(): TrendReport {
    const recentTrends = this.trendData.slice(-30); // Last 30 data points
    
    return {
      scoreTrend: this.calculateScoreTrend(recentTrends),
      issueCountTrend: this.calculateIssueCountTrend(recentTrends),
      categoryTrends: this.calculateCategoryTrends(recentTrends),
      seasonalPatterns: this.identifySeasonalPatterns(recentTrends),
      predictions: this.generateTrendPredictions(recentTrends)
    };
  }

  private generateMetricsRecommendations(): ValidationRecommendation[] {
    const recommendations: ValidationRecommendation[] = [];
    
    // Analyze common issues
    const commonIssues = this.getCommonIssues();
    for (const issue of commonIssues) {
      if (issue.frequency > 0.3) { // Appears in >30% of validations
        recommendations.push({
          type: 'common_issue',
          priority: 'high',
          description: `Frequently occurring issue: ${issue.description}`,
          suggestion: `Consider updating validation rules or providing better guidance for ${issue.category}`,
          expectedImpact: 'medium'
        });
      }
    }

    // Analyze performance issues
    const performanceIssues = this.getPerformanceIssues();
    for (const issue of performanceIssues) {
      recommendations.push({
        type: 'performance',
        priority: issue.severity === 'high' ? 'high' : 'medium',
        description: `Performance issue detected: ${issue.description}`,
        suggestion: issue.suggestion,
        expectedImpact: 'high'
      });
    }

    // Analyze trend issues
    const trendIssues = this.getTrendIssues();
    for (const issue of trendIssues) {
      recommendations.push({
        type: 'trend',
        priority: 'medium',
        description: `Trend issue: ${issue.description}`,
        suggestion: issue.suggestion,
        expectedImpact: 'medium'
      });
    }

    return recommendations;
  }
}
```

## 📝 Implementation Guide

### **Validation System Integration**
```typescript
// Main validation system
class EnhancedValidationSystem {
  private frameworks: Map<string, ValidationFramework>;
  private metrics: ValidationMetrics;
  private reporter: ValidationReporter;

  constructor() {
    this.frameworks = new Map();
    this.initializeFrameworks();
    this.metrics = new ValidationMetrics();
    this.reporter = new ValidationReporter();
  }

  private initializeFrameworks(): void {
    this.frameworks.set('mcp-gateway', new MCPGatewayValidator());
    this.frameworks.set('uiforge-webapp', new UIForgeWebAppValidator());
    this.frameworks.set('uiforge-mcp', new UIForgeMCPValidator());
    this.frameworks.set('forge-patterns', new ForgePatternsValidator());
  }

  async validatePrompt(
    prompt: string,
    technology: string,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const framework = this.frameworks.get(technology);
    if (!framework) {
      throw new Error(`No validation framework found for technology: ${technology}`);
    }

    const startTime = Date.now();
    const result = await framework.validatePrompt(prompt, context);
    result.processingTime = Date.now() - startTime;

    this.metrics.recordValidation(result);
    
    return result;
  }

  async validateCode(
    code: string,
    language: string,
    standards: CodeStandards
  ): Promise<CodeValidationResult> {
    const framework = this.frameworks.get(language);
    if (!framework) {
      throw new Error(`No validation framework found for language: ${language}`);
    }

    const result = await framework.validateCode(code, language, standards);
    this.metrics.recordCodeValidation(result);
    
    return result;
  }

  async generateValidationReport(): Promise<ValidationReport> {
    const metricsReport = this.metrics.generateMetricsReport();
    
    return {
      summary: metricsReport.overview,
      details: this.generateDetailedReport(),
      recommendations: metricsReport.recommendations,
      metrics: metricsReport,
      timestamp: new Date()
    };
  }

  async optimizeValidationRules(): Promise<OptimizationResult> {
    const metricsReport = this.metrics.generateMetricsReport();
    const optimizations: ValidationOptimization[] = [];

    // Analyze and optimize rules based on metrics
    for (const recommendation of metricsReport.recommendations) {
      if (recommendation.type === 'common_issue') {
        const optimization = await this.createRuleOptimization(recommendation);
        optimizations.push(optimization);
      }
    }

    return {
      optimizations,
      expectedImpact: this.calculateExpectedImpact(optimizations),
      implementationPlan: this.createImplementationPlan(optimizations)
    };
  }
}
```

This technology-specific validation framework ensures that all prompts and code generated across the Forge ecosystem meet high quality standards while providing detailed feedback and continuous improvement opportunities.