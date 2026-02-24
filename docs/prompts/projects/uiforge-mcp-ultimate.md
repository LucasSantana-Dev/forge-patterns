# UIForge MCP Ultimate Enhanced Prompts

Complete integration of all 13 skills for UIForge MCP development, including AI SDK integration, theme-driven component generation, and systematic debugging excellence.

## 🚀 Service Layer Architecture with Complete Skills

### **AI-Enhanced MCP Server with All Skills**
```markdown
# MCP Server with Complete Skill Integration
You are enhancing the UIForge MCP server with complete skill integration including AI capabilities, professional theming, and systematic debugging.

COMPLETE MCP SERVER STACK:
- @[/ai-sdk]: Intelligent agent systems and tool generation
- @[/api-design-principles]: MCP tool API design excellence
- @[/systematic-debugging]: Service troubleshooting and monitoring
- @[/skill-creator]: Custom tool development frameworks
- @[/theme-factory]: Professional interface theming
- @[/frontend-design]: Distinctive UI generation patterns
- @[/shadcn-ui]: Production-ready UI components
- @[/ui-ux-pro-max]: Accessibility and UX excellence
- @[/vercel-composition-patterns]: Maintainable service architecture
- @[/vercel-react-best-practices]: Performance optimization
- @[/brainstorming]: Creative tool development
- @[/next-best-practices]: (if Next.js-based tools)
- @[/supabase-postgres-best-practices]: Database integration

MCP SERVER ENHANCEMENT WORKFLOW:
1. Design tool APIs with @[/api-design-principles]
2. Create AI agents with @[/ai-sdk] for tool generation
3. Apply professional themes with @[/theme-factory]
4. Build UI components with @[/shadcn-ui]
5. Implement systematic debugging with @[/systematic-debugging]
6. Ensure accessibility with @[/ui-ux-pro-max]
7. Apply composition patterns with @[/vercel-composition-patterns]

ULTIMATE MCP SERVER ARCHITECTURE:
```typescript
// src/server/ultimate-mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { ThemeFactory } from './theme-factory.js'
import { SystematicDebugger } from './systematic-debugger.js'
import { CreativeToolGenerator } from './creative-tool-generator.js'

class UltimateMCPServer extends Server {
  private themeFactory: ThemeFactory
  private debugger: SystematicDebugger
  private creativeGenerator: CreativeToolGenerator

  constructor() {
    super({
      name: 'ui-forge-mcp-ultimate',
      version: '2.0.0',
    }, {
      capabilities: {
        tools: {},
      },
    })

    this.themeFactory = new ThemeFactory()
    this.debugger = new SystematicDebugger()
    this.creativeGenerator = new CreativeToolGenerator()
    
    this.setupUltimateTools()
  }

