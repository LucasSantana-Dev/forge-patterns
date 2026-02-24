# Dynamic Skill Selection System

Intelligent skill selection and context-aware prompt recommendation system for
the Forge ecosystem.

## 🧠 Skill-Aware Prompt Selection Engine

### **Core Selection Algorithm**

```typescript
interface SkillSelectionEngine {
  selectOptimalSkills(
    project: ForgeProject,
    task: string,
    context: TaskContext
  ): Skill[];
  enhancePromptWithSkills(
    basePrompt: string,
    skills: Skill[],
    project: ForgeProject,
    task: string
  ): string;
  validateSkillEffectiveness(skills: Skill[], outcome: TaskOutcome): void;
  learnFromUsage(skillUsage: SkillUsageData): void;
}

class EnhancedPromptSystem implements SkillSelectionEngine {
  private skillMappings: Map<string, SkillMapping>;
  private projectContexts: Map<string, ProjectContext>;
  private usageAnalytics: SkillUsageAnalytics;

  constructor() {
    this.initializeSkillMappings();
    this.loadProjectContexts();
    this.usageAnalytics = new SkillUsageAnalytics();
  }

  async selectOptimalSkills(
    project: ForgeProject,
    task: string,
    context: TaskContext
  ): Promise<Skill[]> {
    // Step 1: Analyze task requirements
    const taskAnalysis = await this.analyzeTaskRequirements(task);

    // Step 2: Get project-specific base skills
    const baseSkills = this.getProjectBaseSkills(project);

    // Step 3: Determine context-specific needs
    const contextSkills = this.analyzeContextNeeds(context);

    // Step 4: Apply learning from usage patterns
    const learnedSkills = this.getLearnedSkillPreferences(project, task);

    // Step 5: Prioritize and combine skills
    return this.prioritizeSkills([
      ...baseSkills,
      ...taskAnalysis.requiredSkills,
      ...contextSkills,
      ...learnedSkills
    ]);
  }

  private async analyzeTaskRequirements(task: string): Promise<TaskAnalysis> {
    const analysis = {
      primaryIntent: this.extractPrimaryIntent(task),
      complexity: this.assessComplexity(task),
      domain: this.identifyDomain(task),
      requiredSkills: this.mapIntentToSkills(task)
    };

    return analysis;
  }

  private getProjectBaseSkills(project: ForgeProject): Skill[] {
    const projectSkillMap = {
      'mcp-gateway': [
        this.getSkill('systematic-debugging'),
        this.getSkill('mcp-docs-search'),
        this.getSkill('brainstorming')
      ],
      'uiforge-webapp': [
        this.getSkill('next-best-practices'),
        this.getSkill('supabase-postgres-best-practices'),
        this.getSkill('ui-ux-pro-max'),
        this.getSkill('frontend-design')
      ],
      'uiforge-mcp': [
        this.getSkill('vercel-composition-patterns'),
        this.getSkill('systematic-debugging'),
        this.getSkill('mcp-docs-search'),
        this.getSkill('brainstorming')
      ],
      'forge-patterns': [
        this.getSkill('brainstorming'),
        this.getSkill('systematic-debugging'),
        this.getSkill('mcp-docs-search')
      ]
    };

    return projectSkillMap[project] || [];
  }

  private analyzeContextNeeds(context: TaskContext): Skill[] {
    const contextSkills: Skill[] = [];

    // Analyze error context
    if (context.hasErrors) {
      contextSkills.push(this.getSkill('systematic-debugging'));
    }

    // Analyze design requirements
    if (context.requiresDesign) {
      contextSkills.push(this.getSkill('frontend-design'));
      contextSkills.push(this.getSkill('brainstorming'));
    }

    // Analyze performance requirements
    if (context.requiresOptimization) {
      contextSkills.push(this.getSkill('vercel-react-best-practices'));
      contextSkills.push(this.getSkill('next-best-practices'));
    }

    // Analyze database requirements
    if (context.involvesDatabase) {
      contextSkills.push(this.getSkill('supabase-postgres-best-practices'));
    }

    return contextSkills;
  }

  private prioritizeSkills(skills: Skill[]): Skill[] {
    // Remove duplicates while preserving order
    const uniqueSkills = Array.from(new Set(skills));

    // Sort by priority and relevance
    return uniqueSkills.sort((a, b) => {
      // Higher priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // Then by relevance score
      return b.relevanceScore - a.relevanceScore;
    });
  }

  async enhancePromptWithSkills(
    basePrompt: string,
    skills: Skill[],
    project: ForgeProject,
    task: string
  ): Promise<string> {
    let enhancedPrompt = basePrompt;

    // Add skill-specific sections
    for (const skill of skills) {
      enhancedPrompt = this.addSkillSection(
        enhancedPrompt,
        skill,
        project,
        task
      );
    }

    // Add project-specific context
    enhancedPrompt = this.addProjectContext(enhancedPrompt, project);

    // Add MCP integration points
    enhancedPrompt = this.addMCPIntegration(enhancedPrompt, skills);

    // Add dynamic context awareness
    enhancedPrompt = this.addContextAwareness(enhancedPrompt, project, task);

    return enhancedPrompt;
  }

  private addSkillSection(
    prompt: string,
    skill: Skill,
    project: ForgeProject,
    task: string
  ): string {
    const skillTemplate = this.getSkillTemplate(skill, project);
    const contextualizedTemplate = this.contextualizeTemplate(
      skillTemplate,
      project,
      task
    );

    return `${prompt}\n\n${contextualizedTemplate}`;
  }

  private addProjectContext(prompt: string, project: ForgeProject): string {
    const context = this.projectContexts.get(project);
    if (!context) return prompt;

    const contextSection = `
