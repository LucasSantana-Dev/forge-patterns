#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ScorecardAggregator } from './aggregator.js';
import { SecurityCollector } from './collectors/security-collector.js';
import { QualityCollector } from './collectors/quality-collector.js';
import { PerformanceCollector } from './collectors/performance-collector.js';
import { ComplianceCollector } from './collectors/compliance-collector.js';

function parseArgs(args: string[]) {
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const projectDir = resolve(opts['project-dir'] ?? '.');
  const output = opts['output'] ?? 'summary';
  const threshold = Number(opts['threshold'] ?? '0');

  if (!existsSync(projectDir)) {
    console.error(`Project directory not found: ${projectDir}`);
    process.exit(1);
  }

  const pkgPath = resolve(projectDir, 'package.json');
  const pkg = existsSync(pkgPath)
    ? (JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>)
    : {};

  const context: Record<string, unknown> = {
    projectDir,
    packageJson: pkg,
    projectName: (pkg['name'] as string) ?? projectDir
  };

  const aggregator = new ScorecardAggregator();
  aggregator.addCollector(new SecurityCollector());
  aggregator.addCollector(new QualityCollector());
  aggregator.addCollector(new PerformanceCollector());
  aggregator.addCollector(new ComplianceCollector());

  const result = await aggregator.aggregate(context);

  if (output === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nScorecard: ${result.overallScore}/100`);
    console.log('─'.repeat(40));
    for (const [cat, data] of Object.entries(result.categories)) {
      const violations = data.violations.length;
      console.log(
        `  ${cat}: ${data.score}/100` + (violations > 0 ? ` (${violations} violations)` : '')
      );
    }
    if (result.recommendations.length > 0) {
      console.log('\nRecommendations:');
      for (const rec of result.recommendations) {
        console.log(`  - ${rec}`);
      }
    }
  }

  if (threshold > 0 && result.overallScore < threshold) {
    console.error(`\nScore ${result.overallScore} below threshold ${threshold}`);
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Scorecard evaluation failed:', err);
  process.exit(1);
});
