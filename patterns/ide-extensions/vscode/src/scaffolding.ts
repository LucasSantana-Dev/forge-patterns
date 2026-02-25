import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PatternInfo, getPatternFiles } from './discovery';
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

export async function scaffoldPattern(
  pattern: PatternInfo,
  repoPath: string,
  targetDir: string,
  options: ScaffoldOptions
): Promise<ScaffoldResult> {
  const sourcePath = path.join(repoPath, 'patterns', pattern.path);
  const result: ScaffoldResult = {
    created: [],
    skipped: [],
    conflicts: []
  };

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Pattern not found: ${sourcePath}`);
  }

  const files = getPatternFiles(sourcePath);

  for (const file of files) {
    const relative = path.relative(sourcePath, file);
    const dest = path.join(targetDir, relative);

    if (fs.existsSync(dest) && !options.overwrite) {
      result.conflicts.push(relative);
      continue;
    }

    if (options.dryRun) {
      result.created.push(relative);
      continue;
    }

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(file, dest);
    result.created.push(relative);
    log(`Created: ${relative}`);
  }

  return result;
}

export async function promptAndScaffold(pattern: PatternInfo, repoPath: string): Promise<void> {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders?.length) {
    vscode.window.showWarningMessage('Open a workspace folder before applying patterns.');
    return;
  }

  let targetDir = workspaceFolders[0].uri.fsPath;

  if (workspaceFolders.length > 1) {
    const picked = await vscode.window.showWorkspaceFolderPick({
      placeHolder: 'Select target workspace folder'
    });
    if (!picked) return;
    targetDir = picked.uri.fsPath;
  }

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

  const confirm = await vscode.window.showInformationMessage(
    `Apply "${pattern.path}"? ${detail}`,
    { modal: true },
    'Apply',
    'Apply (overwrite)',
    'Cancel'
  );

  if (!confirm || confirm === 'Cancel') return;

  const overwrite = confirm === 'Apply (overwrite)';

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