PROJECT CONTEXT: ${project}
Current Architecture: ${context.architecture}
Technology Stack: ${context.technology}
Recent Changes: ${context.recentChanges}
Performance Metrics: ${context.performance}
`;

    return `${prompt}\n\n${contextSection}`;
  }

  private addMCPIntegration(prompt: string, skills: Skill[]): string {
    const mcpTools = skills
      .filter(skill => skill.requiresMCPIntegration)
      .map(skill => skill.mcpIntegration)
      .filter(Boolean);

    if (mcpTools.length === 0) return prompt;

    const integrationSection = `
MCP ENHANCEMENT:
${mcpTools.map(tool => `- Use @${tool} for ${tool.purpose}`).join('\n')}
`;

    return `${prompt}\n\n${integrationSection}`;
  }

  private addContextAwareness(
    prompt: string,
    project: ForgeProject,
    task: string
  ): string {
    const awarenessSection = `
CONTEXT-AWARE ENHANCEMENT:
- Current project state analyzed with @[/get-context]
- Best practices verified with @[/mcp-docs-and-tools]
- Documentation searched with @[/skill-mcp-docs-search]
- Solutions validated against actual codebase
`;

    return `${prompt}\n\n${awarenessSection}`;
  }
}
```

### **Context Analysis Framework**

