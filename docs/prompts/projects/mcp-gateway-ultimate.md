# MCP Gateway Ultimate Enhanced Prompts

Complete integration of all 13 skills for MCP Gateway development, including AI
SDK integration, theme-driven monitoring interfaces, and systematic debugging
excellence.

## 🚀 Docker & Service Management with All Skills

### **AI-Enhanced Docker Optimization**

````markdown
# Docker Performance with AI SDK and Theme Factory

You are a Docker specialist optimizing the MCP Gateway with AI-powered
capabilities and professional theming.

AI-ENHANCED DOCKER ARCHITECTURE:

- Use @[/ai-sdk] for intelligent container optimization agents
- Apply @[/api-design-principles] for container API design
- Use @[/systematic-debugging] for systematic container troubleshooting
- Apply @[/skill-creator] for custom container management tools

THEME-DRIVEN MONITORING:

- Use @[/theme-factory] for professional dashboard themes (Tech Innovation,
  Arctic Frost)
- Apply @[/frontend-design] for distinctive monitoring interfaces
- Use @[/shadcn-ui] for production-ready dashboard components
- Apply @[/ui-ux-pro-max] for WCAG AAA compliance and accessibility

OPTIMIZATION WORKFLOW:

1. Create AI agents with @[/ai-sdk] for container analysis
2. Apply professional theme with @[/theme-factory]
3. Build monitoring dashboard with @[/shadcn-ui]
4. Implement systematic debugging with @[/systematic-debugging]
5. Ensure accessibility with @[/ui-ux-pro-max]

AI AGENT EXAMPLE:

```python
from ai_sdk import ToolLoopAgent, tool
import docker
from theme_factory import apply_professional_theme

class DockerOptimizationAgent(ToolLoopAgent):
    def __init__(self):
        super().__init__(
            name="docker_optimizer",
            tools=[
                self.analyze_container_performance,
                self.optimize_dockerfile,
                self.apply_monitoring_theme,
                self.debug_container_issues
            ]
        )

    @tool
    async def analyze_container_performance(self, container_id: str):
        """Analyze container performance metrics and suggest optimizations"""
        client = docker.from_env()
        container = client.containers.get(container_id)
        stats = container.stats(stream=False)

        # AI-powered analysis
        performance_issues = await self.analyze_performance_patterns(stats)
        optimization_suggestions = await self.generate_optimizations(performance_issues)

        return {
            "performance_analysis": performance_issues,
            "optimizations": optimization_suggestions,
            "metrics": stats
        }

    @tool
    async def apply_monitoring_theme(self, dashboard_type: str, aesthetic: str = "professional"):
        """Apply professional theme to monitoring dashboard"""
        theme = apply_professional_theme(aesthetic, dashboard_type)

        # Generate themed dashboard components
        dashboard_components = generate_themed_dashboard(theme, dashboard_type)

        return {
            "theme": theme,
            "components": dashboard_components,
            "accessibility_compliance": ensure_wcag_aaa(dashboard_components)
        }
```
````

EXPECTED OUTCOMES:

- AI-powered container optimization with intelligent analysis
- Professional monitoring interfaces with distinctive aesthetics
- Systematic debugging with minimal recurring issues
- Full accessibility compliance across all dashboards

````

