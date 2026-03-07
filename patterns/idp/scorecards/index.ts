export {
  ScorecardAggregator,
  type AggregatedScorecard,
  type ScorecardWeights
} from './aggregator.js';
export { BaseCollector, type CollectorResult } from './collectors/base-collector.js';
export { SecurityCollector } from './collectors/security-collector.js';
export { QualityCollector } from './collectors/quality-collector.js';
export { PerformanceCollector } from './collectors/performance-collector.js';
export { ComplianceCollector } from './collectors/compliance-collector.js';
export { DependencyCollector, type DependencyStatus } from './collectors/dependency-collector.js';
export {
  scoreGeneratedCode,
  type PostGenCheck,
  type PostGenOptions,
  type PostGenScore
} from './post-gen-scorer.js';
