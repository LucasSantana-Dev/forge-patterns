#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PolicyEvaluator } from './evaluator.js';
import type { Policy } from './schema.js';

function parseArgs(args: string[]) {
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--fail-on-block') {
      opts['fail-on-block'] = true;
    } else if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    }
  }
  return opts;
}

function loadPolicies(dir: string): Policy[] {
  if (!existsSync(dir)) {
    console.error(`Policy directory not found: ${dir}`);
    process.exit(1);
  }

  return readdirSync(dir)
    .filter(f => f.endsWith('.policy.json'))
    .map(f => {
      const content = readFileSync(join(dir, f), 'utf-8');
      return JSON.parse(content) as Policy;
    });
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const policyDir = resolve((opts['policy-dir'] as string) ?? './policies');
  const contextFile = opts['context-file'] as string | undefined;
  const failOnBlock = opts['fail-on-block'] === true;

  let context: Record<string, unknown> = {};
  if (contextFile && existsSync(resolve(contextFile))) {
    context = JSON.parse(readFileSync(resolve(contextFile), 'utf-8')) as Record<string, unknown>;
  }

  const policies = loadPolicies(policyDir);
  const evaluator = new PolicyEvaluator();
  evaluator.loadPolicies(policies);
  const result = evaluator.evaluate(context);

  console.log(`\nPolicy Evaluation — ${policies.length} policies loaded`);
  console.log('─'.repeat(40));

  if (result.violations.length > 0) {
    console.log(`\nBlocking violations (${result.violations.length}):`);
    for (const v of result.violations) {
      console.log(`  [BLOCK] ${v.ruleName}: ${v.action.message}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    for (const w of result.warnings) {
      console.log(`  [WARN] ${w.ruleName}: ${w.action.message}`);
    }
  }

  if (result.logs.length > 0) {
    console.log(`\nLog entries (${result.logs.length}):`);
    for (const l of result.logs) {
      console.log(`  [LOG] ${l.ruleName}: ${l.action.message}`);
    }
  }

  if (result.violations.length === 0 && result.warnings.length === 0) {
    console.log('\nAll policies passed.');
  }

  if (failOnBlock && result.shouldBlock) {
    console.error('\nFailing due to blocking violations.');
    process.exit(1);
  }
}

main();