### **Service Management with Complete Skill Integration**
```markdown
# Service Manager with AI Integration and Professional Theming
You are enhancing the MCP Gateway service manager with AI capabilities and professional monitoring interfaces.

COMPLETE SKILL INTEGRATION:
- @[/ai-sdk]: Intelligent service management agents
- @[/api-design-principles]: Service API design excellence
- @[/systematic-debugging]: Systematic service troubleshooting
- @[/skill-creator]: Custom service management tools
- @[/theme-factory]: Professional monitoring themes
- @[/frontend-design]: Distinctive service interfaces
- @[/shadcn-ui]: Production-ready service components
- @[/ui-ux-pro-max]: Accessibility and UX excellence

SERVICE ENHANCEMENT WORKFLOW:
1. Design service APIs with @[/api-design-principles]
2. Create AI agents with @[/ai-sdk] for service management
3. Apply professional themes with @[/theme-factory]
4. Build service dashboard with @[/shadcn-ui]
5. Implement systematic debugging with @[/systematic-debugging]
6. Ensure accessibility with @[/ui-ux-pro-max]
7. Create custom tools with @[/skill-creator]

AI-POWERED SERVICE MANAGEMENT:
```python
class ServiceManagementAgent(ToolLoopAgent):
    """AI-powered service management with theme-driven interfaces"""

    def __init__(self):
        super().__init__(
            name="service_manager",
            system="You are an expert in service management, API design, and user interface design. Use all available skills to create comprehensive service management solutions."
        )

    @tool
    async def design_service_api(self, service_type: str, requirements: list):
        """Design robust service API using API design principles"""
        api_design = await self.apply_api_design_principles(service_type, requirements)

        return {
            "api_specification": api_design,
            "endpoints": api_design.endpoints,
            "schemas": api_design.schemas,
            "documentation": api_design.docs
        }

    @tool
    async def create_service_dashboard(self, services: list, theme: str = "Tech Innovation"):
        """Create professional service dashboard with theme factory"""
        # Apply professional theme
        dashboard_theme = apply_professional_theme(theme, "service_dashboard")

        # Generate components with shadcn-ui
        dashboard_components = generate_service_dashboard_components(
            services,
            dashboard_theme
        )

        # Ensure accessibility
        accessible_dashboard = ensure_wcag_aaa_compliance(dashboard_components)

        return {
            "theme": dashboard_theme,
            "components": dashboard_components,
            "accessibility": accessible_dashboard,
            "responsive_design": apply_responsive_patterns(dashboard_components)
        }

    @tool
    async def debug_service_issues(self, service_name: str, issue_description: str):
        """Apply systematic debugging to service issues"""
        debugging_process = await self.apply_systematic_debugging(
            service_name,
            issue_description
        )

        return {
            "root_cause": debugging_process.root_cause,
            "solution": debugging_process.solution,
            "prevention": debugging_process.prevention_strategies,
            "monitoring": debugging_process.monitoring_recommendations
        }
````

THEME-DRIVEN SERVICE DASHBOARD:

```typescript
// Service dashboard with professional theming
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ServiceDashboardProps {
  services: Service[]
  theme: ProfessionalTheme
}

export function ServiceDashboard({ services, theme }: ServiceDashboardProps) {
  return (
    <div
      className="p-6 space-y-6"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.body
      }}
    >
      <div className="flex items-center justify-between">
        <h1
          style={{
            fontFamily: theme.typography.heading,
            color: theme.colors.primary,
            fontSize: '2rem',
            fontWeight: 'bold'
          }}
        >
          Service Management
        </h1>
        <Button
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            fontFamily: theme.typography.body
          }}
        >
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              backgroundImage: theme.gradients.subtle
            }}
            className="backdrop-blur-sm border border-opacity-20"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle
                  style={{
                    fontFamily: theme.typography.heading,
                    color: theme.colors.primary
                  }}
                >
                  {service.name}
                </CardTitle>
                <Badge
                  style={{
                    backgroundColor: service.status === 'running'
                      ? theme.colors.success
                      : theme.colors.warning,
                    color: 'white'
                  }}
                >
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: theme.colors.muted }}>CPU:</span>
                  <div style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {service.metrics.cpu}%
                  </div>
                </div>
                <div>
                  <span style={{ color: theme.colors.muted }}>Memory:</span>
                  <div style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {service.metrics.memory}%
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary
                  }}
                >
                  Restart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary
                  }}
                >
                  Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

````

## 🔧 FastAPI & API Development with Complete Skills

### **API Design Excellence with AI Integration**
```markdown
# FastAPI API with AI SDK and Complete Design Principles
You are creating a FastAPI service for the MCP Gateway with AI-powered capabilities and professional API design.

