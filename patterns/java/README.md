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
# Use as a starting point
cp -r patterns/java/project-templates/spring-boot-web/ my-service/
cd my-service && mvn spring-boot:run
```

## Migration Strategy

Per the IDP migration assessor, Java projects are detected as `parallel-run` migration candidates — meaning the Java service runs alongside the Forge Space ecosystem during transition, with traffic gradually shifted.

```ts
import { detectStrategy } from '@forgespace/core/idp';

const strategy = detectStrategy({ dir: '.', language: 'java' });
// strategy === 'parallel-run'
```

## Integration Points

Java services integrate with the ecosystem via:
- **mcp-gateway** — Routes HTTP calls from the gateway to Java REST endpoints
- **Shared security patterns** — JWT validation (see `patterns/security/authentication/`)
- **Shared monitoring** — Structured log format compatible with `shared-logger.py`

## Security

All Java templates follow BR-001 (Zero Secrets):
- No hardcoded credentials — use environment variables or Spring Vault
- `REPLACE_WITH_*` placeholders for sensitive config values
- `application.yml` contains no secrets

## Notes

- The `target/` directory contains pre-compiled classes for reference — do not commit `target/` in real projects (add to `.gitignore`)
- Java version: 21+ (LTS) recommended
- Build tool: Maven (pom.xml included in the template)
