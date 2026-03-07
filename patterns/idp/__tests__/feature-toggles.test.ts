import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FileToggleStore } from '../feature-toggles/store.js';
import type { FeatureToggleStore } from '../feature-toggles/schema.js';

const TEST_DIR = join(process.cwd(), '.test-toggles');
const STORE_PATH = join(TEST_DIR, 'features.json');

beforeEach(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
});

describe('FileToggleStore', () => {
  describe('initialization', () => {
    it('creates empty store when file does not exist', () => {
      const store = new FileToggleStore(STORE_PATH);
      expect(store.list()).toEqual([]);
    });

    it('loads existing store from file', () => {
      const existing: FeatureToggleStore = {
        version: 1,
        toggles: [
          {
            name: 'EXISTING',
            namespace: 'global',
            enabled: true,
            strategies: [{ name: 'default' }],
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z'
          }
        ]
      };
      writeFileSync(STORE_PATH, JSON.stringify(existing));
      const store = new FileToggleStore(STORE_PATH);
      expect(store.list()).toHaveLength(1);
      expect(store.get('EXISTING')?.enabled).toBe(true);
    });
  });

  describe('create', () => {
    it('creates a toggle with defaults', () => {
      const store = new FileToggleStore(STORE_PATH);
      const toggle = store.create('ENABLE_FEATURE', 'global');
      expect(toggle.name).toBe('ENABLE_FEATURE');
      expect(toggle.namespace).toBe('global');
      expect(toggle.enabled).toBe(false);
      expect(toggle.strategies).toEqual([{ name: 'default' }]);
      expect(toggle.createdAt).toBeTruthy();
    });

    it('creates a toggle with options', () => {
      const store = new FileToggleStore(STORE_PATH);
      const toggle = store.create('ENABLE_BETA', 'uiforge-webapp', {
        description: 'Beta features',
        enabled: true
      });
      expect(toggle.enabled).toBe(true);
      expect(toggle.description).toBe('Beta features');
      expect(toggle.namespace).toBe('uiforge-webapp');
    });

    it('throws when toggle already exists', () => {
      const store = new FileToggleStore(STORE_PATH);
      store.create('DUPLICATE', 'global');
      expect(() => store.create('DUPLICATE', 'global')).toThrow(
        'Toggle "DUPLICATE" already exists'
      );
    });

    it('persists to file', () => {
      const store1 = new FileToggleStore(STORE_PATH);
      store1.create('PERSIST_TEST', 'mcp-gateway');
      const store2 = new FileToggleStore(STORE_PATH);
      expect(store2.get('PERSIST_TEST')).toBeDefined();
    });
  });

  describe('enable / disable', () => {
    it('enables a toggle', () => {
      const store = new FileToggleStore(STORE_PATH);
      store.create('TOGGLE_IT', 'global');
      expect(store.isEnabled('TOGGLE_IT')).toBe(false);
      store.enable('TOGGLE_IT');
      expect(store.isEnabled('TOGGLE_IT')).toBe(true);
    });

    it('disables a toggle', () => {
      const store = new FileToggleStore(STORE_PATH);
      store.create('TOGGLE_IT', 'global', { enabled: true });
      store.disable('TOGGLE_IT');
      expect(store.isEnabled('TOGGLE_IT')).toBe(false);
    });

    it('throws when toggle not found', () => {
      const store = new FileToggleStore(STORE_PATH);
      expect(() => store.enable('MISSING')).toThrow('Toggle "MISSING" not found');
      expect(() => store.disable('MISSING')).toThrow('Toggle "MISSING" not found');
    });

    it('updates the updatedAt timestamp', () => {
      jest.useFakeTimers();
      const store = new FileToggleStore(STORE_PATH);
      const created = store.create('TIMESTAMP', 'global');
      const before = created.updatedAt;
      jest.advanceTimersByTime(1000);
      store.enable('TIMESTAMP');
      const after = store.get('TIMESTAMP')!.updatedAt;
      expect(after).not.toBe(before);
      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    it('removes an existing toggle', () => {
      const store = new FileToggleStore(STORE_PATH);
      store.create('TO_REMOVE', 'global');
      expect(store.remove('TO_REMOVE')).toBe(true);
      expect(store.get('TO_REMOVE')).toBeUndefined();
    });

    it('returns false for non-existent toggle', () => {
      const store = new FileToggleStore(STORE_PATH);
      expect(store.remove('NOPE')).toBe(false);
    });
  });

  describe('list with filters', () => {
    let store: FileToggleStore;

    beforeEach(() => {
      store = new FileToggleStore(STORE_PATH);
      store.create('GLOBAL_ON', 'global', { enabled: true });
      store.create('GLOBAL_OFF', 'global');
      store.create('GW_ON', 'mcp-gateway', { enabled: true });
      store.create('WEBAPP_OFF', 'uiforge-webapp');
    });

    it('lists all toggles', () => {
      expect(store.list()).toHaveLength(4);
    });

    it('filters by namespace', () => {
      const result = store.list({ namespace: 'global' });
      expect(result).toHaveLength(2);
      expect(result.every(t => t.namespace === 'global')).toBe(true);
    });

    it('filters by enabled', () => {
      const result = store.list({ enabled: true });
      expect(result).toHaveLength(2);
      expect(result.every(t => t.enabled)).toBe(true);
    });

    it('filters by namespace and enabled', () => {
      const result = store.list({ namespace: 'global', enabled: true });
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('GLOBAL_ON');
    });
  });

  describe('isEnabled', () => {
    it('returns false for non-existent toggle', () => {
      const store = new FileToggleStore(STORE_PATH);
      expect(store.isEnabled('UNKNOWN')).toBe(false);
    });
  });

  describe('reload', () => {
    it('reloads store from file', () => {
      const store = new FileToggleStore(STORE_PATH);
      store.create('RELOAD_TEST', 'global');
      const data: FeatureToggleStore = {
        version: 1,
        toggles: [
          {
            name: 'EXTERNAL',
            namespace: 'global',
            enabled: true,
            strategies: [{ name: 'default' }],
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z'
          }
        ]
      };
      writeFileSync(STORE_PATH, JSON.stringify(data));
      store.reload();
      expect(store.get('RELOAD_TEST')).toBeUndefined();
      expect(store.get('EXTERNAL')).toBeDefined();
    });
  });
});
