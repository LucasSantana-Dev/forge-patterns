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
    const stat = safeLstat(categoryPath);
    if (!stat || stat.isSymbolicLink() || !stat.isDirectory()) continue;

    const description = readDescription(path.join(categoryPath, 'README.md'));

    patterns.push({
      category,
      name: category,
      path: category,
      description
    });

    let entries: string[];
    try {
      entries = fs.readdirSync(categoryPath);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry);
      const entryStat = safeLstat(entryPath);
      if (!entryStat || entryStat.isSymbolicLink() || !entryStat.isDirectory()) continue;

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
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (skip.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = safeLstat(fullPath);
    if (!stat || stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) {
      files.push(...walkDir(fullPath, skip));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function safeLstat(p: string): fs.Stats | undefined {
  try {
    return fs.lstatSync(p);
  } catch {
    return undefined;
  }
}

function readDescription(readmePath: string): string {
  if (!fs.existsSync(readmePath)) return '';
  const content = fs.readFileSync(readmePath, 'utf8');
  const match = content.match(/^[^#\n].+/m);
  const desc = match?.[0]?.trim() ?? '';
  return desc.length > 80 ? desc.slice(0, 80) + '\u2026' : desc;
}