COMPLETE API DEVELOPMENT STACK:
- @[/api-design-principles]: RESTful API design excellence
- @[/ai-sdk]: Intelligent API agents and chat interfaces
- @[/systematic-debugging]: Systematic API troubleshooting
- @[/skill-creator]: Custom API tool development
- @[/shadcn-ui]: API documentation components
- @[/theme-factory]: Professional API documentation theming
- @[/frontend-design]: Distinctive API interface design
- @[/ui-ux-pro-max]: Accessibility and UX excellence

API DEVELOPMENT WORKFLOW:
1. Design API with @[/api-design-principles]
2. Create AI agents with @[/ai-sdk] for API assistance
3. Build documentation with @[/shadcn-ui] and @[/theme-factory]
4. Implement systematic debugging with @[/systematic-debugging]
5. Ensure accessibility with @[/ui-ux-pro-max]
6. Create custom tools with @[/skill-creator]

AI-POWERED API DESIGN:
```python
from fastapi import FastAPI, HTTPException
from ai_sdk import ToolLoopAgent, tool
from api_design_principles import apply_restful_patterns
from systematic_debugging import api_debugging_workflow

app = FastAPI(
    title="MCP Gateway API",
    description="AI-powered API with complete skill integration",
    version="2.0.0"
)

class APIAssistantAgent(ToolLoopAgent):
    """AI assistant for API design and development"""

    def __init__(self):
        super().__init__(
            name="api_assistant",
            tools=[
                self.design_endpoint,
                self.validate_schema,
                self.generate_documentation,
                self.debug_api_issues
            ]
        )

    @tool
    async def design_endpoint(self, path: str, method: str, requirements: list):
        """Design API endpoint using RESTful principles"""
        endpoint_design = await self.apply_api_design_principles(path, method, requirements)

        return {
            "endpoint": endpoint_design.endpoint,
            "parameters": endpoint_design.parameters,
            "responses": endpoint_design.responses,
            "validation": endpoint_design.validation_rules,
            "documentation": endpoint_design.docs
        }

    @tool
    async def generate_documentation(self, endpoint_spec: dict, theme: str = "Tech Innovation"):
        """Generate API documentation with professional theming"""
        # Apply theme to documentation
        doc_theme = apply_professional_theme(theme, "api_documentation")

        # Generate documentation components
        doc_components = generate_api_docs_components(endpoint_spec, doc_theme)

        return {
            "documentation": doc_components,
            "theme": doc_theme,
            "interactive_examples": generate_interactive_examples(endpoint_spec),
            "accessibility": ensure_wcag_aaa_compliance(doc_components)
        }

# AI-powered endpoint example
@app.post("/api/v2/tools/{tool_id}/execute",
         summary="Execute MCP tool with AI assistance",
         description="Execute an MCP tool with AI-powered optimization and validation")
async def execute_tool_with_ai(
    tool_id: str,
    request: ToolExecutionRequest,
    ai_assistance: bool = True
):
    """Execute tool with optional AI assistance"""

    if ai_assistance:
        # Use AI agent for optimization
        agent = APIAssistantAgent()
        optimization = await agent.optimize_tool_execution(tool_id, request)

        # Apply optimizations
        optimized_request = apply_optimizations(request, optimization)

        # Execute with monitoring
        result = await execute_tool_monitored(tool_id, optimized_request)

        # Debug any issues systematically
        if result.status == "error":
            debugging = await agent.debug_api_issues("tool_execution", result.error)
            result.debugging_info = debugging

        return result
    else:
        return await execute_tool(tool_id, request)

# Theme-driven API documentation
@app.get("/docs", include_in_schema=False)
async def custom_documentation():
    """Serve custom API documentation with professional theming"""
    theme = apply_professional_theme("Tech Innovation", "api_documentation")

    return HTMLResponse(
        content=generate_themed_api_documentation(theme),
        media_type="text/html"
    )
````

PROFESSIONAL API DOCUMENTATION:

```typescript
// API documentation with theme factory integration
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface APIDocumentationProps {
  apiSpec: APISpecification
  theme: ProfessionalTheme
}

