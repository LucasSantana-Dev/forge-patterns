import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PatternInfo, getPatternFiles } from './discovery';
import { assertWithinBase } from './pathUtils';
import { log } from './ui/output';

export interface ScaffoldOptions {
  dryRun: boolean;
  overwrite: boolean;
}

export interface ScaffoldResult {
  created: string[];
  skipped: string[];
  conflicts: string[];
}

function isFileNotFound(err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  return code === 'FileNotFound' || code === 'ENOENT';
}

async function destExists(dest: string): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(dest));
    return true;
  } catch (err) {
    if (isFileNotFound(err)) return false;
    throw err;
  }
}

async function ensureDestDirectory(destDir: string): Promise<void> {
  const uri = vscode.Uri.file(destDir);
  try {
    await vscode.workspace.fs.stat(uri);
  } catch (err) {
    if (isFileNotFound(err)) {
      await vscode.workspace.fs.createDirectory(uri);
      return;
    }
    throw err;
  }
}

async function readSourceFile(filePath: string): Promise<Uint8Array> {
  return vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
}

export async function scaffoldPattern(
  pattern: PatternInfo,
  repoPath: string,
  targetDir: string,
  options: ScaffoldOptions
): Promise<ScaffoldResult> {
  const patternsBase = path.join(repoPath, 'patterns');
  const sourcePath = path.join(patternsBase, pattern.path);
  assertWithinBase(path.resolve(sourcePath), path.resolve(patternsBase));

  const result: ScaffoldResult = {
    created: [],
    skipped: [],
    conflicts: []
  };

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Pattern not found: ${sourcePath}`);
  }

  const targetResolved = path.resolve(targetDir);
  const files = getPatternFiles(sourcePath);

  for (const file of files) {
    const relative = path.relative(sourcePath, file);
    const dest = path.join(targetDir, relative);
    assertWithinBase(path.resolve(dest), targetResolved);

    const exists = await destExists(dest);
    if (exists && !options.overwrite) {
      result.conflicts.push(relative);
      continue;
    }

    if (options.dryRun) {
      result.created.push(relative);
      continue;
    }

    const destDir = path.dirname(dest);
    await ensureDestDirectory(destDir);

    const content = await readSourceFile(file);
    await vscode.workspace.fs.writeFile(vscode.Uri.file(dest), content);
    result.created.push(relative);
    log(`Created: ${relative}`);
  }

  return result;
}

async function selectTargetDir(): Promise<string | undefined> {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders?.length) {
    vscode.window.showWarningMessage('Open a workspace folder before applying patterns.');
    return undefined;
  }

  if (workspaceFolders.length === 1) {
    return workspaceFolders[0].uri.fsPath;
  }

  const picked = await vscode.window.showWorkspaceFolderPick({
    placeHolder: 'Select target workspace folder'
  });
  return picked?.uri.fsPath;
}

async function confirmScaffold(
  pattern: PatternInfo,
  repoPath: string,
  targetDir: string
): Promise<{ confirmed: boolean; overwrite: boolean }> {
  const dryResult = await scaffoldPattern(pattern, repoPath, targetDir, {
    dryRun: true,
    overwrite: false
  });

  const fileCount = dryResult.created.length;
  const conflictCount = dryResult.conflicts.length;
  let detail = `${fileCount} file(s) to create`;
  if (conflictCount > 0) {
    detail += `, ${conflictCount} conflict(s)`;
  }

  const choice = await vscode.window.showInformationMessage(
    `Apply "${pattern.path}"? ${detail}`,
    { modal: true },
    'Apply',
    'Apply (overwrite)',
    'Cancel'
  );

  if (!choice || choice === 'Cancel') {
    return { confirmed: false, overwrite: false };
  }
  return {
    confirmed: true,
    overwrite: choice === 'Apply (overwrite)'
  };
}

export async function promptAndScaffold(pattern: PatternInfo, repoPath: string): Promise<void> {
  const targetDir = await selectTargetDir();
  if (!targetDir) return;

  const { confirmed, overwrite } = await confirmScaffold(pattern, repoPath, targetDir);
  if (!confirmed) return;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Applying ${pattern.path}...`,
      cancellable: false
    },
    async () => {
      const result = await scaffoldPattern(pattern, repoPath, targetDir, {
        dryRun: false,
        overwrite
      });

      const msg =
        `Applied ${pattern.path}: ` +
        `${result.created.length} created` +
        (result.skipped.length ? `, ${result.skipped.length} skipped` : '') +
        (result.conflicts.length ? `, ${result.conflicts.length} conflicts` : '');

      vscode.window.showInformationMessage(msg);
    }
  );
}
