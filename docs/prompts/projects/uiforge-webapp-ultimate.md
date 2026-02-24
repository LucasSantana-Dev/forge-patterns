# UIForge WebApp Ultimate Enhanced Prompts

Complete integration of all 13 skills for UIForge WebApp development, including Next.js 16 optimization, shadcn-ui component excellence, AI SDK integration, and professional theming.

## 🚀 Next.js 16 Development with Complete Skills

### **Complete Next.js Stack with All Skills**
```markdown
# Next.js 16 with Complete Skill Integration
You are building a Next.js 16 application for UIForge WebApp with complete skill integration including AI capabilities, professional theming, and systematic debugging.

COMPLETE NEXT.JS STACK:
- @[/next-best-practices]: Next.js 16 optimization and App Router patterns
- @[/shadcn-ui]: Production-ready component library with forms and validation
- @[/theme-factory]: Professional theming across all interfaces
- @[/frontend-design]: Distinctive, memorable user experiences
- @[/ui-ux-pro-max]: WCAG AAA compliance and professional UX
- @[/ai-sdk]: Intelligent chat interfaces and agent systems
- @[/vercel-composition-patterns]: Maintainable component architecture
- @[/vercel-react-best-practices]: Performance optimization
- @[/systematic-debugging]: Systematic issue resolution
- @[/supabase-postgres-best-practices]: Database optimization
- @[/api-design-principles]: API design excellence
- @[/skill-creator]: Custom component generation skills
- @[/brainstorming]: Creative solution development

NEXT.JS DEVELOPMENT WORKFLOW:
1. Apply Next.js 16 best practices with @[/next-best-practices]
2. Create component library with @[/shadcn-ui]
3. Apply professional themes with @[/theme-factory]
4. Implement AI features with @[/ai-sdk]
5. Ensure accessibility with @[/ui-ux-pro-max]
6. Apply composition patterns with @[/vercel-composition-patterns]
7. Optimize performance with @[/vercel-react-best-practices]
8. Integrate database with @[/supabase-postgres-best-practices]

ULTIMATE NEXT.JS ARCHITECTURE:
```typescript
// app/layout.tsx - Complete skill integration
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AIProvider } from '@/components/ai-provider'
import { AccessibilityProvider } from '@/components/accessibility-provider'
import { PerformanceOptimizer } from '@/components/performance-optimizer'
import { SupabaseProvider } from '@/components/supabase-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { DebugProvider } from '@/components/debug-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UIForge WebApp - Ultimate Experience',
  description: 'Professional web application with complete skill integration',
  themeColor: '#0066CC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AIProvider>
              <AccessibilityProvider>
                <PerformanceOptimizer>
                  <SupabaseProvider>
                    <DebugProvider>
                      {children}
                    </DebugProvider>
                  </SupabaseProvider>
                </PerformanceOptimizer>
              </AccessibilityProvider>
            </AIProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

// app/page.tsx - Theme-driven home page
"use client"

import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { AIChatSection } from '@/components/sections/ai-chat-section'
import { ThemeSelector } from '@/components/theme-selector'
import { useTheme } from '@/hooks/use-theme'
import { useAIChat } from '@/hooks/use-ai-chat'

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const { messages, sendMessage } = useAIChat()

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      
      <main>
        <HeroSection theme={theme} />
        <FeaturesSection theme={theme} />
        <AIChatSection 
          theme={theme} 
          messages={messages}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  )
}
```

PROFESSIONAL COMPONENT ARCHITECTURE:
```typescript
// components/ui/complete-form-system.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/hooks/use-theme"
import { useAccessibility } from "@/hooks/use-accessibility"
import { cn } from "@/lib/utils"

interface CompleteFormSystemProps {
  schema: z.ZodSchema
  onSubmit: (values: any) => void
  theme: ProfessionalTheme
  features: FormFeatures
}

