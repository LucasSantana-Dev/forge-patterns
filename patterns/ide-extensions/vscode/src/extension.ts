import * as vscode from 'vscode';
import { discoverPatterns } from './discovery';
import { showPatternPicker } from './ui/pattern-picker';
import { promptAndScaffold } from './scaffolding';
import { validateCompliance as runValidation, publishDiagnostics } from './validation';
import { log, show } from './ui/output';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext): void {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('forgePatterns');
  context.subscriptions.push(diagnosticCollection);

  context.subscriptions.push(
    vscode.commands.registerCommand('forgePatterns.listPatterns', listPatterns),
    vscode.commands.registerCommand('forgePatterns.applyPattern', applyPattern),
    vscode.commands.registerCommand('forgePatterns.validateCompliance', validateCompliance)
  );

  log('Forge Patterns extension activated');
}

function getRepoPath(): string | undefined {
  const config = vscode.workspace.getConfiguration('forgePatterns');
  const repoPath = config.get<string>('repoPath');
  if (!repoPath) {
    vscode.window.showWarningMessage(
      'Set "forgePatterns.repoPath" in settings ' + 'to point to your local forge-patterns clone.'
    );
    return undefined;
  }
  return repoPath;
}

async function listPatterns(): Promise<void> {
  const repoPath = getRepoPath();
  if (!repoPath) return;

  const patterns = await discoverPatterns(repoPath);
  if (patterns.length === 0) {
    vscode.window.showInformationMessage('No patterns found. Check forgePatterns.repoPath.');
    return;
  }

  const selected = await showPatternPicker(patterns);
  if (selected) {
    const action = await vscode.window.showInformationMessage(
      `${selected.path}: ${selected.description}`,
      'Apply to workspace'
    );
    if (action) {
      await promptAndScaffold(selected, repoPath);
    }
  }
}

async function applyPattern(): Promise<void> {
  const repoPath = getRepoPath();
  if (!repoPath) return;

  const patterns = await discoverPatterns(repoPath);
  const selected = await showPatternPicker(patterns);
  if (selected) {
    await promptAndScaffold(selected, repoPath);
  }
}

async function validateCompliance(): Promise<void> {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders?.length) {
    vscode.window.showWarningMessage('Open a workspace folder to validate.');
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Validating workspace compliance...',
      cancellable: false
    },
    async () => {
      const results = await runValidation(workspacePath);
      publishDiagnostics(diagnosticCollection, workspacePath, results);

      const errors = results.filter(r => r.severity === 'error');
      const warnings = results.filter(r => r.severity === 'warning');

      if (results.length === 0) {
        vscode.window.showInformationMessage('All compliance checks passed!');
      } else {
        show();
        vscode.window.showWarningMessage(
          `Compliance: ${errors.length} error(s), ` +
            `${warnings.length} warning(s). ` +
            'See Problems panel for details.'
        );
      }
    }
  );
}

export function deactivate(): void {
  diagnosticCollection?.dispose();
}
