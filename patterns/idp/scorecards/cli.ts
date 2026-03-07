#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ScorecardAggregator } from './aggregator.js';
import { SecurityCollector } from './collectors/security-collector.js';
import { QualityCollector } from './collectors/quality-collector.js';
import { PerformanceCollector } from './collectors/performance-collector.js';
import { ComplianceCollector } from './collectors/compliance-collector.js';
import { DependencyCollector } from './collectors/dependency-collector.js';

function parseArgs(args: string[]) {
  const opts: Record<string, string> = {};
  const flags = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') {
      flags.add('json');
    } else if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    }
  }
  return { opts, flags };
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

async function main() {
  const { opts, flags } = parseArgs(process.argv.slice(2));
  const projectDir = resolve(opts['project-dir'] ?? '.');
  const useJson = flags.has('json') || opts['output'] === 'json';
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
  aggregator.addCollector(new DependencyCollector());

  const result = await aggregator.aggregate(context);

  if (useJson) {
    const grade = scoreToGrade(result.overallScore);
    const jsonOutput = {
      ...result,
      grade,
      categories: Object.fromEntries(
        Object.entries(result.categories).map(
          ([name, data]) => [
            name,
            { ...data, grade: scoreToGrade(data.score) }
          ]
        )
      )
    };
    console.log(JSON.stringify(jsonOutput, null, 2));
  } else {
    const grade = scoreToGrade(result.overallScore);
    console.log(
      `\nScorecard: ${result.overallScore}/100 (${grade})`
    );
    console.log('─'.repeat(40));
    for (const [cat, data] of Object.entries(result.categories)) {
      const v = data.violations.length;
      const g = scoreToGrade(data.score);
      console.log(
        `  ${cat}: ${data.score}/100 (${g})`
        + (v > 0 ? ` — ${v} violations` : '')
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
