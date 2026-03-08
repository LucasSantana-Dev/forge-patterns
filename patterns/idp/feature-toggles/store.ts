import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type {
  FeatureToggle,
  FeatureToggleStore,
  ToggleListOptions,
  ToggleNamespace,
  ToggleStrategyConfig
} from './schema.js';

const DEFAULT_STORE: FeatureToggleStore = { version: 1, toggles: [] };

export class FileToggleStore {
  private store: FeatureToggleStore;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = resolve(filePath);
    this.store = this.load();
  }

  private load(): FeatureToggleStore {
    if (!existsSync(this.filePath)) return { ...DEFAULT_STORE, toggles: [] };
    const raw = readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as FeatureToggleStore;
  }

  private save(): void {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(this.store, null, 2) + '\n', 'utf-8');
  }

  list(opts?: ToggleListOptions): FeatureToggle[] {
    let { toggles } = this.store;
    if (opts?.namespace) {
      toggles = toggles.filter(t => t.namespace === opts.namespace);
    }
    if (opts?.enabled !== undefined) {
      toggles = toggles.filter(t => t.enabled === opts.enabled);
    }
    return toggles;
  }

  get(name: string): FeatureToggle | undefined {
    return this.store.toggles.find(t => t.name === name);
  }

  isEnabled(name: string): boolean {
    const toggle = this.get(name);
    return toggle?.enabled ?? false;
  }

  create(
    name: string,
    namespace: ToggleNamespace,
    opts?: { description?: string; enabled?: boolean; strategies?: ToggleStrategyConfig[] }
  ): FeatureToggle {
    if (this.get(name)) {
      throw new Error(`Toggle "${name}" already exists`);
    }
    const now = new Date().toISOString();
    const toggle: FeatureToggle = {
      name,
      namespace,
      enabled: opts?.enabled ?? false,
      ...(opts?.description ? { description: opts.description } : {}),
      strategies: opts?.strategies ?? [{ name: 'default' }],
      createdAt: now,
      updatedAt: now
    };
    this.store.toggles.push(toggle);
    this.save();
    return toggle;
  }

  enable(name: string): FeatureToggle {
    const toggle = this.get(name);
    if (!toggle) throw new Error(`Toggle "${name}" not found`);
    toggle.enabled = true;
    toggle.updatedAt = new Date().toISOString();
    this.save();
    return toggle;
  }

  disable(name: string): FeatureToggle {
    const toggle = this.get(name);
    if (!toggle) throw new Error(`Toggle "${name}" not found`);
    toggle.enabled = false;
    toggle.updatedAt = new Date().toISOString();
    this.save();
    return toggle;
  }

  remove(name: string): boolean {
    const idx = this.store.toggles.findIndex(t => t.name === name);
    if (idx === -1) return false;
    this.store.toggles.splice(idx, 1);
    this.save();
    return true;
  }

  reload(): void {
    this.store = this.load();
  }
}