```typescript
interface ProjectContext {
  architecture: string;
  technology: string[];
  recentChanges: string[];
  performance: PerformanceMetrics;
  challenges: string[];
  opportunities: string[];
}

interface TaskContext {
  hasErrors: boolean;
  requiresDesign: boolean;
  requiresOptimization: boolean;
  involvesDatabase: boolean;
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  stakeholders: string[];
}

class ContextAnalyzer {
  async analyzeProjectContext(project: ForgeProject): Promise<ProjectContext> {
    const context = await this.gatherProjectData(project);

    return {
      architecture: this.identifyArchitecture(context),
      technology: this.extractTechnologyStack(context),
      recentChanges: this.identifyRecentChanges(context),
      performance: this.analyzePerformance(context),
      challenges: this.identifyChallenges(context),
      opportunities: this.identifyOpportunities(context)
    };
  }

  async analyzeTaskContext(
    task: string,
    project: ForgeProject
  ): Promise<TaskContext> {
    return {
      hasErrors: this.detectErrorKeywords(task),
      requiresDesign: this.detectDesignKeywords(task),
      requiresOptimization: this.detectOptimizationKeywords(task),
      involvesDatabase: this.detectDatabaseKeywords(task),
      complexity: this.assessTaskComplexity(task),
      urgency: this.assessTaskUrgency(task),
      stakeholders: this.identifyStakeholders(task)
    };
  }

  private detectErrorKeywords(task: string): boolean {
    const errorKeywords = [
      'error',
      'bug',
      'issue',
      'problem',
      'failure',
      'crash',
      'broken',
      'not working',
      'exception',
      'debug',
      'troubleshoot'
    ];

    return errorKeywords.some(keyword => task.toLowerCase().includes(keyword));
  }

  private detectDesignKeywords(task: string): boolean {
    const designKeywords = [
      'design',
      'ui',
      'ux',
      'interface',
      'component',
      'layout',
      'visual',
      'aesthetic',
      'style',
      'theme',
      'responsive'
    ];

    return designKeywords.some(keyword => task.toLowerCase().includes(keyword));
  }

  private detectOptimizationKeywords(task: string): boolean {
    const optimizationKeywords = [
      'optimize',
      'performance',
      'speed',
      'slow',
      'fast',
      'efficient',
      'improve',
      'enhance',
      'refactor',
      'cleanup',
      'streamline'
    ];

    return optimizationKeywords.some(keyword =>
      task.toLowerCase().includes(keyword)
    );
  }

  private detectDatabaseKeywords(task: string): boolean {
    const databaseKeywords = [
      'database',
      'schema',
      'query',
      'sql',
      'migration',
      'data',
      'model',
      'repository',
      'storage',
      'supabase',
      'postgres'
    ];

    return databaseKeywords.some(keyword =>
      task.toLowerCase().includes(keyword)
    );
  }

  private assessTaskComplexity(task: string): 'low' | 'medium' | 'high' {
    const complexityIndicators = {
      high: ['architecture', 'system', 'integration', 'migration', 'refactor'],
      medium: ['feature', 'component', 'service', 'api', 'module'],
      low: ['fix', 'update', 'change', 'add', 'remove']
    };

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (
        indicators.some(indicator => task.toLowerCase().includes(indicator))
      ) {
        return level as 'low' | 'medium' | 'high';
      }
    }

    return 'medium';
  }

  private assessTaskUrgency(task: string): 'low' | 'medium' | 'high' {
    const urgencyIndicators = {
      high: ['urgent', 'critical', 'blocking', 'production', 'hotfix'],
      medium: ['important', 'priority', 'soon', 'asap'],
      low: ['nice to have', 'later', 'eventually', 'someday']
    };

    for (const [level, indicators] of Object.entries(urgencyIndicators)) {
      if (
        indicators.some(indicator => task.toLowerCase().includes(indicator))
      ) {
        return level as 'low' | 'medium' | 'high';
      }
    }

    return 'medium';
  }
}
```

## 🔄 Dynamic Recommendation Engine

### **Intelligent Prompt Recommendation**