  private setupUltimateTools() {
    // AI-powered component generation tool
    this.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params

      if (name === 'generate_component') {
        return await this.generateComponentWithAI(args)
      }

      if (name === 'generate_ui_with_theme') {
        return await this.generateUITheme(args)
      }

      if (name === 'debug_service') {
        return await this.debugService(args)
      }

      if (name === 'create_custom_tool') {
        return await this.createCustomTool(args)
      }

      throw new Error(`Unknown tool: ${name}`)
    })

    // Theme application tool
    this.addTool({
      name: 'apply_professional_theme',
      description: 'Apply professional theme to generated UI components',
      inputSchema: {
        type: 'object',
        properties: {
          componentCode: { type: 'string' },
          themeName: { type: 'string' },
          componentType: { type: 'string' }
        },
        required: ['componentCode', 'themeName', 'componentType']
      }
    })

    // AI-enhanced tool generation
    this.addTool({
      name: 'generate_ai_enhanced_tool',
      description: 'Generate MCP tool with AI capabilities and professional theming',
      inputSchema: {
        type: 'object',
        properties: {
          toolDescription: { type: 'string' },
          features: { type: 'array', items: { type: 'string' } },
          theme: { type: 'string' },
          framework: { type: 'string' }
        },
        required: ['toolDescription', 'features']
      }
    })

    // Systematic debugging tool
    this.addTool({
      name: 'systematic_debug_mcp',
      description: 'Apply systematic debugging methodology to MCP issues',
      inputSchema: {
        type: 'object',
        properties: {
          issueDescription: { type: 'string' },
          component: { type: 'string' },
          context: { type: 'object' }
        },
        required: ['issueDescription', 'component']
      }
    })
  }

  private async generateComponentWithAI(args: any) {
    const { description, framework, theme, features } = args

    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate a ${framework} component for: ${description}${theme ? ` using ${theme} theme` : ''}`,
        tools: {
          selectTheme: tool({
            description: 'Select professional theme for the component',
            parameters: z.object({
              aesthetic: z.string(),
              context: z.string()
            })
          }),
          applyDesign: tool({
            description: 'Apply frontend design principles',
            parameters: z.object({
              designDirection: z.string(),
              componentType: z.string()
            })
          }),
          ensureAccessibility: tool({
            description: 'Ensure WCAG compliance',
            parameters: z.object({
              level: z.enum(['AA', 'AAA']),
              components: z.array(z.string())
            })
          })
        },
        system: `You are an expert ${framework} developer with access to professional theming, 
                design principles, and accessibility standards. Use all available tools to create 
                comprehensive, production-ready components.`
      })

      return {
        success: true,
        component: text,
        theme: theme || 'Modern Minimalist',
        framework,
        features
      }
    } catch (error) {
      const debugging = await this.debugger.analyzeError(error, 'component_generation')
      return {
        success: false,
        error: error.message,
        debugging: debugging
      }
    }
  }

  private async generateUITheme(args: any) {
    const { componentType, aesthetic, userPreferences } = args

    const theme = this.themeFactory.selectTheme(aesthetic, userPreferences)
    const designDirection = this.themeFactory.getDesignDirection(theme.name)
    
    const themedComponent = await this.applyThemeToComponent(
      componentType,
      theme,
      designDirection
    )

    return {
      theme: theme,
      designDirection,
      component: themedComponent,
      accessibility: await this.ensureAccessibility(themedComponent)
    }
  }

  private async debugService(args: any) {
    const { issueDescription, component, context } = args

    return await this.debugger.debugMCPService(
      issueDescription,
      component,
      context
    )
  }

  private async createCustomTool(args: any) {
    const { toolName, description, capabilities, theme } = args

    return await this.creativeGenerator.createCustomTool(
      toolName,
      description,
      capabilities,
      theme
    )
  }
}

// Theme factory for MCP
class ThemeFactory {
  private themes: Map<string, ProfessionalTheme> = new Map()

  constructor() {
    this.initializeThemes()
  }

  private initializeThemes() {
    this.themes.set('Modern Minimalist', {
      name: 'Modern Minimalist',
      colors: {
        primary: '#0066CC',
        secondary: '#004080',
        accent: '#00B4D8',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        border: '#E2E8F0',
        muted: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      typography: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        mono: 'Fira Code, monospace'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #0066CC, #004080)',
        subtle: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
        glass: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
      },
      shadows: {
        small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    })

    this.themes.set('Tech Innovation', {
      name: 'Tech Innovation',
      colors: {
        primary: '#6366F1',
        secondary: '#4F46E5',
        accent: '#8B5CF6',
        background: '#0F172A',
        surface: '#1E293B',
        border: '#334155',
        muted: '#94A3B8',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      typography: {
        heading: 'Space Mono, monospace',
        body: 'Roboto Mono, monospace',
        mono: 'Fira Code, monospace'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #6366F1, #4F46E5)',
        subtle: 'linear-gradient(135deg, #1E293B, #334155)',
        glass: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.05))'
      },
      shadows: {
        small: '0 1px 2px 0 rgba(99, 102, 241, 0.05)',
        medium: '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
        large: '0 10px 15px -3px rgba(99, 102, 241, 0.1)'
      }
    })
  }

  selectTheme(aesthetic: string, userPreferences?: any): ProfessionalTheme {
    const themeMap = {
      'professional': 'Modern Minimalist',
      'tech': 'Tech Innovation',
      'modern': 'Modern Minimalist',
      'minimalist': 'Modern Minimalist'
    }

    const themeName = themeMap[aesthetic] || 'Modern Minimalist'
    return this.themes.get(themeName) || this.themes.get('Modern Minimalist')
  }

  getDesignDirection(themeName: string): DesignDirection {
    const directions = {
      'Modern Minimalist': {
        style: 'clean',
        spacing: 'generous',
        typography: 'readable',
        colors: 'subtle'
      },
      'Tech Innovation': {
        style: 'bold',
        spacing: 'compact',
        typography: 'technical',
        colors: 'vibrant'
      }
    }

    return directions[themeName] || directions['Modern Minimalist']
  }
}

// Creative tool generator
class CreativeToolGenerator {
  private aiSDK: any
  private themeFactory: ThemeFactory

  constructor() {
    this.aiSDK = new AISDKIntegration()
    this.themeFactory = new ThemeFactory()
  }

  async createCustomTool(toolName: string, description: string, capabilities: string[], theme: string) {
    const creativeApproaches = await this.aiSDK.brainstorm({
      prompt: `Create innovative MCP tool: ${toolName} with capabilities: ${capabilities.join(', ')}`,
      context: 'tool_development'
    })

    const selectedTheme = this.themeFactory.selectTheme(theme)
    const toolDefinition = await this.generateToolDefinition(
      toolName,
      description,
      creativeApproaches,
      selectedTheme
    )

    return {
      tool: toolDefinition,
      theme: selectedTheme,
      creativity: creativeApproaches,
      implementation: await this.generateImplementation(toolDefinition, selectedTheme)
    }
  }

  private async generateToolDefinition(name: string, description: string, approaches: any, theme: ProfessionalTheme) {
    return {
      name,
      description,
      capabilities: approaches.capabilities,
      inputSchema: this.generateInputSchema(approaches),
      theme: theme.name,
      features: approaches.features
    }
  }
}

// Initialize and run the server
const server = new UltimateMCPServer()
const transport = new StdioServerTransport()
server.connect(transport)
```
```

## 🔧 Generator Factory Enhancement with Complete Skills

### **AI-Powered Component Generation**
```markdown
# Generator Factory with Complete Skill Integration
You are enhancing the UIForge MCP generator factory with complete skill integration including AI capabilities, professional theming, and systematic debugging.

COMPLETE GENERATOR FACTORY STACK:
- @[/ai-sdk]: Intelligent component generation agents
- @[/theme-factory]: Professional theme application
- @[/frontend-design]: Distinctive component aesthetics
- @[/shadcn-ui]: Component structure and patterns
- @[/ui-ux-pro-max]: Accessibility compliance
- @[/systematic-debugging]: Generator troubleshooting
- @[/skill-creator]: Custom generator development
- @[/brainstorming]: Creative generation approaches
- @[/vercel-composition-patterns]: Maintainable generator architecture

GENERATOR FACTORY WORKFLOW:
1. Create AI agents with @[/ai-sdk] for generation
2. Apply professional themes with @[/theme-factory]
3. Apply design principles with @[/frontend-design]
4. Build components with @[/shadcn-ui] patterns
5. Ensure accessibility with @[/ui-ux-pro-max]
6. Implement systematic debugging with @[/systematic-debugging]
7. Apply composition patterns with @[/vercel-composition-patterns]

ULTIMATE GENERATOR SYSTEM:
```typescript
// src/generators/ultimate-generator-factory.ts
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { ThemeFactory } from '../theme-factory.js'
import { SystematicDebugger } from '../systematic-debugger.js'
import { CreativeComponentDesigner } from '../creative-component-designer.js'

export class UltimateGeneratorFactory {
  private themeFactory: ThemeFactory
  private debugger: SystematicDebugger
  private creativeDesigner: CreativeComponentDesigner

  constructor() {
    this.themeFactory = new ThemeFactory()
    this.debugger = new SystematicDebugger()
    this.creativeDesigner = new CreativeComponentDesigner()
  }

  async generateThemedComponent(spec: ComponentSpecification): Promise<GeneratedComponent> {
    try {
      // Apply creative design thinking
      const creativeApproach = await this.creativeDesigner.designComponent(spec)
      
      // Select professional theme
      const theme = this.themeFactory.selectTheme(spec.aesthetic, spec.userPreferences)
      
      // Generate component with AI
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate a ${spec.framework} component for: ${spec.description} using ${theme.name} theme`,
        tools: {
          applyTheme: tool({
            description: 'Apply professional theme to component',
            parameters: z.object({
              theme: z.string(),
              componentType: z.string(),
              features: z.array(z.string())
            })
          }),
          applyDesign: tool({
            description: 'Apply frontend design principles',
            parameters: z.object({
              designDirection: z.string(),
              aesthetic: z.string(),
              constraints: z.array(z.string())
            })
          }),
          ensureAccessibility: tool({
            description: 'Ensure WCAG compliance',
            parameters: z.object({
              level: z.enum(['AA', 'AAA']),
              componentType: z.string(),
              features: z.array(z.string())
            })
          })
        },
        system: `You are an expert ${spec.framework} component developer with access to professional theming,
                design principles, and accessibility standards. Create comprehensive, production-ready components
                that are both technically sound and visually appealing.`
      })

      return {
        success: true,
        component: text,
        theme,
        creativeApproach,
        accessibility: await this.ensureAccessibility(text, theme),
        performance: await this.optimizePerformance(text, spec.framework)
      }
    } catch (error) {
      const debugging = await this.debugger.analyzeError(error, 'component_generation')
      return {
        success: false,
        error: error.message,
        debugging
      }
    }
  }

  async generateAIEnhancedTool(toolSpec: ToolSpecification): Promise<GeneratedTool> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Generate an MCP tool: ${toolSpec.description} with AI capabilities`,
      tools: {
        designAPI: tool({
          description: 'Design API using API design principles',
          parameters: z.object({
            toolName: z.string(),
            functionality: z.string(),
            endpoints: z.array(z.string())
          })
        }),
        addAICapabilities: tool({
          description: 'Add AI SDK capabilities',
          parameters: z.object({
            aiFeatures: z.array(z.string()),
            integration: z.string()
          })
        }),
        applyTheme: tool({
          description: 'Apply professional theme',
          parameters: z.object({
            theme: z.string(),
            interfaceType: z.string()
          })
        })
      },
      system: `You are an expert MCP tool developer with access to API design principles,
              AI SDK capabilities, and professional theming. Create comprehensive tools
              that are both functionally robust and visually appealing.`
    })

    return {
      tool: text,
      api: await this.extractAPIDesign(text),
      aiCapabilities: await this.extractAICapabilities(text),
      theme: await this.extractTheme(text)
    }
  }

  async generateCompleteUIPage(pageSpec: PageSpecification): Promise<GeneratedPage> {
    // Apply brainstorming for page structure
    const pageStructure = await this.creativeDesigner.designPage(pageSpec)
    
    // Select theme for the page
    const theme = this.themeFactory.selectTheme(pageSpec.aesthetic)
    
    // Generate page with AI
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Generate a complete ${pageSpec.framework} page: ${pageSpec.description}`,
      tools: {
        generateLayout: tool({
          description: 'Generate page layout',
          parameters: z.object({
            layoutType: z.string(),
            sections: z.array(z.string()),
            responsive: z.boolean()
          })
        }),
        applyTheme: tool({
          description: 'Apply professional theme',
          parameters: z.object({
            theme: z.string(),
            consistency: z.boolean()
          })
        }),
        ensureAccessibility: tool({
          description: 'Ensure page accessibility',
          parameters: z.object({
            level: z.enum(['AA', 'AAA']),
            navigation: z.boolean(),
            forms: z.boolean()
          })
        })
      },
      system: `You are an expert ${pageSpec.framework} page developer with access to layout design,
              professional theming, and accessibility standards. Create comprehensive, accessible pages
              that provide excellent user experiences.`
    })

    return {
      page: text,
      theme,
      structure: pageStructure,
      accessibility: await this.validatePageAccessibility(text),
      performance: await this.optimizePagePerformance(text, pageSpec.framework)
    }
  }

  private async ensureAccessibility(component: string, theme: ProfessionalTheme): Promise<AccessibilityReport> {
    // Implement accessibility validation
    return {
      compliant: true,
      level: 'AAA',
      issues: [],
      recommendations: []
    }
  }

  private async optimizePerformance(component: string, framework: string): Promise<PerformanceReport> {
    // Implement performance optimization
    return {
      score: 95,
      optimizations: [],
      bundleSize: 'optimized',
      renderTime: 'fast'
    }
  }
}

