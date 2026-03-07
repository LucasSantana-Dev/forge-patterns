import { DependencyCollector } from '../scorecards/collectors/dependency-collector.js';
import type { DependencyStatus } from '../scorecards/collectors/dependency-collector.js';

describe('DependencyCollector', () => {
  let collector: DependencyCollector;

  beforeEach(() => {
    collector = new DependencyCollector(0);
  });

  it('should return name "dependency"', () => {
    expect(collector.name).toBe('dependency');
  });

  it('should score 100 when all deps are current', async () => {
    const result = await collector.collect({
      total_dependencies: 20,
      outdated_dependencies: [],
      major_outdated_count: 0,
      has_lockfile: true,
      vulnerability_count: 0
    });

    expect(result.score).toBe(100);
    expect(result.violations).toHaveLength(0);
    expect(result.breakdown['freshness']).toBe(100);
    expect(result.breakdown['major_versions']).toBe(100);
    expect(result.breakdown['lockfile']).toBe(100);
    expect(result.breakdown['vulnerabilities']).toBe(100);
  });

  it('should penalize outdated dependencies', async () => {
    const outdated: DependencyStatus[] = [
      {
        name: 'react',
        current: '18.0.0',
        latest: '19.0.0',
        wanted: '18.3.0',
        type: 'dependencies'
      },
      {
        name: 'typescript',
        current: '5.0.0',
        latest: '5.7.0',
        wanted: '5.7.0',
        type: 'devDependencies'
      }
    ];

    const result = await collector.collect({
      total_dependencies: 10,
      outdated_dependencies: outdated,
      major_outdated_count: 0,
      has_lockfile: true,
      vulnerability_count: 0
    });

    expect(result.score).toBeLessThan(100);
    expect(result.breakdown['freshness']).toBe(80);
    expect(result.violations).toContainEqual(
      expect.stringContaining('2 of 10 dependencies outdated')
    );
  });

  it('should heavily penalize major version gaps', async () => {
    const result = await collector.collect({
      total_dependencies: 20,
      outdated_dependencies: [],
      major_outdated_count: 4,
      has_lockfile: true,
      vulnerability_count: 0
    });

    expect(result.breakdown['major_versions']).toBe(30);
    expect(result.violations).toContainEqual(
      expect.stringContaining('4 dependencies behind by a major')
    );
  });

  it('should penalize missing lockfile', async () => {
    const result = await collector.collect({
      total_dependencies: 5,
      outdated_dependencies: [],
      major_outdated_count: 0,
      has_lockfile: false,
      vulnerability_count: 0
    });

    expect(result.breakdown['lockfile']).toBe(0);
    expect(result.violations).toContainEqual(
      expect.stringContaining('No lockfile found')
    );
  });

  it('should penalize known vulnerabilities', async () => {
    const result = await collector.collect({
      total_dependencies: 10,
      outdated_dependencies: [],
      major_outdated_count: 0,
      has_lockfile: true,
      vulnerability_count: 3
    });

    expect(result.breakdown['vulnerabilities']).toBe(20);
    expect(result.violations).toContainEqual(
      expect.stringContaining('3 known vulnerabilities')
    );
  });

  it('should score 0 for completely neglected project', async () => {
    const outdated: DependencyStatus[] = Array.from(
      { length: 10 },
      (_, i) => ({
        name: `pkg-${i}`,
        current: '1.0.0',
        latest: '5.0.0',
        wanted: '5.0.0',
        type: 'dependencies' as const
      })
    );

    const result = await collector.collect({
      total_dependencies: 10,
      outdated_dependencies: outdated,
      major_outdated_count: 10,
      has_lockfile: false,
      vulnerability_count: 8
    });

    expect(result.score).toBe(0);
    expect(result.violations.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle zero total deps gracefully', async () => {
    const result = await collector.collect({
      total_dependencies: 0,
      outdated_dependencies: [],
      major_outdated_count: 0,
      has_lockfile: true,
      vulnerability_count: 0
    });

    expect(result.breakdown['freshness']).toBe(100);
    expect(result.score).toBe(100);
  });

  it('should include metadata in result', async () => {
    const result = await collector.collect({
      total_dependencies: 15,
      outdated_dependencies: [],
      major_outdated_count: 1,
      has_lockfile: true,
      vulnerability_count: 2
    });

    expect(result.metadata).toEqual({
      totalDeps: 15,
      outdatedCount: 0,
      majorOutdated: 1,
      hasLockfile: true,
      vulnerabilityCount: 2
    });
  });

  it('should use default context values when not provided', async () => {
    const result = await collector.collect({});

    expect(result.score).toBe(100);
    expect(result.breakdown['freshness']).toBe(100);
    expect(result.breakdown['lockfile']).toBe(100);
    expect(result.violations).toHaveLength(0);
  });
});