```typescript
class PromptRecommendationEngine {
  private skillAnalyzer: SkillAnalyzer;
  private contextAnalyzer: ContextAnalyzer;
  private usageTracker: UsageTracker;

  constructor() {
    this.skillAnalyzer = new SkillAnalyzer();
    this.contextAnalyzer = new ContextAnalyzer();
    this.usageTracker = new UsageTracker();
  }

  async recommendPrompts(
    project: ForgeProject,
    task: string,
    userPreferences?: UserPreferences
  ): Promise<PromptRecommendation[]> {
    // Analyze context and requirements
    const projectContext =
      await this.contextAnalyzer.analyzeProjectContext(project);
    const taskContext = await this.contextAnalyzer.analyzeTaskContext(
      task,
      project
    );

    // Select optimal skills
    const skills = await this.selectOptimalSkills(project, task, taskContext);

    // Generate prompt recommendations
    const recommendations = await this.generateRecommendations(
      project,
      task,
      skills,
      projectContext,
      taskContext,
      userPreferences
    );

    // Rank and filter recommendations
    return this.rankRecommendations(recommendations, userPreferences);
  }

  private async generateRecommendations(
    project: ForgeProject,
    task: string,
    skills: Skill[],
    projectContext: ProjectContext,
    taskContext: TaskContext,
    userPreferences?: UserPreferences
  ): Promise<PromptRecommendation[]> {
    const recommendations: PromptRecommendation[] = [];

    // Generate skill-enhanced prompts
    for (const skill of skills) {
      const prompt = await this.generateSkillEnhancedPrompt(
        skill,
        project,
        task,
        projectContext,
        taskContext
      );

      recommendations.push({
        prompt,
        skills: [skill],
        confidence: this.calculateConfidence(skill, taskContext),
        category: this.categorizePrompt(skill, task),
        explanation: this.generateExplanation(skill, project, task)
      });
    }

    // Generate multi-skill prompts
    const multiSkillPrompts = await this.generateMultiSkillPrompts(
      skills,
      project,
      task,
      projectContext,
      taskContext
    );

    recommendations.push(...multiSkillPrompts);

    return recommendations;
  }

  private async generateSkillEnhancedPrompt(
    skill: Skill,
    project: ForgeProject,
    task: string,
    projectContext: ProjectContext,
    taskContext: TaskContext
  ): Promise<string> {
    const baseTemplate = this.getBaseTemplate(skill, project);
    const contextualEnhancements = this.generateContextualEnhancements(
      skill,
      projectContext,
      taskContext
    );

    return this.combineTemplateAndContext(baseTemplate, contextualEnhancements);
  }

  private calculateConfidence(skill: Skill, taskContext: TaskContext): number {
    let confidence = skill.baseConfidence;

    // Boost confidence based on context alignment
    if (skill.appliesToErrors && taskContext.hasErrors) {
      confidence += 0.2;
    }
    if (skill.appliesToDesign && taskContext.requiresDesign) {
      confidence += 0.2;
    }
    if (skill.appliesToOptimization && taskContext.requiresOptimization) {
      confidence += 0.2;
    }
    if (skill.appliesToDatabase && taskContext.involvesDatabase) {
      confidence += 0.2;
    }

    // Adjust based on complexity
    if (taskContext.complexity === 'high' && skill.handlesComplexity) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private rankRecommendations(
    recommendations: PromptRecommendation[],
    userPreferences?: UserPreferences
  ): PromptRecommendation[] {
    return recommendations
      .sort((a, b) => {
        // Sort by confidence first
        if (a.confidence !== b.confidence) {
          return b.confidence - a.confidence;
        }

        // Then by user preference alignment
        if (userPreferences) {
          const aScore = this.calculatePreferenceScore(a, userPreferences);
          const bScore = this.calculatePreferenceScore(b, userPreferences);
          return bScore - aScore;
        }

        // Finally by number of skills (more comprehensive first)
        return b.skills.length - a.skills.length;
      })
      .slice(0, 10); // Top 10 recommendations
  }
}
```

### **Learning and Adaptation System**