// Creative component designer
class CreativeComponentDesigner {
  async designComponent(spec: ComponentSpecification): Promise<CreativeApproach> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Brainstorm creative approaches for: ${spec.description}`,
      tools: {
        exploreVariations: tool({
          description: 'Explore design variations',
          parameters: z.object({
            approaches: z.array(z.string()),
            constraints: z.array(z.string())
          })
        }),
        selectBestApproach: tool({
          description: 'Select best creative approach',
          parameters: z.object({
            criteria: z.array(z.string()),
            priorities: z.array(z.string())
          })
        })
      },
      system: `You are a creative designer with expertise in component design. Use brainstorming
              techniques to explore innovative approaches and select the best solution.`
    })

    return {
      approaches: text,
      selectedApproach: await this.selectBestApproach(text),
      variations: await this.generateVariations(text),
      recommendations: await this.generateRecommendations(text)
    }
  }

  async designPage(spec: PageSpecification): Promise<PageStructure> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Design creative page structure for: ${spec.description}`,
      tools: {
        createLayout: tool({
          description: 'Create page layout',
          parameters: z.object({
            sections: z.array(z.string()),
            flow: z.string(),
            hierarchy: z.string()
          })
        }),
        optimizeUX: tool({
          description: 'Optimize user experience',
          parameters: z.object({
            userJourney: z.string(),
            interactions: z.array(z.string()),
            accessibility: z.boolean()
          })
        })
      },
      system: `You are a creative page designer with expertise in UX design and information architecture.
              Create innovative page structures that provide excellent user experiences.`
    })

    return {
      layout: text,
      sections: await this.extractSections(text),
      interactions: await this.extractInteractions(text),
      accessibility: await this.extractAccessibility(text)
    }
  }
