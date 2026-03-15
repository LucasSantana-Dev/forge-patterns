# Java Patterns

Spring Boot project templates and Java integration patterns for the Forge Space ecosystem. Used when enterprise clients require JVM-based services that integrate with the MCP gateway.

## Contents

```
patterns/java/
├── project-templates/
│   └── spring-boot-web/    # Spring Boot REST API template
│       ├── src/             # Application source with health endpoint
│       └── target/          # Compiled classes (build output)
└── README.md
```

## Spring Boot Web Template

A production-ready Spring Boot REST API skeleton with:
- Health check endpoint (`GET /health`)
- Global exception handler with structured error responses
- Application configuration via `application.yml`

```bash
cp -r patterns/java/project-templates/spring-boot-web/ my-service/
cd my-service && mvn spring-boot:run
```

## Migration Strategy

Per the IDP migration assessor, Java projects are detected as `parallel-run` migration candidates — the Java service runs alongside the Forge Space ecosystem during transition, with traffic gradually shifted.

```ts
import { detectStrategy } from '@forgespace/core';
const strategy = detectStrategy({ dir: '.', language: 'java' });
// strategy === 'parallel-run'
```

## Security

All Java templates follow BR-001 (Zero Secrets):
- No hardcoded credentials — use environment variables or Spring Vault
- `application.yml` contains no secrets; sensitive fields use `${ENV_VAR}` references

## Notes

- `target/` contains pre-compiled reference classes — exclude from real project commits
- Java version: 21+ (LTS) recommended; build tool: Maven
