#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { type TemplateName, TEMPLATE_NAMES, isValidTemplate } from './templates.js';
import { initProject } from './project.js';

function printUsage(): void {
  console.log(`
forge-init — Bootstrap Forge Space governance for a project

Usage:
  forge-init [options]

Options:
  --dir <path>        Target project directory (default: .)
  --template <name>   Framework template: ${TEMPLATE_NAMES.join(', ')}
  --force             Overwrite existing files
  --dry-run           Show what would be created without writing
  --help              Show this help

Templates:
  react     Accessibility rules, component test coverage checks
  nextjs    React rules + bundle size, server component hygiene
  node      Dependency audit, unused deps, API input validation

Creates:
  .forge/policies/         Default security + quality + compliance policies
  .forge/scorecard.json    Scorecard configuration (weights per template)
  .forge/features.json     Feature toggle seed file
  .github/workflows/       Scorecard + policy-check CI workflows
`);
}

function parseArgs(args: string[]) {
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--force') {
      opts['force'] = true;
    } else if (arg === '--dry-run') {
      opts['dry-run'] = true;
    } else if (arg === '--help' || arg === '-h') {
      opts['help'] = true;
    } else if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    }
  }
  return opts;
}

function main(): void {
  const opts = parseArgs(process.argv.slice(2));

  if (opts['help']) {
    printUsage();
    return;
  }

  const targetDir = resolve((opts['dir'] as string) ?? '.');
  const force = opts['force'] === true;
  const dryRun = opts['dry-run'] === true;
  const templateArg = opts['template'] as string | undefined;

  if (templateArg !== undefined && !isValidTemplate(templateArg)) {
    console.error(`Unknown template: ${templateArg}. ` + `Available: ${TEMPLATE_NAMES.join(', ')}`);
    process.exit(1);
  }

  const template = templateArg as TemplateName | undefined;

  if (!existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  if (dryRun) {
    console.log('\n\x1b[36mDry run — no files will be written\x1b[0m\n');
  }

  if (template) {
    console.log(`\x1b[36mTemplate: ${template}\x1b[0m\n`);
  }

  const result = initProject(targetDir, {
    force,
    dryRun,
    ...(template ? { template } : {})
  });

  if (result.created.length > 0) {
    const verb = dryRun ? 'Would create' : 'Created';
    console.log(`\n\x1b[32m${verb}:\x1b[0m`);
    for (const f of result.created) {
      const rel = f.replace(targetDir + '/', '');
      console.log(`  + ${rel}`);
    }
  }

  if (result.skipped.length > 0) {
    console.log('\n\x1b[33mSkipped (already exists):\x1b[0m');
    for (const f of result.skipped) {
      const rel = f.replace(targetDir + '/', '');
      console.log(`  ~ ${rel}`);
    }
    if (!force) {
      console.log('\n  Use --force to overwrite existing files');
    }
  }

  if (result.created.length === 0 && result.skipped.length === 0) {
    console.log('Nothing to do.');
  } else {
    console.log('');
  }
}

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  main();
}

export { initProject } from './project.js';
export type { InitResult } from './project.js';