```typescript
class SkillLearningSystem {
  private usageData: Map<string, SkillUsageData[]> = new Map();
  private effectivenessScores: Map<string, number> = new Map();
  private adaptationRules: AdaptationRule[] = [];

  recordSkillUsage(
    project: ForgeProject,
    task: string,
    skills: Skill[],
    outcome: TaskOutcome
  ): void {
    const usageData: SkillUsageData = {
      project,
      task,
      skills,
      outcome,
      timestamp: new Date(),
      effectiveness: this.calculateEffectiveness(skills, outcome)
    };

    // Store usage data
    const key = this.generateUsageKey(project, task);
    if (!this.usageData.has(key)) {
      this.usageData.set(key, []);
    }
    this.usageData.get(key)!.push(usageData);

    // Update effectiveness scores
    this.updateEffectivenessScores(skills, usageData.effectiveness);

    // Adapt selection rules
    this.adaptSelectionRules(usageData);
  }

  private calculateEffectiveness(
    skills: Skill[],
    outcome: TaskOutcome
  ): number {
    let effectiveness = 0;

    // Base effectiveness from outcome
    if (outcome.success) {
      effectiveness += 0.5;
      if (outcome.quality === 'high') effectiveness += 0.3;
      if (outcome.efficiency === 'high') effectiveness += 0.2;
    }

    // Adjust based on skill relevance
    const relevantSkills = skills.filter(skill =>
      this.isSkillRelevant(skill, outcome)
    );
    effectiveness += (relevantSkills.length / skills.length) * 0.3;

    return Math.min(effectiveness, 1.0);
  }

  private updateEffectivenessScores(
    skills: Skill[],
    effectiveness: number
  ): void {
    for (const skill of skills) {
      const currentScore = this.effectivenessScores.get(skill.name) || 0.5;
      const newScore = currentScore * 0.8 + effectiveness * 0.2; // Weighted average
      this.effectivenessScores.set(skill.name, newScore);
    }
  }

  private adaptSelectionRules(usageData: SkillUsageData): void {
    // Analyze patterns in successful outcomes
    const successfulPatterns = this.analyzeSuccessfulPatterns(usageData);

    // Create adaptation rules based on patterns
    for (const pattern of successfulPatterns) {
      const rule: AdaptationRule = {
        condition: pattern.condition,
        action: {
          boostSkills: pattern.boostSkills,
          avoidSkills: pattern.avoidSkills,
          priority: pattern.priority
        },
        confidence: pattern.confidence,
        createdAt: new Date()
      };

      this.adaptationRules.push(rule);
    }

    // Limit rules to prevent overfitting
    if (this.adaptationRules.length > 100) {
      this.adaptationRules = this.adaptationRules
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 50);
    }
  }

  getAdaptedSkillSelection(
    project: ForgeProject,
    task: string,
    baseSkills: Skill[]
  ): Skill[] {
    let adaptedSkills = [...baseSkills];

    // Apply adaptation rules
    for (const rule of this.adaptationRules) {
      if (this.matchesCondition(rule.condition, project, task)) {
        adaptedSkills = this.applyRule(adaptedSkills, rule);
      }
    }

    // Apply effectiveness-based adjustments
    adaptedSkills = this.applyEffectivenessAdjustments(adaptedSkills);

    return adaptedSkills;
  }

  private matchesCondition(
    condition: AdaptationCondition,
    project: ForgeProject,
    task: string
  ): boolean {
    // Check project match
    if (condition.project && condition.project !== project) {
      return false;
    }

    // Check task pattern match
    if (condition.taskPattern) {
      const regex = new RegExp(condition.taskPattern, 'i');
      if (!regex.test(task)) {
        return false;
      }
    }

    // Check context match
    if (condition.context) {
      const taskContext = this.analyzeTaskContext(task);
      if (!this.contextMatches(condition.context, taskContext)) {
        return false;
      }
    }

    return true;
  }

  generateUsageReport(): SkillUsageReport {
    const report: SkillUsageReport = {
      totalUsage: this.getTotalUsage(),
      skillEffectiveness: this.getSkillEffectiveness(),
      projectUsage: this.getProjectUsage(),
      adaptationRules: this.adaptationRules.length,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  private getTotalUsage(): number {
    let total = 0;
    for (const usageArray of this.usageData.values()) {
      total += usageArray.length;
    }
    return total;
  }

  private getSkillEffectiveness(): Map<string, number> {
    return new Map(this.effectivenessScores);
  }

  private getProjectUsage(): Map<string, number> {
    const projectUsage = new Map<string, number>();

    for (const usageArray of this.usageData.values()) {
      for (const usage of usageArray) {
        const current = projectUsage.get(usage.project) || 0;
        projectUsage.set(usage.project, current + 1);
      }
    }

    return projectUsage;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Analyze low-performing skills
    for (const [skill, score] of this.effectivenessScores) {
      if (score < 0.3) {
        recommendations.push(
          `Consider reviewing or replacing ${skill} - low effectiveness score: ${score.toFixed(2)}`
        );
      }
    }

    // Analyze high-performing combinations
    const combinations = this.analyzeSkillCombinations();
    for (const combo of combinations) {
      if (combo.effectiveness > 0.8) {
        recommendations.push(
          `Highly effective combination: ${combo.skills.join(' + ')} (${combo.effectiveness.toFixed(2)})`
        );
      }
    }

    return recommendations;
  }
}
```

