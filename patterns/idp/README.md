# IDP — Internal Developer Platform Patterns

A comprehensive pattern library for building Internal Developer Platforms with AI governance, migration tooling, project scorecards, policy enforcement, and feature toggle management.

## Directory Structure

```
patterns/idp/
├── __tests__/             # All unit and property-based tests (279 tests)
├── feature-toggles/       # File-based feature flag store + CLI
├── init/                  # Project scaffolding (project.ts, templates.ts, CLI)
├── migration/             # Legacy project assessment + migration tooling
│   ├── collectors/        # 6 assessment collectors (dependency, architecture,
│   │                      #   security, quality, readiness, ai-governance)
│   ├── assessor.ts        # Top-level assessProject() orchestrator
│   ├── cli.ts             # forge-migrate CLI entry point
│   └── types.ts           # Shared types (AssessmentReport, Severity, Grade…)
├── policy-engine/         # Rule-based policy evaluation engine
│   ├── builtin-functions.ts  # evaluateCondition, resolveFieldPath (8 operators)
│   ├── evaluator.ts       # PolicyEvaluator class
│   ├── loader.ts          # loadPolicyFromFile / loadPoliciesFromDir
│   ├── schema.ts          # Types: Policy, PolicyRule, Condition, Action…
│   └── cli.ts             # forge-policy CLI entry point
├── scorecards/            # Project health scorecards
│   ├── collectors/        # 5 collectors: Security, Quality, Performance,
│   │                      #   Compliance, Dependency
│   ├── aggregator.ts      # ScorecardAggregator (weighted scoring)
│   ├── post-gen-scorer.ts # Post-generation code quality scoring
│   └── index.ts           # Barrel exports
├── security-spoke/        # Security spoke v1 contract artifacts
│   ├── types.ts           # SecuritySpokeReportV1, findings, severities…
│   └── index.ts           # Constants + helper functions
└── index.ts               # Public API barrel (re-exports all modules)
```

## Modules

### Policy Engine

Rule-based policy evaluation over arbitrary JSON contexts. Policies are JSON files with conditions (field path + operator + value) and actions (block/warn/log/notify).

```ts
import { PolicyEvaluator, loadPolicyFromFile } from '@forgespace/core/idp';

const evaluator = new PolicyEvaluator();
evaluator.addPolicy(loadPolicyFromFile('./policies/security.policy.json'));

const result = evaluator.evaluate({ coverage: 72, has_secrets: true });
// result.shouldBlock → true if any 'block' action triggered
// result.violations  → array of PolicyViolation with ruleId, action, context
// result.warnings    → 'warn' and 'notify' actions
// result.logs        → 'log' actions
```

**Operators:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `contains`, `matches` (regex, max 200 chars)

**Security:** field path resolution blocks `__proto__`, `constructor`, `prototype` and enforces max depth of 10.

Policy JSON shape:
```json
{
  "id": "security-baseline",
  "name": "Security Baseline",
  "version": "1.0.0",
  "rules": [{
    "id": "no-secrets",
    "name": "Block hardcoded secrets",
    "enabled": true,
    "conditions": [{ "field": "has_secrets", "operator": "eq", "value": true }],
    "actions": [{ "type": "block", "message": "Secrets detected in scan" }]
  }]
}
```

Built-in policy files: `patterns/idp/policies/` (compliance, quality, security).

### Project Scorecards

Pluggable collector system for continuous project health measurement. Each collector runs async checks and returns a score 0-100 with violations.

```ts
import { ScorecardAggregator, SecurityCollector, QualityCollector } from '@forgespace/core/idp';

const aggregator = new ScorecardAggregator([
  new SecurityCollector(),
  new QualityCollector(),
]);
const scorecard = await aggregator.aggregate(context, { security: 0.5, quality: 0.5 });
// scorecard.overallScore, .grade (A-F), .recommendations, .categories
```

