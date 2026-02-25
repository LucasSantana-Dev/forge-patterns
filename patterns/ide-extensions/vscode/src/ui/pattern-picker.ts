import * as vscode from 'vscode';
import { PatternInfo, groupByCategory } from '../discovery';

interface PatternQuickPickItem extends vscode.QuickPickItem {
  pattern?: PatternInfo;
}

export async function showPatternPicker(patterns: PatternInfo[]): Promise<PatternInfo | undefined> {
  const grouped = groupByCategory(patterns);
  const items: PatternQuickPickItem[] = [];

  for (const [category, categoryPatterns] of grouped) {
    items.push({
      label: category,
      kind: vscode.QuickPickItemKind.Separator
    });
    for (const p of categoryPatterns) {
      items.push({
        label: `$(file-code) ${p.name}`,
        description: p.path,
        detail: p.description || undefined,
        pattern: p
      });
    }
  }

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a pattern to apply',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.pattern;
}