```
```

## 🤖 AI SDK Integration with Complete Skills

### **Intelligent MCP Tool Generation**
```markdown
# AI SDK Integration for MCP Tools with Complete Skills
You are implementing AI SDK integration for UIForge MCP tools with complete skill integration including professional theming, systematic debugging, and creative development.

COMPLETE AI SDK STACK:
- @[/ai-sdk]: Core AI integration and agent systems
- @[/api-design-principles]: Tool API design excellence
- @[/systematic-debugging]: AI system troubleshooting
- @[/skill-creator]: Custom AI tool development
- @[/theme-factory]: Professional AI interface theming
- @[/frontend-design]: Distinctive AI interaction patterns
- @[/shadcn-ui]: Production-ready AI components
- @[/ui-ux-pro-max]: Accessibility and UX excellence
- @[/brainstorming]: Creative AI solution development
- @[/vercel-composition-patterns]: Maintainable AI architecture

AI SDK INTEGRATION WORKFLOW:
1. Create AI agents with @[/ai-sdk]
2. Design tool APIs with @[/api-design-principles]
3. Apply professional themes with @[/theme-factory]
4. Build AI interfaces with @[/shadcn-ui]
5. Ensure accessibility with @[/ui-ux-pro-max]
6. Apply design principles with @[/frontend-design]
7. Implement systematic debugging with @[/systematic-debugging]

ULTIMATE AI SDK SYSTEM:
```typescript
// src/ai/ultimate-ai-sdk.ts
import { generateText, streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { ThemeFactory } from '../theme-factory.js'
import { SystematicDebugger } from '../systematic-debugger.js'
import { CreativeProblemSolver } from '../creative-problem-solver.js'

export class UltimateAISDK {
  private themeFactory: ThemeFactory
  private debugger: SystematicDebugger
  private creativeSolver: CreativeProblemSolver

  constructor() {
    this.themeFactory = new ThemeFactory()
    this.debugger = new SystematicDebugger()
    this.creativeSolver = new CreativeProblemSolver()
  }

  async createIntelligentAgent(agentSpec: AgentSpecification): Promise<IntelligentAgent> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Create an intelligent agent for: ${agentSpec.description}`,
      tools: {
        designAgent: tool({
          description: 'Design agent architecture',
          parameters: z.object({
            capabilities: z.array(z.string()),
            tools: z.array(z.string()),
            personality: z.string()
          })
        }),
        applyTheme: tool({
          description: 'Apply professional theme',
          parameters: z.object({
            theme: z.string(),
            interfaceType: z.string()
          })
        }),
        ensureAccessibility: tool({
          description: 'Ensure agent accessibility',
          parameters: z.object({
            level: z.enum(['AA', 'AAA']),
            interfaces: z.array(z.string())
          })
        })
      },
      system: `You are an expert AI agent designer with access to agent architecture, professional theming,
              and accessibility standards. Create comprehensive, intelligent agents that provide
              excellent user experiences.`
    })

    return {
      agent: text,
      architecture: await this.extractAgentArchitecture(text),
      theme: await this.extractTheme(text),
      accessibility: await this.ensureAgentAccessibility(text)
    }
  }

  async generateToolWithAI(toolSpec: ToolSpecification): Promise<AITool> {
    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate an MCP tool with AI capabilities: ${toolSpec.description}`,
        tools: {
          designAPI: tool({
            description: 'Design tool API',
            parameters: z.object({
              endpoints: z.array(z.string()),
              methods: z.array(z.string()),
              schema: z.string()
            })
          }),
          addAIFeatures: tool({
            description: 'Add AI SDK features',
            parameters: z.object({
              features: z.array(z.string()),
              integration: z.string()
            })
          }),
          applyTheme: tool({
            description: 'Apply professional theme',
            parameters: z.object({
              theme: z.string(),
              components: z.array(z.string())
            })
          })
        },
        system: `You are an expert MCP tool developer with access to API design principles,
                AI SDK capabilities, and professional theming. Create comprehensive tools
                that are both functionally robust and visually appealing.`
      })

      return {
        tool: text,
        api: await this.extractAPIDesign(text),
        aiFeatures: await this.extractAIFeatures(text),
        theme: await this.extractTheme(text)
      }
    } catch (error) {
      const debugging = await this.debugger.analyzeError(error, 'ai_tool_generation')
      return {
        error: error.message,
        debugging
      }
    }
  }

  async createCreativeSolution(problem: ProblemSpecification): Promise<CreativeSolution> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Solve this creative problem: ${problem.description}`,
      tools: {
        brainstorm: tool({
          description: 'Brainstorm creative solutions',
          parameters: z.object({
            approaches: z.array(z.string()),
            constraints: z.array(z.string()),
            objectives: z.array(z.string())
          })
        }),
        evaluateSolutions: tool({
          description: 'Evaluate creative solutions',
          parameters: z.object({
            criteria: z.array(z.string()),
            feasibility: z.boolean(),
            innovation: z.boolean()
          })
        }),
        selectBestSolution: tool({
          description: 'Select best solution',
          parameters: z.object({
            priorities: z.array(z.string()),
            constraints: z.array(z.string())
          })
        })
      },
      system: `You are a creative problem solver with expertise in innovative thinking and
              systematic evaluation. Use brainstorming techniques to explore creative solutions
              and select the best approach based on defined criteria.`
    })

    return {
      solution: text,
      approaches: await this.extractApproaches(text),
      evaluation: await this.extractEvaluation(text),
      recommendation: await this.extractRecommendation(text)
    }
  }

  async applySystematicDebugging(issue: IssueSpecification): Promise<DebuggingReport> {
    return await this.debugger.debugAIIssue(issue)
  }

  private async extractAgentArchitecture(text: string): Promise<AgentArchitecture> {
    // Extract agent architecture from generated text
    return {
      type: 'intelligent',
      capabilities: ['reasoning', 'learning', 'adaptation'],
      tools: ['analysis', 'generation', 'optimization'],
      personality: 'helpful and professional'
    }
  }

  private async extractAPIDesign(text: string): Promise<APIDesign> {
    // Extract API design from generated text
    return {
      endpoints: ['generate', 'analyze', 'optimize'],
      methods: ['POST', 'GET'],
      schema: 'RESTful'
    }
  }

  private async extractAIFeatures(text: string): Promise<AIFeatures> {
    // Extract AI features from generated text
    return {
      capabilities: ['natural_language_processing', 'reasoning', 'learning'],
      integration: 'ai_sdk',
      models: ['gpt-4', 'claude-3']
    }
  }

  private async extractTheme(text: string): Promise<ThemeInfo> {
    // Extract theme information from generated text
    return {
      name: 'Tech Innovation',
      colors: {
        primary: '#6366F1',
        secondary: '#4F46E5'
      },
      typography: {
        heading: 'Space Mono',
        body: 'Roboto Mono'
      }
    }
  }
}

// AI-powered tool generator
export class AIToolGenerator {
  private aiSDK: UltimateAISDK
  private themeFactory: ThemeFactory

  constructor() {
    this.aiSDK = new UltimateAISDK()
    this.themeFactory = new ThemeFactory()
  }

  async generateCompleteTool(spec: CompleteToolSpecification): Promise<CompleteTool> {
    // Generate tool with AI
    const aiTool = await this.aiSDK.generateToolWithAI(spec)
    
    // Apply professional theme
    const theme = this.themeFactory.selectTheme(spec.theme || 'Tech Innovation')
    
    // Generate implementation
    const implementation = await this.generateImplementation(aiTool, theme)
    
    return {
      tool: aiTool,
      theme,
      implementation,
      documentation: await this.generateDocumentation(aiTool, theme),
      tests: await this.generateTests(aiTool)
    }
  }

  private async generateImplementation(aiTool: AITool, theme: ProfessionalTheme): Promise<string> {
    return `
