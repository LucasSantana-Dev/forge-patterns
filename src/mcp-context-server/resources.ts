import {
  listProjects,
  readContext,
  readMeta,
  projectExists,
  validateProjectSlug
} from './store.js';

export interface ProjectResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  project: string;
}

export function getProjectResources(): ProjectResource[] {
  return listProjects().map(meta => ({
    uri: `forge-space://context/${meta.project}`,
    name: meta.title,
    description: meta.description,
    mimeType: 'text/markdown',
    project: meta.project
  }));
}

export function readResourceContent(project: string): string {
  // Explicit validation at entry point for static analysis visibility
  validateProjectSlug(project);

  // Additional explicit validation to prevent path traversal
  if (project.includes('..') || project.includes('/') || project.includes('\\')) {
    throw new Error(`Invalid project slug "${project}". Path traversal characters not allowed.`);
  }

  return readContext(project);
}

export function findResourceByUri(uri: string): ProjectResource | undefined {
  const prefix = 'forge-space://context/';
  if (!uri.startsWith(prefix)) return undefined;
  const project = uri.slice(prefix.length);

  // Explicit validation at entry point for static analysis visibility
  try {
    validateProjectSlug(project);
  } catch {
    return undefined;
  }

  // Additional explicit validation to prevent path traversal
  if (project.includes('..') || project.includes('/') || project.includes('\\')) {
    return undefined;
  }

  if (!projectExists(project)) return undefined;
  const meta = readMeta(project);
  return {
    uri,
    name: meta.title,
    description: meta.description,
    mimeType: 'text/markdown',
    project
  };
}

export function findResourceByProject(project: string): ProjectResource | undefined {
  return findResourceByUri(`forge-space://context/${project}`);
}
