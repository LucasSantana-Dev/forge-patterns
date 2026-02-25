import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { log } from './ui/output';

export type Severity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  file: string;
  rule: string;
  severity: Severity;
  message: string;
  line?: number;
}

const SECRET_PATTERNS = [
  /password\s*=\s*['"][^'"{{]+['"]/i,
  /api[_-]?key\s*=\s*['"][^'"{{]+['"]/i,
  /secret\s*=\s*['"][^'"{{]+['"]/i,
  /token\s*=\s*['"][^'"{{]+['"]/i
];

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'out',
  '.next',
  'coverage',
  '__pycache__',
  '.venv'
]);

const MAX_SCAN_DEPTH = 8;
const MAX_SECRET_RESULTS = 20;

export async function validateCompliance(workspacePath: string): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  results.push(...checkEslintConfig(workspacePath));
  results.push(...checkPrettierConfig(workspacePath));
  results.push(...checkTypeScriptStrict(workspacePath));
  results.push(...checkPackageScripts(workspacePath));
  results.push(...scanForSecrets(workspacePath));

  return results;
}

function checkEslintConfig(dir: string): ValidationResult[] {
  const configs = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.ts',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc'
  ];
  const found = configs.some(c => fs.existsSync(path.join(dir, c)));
  if (found) return [];
  return [
    {
      file: dir,
      rule: 'BR-003 Code Quality',
      severity: 'warning',
      message: 'No ESLint configuration found'
    }
  ];
}

function checkPrettierConfig(dir: string): ValidationResult[] {
  const configs = [
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.json',
    '.prettierrc.yml',
    'prettier.config.js',
    'prettier.config.mjs'
  ];
  const found = configs.some(c => fs.existsSync(path.join(dir, c)));
  if (found) return [];
  return [
    {
      file: dir,
      rule: 'BR-003 Code Quality',
      severity: 'warning',
      message: 'No Prettier configuration found'
    }
  ];
}

function checkTypeScriptStrict(dir: string): ValidationResult[] {
  const tsconfigPath = path.join(dir, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return [];

  try {
    const raw = fs.readFileSync(tsconfigPath, 'utf8');
    const content = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const tsconfig = JSON.parse(content);
    if (tsconfig.compilerOptions?.strict === true) return [];
    return [
      {
        file: 'tsconfig.json',
        rule: 'BR-003 Code Quality',
        severity: 'warning',
        message: 'TypeScript strict mode is not enabled'
      }
    ];
  } catch (error) {
    if (error instanceof SyntaxError) {
      return [
        {
          file: 'tsconfig.json',
          rule: 'BR-003 Code Quality',
          severity: 'error',
          message: `Invalid JSON syntax: ${error.message}`
        }
      ];
    }
    return [];
  }
}

function checkPackageScripts(dir: string): ValidationResult[] {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return [];

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return [
        {
          file: 'package.json',
          rule: 'BR-003 Code Quality',
          severity: 'error',
          message: `Invalid JSON syntax: ${error.message}`
        }
      ];
    }
    return [];
  }

  const scripts = (pkg.scripts as Record<string, string>) ?? {};
  const results: ValidationResult[] = [];
  const required = ['lint', 'format', 'test'];

  for (const name of required) {
    if (!scripts[name]) {
      results.push({
        file: 'package.json',
        rule: 'BR-003 Code Quality',
        severity: 'warning',
        message: `Missing "${name}" script in package.json`
      });
    }
  }
  return results;
}

function scanForSecrets(dir: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const textExts = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
    '.env',
    '.yml',
    '.yaml',
    '.toml',
    '.cfg',
    '.ini',
    '.py'
  ]);

  walkForSecrets(dir, textExts, results, 0);
  return results;
}

function walkForSecrets(
  dir: string,
  exts: Set<string>,
  results: ValidationResult[],
  depth: number
): void {
  if (depth > MAX_SCAN_DEPTH || results.length > MAX_SECRET_RESULTS) {
    return;
  }

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);

    let stat: fs.Stats;
    try {
      stat = fs.lstatSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isSymbolicLink()) continue;

    if (stat.isDirectory()) {
      walkForSecrets(fullPath, exts, results, depth + 1);
      continue;
    }

    if (!exts.has(path.extname(entry))) continue;
    scanFileForSecrets(fullPath, dir, results);
    if (results.length > MAX_SECRET_RESULTS) return;
  }
}

function scanFileForSecrets(filePath: string, baseDir: string, results: ValidationResult[]): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(lines[i])) {
          results.push({
            file: path.relative(baseDir, filePath),
            rule: 'BR-001 Zero-Secrets',
            severity: 'error',
            message: 'Possible hardcoded secret detected',
            line: i + 1
          });
          break;
        }
      }
      if (results.length > MAX_SECRET_RESULTS) return;
    }
  } catch {
    log(`Secrets scan: cannot read ${filePath}`);
  }
}

export function publishDiagnostics(
  collection: vscode.DiagnosticCollection,
  workspacePath: string,
  results: ValidationResult[]
): void {
  collection.clear();

  const byFile = new Map<string, ValidationResult[]>();
  for (const r of results) {
    const key = r.file;
    const list = byFile.get(key) ?? [];
    list.push(r);
    byFile.set(key, list);
  }

  for (const [file, items] of byFile) {
    const fullPath = path.isAbsolute(file) ? file : path.join(workspacePath, file);
    const uri = vscode.Uri.file(fullPath);
    const diagnostics = items.map(r => {
      const line = (r.line ?? 1) - 1;
      const range = new vscode.Range(line, 0, line, 100);
      const severity =
        r.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : r.severity === 'warning'
            ? vscode.DiagnosticSeverity.Warning
            : vscode.DiagnosticSeverity.Information;
      const diag = new vscode.Diagnostic(range, `[${r.rule}] ${r.message}`, severity);
      diag.source = 'Forge Patterns';
      return diag;
    });
    collection.set(uri, diagnostics);
  }

  log(`Validation: ${results.length} issue(s) ` + `across ${byFile.size} file(s)`);
}
