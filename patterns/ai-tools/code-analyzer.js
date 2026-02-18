/**
 * AI-Powered Code Analyzer
 * Provides intelligent code analysis, pattern recommendations, and optimization suggestions
 */

const fs = require('fs').promises;
const path = require('path');

class AICodeAnalyzer {
  constructor(options = {}) {
    this.options = {
      enablePatternRecognition: options.enablePatternRecognition !== false,
      enablePerformanceAnalysis: options.enablePerformanceAnalysis !== false,
      enableSecurityAnalysis: options.enableSecurityAnalysis !== false,
      enableCodeQualityAnalysis: options.enableCodeQualityAnalysis !== false,
      modelPath: options.modelPath || './models',
      ...options
    };

    this.patterns = new Map();
    this.securityRules = new Map();
    this.performanceRules = new Map();
    this.qualityMetrics = new Map();
    
    this.initialize();
  }

  async initialize() {
    await this.loadPatterns();
    await this.loadSecurityRules();
    await this.loadPerformanceRules();
    await this.loadQualityMetrics();
    
    console.log('AI Code Analyzer initialized');
  }

  /**
   * Analyze code file and provide recommendations
   */
  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const analysis = {
        filePath,
        timestamp: new Date().toISOString(),
        recommendations: [],
        issues: [],
        metrics: {},
        patterns: [],
        security: {},
        performance: {},
        quality: {}
      };

      // Basic code analysis
      analysis.metrics = this.calculateBasicMetrics(content);
      
      // Pattern recognition
      if (this.options.enablePatternRecognition) {
        analysis.patterns = this.recognizePatterns(content, filePath);
        analysis.recommendations.push(...this.getPatternRecommendations(analysis.patterns));
      }

      // Security analysis
      if (this.options.enableSecurityAnalysis) {
        analysis.security = this.analyzeSecurity(content, filePath);
        analysis.issues.push(...this.getSecurityIssues(analysis.security));
        analysis.recommendations.push(...this.getSecurityRecommendations(analysis.security));
      }

      // Performance analysis
      if (this.options.enablePerformanceAnalysis) {
        analysis.performance = this.analyzePerformance(content, filePath);
        analysis.issues.push(...this.getPerformanceIssues(analysis.performance));
        analysis.recommendations.push(...this.getPerformanceRecommendations(analysis.performance));
      }

      // Code quality analysis
      if (this.options.enableCodeQualityAnalysis) {
        analysis.quality = this.analyzeCodeQuality(content, filePath);
        analysis.issues.push(...this.getQualityIssues(analysis.quality));
        analysis.recommendations.push(...this.getQualityRecommendations(analysis.quality));
      }

