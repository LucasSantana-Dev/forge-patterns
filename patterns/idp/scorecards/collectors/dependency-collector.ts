import { BaseCollector, type CollectorResult } from './base-collector.js';

export interface DependencyStatus {
  name: string;
  current: string;
  latest: string;
  wanted: string;
  type: 'dependencies' | 'devDependencies';
}

export class DependencyCollector extends BaseCollector {
  get name(): string {
    return 'dependency';
  }

  protected async doCollect(context: Record<string, unknown>): Promise<CollectorResult> {
    const violations: string[] = [];
    const breakdown: Record<string, number> = {};

    const totalDeps = (context['total_dependencies'] as number | undefined) ?? 0;
    const outdatedDeps = (context['outdated_dependencies'] as DependencyStatus[] | undefined) ?? [];
    const majorOutdated = (context['major_outdated_count'] as number | undefined) ?? 0;
    const hasLockfile = (context['has_lockfile'] as boolean | undefined) ?? true;
    const hasVulnerabilities = (context['vulnerability_count'] as number | undefined) ?? 0;

    breakdown['freshness'] = this.scoreFreshness(totalDeps, outdatedDeps.length);
    breakdown['major_versions'] = this.scoreMajorVersions(majorOutdated);
    breakdown['lockfile'] = hasLockfile ? 100 : 0;
    breakdown['vulnerabilities'] = this.scoreVulnerabilities(hasVulnerabilities);

    if (outdatedDeps.length > 0) {
      const pct = Math.round((outdatedDeps.length / totalDeps) * 100);
      violations.push(`${outdatedDeps.length} of ${totalDeps} dependencies outdated (${pct}%)`);
    }
    if (majorOutdated > 0) {
      violations.push(`${majorOutdated} dependencies behind by a major version`);
    }
    if (!hasLockfile) {
      violations.push('No lockfile found (package-lock.json or yarn.lock)');
    }
    if (hasVulnerabilities > 0) {
      violations.push(`${hasVulnerabilities} known vulnerabilities in dependencies`);
    }

    const weights = {
      freshness: 0.4,
      major_versions: 0.25,
      lockfile: 0.15,
      vulnerabilities: 0.2
    };

    let weightedTotal = 0;
    let weightSum = 0;
    for (const [key, weight] of Object.entries(weights)) {
      weightedTotal += (breakdown[key] ?? 0) * weight;
      weightSum += weight;
    }

    const score = weightSum > 0 ? Math.round(weightedTotal / weightSum) : 0;

    return {
      score,
      breakdown,
      violations,
      metadata: {
        totalDeps,
        outdatedCount: outdatedDeps.length,
        majorOutdated,
        hasLockfile,
        vulnerabilityCount: hasVulnerabilities
      }
    };
  }

  private scoreFreshness(total: number, outdated: number): number {
    if (total === 0) return 100;
    const ratio = 1 - outdated / total;
    return Math.round(ratio * 100);
  }

  private scoreMajorVersions(majorOutdated: number): number {
    if (majorOutdated === 0) return 100;
    if (majorOutdated <= 2) return 60;
    if (majorOutdated <= 5) return 30;
    return 0;
  }

  private scoreVulnerabilities(count: number): number {
    if (count === 0) return 100;
    if (count <= 2) return 50;
    if (count <= 5) return 20;
    return 0;
  }
}
