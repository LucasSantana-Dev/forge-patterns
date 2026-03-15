import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { AssessmentFinding, AssessmentContext, CategoryScore, Grade } from '../types.js';

export function collectGovernanceFindings(ctx: AssessmentContext): CategoryScore {
  const findings: AssessmentFinding[] = [];
  const { dir } = ctx;

  checkCodingRules(dir, findings);
  checkAiSkills(dir, findings);
  checkHooks(dir, findings);
  checkSecurityPolicies(dir, findings);
  checkCiGovernance(dir, findings);

  return scoreCategory(findings);
}

function checkCodingRules(dir: string, findings: AssessmentFinding[]): void {
  const hasClaude = existsSync(join(dir, 'CLAUDE.md'));
  const hasCursor = existsSync(join(dir, '.cursorrules'));
  const hasCopilot = existsSync(join(dir, '.github', 'copilot-instructions.md'));

  if (!hasClaude && !hasCursor && !hasCopilot) {
    findings.push({
      category: 'ai-governance',
      severity: 'critical',
      message: 'No AI coding rules found ' + '(CLAUDE.md, .cursorrules, or copilot-instructions.md)'
    });
    return;
  }

  if (!hasClaude) {
    findings.push({
      category: 'ai-governance',
      severity: 'medium',
      message: 'Missing CLAUDE.md — Claude Code has no project context'
    });
  }

  if (hasClaude) {
    const content = safeRead(join(dir, 'CLAUDE.md'));
    if (content && content.length < 200) {
      findings.push({
        category: 'ai-governance',
        severity: 'medium',
        message:
          'CLAUDE.md is minimal (<200 chars) — add conventions, ' +
          'gotchas, and architecture notes',
        file: 'CLAUDE.md'
      });
    }
  }
}

function checkAiSkills(dir: string, findings: AssessmentFinding[]): void {
  const skillsDir = join(dir, '.claude', 'skills');
  if (!existsSync(skillsDir)) {
    findings.push({
      category: 'ai-governance',
      severity: 'low',
      message: 'No .claude/skills/ directory — consider adding AI skills'
    });
    return;
  }

  let entries: string[];
  try {
    entries = readdirSync(skillsDir);
  } catch {
    return;
  }

  const skillFiles = entries.filter(e => e.endsWith('.md') || e.endsWith('.txt'));
  if (skillFiles.length === 0) {
    findings.push({
      category: 'ai-governance',
      severity: 'low',
      message: '.claude/skills/ exists but has no skill files'
    });
  }
}

function checkHooks(dir: string, findings: AssessmentFinding[]): void {
  const settingsPath = join(dir, '.claude', 'settings.json');
  if (!existsSync(settingsPath)) {
    findings.push({
      category: 'ai-governance',
      severity: 'medium',
      message: 'No .claude/settings.json — no pre/post tool-use hooks configured'
    });
    return;
  }

  const content = safeRead(settingsPath);
  if (!content) return;

  try {
    const settings = JSON.parse(content);
    const hooks = settings.hooks ?? {};
    const preTools = hooks.PreToolUse ?? [];
    const postTools = hooks.PostToolUse ?? [];

    if (preTools.length === 0 && postTools.length === 0) {
      findings.push({
        category: 'ai-governance',
        severity: 'low',
        message: 'settings.json has no hooks — consider adding ' + 'formatting or safety hooks',
        file: '.claude/settings.json'
      });
    }
  } catch {
    findings.push({
      category: 'ai-governance',
      severity: 'low',
      message: '.claude/settings.json is not valid JSON',
      file: '.claude/settings.json'
    });
  }
}

function checkSecurityPolicies(dir: string, findings: AssessmentFinding[]): void {
  const hasSecurity = existsSync(join(dir, 'SECURITY.md'));
  if (!hasSecurity) {
    findings.push({
      category: 'ai-governance',
      severity: 'medium',
      message: 'No SECURITY.md — add a security policy'
    });
  }

  const hasEnvProtection =
    existsSync(join(dir, '.gitignore')) &&
    (safeRead(join(dir, '.gitignore')) ?? '').includes('.env');
  if (!hasEnvProtection) {
    findings.push({
      category: 'ai-governance',
      severity: 'high',
      message: '.env not in .gitignore — secrets may be committed'
    });
  }

  const mcpPath = join(dir, '.mcp.json');
  if (existsSync(mcpPath)) {
    const content = safeRead(mcpPath);
    if (content && (content.includes('API_KEY') || content.includes('SECRET'))) {
      findings.push({
        category: 'ai-governance',
        severity: 'critical',
        message: '.mcp.json may contain hardcoded secrets — use env vars',
        file: '.mcp.json'
      });
    }
  }
}

function checkCiGovernance(dir: string, findings: AssessmentFinding[]): void {
  const ghDir = join(dir, '.github', 'workflows');
  if (!existsSync(ghDir)) return;

  let workflows: string[];
  try {
    workflows = readdirSync(ghDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  } catch {
    return;
  }

  const allContent = workflows.map(f => safeRead(join(ghDir, f)) ?? '').join('\n');

  if (
    !allContent.includes('secret-scan') &&
    !allContent.includes('trufflehog') &&
    !allContent.includes('gitguardian') &&
    !allContent.includes('ggshield')
  ) {
    findings.push({
      category: 'ai-governance',
      severity: 'high',
      message: 'No secret scanning in CI workflows'
    });
  }

  if (
    !allContent.includes('semgrep') &&
    !allContent.includes('codeql') &&
    !allContent.includes('snyk')
  ) {
    findings.push({
      category: 'ai-governance',
      severity: 'medium',
      message: 'No SAST tool in CI workflows (Semgrep, CodeQL, Snyk)'
    });
  }
}

function safeRead(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

function scoreCategory(findings: AssessmentFinding[]): CategoryScore {
  let penalty = 0;
  for (const f of findings) {
    switch (f.severity) {
      case 'critical':
        penalty += 25;
        break;
      case 'high':
        penalty += 15;
        break;
      case 'medium':
        penalty += 8;
        break;
      case 'low':
        penalty += 3;
        break;
    }
  }
  const score = Math.max(0, 100 - penalty);
  const grade: Grade =
    score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';
  return { category: 'ai-governance', score, grade, findings };
}