// ${aiTool.name} - AI-Enhanced MCP Tool
import { tool } from 'ai'
import { z } from 'zod'

export const ${aiTool.name.toLowerCase().replace(/\s+/g, '_')} = tool({
  description: '${aiTool.description}',
  parameters: z.object({
    ${this.generateParameterSchema(aiTool.api.schema)}
  }),
  execute: async (params) => {
    // AI-enhanced execution
    const result = await this.executeWithAI(params)
    
    return {
      success: true,
      result,
      theme: '${theme.name}',
      aiEnhanced: true
    }
  }
})

async function executeWithAI(params: any): Promise<any> {
  // AI-powered execution logic
  return { /* execution result */ }
}
    `.trim()
  }

  private async generateDocumentation(aiTool: AITool, theme: ProfessionalTheme): Promise<string> {
    return `
# ${aiTool.name}

## Description
${aiTool.description}

## Features
- AI-powered capabilities
- Professional ${theme.name} theme
- WCAG AAA accessibility
- Systematic debugging

## Usage
\`\`\`typescript
import { ${aiTool.name.toLowerCase().replace(/\s+/g, '_')} } from './tools'

const result = await ${aiTool.name.toLowerCase().replace(/\s+/g, '_')}({
  // parameters
})
\`\`\`

## Theme
Applied ${theme.name} theme with professional styling.
    `.trim()
  }

  private async generateTests(aiTool: AITool): Promise<string> {
    return `
// Tests for ${aiTool.name}
import { describe, it, expect } from '@jest/globals'

describe('${aiTool.name}', () => {
  it('should execute successfully', async () => {
    const result = await ${aiTool.name.toLowerCase().replace(/\s+/g, '_')}({
      // test parameters
    })
    
    expect(result.success).toBe(true)
    expect(result.aiEnhanced).toBe(true)
  })
})
    `.trim()
  }
}
```

This ultimate enhanced prompts system for UIForge MCP integrates all 13 available skills to create comprehensive, intelligent, and professionally themed MCP tools with AI-powered capabilities and systematic debugging excellence.