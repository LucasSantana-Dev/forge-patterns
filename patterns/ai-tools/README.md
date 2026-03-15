# AI Tools Patterns

AI-powered development tooling for the Forge Space ecosystem — code analysis, pattern recommendations, and optimization scoring.

## Contents

```
patterns/ai-tools/
├── code-analyzer.js    # AI-powered static code analyzer with scoring
└── README.md
```

## Code Analyzer

`code-analyzer.js` provides multi-dimensional code quality scoring with AI-assisted insights:

```js
const { AICodeAnalyzer } = require('./code-analyzer.js');

const analyzer = new AICodeAnalyzer({ enablePatternRecognition: true });
const report = await analyzer.analyzeFile('./src/api.ts');
// report.scores: { security, performance, quality, maintainability }
// report.recommendations: [...actionable suggestions]
// report.patterns: [...recognized patterns]
```

**Score categories:**
| Category | Checks |
|----------|--------|
| Security | SQL injection risks, hardcoded secrets, unsafe eval |
| Performance | N+1 queries, unoptimized loops, large payloads |
| Quality | Dead code, magic numbers, complexity |
| Maintainability | Function length, cyclomatic complexity, naming |

## Integration with forge-audit

The code analyzer feeds into the IDP migration assessor's `quality` category. High complexity or security risk scores affect the overall project grade.

## Related

- `patterns/idp/migration/collectors/quality-assessor.ts` — quality scoring for migration readiness
- `patterns/idp/migration/collectors/ai-governance-assessor.ts` — AI tooling governance checks