      return analysis;
    } catch (error) {
      throw new Error(`Failed to analyze file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Analyze entire project
   */
  async analyzeProject(projectPath) {
    const projectAnalysis = {
      projectPath,
      timestamp: new Date().toISOString(),
      files: [],
      summary: {
        totalFiles: 0,
        totalIssues: 0,
        totalRecommendations: 0,
        securityScore: 0,
        performanceScore: 0,
        qualityScore: 0
      },
      patterns: {},
      recommendations: []
    };

    try {
      // Find all code files
      const codeFiles = await this.findCodeFiles(projectPath);
      
      for (const filePath of codeFiles) {
        const fileAnalysis = await this.analyzeFile(filePath);
        projectAnalysis.files.push(fileAnalysis);
        
        // Aggregate metrics
        projectAnalysis.summary.totalFiles++;
        projectAnalysis.summary.totalIssues += fileAnalysis.issues.length;
        projectAnalysis.summary.totalRecommendations += fileAnalysis.recommendations.length;
        
        // Aggregate scores
        projectAnalysis.summary.securityScore += this.calculateSecurityScore(fileAnalysis.security);
        projectAnalysis.summary.performanceScore += this.calculatePerformanceScore(fileAnalysis.performance);
        projectAnalysis.summary.qualityScore += this.calculateQualityScore(fileAnalysis.quality);
      }

      // Calculate average scores
      const fileCount = projectAnalysis.summary.totalFiles;
      if (fileCount > 0) {
        projectAnalysis.summary.securityScore = Math.round(projectAnalysis.summary.securityScore / fileCount);
        projectAnalysis.summary.performanceScore = Math.round(projectAnalysis.summary.performanceScore / fileCount);
        projectAnalysis.summary.qualityScore = Math.round(projectAnalysis.summary.qualityScore / fileCount);
      }

      // Get project-level recommendations
      projectAnalysis.recommendations = this.getProjectRecommendations(projectAnalysis);

      return projectAnalysis;
    } catch (error) {
      throw new Error(`Failed to analyze project ${projectPath}: ${error.message}`);
    }
  }

  /**
   * Generate code improvement suggestions
   */
  async generateImprovements(filePath) {
    const analysis = await this.analyzeFile(filePath);
    const improvements = {
      filePath,
      timestamp: new Date().toISOString(),
      suggestions: [],
      autoFixable: [],
      requiresReview: []
    };

    // Generate specific improvement suggestions
    for (const recommendation of analysis.recommendations) {
      if (recommendation.autoFixable) {
        improvements.autoFixable.push(recommendation);
      } else {
        improvements.requiresReview.push(recommendation);
      }
      
      improvements.suggestions.push({
        type: recommendation.type,
        title: recommendation.title,
        description: recommendation.description,
        code: recommendation.code,
        impact: recommendation.impact,
        effort: recommendation.effort
      });
    }

    return improvements;
  }

  /**
   * Auto-fix simple issues
   */
  async autoFix(filePath, improvements) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;

      for (const improvement of improvements.autoFixable) {
        if (improvement.fix) {
          content = content.replace(improvement.pattern, improvement.fix);
          modified = true;
        }
      }

      if (modified) {
        await fs.writeFile(filePath, content, 'utf8');
        return { fixed: true, modifications: improvements.autoFixable.length };
      }

      return { fixed: false, modifications: 0 };
    } catch (error) {
      throw new Error(`Failed to auto-fix file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Private methods
   */

  async loadPatterns() {
    // Load pattern definitions
    const patterns = [
      {
        name: 'singleton',
        pattern: /class\s+\w+\s*{[^}]*static\s+instance/,
        description: 'Singleton pattern detected',
        recommendation: 'Consider using dependency injection instead',
        impact: 'medium',
        effort: 'low'
      },
      {
        name: 'promise-chain',
        pattern: /\.then\(/g,
        description: 'Long promise chain detected',
        recommendation: 'Consider using async/await for better readability',
        impact: 'low',
        effort: 'low'
      },
      {
        name: 'console-log',
        pattern: /console\.log/,
        description: 'Console.log statement found',
        recommendation: 'Use proper logging framework',
        impact: 'low',
        effort: 'low'
      },
      {
        name: 'var-declaration',
        pattern: /\bvar\s+/,
        description: 'var declaration detected',
        recommendation: 'Use let or const instead of var',
        impact: 'low',
        effort: 'low'
      },
      {
        name: 'callback-hell',
        pattern: /function\s*\([^)]*\s*{\s*[^}]*function\s*\([^)]*\s*{\s*[^}]*function/,
        description: 'Callback hell pattern detected',
        recommendation: 'Use promises or async/await',
        impact: 'high',
        effort: 'medium'
      }
    ];

    for (const pattern of patterns) {
      this.patterns.set(pattern.name, pattern);
    }
  }

  async loadSecurityRules() {
    // Load security analysis rules
    const rules = [
      {
        name: 'sql-injection',
        pattern: /SELECT.*FROM.*WHERE.*\+/i,
        description: 'Potential SQL injection vulnerability',
        severity: 'critical',
        recommendation: 'Use parameterized queries'
      },
      {
        name: 'hardcoded-secret',
        pattern: /(password|secret|key|token)\s*=\s*['"`][^'"`]+['"`]/i,
        description: 'Hardcoded secret detected',
        severity: 'high',
        recommendation: 'Use environment variables'
      },
      {
        name: 'eval-usage',
        pattern: /\beval\(/,
        description: 'eval() usage detected',
        severity: 'high',
        recommendation: 'Avoid using eval()'
      },
      {
        name: 'innerhtml',
        pattern: /\.innerHTML\s*=/,
        description: 'innerHTML usage detected',
        severity: 'medium',
        recommendation: 'Use safer DOM manipulation methods'
      },
      {
        name: 'regex-dos',
        pattern: /new RegExp\([^)]*\+\s*\+/,
        description: 'Potential regex DoS vulnerability',
        severity: 'medium',
        recommendation: 'Validate regex patterns'
      }
    ];

    for (const rule of rules) {
      this.securityRules.set(rule.name, rule);
    }
  }

  async loadPerformanceRules() {
    // Load performance analysis rules
    const rules = [
      {
        name: 'sync-operation',
        pattern: /\b(readFileSync|writeFileSync|existsSync)\(/,
        description: 'Synchronous file operation detected',
        severity: 'medium',
        recommendation: 'Use async file operations'
      },
      {
        name: 'memory-leak',
        pattern: /setInterval\s*\([^)]*\s*,\s*\d+\)/,
        description: 'setInterval without cleanup',
        severity: 'medium',
        recommendation: 'Clear intervals when not needed'
      },
      {
        name: 'large-loop',
        pattern: /for\s*\([^)]*\)\s*{\s*[^}]*for\s*\(/,
        description: 'Nested loop detected',
        severity: 'medium',
        recommendation: 'Consider optimizing algorithm'
      },
      {
        name: 'blocking-operation',
        pattern: /while\s*\([^)]*\)\s*{\s*[^}]*sleep\(/,
        description: 'Blocking operation in loop',
        severity: 'high',
        recommendation: 'Use async alternatives'
      },
      {
        name: 'inefficient-regex',
        pattern: /\.\*\+/g,
        description: 'Inefficient regex pattern',
        severity: 'low',
        recommendation: 'Use specific regex patterns'
      }
    ];

    for (const rule of rules) {
      this.performanceRules.set(rule.name, rule);
    }
  }

  async loadQualityMetrics() {
    // Load code quality metrics
    const metrics = [
      {
        name: 'function-length',
        threshold: 50,
        description: 'Function should be under 50 lines',
        measurement: 'lines'
      },
      {
        name: 'cyclomatic-complexity',
        threshold: 10,
        description: 'Complexity should be under 10',
        measurement: 'score'
      },
      {
        name: 'parameter-count',
        threshold: 5,
        description: 'Functions should have under 5 parameters',
        measurement: 'count'
      },
      {
        name: 'nesting-depth',
        threshold: 5,
        description: 'Nesting depth should be under 5',
        measurement: 'depth'
      },
      {
        name: 'line-length',
        threshold: 120,
        description: 'Lines should be under 120 characters',
        measurement: 'characters'
      }
    ];

    for (const metric of metrics) {
      this.qualityMetrics.set(metric.name, metric);
    }
  }

  calculateBasicMetrics(content) {
    const lines = content.split('\n');
    const words = content.split(/\s+/).filter(word => word.length > 0);
    
    return {
      lines: lines.length,
      words: words.length,
      characters: content.length,
      functions: (content.match(/function\s+\w+/g) || []).length,
      classes: (content.match(/class\s+\w+/g) || []).length,
      imports: (content.match(/import\s+.*from/g) || []).length,
      exports: (content.match(/export\s+/g) || []).length
    };
  }

  recognizePatterns(content, filePath) {
    const patterns = [];
    
    for (const [name, pattern] of this.patterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        patterns.push({
          name,
          pattern: pattern.pattern,
          matches: matches.length,
          description: pattern.description
        });
      }
    }
    
    return patterns;
  }

  getPatternRecommendations(patterns) {
    const recommendations = [];
    
    for (const pattern of patterns) {
      const patternInfo = this.patterns.get(pattern.name);
      recommendations.push({
        type: 'pattern',
        title: `Pattern: ${pattern.name}`,
        description: patternInfo.description,
        recommendation: patternInfo.recommendation,
        impact: patternInfo.impact,
        effort: patternInfo.effort,
        autoFixable: false,
        line: this.findLineNumber(pattern.matches[0], pattern.pattern)
      });
    }
    
    return recommendations;
  }

  analyzeSecurity(content, filePath) {
    const security = {
      vulnerabilities: [],
      riskScore: 0,
      rules: []
    };

    for (const [name, rule] of this.securityRules) {
      const matches = content.match(rule.pattern);
      if (matches) {
        security.vulnerabilities.push({
          name,
          severity: rule.severity,
          description: rule.description,
          matches: matches.length,
          recommendation: rule.recommendation
        });
        
        // Calculate risk score
        const severityScores = { critical: 10, high: 7, medium: 4, low: 2 };
        security.riskScore += severityScores[rule.severity] * matches.length;
        
        security.rules.push({
          name,
          severity: rule.severity,
          count: matches.length
        });
      }
    }

    return security;
  }

  getSecurityIssues(security) {
    return security.vulnerabilities.map(vuln => ({
      type: 'security',
      title: `Security Issue: ${vuln.name}`,
      description: vuln.description,
      severity: vuln.severity,
      recommendation: vuln.recommendation,
      autoFixable: false,
      line: this.findLineNumber(vuln.matches[0], this.securityRules.get(vuln.name).pattern)
    }));
  }

  getSecurityRecommendations(security) {
    const recommendations = [];
    
    if (security.riskScore > 0) {
      recommendations.push({
        type: 'security',
        title: 'Security Review Required',
        description: `Security risk score: ${security.riskScore}`,
        recommendation: 'Review and fix security vulnerabilities',
        impact: 'high',
        effort: 'high',
        autoFixable: false
      });
    }
    
    return recommendations;
  }

  analyzePerformance(content, filePath) {
    const performance = {
      issues: [],
      score: 100,
      rules: []
    };

    for (const [name, rule] of this.performanceRules) {
      const matches = content.match(rule.pattern);
      if (matches) {
        performance.issues.push({
          name,
          severity: rule.severity,
          description: rule.description,
          matches: matches.length,
          recommendation: rule.recommendation
        });
        
        // Calculate performance score
        const severityDeductions = { critical: 20, high: 15, medium: 10, low: 5 };
        performance.score -= severityDeductions[rule.severity] * matches.length;
        
        performance.rules.push({
          name,
          severity: rule.severity,
          count: matches.length
        });
      }
    }

    return performance;
  }

  getPerformanceIssues(performance) {
    return performance.issues.map(issue => ({
      type: 'performance',
      title: `Performance Issue: ${issue.name}`,
      description: issue.description,
      severity: issue.severity,
      recommendation: issue.recommendation,
      autoFixable: false,
      line: this.findLineNumber(issue.matches[0], this.performanceRules.get(issue.name).pattern)
    }));
  }

  getPerformanceRecommendations(performance) {
    const recommendations = [];
    
    if (performance.score < 80) {
      recommendations.push({
        type: 'performance',
        title: 'Performance Optimization Needed',
        description: `Performance score: ${performance.score}/100`,
        recommendation: 'Optimize performance bottlenecks',
        impact: 'medium',
        effort: 'medium',
        autoFixable: false
      });
    }
    
    return recommendations;
  }

  analyzeCodeQuality(content, filePath) {
    const quality = {
      metrics: {},
      issues: [],
      score: 100,
      rules: []
    };

    for (const [name, metric] of this.qualityMetrics) {
      let value = 0;
      
      switch (metric.measurement) {
        case 'lines':
          value = this.calculateFunctionLength(content, metric.threshold);
          break;
        case 'count':
          value = this.calculateParameterCount(content, metric.threshold);
          break;
        case 'depth':
          value = this.calculateNestingDepth(content, metric.threshold);
          break;
        case 'characters':
          value = this.calculateLineLength(content, metric.threshold);
          break;
        default:
          value = 0;
      }
      
      quality.metrics[name] = {
        value,
        threshold: metric.threshold,
        description: metric.description
      };
      
      if (value > metric.threshold) {
        quality.issues.push({
          name,
          description: metric.description,
          value,
          threshold: metric.threshold
        });
        
        quality.score -= 10;
        quality.rules.push({
          name,
          violations: 1
        });
      }
    }

    return quality;
  }

  getQualityIssues(quality) {
    return quality.issues.map(issue => ({
      type: 'quality',
      title: `Quality Issue: ${issue.name}`,
      description: issue.description,
      severity: 'medium',
      recommendation: `Improve ${issue.name} (current: ${issue.value}, threshold: ${issue.threshold})`,
      autoFixable: false,
      line: null
    }));
  }

  getQualityRecommendations(quality) {
    const recommendations = [];
    
    if (quality.score < 80) {
      recommendations.push({
        type: 'quality',
        title: 'Code Quality Improvement Needed',
        description: `Quality score: ${quality.score}/100`,
        recommendation: 'Improve code quality metrics',
        impact: 'medium',
        effort: 'medium',
        autoFixable: false
      });
    }
    
    return recommendations;
  }

  calculateSecurityScore(security) {
    const maxScore = 100;
    const deduction = Math.min(security.riskScore, maxScore);
    return Math.max(0, maxScore - deduction);
  }

  calculatePerformanceScore(performance) {
    return Math.max(0, performance.score);
  }

  calculateQualityScore(quality) {
    return Math.max(0, quality.score);
  }

  calculateFunctionLength(content, threshold) {
    const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*{/g) || [];
    let maxLength = 0;
    
    for (const func of functions) {
      const start = func.index;
      const end = content.indexOf('}', start);
      const lines = content.substring(start, end).split('\n').length;
      maxLength = Math.max(maxLength, lines);
    }
    
    return maxLength;
  }

  calculateParameterCount(content, threshold) {
    const functions = content.match(/function\s+\w+\s*\([^)]*\)/g) || [];
    let maxCount = 0;
    
    for (const func of functions) {
      const params = func.match(/[^()]+/)[0];
      const count = params ? params.split(',').length : 0;
      maxCount = Math.max(maxCount, count);
    }
    
    return maxCount;
  }

  calculateNestingDepth(content, threshold) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const char of content) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  }

  calculateLineLength(content, threshold) {
    const lines = content.split('\n');
    let maxLength = 0;
    
    for (const line of lines) {
      maxLength = Math.max(maxLength, line.length);
    }
    
    return maxLength;
  }

  findLineNumber(match, pattern) {
    const lines = match.input.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match[0])) {
        return i + 1;
      }
    }
    return null;
  }

  async findCodeFiles(projectPath) {
    const files = [];
    
    async function searchDirectory(dir) {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          await searchDirectory(fullPath);
        } else if (stat.isFile() && this.isCodeFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
    
    await searchDirectory(projectPath);
    return files;
  }

  isCodeFile(filePath) {
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.py', '.java', '.go', '.rs', '.php', '.rb', '.cs'];
    return extensions.some(ext => filePath.endsWith(ext));
  }

  getProjectRecommendations(projectAnalysis) {
    const recommendations = [];
    
    // Overall recommendations based on aggregate metrics
    if (projectAnalysis.summary.securityScore < 70) {
      recommendations.push({
        type: 'project',
        title: 'Security Review Required',
        description: `Project security score: ${projectAnalysis.summary.securityScore}/100`,
        recommendation: 'Conduct comprehensive security review',
        impact: 'high',
        effort: 'high'
      });
    }
    
    if (projectAnalysis.summary.performanceScore < 70) {
      recommendations.push({
        type: 'project',
        title: 'Performance Optimization Needed',
        description: `Project performance score: ${projectAnalysis.summary.performanceScore}/100`,
        recommendation: 'Optimize performance bottlenecks',
        impact: 'medium',
        effort: 'medium'
      });
    }
    
    if (projectAnalysis.summary.qualityScore < 70) {
      recommendations.push({
        type: 'project',
        title: 'Code Quality Improvement',
        description: `Project quality score: ${projectAnalysis.summary.qualityScore}/100`,
        recommendation: 'Improve code quality standards',
        impact: 'medium',
        effort: 'medium'
      });
    }
    
    return recommendations;
  }
}

module.exports = AICodeAnalyzer;
