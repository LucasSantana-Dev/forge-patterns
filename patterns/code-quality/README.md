# Code Quality Patterns

Shared ESLint and Prettier configurations that enforce consistent code style, security rules, and quality standards across all Forge Space repos.

## Contents

```
patterns/code-quality/
├── eslint/
│   ├── base.config.js    # ESLint flat config — baseline rules for TS/JS
│   └── base.config.json  # JSON version for non-module environments
├── prettier/
│   ├── base.config.js    # Prettier config (singleQuote, no trailing commas)
│   └── base.config.json  # JSON version
└── README.md
```

## ESLint Rules (Summary)

| Rule | Setting | Rationale |
|------|---------|-----------|
| `no-unused-vars` | error (args ignore `^_`) | Catch dead code |
| `@typescript-eslint/no-explicit-any` | warn | Push toward typed code |
| `no-magic-numbers` | warn (ignore: -1,0,1,2,100,1000) | Force named constants |
| `no-eval` / `no-implied-eval` | error | Security: prevent code injection |
| `eqeqeq` | error (always) | Prevent type coercion bugs |
| `comma-dangle` | error (never) | Consistent trailing comma style |
| `quotes` | error (single, avoidEscape) | Consistent string quoting |
| `prefer-destructuring` | error (objects) | Cleaner access patterns |
| `no-console` | warn | Use structured logger instead |

Test files (`.test.ts`, `.test.js`, `.spec.*`) have `no-magic-numbers: off` automatically.

## Usage

```js
// eslint.config.js
const base = require('@forgespace/core/code-quality/eslint/base.config.js');
module.exports = [
  ...base,
  { /* project-specific overrides */ }
];
```

## Prettier Rules

```json
{
  "singleQuote": true,
  "trailingComma": "none",
  "semi": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## Integration

Run via the standard scripts:
```bash
npm run lint        # eslint . --fix
npm run lint:check  # eslint . (no fix, for CI)
npm run format      # prettier --write .
npm run format:check # prettier --check . (for CI)
```