## 📊 Usage Analytics and Feedback

### **Analytics Dashboard**

```typescript
class SkillUsageAnalytics {
  private metrics: SkillMetrics;
  private dashboard: AnalyticsDashboard;

  constructor() {
    this.metrics = new SkillMetrics();
    this.dashboard = new AnalyticsDashboard();
  }

  trackSkillUsage(
    project: ForgeProject,
    task: string,
    skills: Skill[],
    outcome: TaskOutcome
  ): void {
    const usageEvent: SkillUsageEvent = {
      id: this.generateEventId(),
      project,
      task,
      skills: skills.map(s => s.name),
      outcome,
      timestamp: new Date(),
      duration: this.calculateDuration(task, skills),
      context: this.captureContext()
    };

    this.metrics.recordEvent(usageEvent);
    this.updateDashboard(usageEvent);
  }

  generateAnalyticsReport(): AnalyticsReport {
    return {
      overview: this.generateOverviewMetrics(),
      skillPerformance: this.generateSkillPerformanceReport(),
      projectInsights: this.generateProjectInsights(),
      trends: this.generateTrendAnalysis(),
      recommendations: this.generateOptimizationRecommendations()
    };
  }

  private generateOverviewMetrics(): OverviewMetrics {
    const events = this.metrics.getAllEvents();

    return {
      totalPrompts: events.length,
      successRate: this.calculateSuccessRate(events),
      averageDuration: this.calculateAverageDuration(events),
      topSkills: this.getTopSkills(events),
      topProjects: this.getTopProjects(events)
    };
  }

  private generateSkillPerformanceReport(): SkillPerformanceReport {
    const skillStats = new Map<string, SkillStatistics>();

    for (const event of this.metrics.getAllEvents()) {
      for (const skillName of event.skills) {
        if (!skillStats.has(skillName)) {
          skillStats.set(skillName, {
            name: skillName,
            usageCount: 0,
            successCount: 0,
            totalDuration: 0,
            averageEffectiveness: 0,
            projects: new Set()
          });
        }

        const stats = skillStats.get(skillName)!;
        stats.usageCount++;
        stats.projects.add(event.project);

        if (event.outcome.success) {
          stats.successCount++;
        }

        stats.totalDuration += event.duration;
      }
    }

    // Calculate averages and rankings
    const skillArray = Array.from(skillStats.values());
    for (const skill of skillArray) {
      skill.averageEffectiveness = skill.successCount / skill.usageCount;
      skill.averageDuration = skill.totalDuration / skill.usageCount;
    }

    return {
      skills: skillArray.sort(
        (a, b) => b.averageEffectiveness - a.averageEffectiveness
      ),
      insights: this.generateSkillInsights(skillArray)
    };
  }

  private generateProjectInsights(): ProjectInsights {
    const projectStats = new Map<string, ProjectStatistics>();

    for (const event of this.metrics.getAllEvents()) {
      if (!projectStats.has(event.project)) {
        projectStats.set(event.project, {
          name: event.project,
          totalPrompts: 0,
          successRate: 0,
          topSkills: [],
          averageDuration: 0,
          trends: []
        });
      }

      const stats = projectStats.get(event.project)!;
      stats.totalPrompts++;

      // Update other metrics
      this.updateProjectStats(stats, event);
    }

    return {
      projects: Array.from(projectStats.values()),
      comparisons: this.generateProjectComparisons(
        Array.from(projectStats.values())
      ),
      recommendations: this.generateProjectRecommendations(
        Array.from(projectStats.values())
      )
    };
  }

  private generateTrendAnalysis(): TrendAnalysis {
    const timeSeriesData = this.metrics.getTimeSeriesData();

    return {
      skillUsage: this.analyzeSkillTrends(timeSeriesData),
      projectActivity: this.analyzeProjectTrends(timeSeriesData),
      effectiveness: this.analyzeEffectivenessTrends(timeSeriesData),
      predictions: this.generatePredictions(timeSeriesData)
    };
  }

  private generateOptimizationRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Analyze underperforming skills
    const skillReport = this.generateSkillPerformanceReport();
    for (const skill of skillReport.skills) {
      if (skill.averageEffectiveness < 0.5) {
        recommendations.push({
          type: 'skill_improvement',
          priority: 'high',
          target: skill.name,
          description: `Skill ${skill.name} has low effectiveness (${skill.averageEffectiveness.toFixed(2)}). Consider reviewing or replacing.`,
          action: 'review_skill_template',
          expectedImpact: 'medium'
        });
      }
    }

    // Analyze skill combinations
    const combinations = this.analyzeSkillCombinations();
    for (const combo of combinations) {
      if (combo.effectiveness > 0.8 && combo.frequency < 0.1) {
        recommendations.push({
          type: 'skill_combination',
          priority: 'medium',
          target: combo.skills.join(' + '),
          description: `Highly effective but underused combination: ${combo.skills.join(' + ')}`,
          action: 'promote_combination',
          expectedImpact: 'high'
        });
      }
    }

    return recommendations;
  }
}
```