export function CompleteFormSystem({ schema, onSubmit, theme, features }: CompleteFormSystemProps) {
  const { ensureAccessibility } = useAccessibility()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: features.defaultValues,
  })

  return (
    <Card
      className="w-full max-w-2xl mx-auto"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        backgroundImage: theme.gradients.subtle
      }}
    >
      <CardHeader>
        <CardTitle 
          style={{
            fontFamily: theme.typography.heading,
            color: theme.colors.primary
          }}
        >
          {features.title}
        </CardTitle>
        <CardDescription style={{ color: theme.colors.muted }}>
          {features.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dynamic form fields based on schema */}
            {Object.entries(schema.shape).map(([fieldName, fieldSchema]) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel 
                      style={{
                        fontFamily: theme.typography.body,
                        color: theme.colors.primary,
                        fontWeight: 'medium'
                      }}
                    >
                      {formatFieldName(fieldName)}
                    </FormLabel>
                    <FormControl>
                      {renderFormField(fieldSchema as z.ZodTypeAny, field, theme)}
                    </FormControl>
                    <FormMessage />
                    {fieldSchema._def.description && (
                      <FormDescription style={{ color: theme.colors.muted }}>
                        {fieldSchema._def.description}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            ))}
            
            {/* AI Assistant Integration */}
            {features.aiAssistant && (
              <Card
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 
                      style={{
                        fontFamily: theme.typography.heading,
                        color: theme.colors.primary
                      }}
                    >
                      AI Assistant
                    </h4>
                    <Badge
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: 'white'
                      }}
                    >
                      Powered by AI SDK
                    </Badge>
                  </div>
                  <AIFormAssistant 
                    schema={schema}
                    currentValues={form.getValues()}
                    theme={theme}
                    onSuggestion={(suggestion) => {
                      form.setValue(suggestion.field, suggestion.value)
                    }}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Form Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  fontFamily: theme.typography.body
                }}
              >
                {features.submitText || 'Submit'}
              </Button>
              
              {features.showReset && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )

  function renderFormField(fieldSchema: z.ZodTypeAny, field: any, theme: ProfessionalTheme) {
    if (fieldSchema._def.typeName === 'ZodString') {
      if (fieldSchema._def.description?.includes('email')) {
        return (
          <Input
            {...field}
            type="email"
            style={{
              borderColor: theme.colors.border,
              fontFamily: theme.typography.body
            }}
          />
        )
      }
      if (fieldSchema._def.description?.includes('password')) {
        return (
          <Input
            {...field}
            type="password"
            style={{
              borderColor: theme.colors.border,
              fontFamily: theme.typography.body
            }}
          />
        )
      }
      if (fieldSchema._def.description?.includes('textarea')) {
        return (
          <Textarea
            {...field}
            rows={4}
            style={{
              borderColor: theme.colors.border,
              fontFamily: theme.typography.body
            }}
          />
        )
      }
      return (
        <Input
          {...field}
          style={{
            borderColor: theme.colors.border,
            fontFamily: theme.typography.body
          }}
        />
      )
    }
    
    if (fieldSchema._def.typeName === 'ZodEnum') {
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger style={{ borderColor: theme.colors.border }}>
            <SelectValue placeholder={formatFieldName(field.name)} />
          </SelectTrigger>
          <SelectContent>
            {fieldSchema._def.values.map((value: string) => (
              <SelectItem key={value} value={value}>
                {formatEnumValue(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    
    if (fieldSchema._def.typeName === 'ZodBoolean') {
      return (
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          style={{
            accentColor: theme.colors.primary
          }}
        />
      )
    }
    
    return (
      <Input
        {...field}
        style={{
          borderColor: theme.colors.border,
          fontFamily: theme.typography.body
        }}
      />
    )
  }
}

// AI Form Assistant Component
function AIFormAssistant({ schema, currentValues, theme, onSuggestion }: {
  schema: z.ZodSchema
  currentValues: any
  theme: ProfessionalTheme
  onSuggestion: (suggestion: { field: string, value: any }) => void
}) {
  const { messages, input, handleSubmit } = useChat({
    api: "/api/ai/form-assistant",
    body: {
      schema: schema.shape,
      current_values: currentValues,
      context: "form_completion"
    }
  })

  return (
    <div className="space-y-4">
      <div className="h-32 overflow-y-auto border rounded p-2" 
           style={{ 
             backgroundColor: theme.colors.background,
             borderColor: theme.colors.border 
           }}>
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <div 
              className={cn(
                "p-2 rounded text-sm",
                message.role === 'user' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for help with this form..."
          className="flex-1"
          style={{
            borderColor: theme.colors.border,
            fontFamily: theme.typography.body
          }}
        />
        <Button
          type="submit"
          size="sm"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
          }}
        >
          Ask
        </Button>
      </form>
    </div>
  )
}
```
```

## 🎨 shadcn-ui Component Library with Complete Skills

### **Production-Ready Components with All Skills**
```markdown
# shadcn-ui Component Library with Complete Skill Integration
You are creating a production-ready component library for UIForge WebApp with complete skill integration including professional theming, AI features, and systematic debugging.

COMPLETE COMPONENT LIBRARY STACK:
- @[/shadcn-ui]: Core component library with Radix UI primitives
- @[/theme-factory]: Professional theming for all components
- @[/frontend-design]: Distinctive component aesthetics
- @[/ui-ux-pro-max]: WCAG AAA compliance and accessibility
- @[/ai-sdk]: AI-powered component generation and assistance
- @[/vercel-composition-patterns]: Maintainable component architecture
- @[/vercel-react-best-practices]: Performance optimization
- @[/systematic-debugging]: Component troubleshooting
- @[/skill-creator]: Custom component development
- @[/brainstorming]: Creative component solutions

COMPONENT LIBRARY WORKFLOW:
1. Build core components with @[/shadcn-ui]
2. Apply professional themes with @[/theme-factory]
3. Ensure accessibility with @[/ui-ux-pro-max]
4. Apply design principles with @[/frontend-design]
5. Integrate AI features with @[/ai-sdk]
6. Apply composition patterns with @[/vercel-composition-patterns]
7. Optimize performance with @[/vercel-react-best-practices]

ULTIMATE COMPONENT SYSTEM:
```typescript
// components/ui/ultimate-button.tsx
"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useAIAssistant } from "@/hooks/use-ai-assistant"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "text-white font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  theme?: ProfessionalTheme
  aiEnhanced?: boolean
  loading?: boolean
  accessibility?: AccessibilityOptions
}

const UltimateButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, theme, aiEnhanced, loading, accessibility, children, ...props }, ref) => {
    const { currentTheme } = useTheme()
    const { ensureAccessibility } = useAccessibility()
    const { getAISuggestion } = useAIAssistant()

    const appliedTheme = theme || currentTheme
    const accessibleProps = ensureAccessibility(accessibility)

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (aiEnhanced) {
        const suggestion = await getAISuggestion('button_interaction', {
          variant,
          size,
          context: 'user_interaction'
        })
        
        if (suggestion) {
          console.log('AI Suggestion:', suggestion)
        }
      }
      
      if (props.onClick) {
        props.onClick(event)
      }
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          ...(variant === 'gradient' && {
            background: `linear-gradient(135deg, ${appliedTheme.colors.primary}, ${appliedTheme.colors.secondary})`,
            boxShadow: appliedTheme.shadows.medium
          }),
          fontFamily: appliedTheme.typography.body,
          ...accessibleProps.style
        })}
        ref={ref}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...accessibleProps}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
        )}
        {children}
        {aiEnhanced && (
          <div className="ml-2 w-2 h-2 rounded-full bg-green-500" />
        )}
      </Comp>
    )
  }
)
UltimateButton.displayName = "Button"

