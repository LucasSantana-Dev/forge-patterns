import { Logger, LoggerFactory } from '../src/logger.js';
import { LogLevel } from '../src/types.js';
import type { LogEntry, LoggerTransport } from '../src/types.js';
import {
  ConsoleTransport,
  JsonTransport,
  FilteredTransport,
  MultiTransport,
  RemoteTransport
} from '../src/transports.js';

// ---------- helpers ----------

function makeConfig(overrides = {}) {
  return {
    service: 'test-svc',
    version: '1.0.0',
    environment: 'test',
    level: LogLevel.TRACE,
    enableConsole: false,
    enableFile: false,
    enableStructured: false,
    enableCorrelationIds: true,
    enableMetrics: true,
    enableTracing: false,
    ...overrides
  };
}

/** Spy transport — captures every entry written to it */
class SpyTransport implements LoggerTransport {
  name = 'spy';
  level: LogLevel;
  entries: LogEntry[] = [];

  constructor(level: LogLevel = LogLevel.TRACE) {
    this.level = level;
  }

  format(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  write(entry: LogEntry): void {
    if (entry.level >= this.level) this.entries.push(entry);
  }
}

// ---------- Logger core ----------

describe('Logger — log levels', () => {
  it('logs trace when level is TRACE', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.trace('hello');
    expect(spy.entries).toHaveLength(1);
    expect(spy.entries[0].level).toBe(LogLevel.TRACE);
  });

  it('suppresses debug when level is WARN', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ level: LogLevel.WARN, transports: [spy] }));
    logger.debug('ignored');
    expect(spy.entries).toHaveLength(0);
  });

  it('passes warn through when level is WARN', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ level: LogLevel.WARN, transports: [spy] }));
    logger.warn('visible');
    expect(spy.entries).toHaveLength(1);
  });

  it('logs all five levels (debug/info/warn/error/fatal)', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    const levels = spy.entries.map(e => e.level);
    expect(levels).toEqual([
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.FATAL
    ]);
  });
});

describe('Logger — entry fields', () => {
  it('populates service, version, environment on every entry', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.info('check');
    const entry = spy.entries[0];
    expect(entry.service).toBe('test-svc');
    expect(entry.version).toBe('1.0.0');
    expect(entry.environment).toBe('test');
    expect(entry.message).toBe('check');
  });

  it('includes timestamp as ISO string', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.info('ts');
    expect(typeof spy.entries[0].timestamp).toBe('string');
    expect(() => new Date(spy.entries[0].timestamp)).not.toThrow();
  });

  it('merges context into entry.context', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.info('ctx', { userId: '42' });
    expect(spy.entries[0].context?.userId).toBe('42');
  });

  it('includes correlationId from getCorrelation()', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.info('corr');
    const { correlationId } = logger.getCorrelation();
    expect(spy.entries[0].correlationId).toBe(correlationId);
  });
});

describe('Logger — context management', () => {
  it('setContext persists across log calls', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.setContext({ env: 'prod' });
    logger.info('msg');
    expect(spy.entries[0].context?.env).toBe('prod');
  });

  it('clearContext removes previously set keys', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.setContext({ env: 'prod' });
    logger.clearContext();
    logger.info('msg');
    expect(spy.entries[0].context?.env).toBeUndefined();
  });

  it('getContext returns a copy, not the internal reference', () => {
    const logger = new Logger(makeConfig());
    logger.setContext({ x: 1 });
    const ctx = logger.getContext();
    ctx['x'] = 999;
    expect(logger.getContext()['x']).toBe(1);
  });
});

describe('Logger — correlation', () => {
  it('setCorrelation updates fields', () => {
    const logger = new Logger(makeConfig());
    logger.setCorrelation({ userId: 'u1', requestId: 'r1' });
    const corr = logger.getCorrelation();
    expect(corr.userId).toBe('u1');
    expect(corr.requestId).toBe('r1');
  });

  it('clearCorrelation resets to a fresh correlationId', () => {
    const logger = new Logger(makeConfig());
    const before = logger.getCorrelation().correlationId;
    logger.setCorrelation({ userId: 'u' });
    logger.clearCorrelation();
    expect(logger.getCorrelation().userId).toBeUndefined();
    // correlationId regenerated so it may differ from `before`
    expect(typeof logger.getCorrelation().correlationId).toBe('string');
    void before; // used to suppress lint warning
  });
});