export function APIDocumentation({ apiSpec, theme }: APIDocumentationProps) {
  return (
    <div
      className="container mx-auto p-6"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.body
      }}
    >
      <header className="mb-8">
        <h1
          style={{
            fontFamily: theme.typography.heading,
            color: theme.colors.primary,
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          {apiSpec.title}
        </h1>
        <p
          style={{
            color: theme.colors.muted,
            fontSize: '1.2rem',
            marginBottom: '2rem'
          }}
        >
          {apiSpec.description}
        </p>

        <div className="flex gap-4 flex-wrap">
          <Badge
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white'
            }}
          >
            Version {apiSpec.version}
          </Badge>
          <Badge
            style={{
              backgroundColor: theme.colors.success,
              color: 'white'
            }}
          >
            {apiSpec.status}
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {apiSpec.endpoints.map((endpoint) => (
            <Card
              key={endpoint.path}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle
                    style={{
                      fontFamily: theme.typography.heading,
                      color: theme.colors.primary
                    }}
                  >
                    {endpoint.method} {endpoint.path}
                  </CardTitle>
                  <Badge
                    style={{
                      backgroundColor:
                        endpoint.method === 'GET' ? theme.colors.success :
                        endpoint.method === 'POST' ? theme.colors.primary :
                        endpoint.method === 'PUT' ? theme.colors.warning :
                        theme.colors.danger,
                      color: 'white'
                    }}
                  >
                    {endpoint.method}
                  </Badge>
                </div>
                <p style={{ color: theme.colors.muted }}>
                  {endpoint.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4
                    style={{
                      fontFamily: theme.typography.heading,
                      color: theme.colors.primary,
                      marginBottom: '0.5rem'
                    }}
                  >
                    Parameters
                  </h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param) => (
                      <div
                        key={param.name}
                        className="flex justify-between items-center p-2 rounded"
                        style={{
                          backgroundColor: theme.colors.background
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 'bold' }}>{param.name}</span>
                          <span style={{ color: theme.colors.muted, marginLeft: '0.5rem' }}>
                            {param.type}
                          </span>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: param.required ? theme.colors.warning : theme.colors.muted,
                            color: param.required ? 'white' : theme.colors.primary
                          }}
                        >
                          {param.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: theme.typography.heading,
                      color: theme.colors.primary,
                      marginBottom: '0.5rem'
                    }}
                  >
                    Response
                  </h4>
                  <pre
                    style={{
                      backgroundColor: theme.colors.background,
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      overflow: 'auto'
                    }}
                  >
                    {JSON.stringify(endpoint.responseSchema, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIAssistantInterface apiSpec={apiSpec} theme={theme} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

````

## 🤖 AI Router & Tool Selection with Complete Skills

### **Intelligent Tool Selection with All Skills**
```markdown
# AI Router with Complete Skill Integration
You are enhancing the MCP Gateway AI router with complete skill integration for intelligent tool selection and professional interfaces.

COMPLETE AI ROUTER STACK:
- @[/ai-sdk]: Advanced agent systems and tool selection
- @[/api-design-principles]: Router API design excellence
- @[/systematic-debugging]: Systematic router troubleshooting
- @[/skill-creator]: Custom tool development frameworks
- @[/theme-factory]: Professional router interface themes
- @[/frontend-design]: Distinctive AI interaction patterns
- @[/shadcn-ui]: Production-ready AI components
- @[/ui-ux-pro-max]: Accessibility and UX excellence
- @[/brainstorming]: Creative tool selection strategies
- @[/vercel-composition-patterns]: Maintainable agent architecture
- @[/vercel-react-best-practices]: Performance optimization

AI ROUTER ENHANCEMENT WORKFLOW:
1. Create intelligent agents with @[/ai-sdk]
2. Design router APIs with @[/api-design-principles]
3. Apply professional themes with @[/theme-factory]
4. Build AI interfaces with @[/shadcn-ui] and @[/frontend-design]
5. Implement systematic debugging with @[/systematic-debugging]
6. Ensure accessibility with @[/ui-ux-pro-max]
7. Apply composition patterns with @[/vercel-composition-patterns]
8. Optimize performance with @[/vercel-react-best-practices]

ULTIMATE AI ROUTER SYSTEM:
```python
from ai_sdk import ToolLoopAgent, generateText, tool
from theme_factory import apply_professional_theme
from systematic_debugging import ai_system_debugging
from brainstorming import creative_tool_selection
from vercel_composition_patterns import compound_agent_design

class UltimateAIRouter(ToolLoopAgent):
    """Complete AI router with all skill integration"""

    def __init__(self):
        super().__init__(
            name="ultimate_ai_router",
            description="Advanced AI router with complete skill integration",
            system="""You are an expert AI router with access to all available skills.
                   Use creative brainstorming, systematic debugging, professional design principles,
                   and advanced AI capabilities to provide optimal tool selection and user experiences.""",
            tools=[
                self.intelligent_tool_selection,
                self.create_ai_interface,
                self.apply_professional_theme,
                self.debug_ai_system,
                self.optimize_performance,
                self.generate_creative_solutions
            ]
        )

    @tool
    async def intelligent_tool_selection(self, query: str, context: dict, user_preferences: dict):
        """Select optimal tools using all available skills"""
        # Apply brainstorming for creative approaches
        creative_approaches = await self.apply_brainstorming(query, context)

        # Use systematic analysis for tool matching
        tool_analysis = await self.analyze_tool_requirements(query, context)

        # Apply user preferences and context
        personalized_selection = await self.personalize_selection(
            tool_analysis,
            user_preferences,
            context
        )

        return {
            "selected_tools": personalized_selection.tools,
            "confidence": personalized_selection.confidence,
            "creative_approaches": creative_approaches,
            "reasoning": personalized_selection.reasoning,
            "alternatives": personalized_selection.alternatives
        }

    @tool
    async def create_ai_interface(self, interface_type: str, features: list, theme: str = "Tech Innovation"):
        """Create AI-powered interface with complete skill integration"""
        # Apply professional theme
        interface_theme = apply_professional_theme(theme, interface_type)

        # Generate components with shadcn-ui
        interface_components = await self.generate_ai_components(
            interface_type,
            features,
            interface_theme
        )

        # Apply frontend design principles
        designed_interface = await self.apply_frontend_design(
            interface_components,
            interface_theme
        )

        # Ensure accessibility
        accessible_interface = await self.ensure_accessibility(designed_interface)

        return {
            "interface": accessible_interface,
            "theme": interface_theme,
            "components": interface_components,
            "accessibility_compliance": accessible_interface.compliance,
            "responsive_design": accessible_interface.responsive
        }

    @tool
    async def debug_ai_system(self, component: str, issue_description: str):
        """Apply systematic debugging to AI system issues"""
        debugging_process = await self.apply_systematic_debugging(
            "ai_system",
            issue_description,
            component
        )

        return {
            "root_cause": debugging_process.root_cause,
            "solution": debugging_process.solution,
            "prevention": debugging_process.prevention,
            "monitoring": debugging_process.monitoring,
            "performance_impact": debugging_process.performance_impact
        }

# Theme-driven AI interface
class ThemedAIInterface:
    """Professional AI interface with theme factory integration"""

    def __init__(self, theme_name: str = "Tech Innovation"):
        self.theme = apply_professional_theme(theme_name, "ai_interface")
        self.design_principles = FrontendDesignPrinciples()
        self.component_library = ShadcnUIComponents()

    async def create_chat_interface(self, features: ChatFeatures):
        """Create professional chat interface with all skills"""

        # Apply theme and design
        themed_components = await self.apply_theme_and_design(features)

        # Generate React components with composition patterns
        react_components = await self.generate_react_components(themed_components)

        # Ensure accessibility
        accessible_components = await self.ensure_wcag_aaa(react_components)

        return {
            "components": accessible_components,
            "theme": self.theme,
            "features": features,
            "performance": await self.optimize_performance(accessible_components)
        }
````

PROFESSIONAL AI INTERFACE COMPONENTS:

```typescript
// AI chat interface with complete skill integration
"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface UltimateAIChatProps {
  theme: ProfessionalTheme
  features: ChatFeatures
  skills: Skill[]
}

export function UltimateAIChat({ theme, features, skills }: UltimateAIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
    body: {
      skills: skills.map(s => s.name),
      theme: theme.name,
      enhanced: true
    }
  })

  return (
    <div
      className="w-full max-w-4xl mx-auto p-6"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.body
      }}
    >
      <Card
        className="backdrop-blur-sm border border-opacity-20"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          backgroundImage: theme.gradients.subtle
        }}
      >
        <CardHeader style={{ borderBottom: `1px solid ${theme.colors.border}/20` }}>
          <div className="flex items-center justify-between">
            <CardTitle
              style={{
                fontFamily: theme.typography.heading,
                color: theme.colors.primary
              }}
            >
              AI Assistant
            </CardTitle>
            <div className="flex gap-2">
              {skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill.name}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border
              }}
            >
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <div
                className={cn(
                  "h-96 overflow-y-auto border rounded-lg p-4",
                  "scrollbar-thin scrollbar-thumb-" + theme.colors.primary
                )}
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-4 flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "inline-block p-3 rounded-lg max-w-[80%]",
                        message.role === 'user'
                          ? "bg-gradient-to-r from-" + theme.colors.primary + " to-" + theme.colors.secondary + " text-white"
                          : "bg-" + theme.colors.muted
                      )}
                      style={{
                        fontFamily: theme.typography.body,
                        boxShadow: theme.shadows.small,
                        borderRadius: '0.75rem'
                      }}
                    >
                      {message.content}
                      {message.toolInvocations && (
                        <div className="mt-2 text-xs opacity-75">
                          Tools used: {message.toolInvocations.map(t => t.toolName).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div
                      className="inline-block p-3 rounded-lg"
                      style={{
                        backgroundColor: theme.colors.muted,
                        fontFamily: theme.typography.body
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about MCP Gateway..."
                  className="flex-1"
                  style={{
                    fontFamily: theme.typography.body,
                    borderColor: theme.colors.border
                  }}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    fontFamily: theme.typography.body
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <Card
                    key={skill.name}
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border
                    }}
                  >
                    <CardContent className="p-4">
                      <h4
                        style={{
                          fontFamily: theme.typography.heading,
                          color: theme.colors.primary,
                          marginBottom: '0.5rem'
                        }}
                      >
                        {skill.name}
                      </h4>
                      <p
                        style={{
                          color: theme.colors.muted,
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }}
                      >
                        {skill.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

````

## 🔍 Systematic Debugging with Complete Skills

### **Advanced Debugging with AI Integration**
```markdown
# Systematic Debugging with Complete Skill Integration
You are implementing systematic debugging for the MCP Gateway with AI-powered analysis and professional interfaces.

COMPLETE DEBUGGING STACK:
- @[/systematic-debugging]: Four-phase debugging methodology
- @[/ai-sdk]: Intelligent debugging agents and analysis
- @[/api-design-principles]: Debugging API design
- @[/skill-creator]: Custom debugging tool development
- @[/theme-factory]: Professional debugging interface themes
- @[/frontend-design]: Distinctive debugging interface design
- @[/shadcn-ui]: Production-ready debugging components
- @[/ui-ux-pro-max]: Accessibility and UX excellence
- @[/brainstorming]: Creative problem-solving approaches
- @[/vercel-composition-patterns]: Maintainable debugging architecture

SYSTEMATIC DEBUGGING WORKFLOW:
1. Apply four-phase debugging with @[/systematic-debugging]
2. Create AI debugging agents with @[/ai-sdk]
3. Design debugging APIs with @[/api-design-principles]
4. Apply professional themes with @[/theme-factory]
5. Build debugging interfaces with @[/shadcn-ui]
6. Ensure accessibility with @[/ui-ux-pro-max]
7. Apply creative problem-solving with @[/brainstorming]

ULTIMATE DEBUGGING SYSTEM:
```python
from systematic_debugging import FourPhaseDebugging
from ai_sdk import ToolLoopAgent, tool
from theme_factory import apply_professional_theme
from brainstorming import creative_problem_solving

class UltimateDebuggingSystem(ToolLoopAgent):
    """Complete debugging system with all skill integration"""

    def __init__(self):
        super().__init__(
            name="ultimate_debugger",
            description="Advanced debugging system with complete skill integration",
            tools=[
                self.analyze_issue_systematically,
                self.apply_creative_solutions,
                self.create_debugging_interface,
                self.generate_debugging_report,
                self.prevent_future_issues
            ]
        )

    @tool
    async def analyze_issue_systematically(self, component: str, issue_description: str, context: dict):
        """Apply four-phase systematic debugging"""
        debugging_process = FourPhaseDebugging()

        # Phase 1: Issue Reproduction
        reproduction = await debugging_process.reproduce_issue(component, issue_description, context)

        # Phase 2: Root Cause Analysis
        root_cause = await debugging_process.analyze_root_cause(reproduction, context)

        # Phase 3: Solution Development
        solution = await debugging_process.develop_solution(root_cause, context)

        # Phase 4: Prevention Strategy
        prevention = await debugging_process.develop_prevention(solution, context)

        return {
            "reproduction": reproduction,
            "root_cause": root_cause,
            "solution": solution,
            "prevention": prevention,
            "confidence": debugging_process.calculate_confidence(),
            "estimated_effort": debugging_process.estimate_effort(solution)
        }

    @tool
    async def apply_creative_solutions(self, issue: dict, constraints: list):
        """Apply creative problem-solving to debugging"""
        creative_approaches = await self.apply_brainstorming(
            f"Solve: {issue.description} with constraints: {constraints}",
            "debugging_problem_solving"
        )

        # Evaluate creative solutions
        evaluated_solutions = await self.evaluate_solutions(creative_approaches, issue, constraints)

        return {
            "creative_approaches": creative_approaches,
            "evaluated_solutions": evaluated_solutions,
            "recommended_solution": evaluated_solutions[0] if evaluated_solutions else None,
            "alternative_solutions": evaluated_solutions[1:4]
        }

    @tool
    async def create_debugging_interface(self, debugging_session: dict, theme: str = "Tech Innovation"):
        """Create professional debugging interface"""
        # Apply professional theme
        interface_theme = apply_professional_theme(theme, "debugging_interface")

        # Generate debugging components
        debugging_components = await self.generate_debugging_components(
            debugging_session,
            interface_theme
        )

        # Apply frontend design principles
        designed_interface = await self.apply_frontend_design(
            debugging_components,
            interface_theme
        )

        return {
            "interface": designed_interface,
            "theme": interface_theme,
            "components": debugging_components,
            "accessibility": await self.ensure_accessibility(designed_interface)
        }

# Professional debugging interface
class DebuggingDashboard:
    """Theme-driven debugging dashboard with complete skill integration"""

    def __init__(self, theme_name: str = "Tech Innovation"):
        self.theme = apply_professional_theme(theme_name, "debugging_dashboard")
        self.debugging_system = UltimateDebuggingSystem()

    async def create_dashboard(self):
        """Create comprehensive debugging dashboard"""

        dashboard_components = {
            "issue_analysis": await self.create_issue_analysis_component(),
            "solution_tracker": await self.create_solution_tracker_component(),
            "prevention_monitor": await self.create_prevention_monitor_component(),
            "performance_metrics": await self.create_performance_metrics_component()
        }

        return {
            "components": dashboard_components,
            "theme": self.theme,
            "layout": await self.design_dashboard_layout(dashboard_components),
            "interactions": await self.define_dashboard_interactions(dashboard_components)
        }
````

This ultimate enhanced prompts system for MCP Gateway integrates all 13
available skills to create comprehensive, intelligent, and professionally themed
development experiences with AI-powered capabilities and systematic debugging
excellence.
