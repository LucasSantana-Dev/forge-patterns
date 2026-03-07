export interface PostGenCheck {
  name: string;
  passed: boolean;
  message: string;
  weight: number;
}

export interface PostGenScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: PostGenCheck[];
  passed: boolean;
  timestamp: string;
}

export interface PostGenOptions {
  framework?: 'react' | 'vue' | 'svelte' | 'angular' | 'html';
  typescript?: boolean;
  minScore?: number;
}

const ANTI_PATTERNS = [
  { pattern: /console\.(log|debug|info)\(/g, name: 'no-console', msg: 'Remove console statements' },
  { pattern: /\/\/\s*TODO/gi, name: 'no-todo', msg: 'Resolve TODO comments before shipping' },
  { pattern: /\/\/\s*FIXME/gi, name: 'no-fixme', msg: 'Resolve FIXME comments before shipping' },
  {
    pattern: /style\s*=\s*\{\{/g,
    name: 'no-inline-styles',
    msg: 'Avoid inline styles, use CSS classes'
  },
  { pattern: /!important/g, name: 'no-important', msg: 'Avoid !important in CSS' }
];

const REACT_CHECKS = [
  {
    pattern: /onClick\s*=\s*\{[^}]*\}/,
    positive: true,
    name: 'event-handlers',
    msg: 'Uses proper event handlers'
  },
  {
    pattern: /aria-|role=/,
    positive: true,
    name: 'accessibility',
    msg: 'Includes accessibility attributes'
  },
  { pattern: /key\s*=\s*\{/, positive: true, name: 'list-keys', msg: 'Uses key prop in lists' },
  {
    pattern: /dangerouslySet/,
    positive: false,
    name: 'no-unsafe-html',
    msg: 'Avoid unsafe HTML injection'
  }
];

function gradeFromScore(score: number): PostGenScore['grade'] {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function checkAntiPatterns(code: string): PostGenCheck[] {
  return ANTI_PATTERNS.map(({ pattern, name, msg }) => {
    const matches = code.match(pattern);
    return {
      name,
      passed: !matches,
      message: matches ? `${msg} (${matches.length} found)` : msg,
      weight: 10
    };
  });
}

function checkStructure(code: string): PostGenCheck[] {
  const checks: PostGenCheck[] = [];
  const lines = code.split('\n');

  const hasExport = /export\s+(default\s+)?(function|class|const|interface|type)\b/.test(code);
  checks.push({
    name: 'has-export',
    passed: hasExport,
    message: hasExport ? 'Has proper exports' : 'Missing exports',
    weight: 15
  });

  const maxLineLength = Math.max(...lines.map(l => l.length));
  const longLines = maxLineLength <= 100;
  checks.push({
    name: 'line-length',
    passed: longLines,
    message: longLines ? 'Lines within 100 chars' : `Longest line: ${maxLineLength} chars`,
    weight: 5
  });

  const totalLines = lines.length;
  const reasonable = totalLines > 0 && totalLines <= 500;
  checks.push({
    name: 'file-length',
    passed: reasonable,
    message: reasonable ? `${totalLines} lines` : `${totalLines} lines (consider splitting)`,
    weight: 5
  });

  const hasErrorHandling = /try\s*\{|\.catch\(|catch\s*\(/.test(code);
  checks.push({
    name: 'error-handling',
    passed: hasErrorHandling,
    message: hasErrorHandling ? 'Has error handling' : 'Consider adding error handling',
    weight: 10
  });

  return checks;
}

function checkTypeScript(code: string): PostGenCheck[] {
  const checks: PostGenCheck[] = [];

  const hasTypes =
    /:\s*(string|number|boolean|Record|Array|Promise|void)\b/.test(code) ||
    /interface\s+\w+/.test(code) ||
    /type\s+\w+\s*=/.test(code);
  checks.push({
    name: 'type-annotations',
    passed: hasTypes,
    message: hasTypes ? 'Uses TypeScript types' : 'Missing type annotations',
    weight: 15
  });

  const hasAny = /:\s*any\b/.test(code);
  checks.push({
    name: 'no-any',
    passed: !hasAny,
    message: hasAny ? 'Avoid using `any` type' : 'No `any` types',
    weight: 10
  });

  return checks;
}

function checkFramework(code: string, framework: string): PostGenCheck[] {
  if (framework !== 'react') return [];

  return REACT_CHECKS.map(({ pattern, positive, name, msg }) => {
    const found = pattern.test(code);
    return {
      name,
      passed: positive ? found : !found,
      message: msg,
      weight: 10
    };
  });
}

export function scoreGeneratedCode(code: string, opts?: PostGenOptions): PostGenScore {
  const checks: PostGenCheck[] = [
    ...checkAntiPatterns(code),
    ...checkStructure(code),
    ...(opts?.typescript !== false ? checkTypeScript(code) : []),
    ...(opts?.framework ? checkFramework(code, opts.framework) : [])
  ];

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const minScore = opts?.minScore ?? 60;

  return {
    score,
    grade: gradeFromScore(score),
    checks,
    passed: score >= minScore,
    timestamp: new Date().toISOString()
  };
}