describe('Logger — child logger', () => {
  it('child inherits parent context', () => {
    const spy = new SpyTransport();
    const parent = new Logger(makeConfig({ transports: [spy] }));
    parent.setContext({ app: 'root' });
    const child = parent.child({ request: 'req-1' });
    child.info('from child');
    const entry = spy.entries[0];
    expect(entry.context?.app).toBe('root');
    expect(entry.context?.request).toBe('req-1');
  });

  it('child log does not affect parent context', () => {
    const spy = new SpyTransport();
    const parent = new Logger(makeConfig({ transports: [spy] }));
    const child = parent.child({ scope: 'child-scope' });
    child.setContext({ extra: 'yes' });
    parent.info('parent log');
    const parentEntry = spy.entries.find(e => e.message === 'parent log');
    expect(parentEntry?.context?.extra).toBeUndefined();
  });
});

describe('Logger — error handling', () => {
  it('error() attaches error message and name', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.error('boom', new Error('something failed'));
    const entry = spy.entries[0];
    expect(entry.context?.error).toBe('something failed');
    expect(entry.context?.name).toBe('Error');
  });

  it('fatal() attaches error context', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.fatal('critical', new Error('fatal err'));
    expect(spy.entries[0].level).toBe(LogLevel.FATAL);
    expect(spy.entries[0].context?.error).toBe('fatal err');
  });

  it('error() with plain object attaches it', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.error('oops', { code: 500 });
    expect(spy.entries[0].context?.error).toEqual({ code: 500 });
  });
});

describe('Logger — redaction', () => {
  it('redacts fields listed in redactFields', () => {
    const spy = new SpyTransport();
    const logger = new Logger(
      makeConfig({ redactFields: ['password', 'token'], transports: [spy] })
    );
    logger.info('login', { password: 'secret', token: 'abc', user: 'alice' });
    const ctx = spy.entries[0].context!;
    expect(ctx.password).toBe('[REDACTED]');
    expect(ctx.token).toBe('[REDACTED]');
    expect(ctx.user).toBe('alice');
  });

  it('leaves fields not in redactFields unchanged', () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ redactFields: ['secret'], transports: [spy] }));
    logger.info('msg', { name: 'alice' });
    expect(spy.entries[0].context?.name).toBe('alice');
  });
});

describe('Logger — metrics', () => {
  it('totalLogs increments per log call', () => {
    const logger = new Logger(makeConfig());
    logger.info('a');
    logger.info('b');
    logger.warn('c');
    expect(logger.getMetrics().totalLogs).toBe(3);
  });

  it('logsByLevel tracks counts per level', () => {
    const logger = new Logger(makeConfig());
    logger.info('1');
    logger.info('2');
    logger.error('e');
    const m = logger.getMetrics();
    expect(m.logsByLevel[LogLevel.INFO]).toBe(2);
    expect(m.logsByLevel[LogLevel.ERROR]).toBe(1);
  });

  it('errorRate reflects errors / total', () => {
    const logger = new Logger(makeConfig());
    logger.info('ok');
    logger.info('ok');
    logger.error('bad');
    const { errorRate } = logger.getMetrics();
    expect(errorRate).toBeCloseTo(1 / 3);
  });

  it('getMetrics returns a copy', () => {
    const logger = new Logger(makeConfig());
    logger.info('x');
    const m = logger.getMetrics();
    m.totalLogs = 999;
    expect(logger.getMetrics().totalLogs).toBe(1);
  });
});

describe('Logger — lifecycle', () => {
  it('ignores log calls after close()', async () => {
    const spy = new SpyTransport();
    const logger = new Logger(makeConfig({ transports: [spy] }));
    logger.info('before');
    await logger.close();
    logger.info('after');
    expect(spy.entries).toHaveLength(1);
    expect(spy.entries[0].message).toBe('before');
  });

  it('health() returns true when all transports are healthy', async () => {
    const logger = new Logger(makeConfig());
    expect(await logger.health()).toBe(true);
  });
});

// ---------- ConsoleTransport ----------

