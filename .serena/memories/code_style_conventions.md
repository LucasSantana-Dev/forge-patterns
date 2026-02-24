# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES2022
- **Module**: NodeNext with NodeNext resolution
- **Strict Mode**: Enabled with all strict options
- **Imports**: ES modules with esModuleInterop
- **Paths**: @/* for src, @patterns/* for patterns, @docs/* for docs

## ESLint Rules
- **Base**: ESLint recommended + TypeScript ESLint + Prettier
- **Style**: Single quotes, semicolons, 100 char line width
- **Variables**: No unused vars, underscore prefix for ignored
- **Functions**: Arrow callbacks preferred, destructuring encouraged
- **Security**: No eval, no implied eval, no new Function
- **Equality**: Strict equality (===) required

## Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## Naming Conventions
- **Files**: kebab-case for files, PascalCase for classes
- **Variables**: camelCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE for exports
- **Types**: PascalCase for interfaces/types
- **Functions**: camelCase, verb-noun for actions
- **Patterns**: kebab-case directories

## Documentation Standards
- **JSDoc**: Comprehensive for all public APIs
- **Comments**: Explain why, not what
- **README**: Required for all patterns with specific sections
- **Examples**: Working code snippets in documentation

## Code Organization
- **Exports**: Named exports preferred, default for main class
- **Imports**: Grouped by type (node, external, internal)
- **Structure**: Constants → Types → Functions → Classes → Exports
- **Dependencies**: Minimal, explicit, purposeful

## Error Handling
- **Throw**: Error objects with descriptive messages
- **Catch**: Specific error types when possible
- **Returns**: Consistent error/response patterns
- **Validation**: Input validation at boundaries

## Security Guidelines
- **Secrets**: Never hardcoded, use {{PLACEHOLDER}} format
- **Validation**: Input sanitization and type checking
- **Dependencies**: Regular security audits
- **Exposure**: Minimal external API surface