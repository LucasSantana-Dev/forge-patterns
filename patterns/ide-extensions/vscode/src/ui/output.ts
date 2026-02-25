import * as vscode from 'vscode';

let channel: vscode.OutputChannel | undefined;

export function getOutputChannel(): vscode.OutputChannel {
  if (!channel) {
    channel = vscode.window.createOutputChannel('Forge Patterns');
  }
  return channel;
}

export function log(message: string): void {
  getOutputChannel().appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
}

export function show(): void {
  getOutputChannel().show(true);
}