**Collectors:**
| Collector | Measures |
|-----------|----------|
| `SecurityCollector` | Vulnerability score, secret exposure, auth checks |
| `QualityCollector` | Test coverage, linting, type safety |
| `PerformanceCollector` | Response time, cache hit rate, error rate |
| `ComplianceCollector` | License compliance, GDPR, audit logging |
| `DependencyCollector` | Dependency freshness, known CVEs |

### Migration Assessor

Assesses an existing project for migration readiness to the Forge Space ecosystem. Produces an `AssessmentReport` with 6 graded categories and a recommended migration strategy.

```ts
import { assessProject } from '@forgespace/core/idp';

const report = assessProject({ dir: '/path/to/project' });
// report.grade           → 'A' | 'B' | 'C' | 'D' | 'F'
// report.readiness       → 'ready' | 'needs-work' | 'high-risk'
// report.strategy        → 'strangler-fig' | 'branch-by-abstraction' | …
// report.categories      → 6 CategoryScore items with findings
// report.findings        → all findings sorted by severity
```

**Assessment Categories:**
| Category | What it checks |
|----------|----------------|
| `dependencies` | Package freshness, lockfile presence, legacy deps |
| `architecture` | File size, coupling, code sprawl |
| `security` | `.env` in `.gitignore`, hardcoded secrets, missing auth |
| `quality` | Test framework, type-checking, linting, empty catches |
| `migration-readiness` | Stack compatibility, test coverage, CI presence |
| `ai-governance` | AI coding rules, skills directory, hooks, SECURITY.md, CI scanning |

**CLI:** `forge-migrate assess [dir]` — pretty-prints the assessment report.

### Feature Toggles

File-based feature flag store with namespace support and CLI management.

```ts
import { FileToggleStore } from '@forgespace/core/idp';

const store = new FileToggleStore('.forge/toggles.json');
await store.set({ name: 'new-dashboard', namespace: 'global', enabled: true });
const flags = await store.list({ namespace: 'global' });
```

**CLI:** `forge-features create|enable|disable|list|remove [--dry-run]`

### Security Spoke

Typed contract artifacts for security spoke v1 reports. Provides types for findings, scanners, DAST results, and report aggregation.

```ts
import {
  SECURITY_SPOKE_SEVERITIES,
  SECURITY_SPOKE_CATEGORIES,
  type SecuritySpokeReportV1
} from '@forgespace/core/idp';
```

### Project Init

Scaffolds a new project with scorecard config, feature toggle seeds, and CI workflows.

```ts
import { initProject } from '@forgespace/core/idp';

initProject({ dir: '.', template: 'nextjs', force: false, dryRun: false });
// Creates: .forge/scorecard.json, .forge/toggles.json, .github/workflows/scorecard.yml
```

**Templates:** `react`, `nextjs`, `node` (adds template-specific policies and scorecard weights)

**CLI:** `forge-idp init [dir] [--template react|nextjs|node] [--force] [--dry-run]`

## Testing

```bash
# Run all IDP tests
npx jest patterns/idp --verbose

# Run specific module
npx jest patterns/idp/__tests__/policy-engine.test.ts
npx jest patterns/idp/__tests__/scorecard.test.ts
npx jest patterns/idp/__tests__/migration-assessor.test.ts
```

**Test count:** 279 tests across 14 test files, including property-based tests via `fast-check`.

## Business Rules

- **BR-001 Zero Secrets:** Policy files must not contain hardcoded credentials — use `{{PLACEHOLDER}}` format
- **BR-002 Pattern Versioning:** Policy schemas are versioned (v1)
- Policies use `eq`/`ne`/`gt`/`gte`/`lt`/`lte` for numeric scoring gates, `contains`/`matches` for string/regex checks
- Field paths protect against prototype pollution and depth attacks
- All CLI commands support `--dry-run` for safe previewing

## Integration

The IDP patterns integrate with the broader Forge Space ecosystem:

- **mcp-gateway:** Policy engine gates used in routing decisions
- **CI workflows:** Scorecard aggregator runs on PRs, posts results as comments
- **forge-audit:** AI governance assessor feeds into `forge-audit` report categories
