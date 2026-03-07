export const TEMPLATE_NAMES = ['react', 'nextjs', 'node'] as const;
export type TemplateName = (typeof TEMPLATE_NAMES)[number];

interface TemplateRule {
  id: string;
  name: string;
  description: string;
  conditions: Array<{ field: string; operator: string; value: unknown }>;
  actions: Array<{ type: string; message: string }>;
  enabled: boolean;
}

interface TemplateConfig {
  policies: Record<string, TemplateRule[]>;
  scorecardWeights: Record<string, number>;
  ciTriggers: string[];
}

const REACT_RULES: TemplateRule[] = [
  {
    id: 'react-001',
    name: 'Accessibility required',
    description: 'Warn if components lack ARIA attributes or alt text',
    conditions: [
      { field: 'quality.a11y_passed', operator: 'eq', value: false }
    ],
    actions: [
      { type: 'warn', message: 'Components must pass accessibility checks' }
    ],
    enabled: true
  },
  {
    id: 'react-002',
    name: 'Component test coverage',
    description: 'Block if React component test coverage is below 70%',
    conditions: [
      {
        field: 'quality.component_coverage_percent',
        operator: 'lt',
        value: 70
      }
    ],
    actions: [
      { type: 'block', message: 'Component test coverage below 70%' }
    ],
    enabled: true
  }
];

const NEXTJS_RULES: TemplateRule[] = [
  ...REACT_RULES.map((r) => ({
    ...r,
    id: r.id.replace('react-', 'next-')
  })),
  {
    id: 'next-003',
    name: 'Bundle size limit',
    description: 'Warn if JS bundle exceeds 300 KB gzipped',
    conditions: [
      { field: 'performance.bundle_size_kb', operator: 'gt', value: 300 }
    ],
    actions: [
      { type: 'warn', message: 'JS bundle exceeds 300 KB gzipped' }
    ],
    enabled: true
  },
  {
    id: 'next-004',
    name: 'Server component hygiene',
    description:
      'Warn if client components exceed 40% of total components',
    conditions: [
      {
        field: 'quality.client_component_ratio',
        operator: 'gt',
        value: 0.4
      }
    ],
    actions: [
      {
        type: 'warn',
        message: 'Client component ratio exceeds 40% threshold'
      }
    ],
    enabled: true
  }
];

const NODE_RULES: TemplateRule[] = [
  {
    id: 'node-001',
    name: 'Dependency audit',
    description: 'Block if npm audit finds high/critical vulnerabilities',
    conditions: [
      {
        field: 'security.audit_high_vulns',
        operator: 'gt',
        value: 0
      }
    ],
    actions: [
      {
        type: 'block',
        message: 'High/critical vulnerabilities found in dependencies'
      }
    ],
    enabled: true
  },
  {
    id: 'node-002',
    name: 'No unused dependencies',
    description: 'Warn if unused dependencies are detected',
    conditions: [
      {
        field: 'quality.unused_deps_count',
        operator: 'gt',
        value: 0
      }
    ],
    actions: [
      { type: 'warn', message: 'Unused dependencies detected' }
    ],
    enabled: true
  },
  {
    id: 'node-003',
    name: 'API input validation',
    description: 'Block if API endpoints lack input validation',
    conditions: [
      {
        field: 'security.unvalidated_endpoints',
        operator: 'gt',
        value: 0
      }
    ],
    actions: [
      {
        type: 'block',
        message: 'API endpoints must validate input'
      }
    ],
    enabled: true
  }
];

const TEMPLATES: Record<TemplateName, TemplateConfig> = {
  react: {
    policies: { react: REACT_RULES },
    scorecardWeights: {
      security: 25,
      quality: 30,
      performance: 20,
      compliance: 25
    },
    ciTriggers: ['src/**/*.tsx', 'src/**/*.jsx']
  },
  nextjs: {
    policies: { nextjs: NEXTJS_RULES },
    scorecardWeights: {
      security: 25,
      quality: 25,
      performance: 30,
      compliance: 20
    },
    ciTriggers: [
      'app/**/*.tsx',
      'src/**/*.tsx',
      'next.config.*'
    ]
  },
  node: {
    policies: { node: NODE_RULES },
    scorecardWeights: {
      security: 35,
      quality: 30,
      performance: 15,
      compliance: 20
    },
    ciTriggers: ['src/**/*.ts', 'package.json']
  }
};

export function getTemplate(
  name: TemplateName
): TemplateConfig {
  return TEMPLATES[name];
}

export function isValidTemplate(
  name: string
): name is TemplateName {
  return TEMPLATE_NAMES.includes(name as TemplateName);
}
