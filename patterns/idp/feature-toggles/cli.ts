#!/usr/bin/env node

import { resolve } from 'node:path';
import { FileToggleStore } from './store.js';
import type { ToggleNamespace } from './schema.js';

const VALID_NAMESPACES: ToggleNamespace[] = [
  'global',
  'mcp-gateway',
  'uiforge-mcp',
  'uiforge-webapp'
];

function parseArgs(args: string[]) {
  const positional: string[] = [];
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') {
      opts['json'] = true;
    } else if (arg === '--enabled') {
      opts['enabled'] = true;
    } else if (arg === '--disabled') {
      opts['disabled'] = true;
    } else if (arg?.startsWith('--') && i + 1 < args.length) {
      opts[arg.slice(2)] = args[++i] ?? '';
    } else if (arg) {
      positional.push(arg);
    }
  }
  return { positional, opts };
}

function printUsage(): void {
  console.log(`
forge-features — Manage feature toggles

Usage:
  forge-features list [--namespace <ns>] [--enabled] [--disabled] [--json]
  forge-features get <name>
  forge-features create <name> --namespace <ns> [--description <desc>] [--enabled]
  forge-features enable <name>
  forge-features disable <name>
  forge-features remove <name>
  forge-features check <name>

Options:
  --store <path>      Toggle store file (default: .forge/features.json)
  --namespace <ns>    Filter by namespace: global, mcp-gateway, uiforge-mcp, uiforge-webapp
  --description <d>   Toggle description
  --enabled           Filter or create as enabled
  --disabled          Filter by disabled
  --json              Output as JSON

Examples:
  forge-features create ENABLE_NEW_SPOKE --namespace mcp-gateway --description "New spoke rollout"
  forge-features enable ENABLE_NEW_SPOKE
  forge-features list --namespace global --enabled
  forge-features check ENABLE_BETA_FEATURES
`);
}

function main(): void {
  const { positional, opts } = parseArgs(process.argv.slice(2));
  const command = positional[0];
  const storePath = resolve((opts['store'] as string) ?? '.forge/features.json');
  const store = new FileToggleStore(storePath);

  if (!command || command === 'help' || command === '--help') {
    printUsage();
    return;
  }

  switch (command) {
    case 'list': {
      const namespace = opts['namespace'] as ToggleNamespace | undefined;
      if (namespace && !VALID_NAMESPACES.includes(namespace)) {
        console.error(`Invalid namespace: ${namespace}`);
        console.error(`Valid: ${VALID_NAMESPACES.join(', ')}`);
        process.exit(1);
      }
      const listOpts: import('./schema.js').ToggleListOptions = {};
      if (namespace) listOpts.namespace = namespace;
      if (opts['enabled'] === true) listOpts.enabled = true;
      else if (opts['disabled'] === true) listOpts.enabled = false;
      const toggles = store.list(listOpts);

      if (opts['json']) {
        console.log(JSON.stringify(toggles, null, 2));
      } else {
        if (toggles.length === 0) {
          console.log('No toggles found.');
          return;
        }
        console.log(`\nFeature Toggles (${toggles.length})`);
        console.log('─'.repeat(60));
        for (const t of toggles) {
          const status = t.enabled ? '\x1b[32mON \x1b[0m' : '\x1b[31mOFF\x1b[0m';
          const ns = `[${t.namespace}]`;
          console.log(`  ${status}  ${t.name.padEnd(35)} ${ns}`);
          if (t.description) {
            console.log(`       ${t.description}`);
          }
        }
      }
      break;
    }

    case 'get': {
      const name = positional[1];
      if (!name) {
        console.error('Usage: forge-features get <name>');
        process.exit(1);
      }
      const toggle = store.get(name);
      if (!toggle) {
        console.error(`Toggle "${name}" not found`);
        process.exit(1);
      }
      if (opts['json']) {
        console.log(JSON.stringify(toggle, null, 2));
      } else {
        const status = toggle.enabled ? '\x1b[32mON\x1b[0m' : '\x1b[31mOFF\x1b[0m';
        console.log(`\n${toggle.name}  ${status}`);
        console.log('─'.repeat(40));
        console.log(`  Namespace:   ${toggle.namespace}`);
        if (toggle.description) console.log(`  Description: ${toggle.description}`);
        console.log(`  Strategies:  ${toggle.strategies.map(s => s.name).join(', ')}`);
        console.log(`  Created:     ${toggle.createdAt}`);
        console.log(`  Updated:     ${toggle.updatedAt}`);
      }
      break;
    }

    case 'create': {
      const name = positional[1];
      const namespace = opts['namespace'] as ToggleNamespace | undefined;
      if (!name || !namespace) {
        console.error('Usage: forge-features create <name> --namespace <ns>');
        process.exit(1);
      }
      if (!VALID_NAMESPACES.includes(namespace)) {
        console.error(`Invalid namespace: ${namespace}`);
        console.error(`Valid: ${VALID_NAMESPACES.join(', ')}`);
        process.exit(1);
      }
      try {
        const createOpts: { description?: string; enabled?: boolean } = {};
        if (typeof opts['description'] === 'string') createOpts.description = opts['description'];
        if (opts['enabled'] === true) createOpts.enabled = true;
        const toggle = store.create(name, namespace, createOpts);
        console.log(`Created toggle "${toggle.name}" in ${toggle.namespace}`);
      } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
      }
      break;
    }

    case 'enable': {
      const name = positional[1];
      if (!name) {
        console.error('Usage: forge-features enable <name>');
        process.exit(1);
      }
      try {
        store.enable(name);
        console.log(`Enabled "${name}"`);
      } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
      }
      break;
    }

    case 'disable': {
      const name = positional[1];
      if (!name) {
        console.error('Usage: forge-features disable <name>');
        process.exit(1);
      }
      try {
        store.disable(name);
        console.log(`Disabled "${name}"`);
      } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
      }
      break;
    }

    case 'remove': {
      const name = positional[1];
      if (!name) {
        console.error('Usage: forge-features remove <name>');
        process.exit(1);
      }
      const removed = store.remove(name);
      if (removed) {
        console.log(`Removed "${name}"`);
      } else {
        console.error(`Toggle "${name}" not found`);
        process.exit(1);
      }
      break;
    }

    case 'check': {
      const name = positional[1];
      if (!name) {
        console.error('Usage: forge-features check <name>');
        process.exit(1);
      }
      const enabled = store.isEnabled(name);
      if (opts['json']) {
        console.log(JSON.stringify({ name, enabled }));
      } else {
        console.log(enabled ? 'true' : 'false');
      }
      process.exit(enabled ? 0 : 1);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
