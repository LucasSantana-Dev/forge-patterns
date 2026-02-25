import * as fs from 'fs';
import * as path from 'path';

export interface PatternInfo {
  name: string;
  category: string;
  path: string;
  description: string;
}

export async function discoverPatterns(
  repoPath: string,
  categoryFilter?: string
): Promise<PatternInfo[]> {
  const patternsDir = path.join(repoPath, 'patterns');
  const patterns: PatternInfo[] = [];

  if (!fs.existsSync(patternsDir)) {
    return patterns;
  }

  const categories = fs.readdirSync(patternsDir);

  for (const category of categories) {
    if (categoryFilter && category !== categoryFilter) continue;

    const categoryPath = path.join(patternsDir, category);
    const stat = fs.statSync(categoryPath);
    if (!stat.isDirectory()) continue;

    const description = readDescription(path.join(categoryPath, 'README.md'));

    patterns.push({
      category,
      name: category,
      path: category,
      description
    });

    const entries = fs.readdirSync(categoryPath);
    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry);
      const entryStat = fs.statSync(entryPath);
      if (!entryStat.isDirectory()) continue;

      const subDesc = readDescription(path.join(entryPath, 'README.md'));
      patterns.push({
        category,
        name: entry,
        path: `${category}/${entry}`,
        description: subDesc
      });
    }
  }

  return patterns;
}

export function groupByCategory(patterns: PatternInfo[]): Map<string, PatternInfo[]> {
  const grouped = new Map<string, PatternInfo[]>();
  for (const p of patterns) {
    if (p.name === p.category) continue;
    const list = grouped.get(p.category) ?? [];
    list.push(p);
    grouped.set(p.category, list);
  }
  return grouped;
}

export function getPatternFiles(patternPath: string): string[] {
  const SKIP = new Set(['node_modules', '.git', '__pycache__', 'dist', 'out']);
  return walkDir(patternPath, SKIP);
}

function walkDir(dir: string, skip: Set<string>): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (skip.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkDir(fullPath, skip));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function readDescription(readmePath: string): string {
  if (!fs.existsSync(readmePath)) return '';
  const content = fs.readFileSync(readmePath, 'utf8');
  const match = content.match(/^[^#\n].+/m);
  const desc = match?.[0]?.trim() ?? '';
  return desc.length > 80 ? desc.slice(0, 80) + '…' : desc;
}
