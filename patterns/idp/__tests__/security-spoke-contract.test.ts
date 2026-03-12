import fs from 'node:fs';
import path from 'node:path';
import {
  isSecuritySpokeReportV1,
  readSecuritySpokeReportV1Schema,
  readSecuritySpokeRuleCatalogV1,
  SECURITY_SPOKE_CATEGORIES,
  SECURITY_SPOKE_RISK_LEVELS,
  SECURITY_SPOKE_SEVERITIES
} from '../security-spoke/index.js';
import type { SecuritySpokeReportV1 } from '../security-spoke/types.js';

const baseDir = __dirname;
const securitySpokeDir = path.join(baseDir, '..', 'security-spoke');
const fixturesDir = path.join(securitySpokeDir, 'fixtures');

function readJson(pathname: string): unknown {
  return JSON.parse(fs.readFileSync(pathname, 'utf-8')) as unknown;
}

function readFixture(pathname: string): SecuritySpokeReportV1 {
  return readJson(path.join(fixturesDir, pathname)) as SecuritySpokeReportV1;
}

describe('Security Spoke v1 contract', () => {
  it('keeps required top-level fields stable', () => {
    const schema = readSecuritySpokeReportV1Schema() as {
      required?: string[];
      properties?: Record<string, unknown>;
    };

    expect(schema.required).toEqual(
      expect.arrayContaining([
        'version',
        'generated_at',
        'scanner',
        'summary',
        'findings',
        'dast'
      ])
    );

    expect(schema.properties).toMatchObject({
      version: expect.any(Object),
      generated_at: expect.any(Object),
      scanner: expect.any(Object),
      summary: expect.any(Object),
      findings: expect.any(Object),
      dast: expect.any(Object)
    });
  });

  it('keeps finding enums stable', () => {
    const schema = readSecuritySpokeReportV1Schema() as {
      properties?: {
        findings?: {
          items?: {
            properties?: {
              severity?: { enum?: string[] };
              category?: { enum?: string[] };
              risk_level?: { enum?: string[] };
            };
          };
        };
      };
    };

    const findingProperties = schema.properties?.findings?.items?.properties;

    expect(findingProperties?.severity?.enum).toEqual(SECURITY_SPOKE_SEVERITIES);
    expect(findingProperties?.category?.enum).toEqual(SECURITY_SPOKE_CATEGORIES);
    expect(findingProperties?.risk_level?.enum).toEqual(SECURITY_SPOKE_RISK_LEVELS);
  });

  it('validates all report fixtures against runtime contract', () => {
    const fixtureFiles = fs
      .readdirSync(fixturesDir)
      .filter((file) => file.endsWith('.json'))
      .sort();

    for (const file of fixtureFiles) {
      const payload = readJson(path.join(fixturesDir, file));
      expect(isSecuritySpokeReportV1(payload)).toBe(true);
    }
  });

  it('keeps rule catalog IDs unique and enum-compatible', () => {
    const catalog = readSecuritySpokeRuleCatalogV1();
    const seenRuleIds = new Set<string>();

    expect(catalog.version).toBe('v1');
    expect(catalog.rules.length).toBeGreaterThan(0);

    for (const rule of catalog.rules) {
      expect(seenRuleIds.has(rule.rule_id)).toBe(false);
      seenRuleIds.add(rule.rule_id);
      expect(SECURITY_SPOKE_SEVERITIES).toContain(rule.severity);
      expect(SECURITY_SPOKE_CATEGORIES).toContain(rule.category);
      expect(SECURITY_SPOKE_RISK_LEVELS).toContain(rule.risk_level);
      expect(rule.recommendation.length).toBeGreaterThan(0);
    }
  });

  it('keeps fixture finding rule IDs mapped to the catalog', () => {
    const catalog = readSecuritySpokeRuleCatalogV1();
    const validRuleIds = new Set(catalog.rules.map((rule) => rule.rule_id));
    const findingsFixture = readFixture('security-spoke-report-v1.findings.json');

    for (const finding of findingsFixture.findings) {
      expect(validRuleIds.has(finding.rule_id)).toBe(true);
    }
  });

  it('keeps fail-open fixture explicit for advisory mode', () => {
    const failOpenFixture = readFixture('security-spoke-report-v1.fail-open.json');

    expect(failOpenFixture.scanner.execution).toBe('error');
    expect(failOpenFixture.summary.total_findings).toBe(0);
    expect(failOpenFixture.dast.status).toBe('not_executed');
  });
});