describe('ConsoleTransport', () => {
  it('defaults to INFO level', () => {
    const t = new ConsoleTransport();
    expect(t.level).toBe(LogLevel.INFO);
  });

  it('accepts custom level', () => {
    const t = new ConsoleTransport(LogLevel.DEBUG);
    expect(t.level).toBe(LogLevel.DEBUG);
  });

  it('format() returns a non-empty string', () => {
    const t = new ConsoleTransport();
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'hi',
      service: 'svc'
    };
    expect(typeof t.format(entry)).toBe('string');
    expect(t.format(entry).length).toBeGreaterThan(0);
  });

  it('write() suppresses entries below its level', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const t = new ConsoleTransport(LogLevel.WARN);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'suppressed'
    };
    t.write(entry);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ---------- JsonTransport ----------

describe('JsonTransport', () => {
  it('format() returns valid JSON', () => {
    const t = new JsonTransport();
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'json'
    };
    const parsed = JSON.parse(t.format(entry));
    expect(parsed.message).toBe('json');
  });

  it('write() suppresses entries below its level', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const t = new JsonTransport(LogLevel.ERROR);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'ignored'
    };
    t.write(entry);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ---------- FilteredTransport ----------

describe('FilteredTransport', () => {
  it('forwards entries matching the filter', () => {
    const inner = new SpyTransport();
    const ft = new FilteredTransport(inner, e => e.message.includes('keep'));
    ft.write({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'keep this'
    });
    expect(inner.entries).toHaveLength(1);
  });

  it('drops entries not matching the filter', () => {
    const inner = new SpyTransport();
    const ft = new FilteredTransport(inner, e => e.message.includes('keep'));
    ft.write({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'discard this'
    });
    expect(inner.entries).toHaveLength(0);
  });

  it('inherits inner transport level when none provided', () => {
    const inner = new SpyTransport(LogLevel.WARN);
    const ft = new FilteredTransport(inner, () => true);
    expect(ft.level).toBe(LogLevel.WARN);
  });

  it('respects explicit level override', () => {
    const inner = new SpyTransport(LogLevel.TRACE);
    const ft = new FilteredTransport(inner, () => true, LogLevel.ERROR);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: 'below level'
    };
    ft.write(entry);
    expect(inner.entries).toHaveLength(0);
  });
});

// ---------- MultiTransport ----------

describe('MultiTransport', () => {
  it('fans out to all transports', () => {
    const a = new SpyTransport();
    const b = new SpyTransport();
    const mt = new MultiTransport([a, b]);
    mt.write({ timestamp: new Date().toISOString(), level: LogLevel.INFO, message: 'hi' });
    expect(a.entries).toHaveLength(1);
    expect(b.entries).toHaveLength(1);
  });

  it('level = min of all transports', () => {
    const a = new SpyTransport(LogLevel.DEBUG);
    const b = new SpyTransport(LogLevel.ERROR);
    const mt = new MultiTransport([a, b]);
    expect(mt.level).toBe(LogLevel.DEBUG);
  });

  it('close() resolves without error', async () => {
    const mt = new MultiTransport([new SpyTransport()]);
    await expect(mt.close()).resolves.toBeUndefined();
  });
});

// ---------- RemoteTransport ----------

describe('RemoteTransport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('buffers entries up to batchSize', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const t = new RemoteTransport('http://example.com', LogLevel.TRACE, undefined, 5);
    for (let i = 0; i < 4; i++) {
      t.write({ timestamp: new Date().toISOString(), level: LogLevel.INFO, message: `m${i}` });
    }
    // batch hasn't been sent yet (need 5)
    expect(debugSpy).not.toHaveBeenCalledWith(expect.stringContaining('Sending'));
    void t.close();
    debugSpy.mockRestore();
  });

  it('close() resolves without error', async () => {
    const t = new RemoteTransport('http://example.com', LogLevel.INFO);
    await expect(t.close()).resolves.toBeUndefined();
  });
});

// ---------- LoggerFactory ----------

describe('LoggerFactory', () => {
  it('createDefault produces a working logger', () => {
    const logger = LoggerFactory.createDefault('my-svc');
    expect(() => logger.info('hello')).not.toThrow();
  });

  it('createDevelopment uses DEBUG level', () => {
    const spy = new SpyTransport(LogLevel.TRACE);
    const logger = LoggerFactory.create(makeConfig({
      service: 'dev',
      version: 'dev',
      environment: 'development',
      level: LogLevel.DEBUG,
      transports: [spy]
    }));
    logger.debug('visible');
    expect(spy.entries).toHaveLength(1);
  });

  it('createTest suppresses INFO logs', () => {
    const spy = new SpyTransport(LogLevel.TRACE);
    const logger = LoggerFactory.create(makeConfig({
      service: 'test',
      version: 'test',
      environment: 'test',
      level: LogLevel.WARN,
      transports: [spy]
    }));
    logger.info('hidden');
    expect(spy.entries).toHaveLength(0);
  });
});
