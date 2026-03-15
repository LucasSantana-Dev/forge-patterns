import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateProjectSlug, safeResolve } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORE_DIR = process.env.MCP_CONTEXT_STORE_PATH
  ? resolve(process.env.MCP_CONTEXT_STORE_PATH)
  : resolve(__dirname, '..', '..', 'src', 'mcp-context-server', 'context-store');

interface ProjectMeta {
  project: string;
  title: string;
  description: string;
  updatedAt: string;
}

function metaPath(project: string): string {
  validateProjectSlug(project);
  return safeResolve(STORE_DIR, `${project}.meta.json`);
}

function contentPath(project: string): string {
  validateProjectSlug(project);
  return safeResolve(STORE_DIR, `${project}.md`);
}

function ensureStoreDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

export function listProjects(): ProjectMeta[] {
  ensureStoreDir();
  const files = readdirSync(STORE_DIR).filter(f => f.endsWith('.meta.json'));
  return files
    .map(f => {
      const raw = readFileSync(resolve(STORE_DIR, f), 'utf-8');
      return JSON.parse(raw) as ProjectMeta;
    })
    .sort((a, b) => a.project.localeCompare(b.project));
}

export function projectExists(project: string): boolean {
  return existsSync(contentPath(project)) && existsSync(metaPath(project));
}

export function readContext(project: string): string {
  const cp = contentPath(project);
  if (!existsSync(cp)) {
    throw new Error(
      `No context found for project "${project}". Use update_project_context to add it.`
    );
  }
  return readFileSync(cp, 'utf-8');
}

export function readMeta(project: string): ProjectMeta {
  const mp = metaPath(project);
  if (!existsSync(mp)) {
    throw new Error(`No metadata found for project "${project}".`);
  }
  return JSON.parse(readFileSync(mp, 'utf-8')) as ProjectMeta;
}

export function writeContext(
  project: string,
  content: string,
  title: string,
  description: string
): ProjectMeta {
  ensureStoreDir();

  const cp = contentPath(project);
  const mp = metaPath(project);
  const now = new Date().toISOString();

  writeFileSync(cp, content, 'utf-8');

  const meta: ProjectMeta = {
    project,
    title,
    description,
    updatedAt: now
  };
  writeFileSync(mp, JSON.stringify(meta, null, 2), 'utf-8');

  return meta;
}