## 📝 Implementation Guide

### **System Integration**

```typescript
// Main integration point
class EnhancedPromptSystem {
  private skillSelector: SkillSelectionEngine;
  private recommendationEngine: PromptRecommendationEngine;
  private learningSystem: SkillLearningSystem;
  private analytics: SkillUsageAnalytics;

  constructor() {
    this.skillSelector = new EnhancedPromptSystem();
    this.recommendationEngine = new PromptRecommendationEngine();
    this.learningSystem = new SkillLearningSystem();
    this.analytics = new SkillUsageAnalytics();
  }

  async processPromptRequest(
    project: ForgeProject,
    task: string,
    userPreferences?: UserPreferences
  ): Promise<EnhancedPromptResponse> {
    // Select optimal skills
    const skills = await this.skillSelector.selectOptimalSkills(
      project,
      task,
      await this.analyzeContext(task, project)
    );

    // Generate recommendations
    const recommendations = await this.recommendationEngine.recommendPrompts(
      project,
      task,
      userPreferences
    );

    // Enhance prompt with selected skills
    const enhancedPrompt = await this.skillSelector.enhancePromptWithSkills(
      recommendations[0]?.prompt || task,
      skills,
      project,
      task
    );

    return {
      enhancedPrompt,
      skills,
      recommendations,
      confidence: this.calculateOverallConfidence(recommendations),
      explanation: this.generateExplanation(skills, recommendations)
    };
  }

  async recordOutcome(requestId: string, outcome: TaskOutcome): Promise<void> {
    // Record usage for learning
    await this.learningSystem.recordSkillUsage(
      this.getRequestProject(requestId),
      this.getRequestTask(requestId),
      this.getRequestSkills(requestId),
      outcome
    );

    // Update analytics
    await this.analytics.trackSkillUsage(
      this.getRequestProject(requestId),
      this.getRequestTask(requestId),
      this.getRequestSkills(requestId),
      outcome
    );
  }

  async getAnalyticsReport(): Promise<AnalyticsReport> {
    return this.analytics.generateAnalyticsReport();
  }

  async optimizeSystem(): Promise<OptimizationReport> {
    const usageReport = this.learningSystem.generateUsageReport();
    const analyticsReport = await this.getAnalyticsReport();

    return {
      usageInsights: usageReport,
      analyticsInsights: analyticsReport,
      recommendations: this.generateSystemRecommendations(
        usageReport,
        analyticsReport
      ),
      nextSteps: this.planOptimizations(usageReport, analyticsReport)
    };
  }
}
```

This dynamic skill selection system provides intelligent, context-aware prompt
enhancement that learns from usage patterns and continuously improves its
recommendations based on real-world effectiveness data.
