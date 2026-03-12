# Security Spoke Contract v1

`@forgespace/core` is the canonical source for the Security Spoke v1 contract
used by scanner emitters and consumers across Forge Space.

## Contract artifacts

- Report schema:
  `patterns/idp/security-spoke/schema/security-spoke-report-v1.schema.json`
- Rule catalog: `patterns/idp/security-spoke/rules/security-spoke-rules-v1.json`
- Compatibility fixtures: `patterns/idp/security-spoke/fixtures/*.json`

## Canonical finding fields

Each finding payload includes:

- `rule_id`
- `severity`
- `category`
- `evidence`
- `recommendation`
- `risk_level`

DAST telemetry is explicit in `dast.status` and remains hooks-only in v1.

## TypeScript helpers

The `patterns/idp/security-spoke` module exports:

- contract enums for `severity`, `category`, and `risk_level`
- report/catalog path constants
- `isSecuritySpokeReportV1` runtime guard
- schema/catalog readers

## Compatibility guardrails

- schema required fields are covered by contract tests
- enum stability is covered by contract tests
- fixture payloads are verified against the runtime guard
- fixture findings are validated against rule catalog IDs
