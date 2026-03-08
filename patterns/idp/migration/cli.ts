#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { assessProject, detectStrategy } from './assessor.js';
import type { AssessmentContext, Grade } from './types.js';

function parseArgs(args: string[]) {
  const opts: Record<string, string> = {};
  const flags = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') {
      flags.add('json');
    } else if (arg === '--help' || arg === '-h') {
      flags.add('help');
    } else if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    }
  }
  return { opts, flags };
}

function gradeColor(grade: Grade): string {
  switch (grade) {
    case 'A': return '\x1b[32m';
    case 'B': return '\x1b[36m';
    case 'C': return '\x1b[33m';
    case 'D': return '\x1b[33m';
    case 'F': return '\x1b[31m';
  }
}

function sevColor(s: string): string {
  switch (s) {
    case 'critical': return '\x1b[31m';
    case 'high': return '\x1b[33m';
    case 'medium': return '\x1b[36m';
    default: return '\x1b[90m';
  }
}

function printUsage(): void {
  console.log(`
forge-audit — Legacy codebase migration assessment

Usage:
  forge-audit [options]

Options:
  --dir <path>       Project directory (default: .)
  --json             Output as JSON
  --threshold <n>    Exit 1 if score below threshold
  --help             Show this help

Categories:
  dependencies       Legacy packages, dep count, lockfile
  architecture       God files, coupling, function sprawl
  security           Secrets, injection risks, CORS
  quality            Tests, linting, CI, code hygiene
  migration-readiness  Legacy stack, TypeScript, global state
`);
}

function detectContext(dir: string): AssessmentContext {
  const ctx: AssessmentContext = { dir };
  const pkgPath = join(dir, 'package.json');

  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(
      readFileSync(pkgPath, 'utf-8'),
    ) as Record<string, unknown>;
    const deps = {
      ...(pkg['dependencies'] as Record<string, string> | undefined),
      ...(pkg['devDependencies'] as Record<string, string> | undefined),
    };

    if (existsSync(join(dir, 'tsconfig.json'))) {
      ctx.language = 'typescript';
      ctx.hasTypeChecking = true;
    } else {
      ctx.language = 'javascript';
    }

    if (deps['next']) ctx.framework = 'nextjs';
    else if (deps['react']) ctx.framework = 'react';
    else if (deps['vue']) ctx.framework = 'vue';
    else if (deps['express']) ctx.framework = 'express';
    else if (deps['@nestjs/core']) ctx.framework = 'nestjs';
    else if (deps['svelte']) ctx.framework = 'svelte';

    if (deps['jest'] || deps['vitest'] || deps['mocha']) {
      ctx.testFramework = deps['jest'] ? 'jest'
        : deps['vitest'] ? 'vitest' : 'mocha';
    }

    ctx.hasLinting = !!(
      deps['eslint'] || deps['biome'] || deps['oxlint']
    );
    ctx.hasFormatting = !!(
      deps['prettier'] || deps['biome']
    );

    const lockFiles = [
      'package-lock.json', 'yarn.lock',
      'pnpm-lock.yaml', 'bun.lockb',
    ];
    if (lockFiles.some(f => existsSync(join(dir, f)))) {
      ctx.packageManager = 'npm';
    }
  } else if (existsSync(join(dir, 'requirements.txt')) ||
    existsSync(join(dir, 'pyproject.toml'))) {
    ctx.language = 'python';
    if (existsSync(join(dir, 'mypy.ini')) ||
      existsSync(join(dir, 'pyrightconfig.json'))) {
      ctx.hasTypeChecking = true;
    }
  } else if (existsSync(join(dir, 'go.mod'))) {
    ctx.language = 'go';
    ctx.hasTypeChecking = true;
  } else if (existsSync(join(dir, 'Cargo.toml'))) {
    ctx.language = 'rust';
    ctx.hasTypeChecking = true;
  }

  ctx.hasCi = existsSync(join(dir, '.github', 'workflows')) ||
    existsSync(join(dir, '.gitlab-ci.yml'));

  return ctx;
}

function main(): void {
  const { opts, flags } = parseArgs(process.argv.slice(2));

  if (flags.has('help')) {
    printUsage();
    return;
  }

  const dir = resolve(opts['dir'] ?? '.');
  const useJson = flags.has('json');
  const threshold = Number(opts['threshold'] ?? '0');

  if (!existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }

  const ctx = detectContext(dir);
  const report = assessProject(ctx);

  if (useJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const r = '\x1b[0m';
    console.log(
      `\n${gradeColor(report.grade)}` +
      `  Migration Assessment: ` +
      `${report.overallScore}/100 (${report.grade})${r}`,
    );
    console.log(`  Readiness: ${report.readiness}`);
    console.log(
      `  Strategy: ${report.strategy.replace(/-/g, ' ')}`,
    );
    console.log('─'.repeat(50));

    for (const cat of report.categories) {
      const gc = gradeColor(cat.grade);
      const fc = cat.findings.length;
      console.log(
        `  ${gc}${cat.category}: ` +
        `${cat.score}/100 (${cat.grade})${r}` +
        (fc > 0 ? ` — ${fc} findings` : ''),
      );
    }

    if (report.findings.length > 0) {
      console.log('\nTop findings:');
      const top = report.findings.slice(0, 10);
      for (const f of top) {
        const sc = sevColor(f.severity);
        const loc = f.file
          ? ` (${f.file}${f.line ? `:${f.line}` : ''})`
          : '';
        console.log(
          `  ${sc}[${f.severity}]${r} ${f.message}${loc}`,
        );
      }
      const remaining = report.findings.length - top.length;
      if (remaining > 0) {
        console.log(`  ... and ${remaining} more`);
      }
    }

    console.log('');
  }

  if (threshold > 0 && report.overallScore < threshold) {
    console.error(
      `Score ${report.overallScore} below threshold ${threshold}`,
    );
    process.exit(1);
  }
}

main();