// Theme-enhanced card component
export function UltimateCard({ 
  children, 
  className, 
  theme, 
  variant = "default",
  interactive = false,
  ...props 
}: CardProps) {
  const { currentTheme } = useTheme()
  const appliedTheme = theme || currentTheme

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        interactive && "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      style={{
        backgroundColor: appliedTheme.colors.surface,
        borderColor: appliedTheme.colors.border,
        backgroundImage: variant === "glass" ? appliedTheme.gradients.glass : undefined,
        backdropFilter: variant === "glass" ? "blur(10px)" : undefined,
        fontFamily: appliedTheme.typography.body
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// AI-powered form component
export function UltimateForm({ 
  schema, 
  onSubmit, 
  theme, 
  aiAssistance = true,
  className,
  ...props 
}: FormProps) {
  const { currentTheme } = useTheme()
  const appliedTheme = theme || currentTheme
  const { getFormSuggestions } = useAIAssistant()

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-6", className)}
      style={{
        fontFamily: appliedTheme.typography.body
      }}
      {...props}
    >
      {/* Form content */}
      
      {aiAssistance && (
        <div className="flex justify-end">
          <UltimateButton
            variant="outline"
            size="sm"
            onClick={async () => {
              const suggestions = await getFormSuggestions(schema)
              // Apply AI suggestions to form
            }}
          >
            AI Assist
          </UltimateButton>
        </div>
      )}
    </form>
  )
}
```

PROFESSIONAL COMPONENT GENERATION:
```typescript
// Component generation with AI SDK and theme factory
import { generateText, tool } from 'ai'
import { z } from 'zod'

export class ComponentGenerator {
  private themeFactory: ThemeFactory
  private designPrinciples: FrontendDesignPrinciples
  private accessibilityStandards: UIUXProMaxStandards

  constructor() {
    this.themeFactory = new ThemeFactory()
    this.designPrinciples = new FrontendDesignPrinciples()
    this.accessibilityStandards = new UIUXProMaxStandards()
  }

