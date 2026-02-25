import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  validateCompliance,
  publishDiagnostics,
  ValidationResult
} from '../src/validation';

const mockDiagnostics = new Map();
jest.mock('vscode', () => ({
  window: {
    createOutputChannel: () => ({
      appendLine: jest.fn(),
      show: jest.fn()
    })
  },
  Uri: {
    file: (p: string) => ({ fsPath: p, toString: () => p })
  },
  Range: class {
    constructor(
      public sl: number, public sc: number,
      public el: number, public ec: number
    ) {}
  },
  Diagnostic: class {
    source = '';
    constructor(
      public range: unknown,
      public message: string,
      public severity: number
    ) {}
  },
  DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2 }
}), { virtual: true });

describe('validation', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-val-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('ESLint config check', () => {
    it('passes when eslint.config.js exists', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'eslint.config.js'), 'export default [];'
      );
      const results = await validateCompliance(tmpDir);
      const eslint = results.filter(
        r => r.message.includes('ESLint')
      );
      expect(eslint.length).toBe(0);
    });

    it('warns when no ESLint config found', async () => {
      const results = await validateCompliance(tmpDir);
      const eslint = results.find(
        r => r.message.includes('ESLint')
      );
      expect(eslint).toBeDefined();
      expect(eslint!.severity).toBe('warning');
    });
  });

  describe('Prettier config check', () => {
    it('passes when .prettierrc exists', async () => {
      fs.writeFileSync(
        path.join(tmpDir, '.prettierrc'), '{}'
      );
      const results = await validateCompliance(tmpDir);
      const prettier = results.filter(
        r => r.message.includes('Prettier')
      );
      expect(prettier.length).toBe(0);
    });

    it('warns when no Prettier config found', async () => {
      const results = await validateCompliance(tmpDir);
      const prettier = results.find(
        r => r.message.includes('Prettier')
      );
      expect(prettier).toBeDefined();
    });
  });

  describe('TypeScript strict check', () => {
    it('passes when strict is true', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: { strict: true }
        })
      );
      const results = await validateCompliance(tmpDir);
      const ts = results.filter(
        r => r.message.includes('strict mode')
      );
      expect(ts.length).toBe(0);
    });

    it('warns when strict is false', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: { strict: false }
        })
      );
      const results = await validateCompliance(tmpDir);
      const ts = results.find(
        r => r.message.includes('strict mode')
      );
      expect(ts).toBeDefined();
      expect(ts!.severity).toBe('warning');
    });

    it('skips when no tsconfig.json', async () => {
      const results = await validateCompliance(tmpDir);
      const ts = results.filter(
        r => r.message.includes('strict mode')
      );
      expect(ts.length).toBe(0);
    });
  });

  describe('package.json scripts check', () => {
    it('passes when lint, format, test exist', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          scripts: {
            lint: 'eslint .',
            format: 'prettier .',
            test: 'jest'
          }
        })
      );
      const results = await validateCompliance(tmpDir);
      const scripts = results.filter(
        r => r.message.includes('script')
      );
      expect(scripts.length).toBe(0);
    });

    it('warns for each missing required script', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ scripts: {} })
      );
      const results = await validateCompliance(tmpDir);
      const scripts = results.filter(
        r => r.message.includes('script')
      );
      expect(scripts.length).toBe(3);
    });
  });

  describe('secret scanning', () => {
    it('detects hardcoded passwords', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'config.ts'),
        'const password = "hunter2";'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBeGreaterThan(0);
      expect(secrets[0].severity).toBe('error');
      expect(secrets[0].line).toBe(1);
    });

    it('detects API keys', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'env.ts'),
        'const API_KEY = "sk-abc123";'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBeGreaterThan(0);
    });

    it('ignores placeholder patterns', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'config.ts'),
        'const password = "{{REPLACE_WITH_PASSWORD}}";'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBe(0);
    });

    it('skips node_modules', async () => {
      fs.mkdirSync(path.join(tmpDir, 'node_modules'));
      fs.writeFileSync(
        path.join(tmpDir, 'node_modules', 'lib.ts'),
        'const secret = "leaked";'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBe(0);
    });

    it('skips non-text file extensions', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'image.png'), 'fake binary'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBe(0);
    });

    it('detects secrets in nested directories', async () => {
      fs.mkdirSync(path.join(tmpDir, 'src', 'config'), {
        recursive: true
      });
      fs.writeFileSync(
        path.join(tmpDir, 'src', 'config', 'db.ts'),
        'const token = "abc123";'
      );
      const results = await validateCompliance(tmpDir);
      const secrets = results.filter(
        r => r.rule === 'BR-001 Zero-Secrets'
      );
      expect(secrets.length).toBeGreaterThan(0);
    });
  });

  describe('TypeScript config with comments', () => {
    it('handles tsconfig with comments', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'tsconfig.json'),
        `{
  // This is strict
  "compilerOptions": {
    "strict": true /* enforce */
  }
}`
      );
      const results = await validateCompliance(tmpDir);
      const ts = results.filter(
        r => r.message.includes('strict mode')
      );
      expect(ts.length).toBe(0);
    });

    it('handles malformed tsconfig gracefully', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'tsconfig.json'), 'not json'
      );
      const results = await validateCompliance(tmpDir);
      const ts = results.filter(
        r => r.message.includes('strict mode')
      );
      expect(ts.length).toBe(0);
    });
  });

  describe('publishDiagnostics', () => {
    it('publishes results to diagnostic collection', () => {
      const items = new Map();
      const collection = {
        clear: jest.fn(),
        set: (uri: unknown, diags: unknown[]) => {
          items.set(uri, diags);
        }
      };

      const results: ValidationResult[] = [
        {
          file: 'src/index.ts',
          rule: 'BR-001',
          severity: 'error',
          message: 'secret found',
          line: 5
        },
        {
          file: 'package.json',
          rule: 'BR-003',
          severity: 'warning',
          message: 'missing lint script'
        }
      ];

      publishDiagnostics(
        collection as never, tmpDir, results
      );
      expect(collection.clear).toHaveBeenCalled();
      expect(items.size).toBe(2);
    });

    it('handles empty results', () => {
      const collection = {
        clear: jest.fn(),
        set: jest.fn()
      };
      publishDiagnostics(collection as never, tmpDir, []);
      expect(collection.clear).toHaveBeenCalled();
      expect(collection.set).not.toHaveBeenCalled();
    });
  });
});