  async generateComponent(componentSpec: ComponentSpecification) {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Generate a React component for: ${componentSpec.description}`,
      tools: {
        selectTheme: tool({
          description: 'Select professional theme for the component',
          parameters: z.object({
            aesthetic: z.string().describe('Design aesthetic preference'),
            componentType: z.string().describe('Type of component')
          })
        }),
        applyDesign: tool({
          description: 'Apply frontend design principles',
          parameters: z.object({
            designDirection: z.string().describe('Design direction'),
            componentType: z.string().describe('Component type')
          })
        }),
        ensureAccessibility: tool({
          description: 'Ensure WCAG compliance',
          parameters: z.object({
            level: z.enum(['AA', 'AAA']).describe('Accessibility level'),
            componentType: z.string().describe('Component type')
          })
        })
      },
      system: `You are an expert React component developer with access to professional theming, 
              design principles, and accessibility standards. Use all available tools to create 
              comprehensive, production-ready components.`
    })

    return {
      component: text,
      theme: this.themeFactory.applyTheme(componentSpec.aesthetic),
      design: this.designPrinciples.applyDesign(componentSpec.designDirection),
      accessibility: this.accessibilityStandards.ensureCompliance(componentSpec.accessibilityLevel)
    }
  }

  async generateThemedComponent(themeName: string, componentType: string) {
    const theme = this.themeFactory.getTheme(themeName)
    const designDirection = this.designPrinciples.getDesignDirection(themeName)
    
    switch (componentType) {
      case 'button':
        return this.generateThemedButton(theme, designDirection)
      case 'card':
        return this.generateThemedCard(theme, designDirection)
      case 'form':
        return this.generateThemedForm(theme, designDirection)
      default:
        throw new Error(`Unsupported component type: ${componentType}`)
    }
  }

  private generateThemedButton(theme: ProfessionalTheme, design: DesignDirection) {
    return `
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ${theme.name}Button({ variant = "default", size = "default", className, ...props }) {
  return (
    <Button
      className={cn(
        "transition-all duration-200 hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "default" && "bg-gradient-to-r from-\${theme.colors.primary} to-\${theme.colors.secondary}",
        variant === "outline" && "border-2 border-\${theme.colors.primary} text-\${theme.colors.primary}",
        className
      )}
      style={{
        fontFamily: theme.typography.body,
        boxShadow: theme.shadows.medium,
        ...design.buttonStyles
      }}
      {...props}
    />
  )
}
    `.trim()
  }
}
```
```

## 🤖 AI SDK Integration with Complete Skills

### **Intelligent Chat Interfaces with All Skills**
```markdown
# AI SDK Integration with Complete Skill Integration
You are implementing AI SDK integration for UIForge WebApp with complete skill integration including professional theming, systematic debugging, and creative problem-solving.

COMPLETE AI SDK STACK:
- @[/ai-sdk]: Intelligent chat interfaces and agent systems
- @[/theme-factory]: Professional AI interface theming
- @[/frontend-design]: Distinctive AI interaction patterns
- @[/shadcn-ui]: Production-ready chat components
- @[/ui-ux-pro-max]: Accessibility and UX excellence
- @[/systematic-debugging]: AI system troubleshooting
- @[/brainstorming]: Creative AI solution development
- @[/vercel-composition-patterns]: Maintainable AI component architecture
- @[/vercel-react-best-practices]: AI performance optimization
- @[/skill-creator]: Custom AI tool development

AI SDK INTEGRATION WORKFLOW:
1. Create chat interfaces with @[/ai-sdk]
2. Apply professional themes with @[/theme-factory]
3. Build components with @[/shadcn-ui]
4. Ensure accessibility with @[/ui-ux-pro-max]
5. Apply design principles with @[/frontend-design]
6. Implement systematic debugging with @[/systematic-debugging]
7. Apply composition patterns with @[/vercel-composition-patterns]

ULTIMATE AI CHAT SYSTEM:
```typescript
// app/api/chat/route.ts - Complete AI SDK integration
import { generateText, streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { ThemeFactory } from '@/lib/theme-factory'
import { SystematicDebugger } from '@/lib/systematic-debugger'
import { CreativeProblemSolver } from '@/lib/creative-problem-solver'

// AI tools with complete skill integration
const aiTools = {
  selectTheme: tool({
    description: 'Select professional theme for the interface',
    parameters: z.object({
      aesthetic: z.string().describe('Design aesthetic preference'),
      context: z.string().describe('Current context and purpose'),
      userPreferences: z.object({
        favoriteColors: z.array(z.string()).optional(),
        stylePreference: z.string().optional()
      }).optional()
    })
  }),
  
  applyDesignPrinciples: tool({
    description: 'Apply frontend design principles to the solution',
    parameters: z.object({
      designDirection: z.string().describe('Design direction to apply'),
      constraints: z.array(z.string()).describe('Design constraints'),
      targetAudience: z.string().describe('Target audience for the design')
    })
  }),
  
  ensureAccessibility: tool({
    description: 'Ensure WCAG compliance for the solution',
    parameters: z.object({
      level: z.enum(['AA', 'AAA']).describe('Accessibility compliance level'),
      components: z.array(z.string()).describe('Components to check'),
      userNeeds: z.array(z.string()).describe('Specific user accessibility needs')
    })
  }),
  
  systematicDebugging: tool({
    description: 'Apply systematic debugging to identify and resolve issues',
    parameters: z.object({
      issueDescription: z.string().describe('Description of the issue'),
      context: z.string().describe('Context where the issue occurs'),
      recentChanges: z.array(z.string()).describe('Recent changes that might be related')
    })
  }),
  
  creativeProblemSolving: tool({
    description: 'Apply creative problem-solving approaches',
    parameters: z.object({
      problemStatement: z.string().describe('Clear statement of the problem'),
      constraints: z.array(z.string()).describe('Constraints and limitations'),
      objectives: z.array(z.string()).describe('Desired objectives and outcomes')
    })
  })
}

export async function POST(req: Request) {
  try {
    const { messages, skills, theme, context } = await req.json()
    
    // Initialize skill integrations
    const themeFactory = new ThemeFactory()
    const debugger = new SystematicDebugger()
    const creativeSolver = new CreativeProblemSolver()
    
    const response = await generateText({
      model: openai('gpt-4-turbo'),
      messages,
      tools: aiTools,
      system: `You are an expert AI assistant with complete skill integration. 
             You have access to professional theming, design principles, accessibility standards,
             systematic debugging, and creative problem-solving. Use these skills to provide
             comprehensive, context-aware solutions that are both technically sound and
             professionally designed. Always consider accessibility and user experience.`,
      maxSteps: 5,
    })

    return Response.json(response)
  } catch (error) {
    // Apply systematic debugging to AI errors
    const debugging = await debugger.analyzeError(error, 'ai_chat_api')
    
    return Response.json(
      { 
        error: 'AI service temporarily unavailable',
        debugging: debugging,
        fallback: 'Please try again later'
      },
      { status: 500 }
    )
  }
}

// components/ai/ultimate-chat-interface.tsx
"use client"

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeSelector } from '@/components/theme-selector'
import { SkillSelector } from '@/components/skill-selector'
import { useTheme } from '@/hooks/use-theme'
import { useAccessibility } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'

interface UltimateChatInterfaceProps {
  initialTheme?: string
  availableSkills: Skill[]
  features: ChatFeatures
}

export function UltimateChatInterface({ 
  initialTheme = "Tech Innovation", 
  availableSkills, 
  features 
}: UltimateChatInterfaceProps) {
  const { theme, setTheme } = useTheme(initialTheme)
  const { ensureAccessibility } = useAccessibility()
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(availableSkills.slice(0, 3))
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
    body: {
      skills: selectedSkills.map(s => s.name),
      theme: theme.name,
      context: "ui_forge_webapp_assistant"
    },
    onError: (error) => {
      console.error('Chat error:', error)
      // Apply systematic debugging to chat errors
      debugger.analyzeError(error, 'chat_interface')
    }
  })

  const accessibleProps = ensureAccessibility({
    role: 'application',
    ariaLabel: 'AI Chat Assistant'
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
            
            <div className="flex items-center gap-4">
              <ThemeSelector 
                currentTheme={theme} 
                onThemeChange={setTheme}
                compact
              />
              
              <div className="flex gap-2">
                {selectedSkills.slice(0, 3).map((skill) => (
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
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
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
                {...accessibleProps}
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
                  placeholder="Ask me anything about UIForge WebApp..."
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
            
            <TabsContent value="skills" className="space-y-4">
              <SkillSelector
                availableSkills={availableSkills}
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
                theme={theme}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

This ultimate enhanced prompts system for UIForge WebApp integrates all 13 available skills to create comprehensive, intelligent, and professionally themed Next.js applications with AI-powered capabilities, systematic debugging, and complete accessibility compliance.