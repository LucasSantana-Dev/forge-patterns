import { scoreGeneratedCode } from '../scorecards/post-gen-scorer.js';

const CLEAN_CODE = `
export interface UserProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserProps): JSX.Element {
  try {
    return (
      <div role="article" aria-label={name}>
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
    );
  } catch (err) {
    return <div>Error loading user</div>;
  }
}
`;

const DIRTY_CODE = `
function badComponent(props: any) {
  console.log('debugging');
  // TODO: fix this later
  // FIXME: hack
  return (
    <div style={{ color: 'red' }}>
      {props.items.map(item => <span>{item}</span>)}
    </div>
  );
}
`;

describe('scoreGeneratedCode', () => {
  describe('clean code', () => {
    it('scores clean TypeScript React code highly', () => {
      const result = scoreGeneratedCode(CLEAN_CODE, { framework: 'react' });
      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(result.grade).toMatch(/^[AB]$/);
      expect(result.passed).toBe(true);
    });

    it('passes all anti-pattern checks', () => {
      const result = scoreGeneratedCode(CLEAN_CODE);
      const antiPatterns = result.checks.filter(c =>
        c.name.startsWith('no-')
      );
      expect(antiPatterns.every(c => c.passed)).toBe(true);
    });
  });

  describe('dirty code', () => {
    it('scores dirty code lower', () => {
      const result = scoreGeneratedCode(DIRTY_CODE, { framework: 'react' });
      expect(result.score).toBeLessThan(60);
      expect(result.passed).toBe(false);
    });

    it('detects console statements', () => {
      const result = scoreGeneratedCode(DIRTY_CODE);
      const check = result.checks.find(c => c.name === 'no-console');
      expect(check?.passed).toBe(false);
      expect(check?.message).toContain('1 found');
    });

    it('detects TODO and FIXME comments', () => {
      const result = scoreGeneratedCode(DIRTY_CODE);
      const todo = result.checks.find(c => c.name === 'no-todo');
      const fixme = result.checks.find(c => c.name === 'no-fixme');
      expect(todo?.passed).toBe(false);
      expect(fixme?.passed).toBe(false);
    });

    it('detects inline styles', () => {
      const result = scoreGeneratedCode(DIRTY_CODE);
      const check = result.checks.find(c => c.name === 'no-inline-styles');
      expect(check?.passed).toBe(false);
    });

    it('detects any type usage', () => {
      const result = scoreGeneratedCode(DIRTY_CODE);
      const check = result.checks.find(c => c.name === 'no-any');
      expect(check?.passed).toBe(false);
    });

    it('detects missing exports', () => {
      const result = scoreGeneratedCode(DIRTY_CODE);
      const check = result.checks.find(c => c.name === 'has-export');
      expect(check?.passed).toBe(false);
    });
  });

  describe('framework checks', () => {
    it('checks React accessibility attributes', () => {
      const result = scoreGeneratedCode(CLEAN_CODE, { framework: 'react' });
      const check = result.checks.find(c => c.name === 'accessibility');
      expect(check?.passed).toBe(true);
    });

    it('skips React checks for non-React code', () => {
      const result = scoreGeneratedCode(CLEAN_CODE, { framework: 'vue' });
      const reactChecks = result.checks.filter(c =>
        ['event-handlers', 'accessibility', 'list-keys', 'no-unsafe-html'].includes(c.name)
      );
      expect(reactChecks).toHaveLength(0);
    });

    it('runs no framework checks when framework not specified', () => {
      const result = scoreGeneratedCode(CLEAN_CODE);
      const reactChecks = result.checks.filter(c =>
        c.name === 'accessibility' || c.name === 'list-keys'
      );
      expect(reactChecks).toHaveLength(0);
    });
  });

  describe('TypeScript checks', () => {
    it('detects type annotations', () => {
      const result = scoreGeneratedCode(CLEAN_CODE);
      const check = result.checks.find(c => c.name === 'type-annotations');
      expect(check?.passed).toBe(true);
    });

    it('skips TS checks when typescript is false', () => {
      const result = scoreGeneratedCode(DIRTY_CODE, { typescript: false });
      const tsChecks = result.checks.filter(c =>
        c.name === 'type-annotations' || c.name === 'no-any'
      );
      expect(tsChecks).toHaveLength(0);
    });
  });

  describe('scoring', () => {
    it('respects custom minScore threshold', () => {
      const result = scoreGeneratedCode(DIRTY_CODE, { minScore: 30 });
      expect(result.passed).toBe(result.score >= 30);
    });

    it('assigns correct grades', () => {
      const highResult = scoreGeneratedCode(CLEAN_CODE);
      expect(['A', 'B']).toContain(highResult.grade);

      const lowResult = scoreGeneratedCode(DIRTY_CODE, { framework: 'react' });
      expect(['D', 'F']).toContain(lowResult.grade);
    });

    it('includes timestamp', () => {
      const result = scoreGeneratedCode(CLEAN_CODE);
      expect(result.timestamp).toBeTruthy();
      expect(() => new Date(result.timestamp)).not.toThrow();
    });
  });

  describe('architecture checks', () => {
    it('passes for small files', () => {
      const result = scoreGeneratedCode(CLEAN_CODE);
      const check = result.checks.find(
        c => c.name === 'architecture-file-size'
      );
      expect(check?.passed).toBe(true);
    });

    it('flags files over 300 lines', () => {
      const longCode =
        'export const x: string = "a";\n'.repeat(301);
      const result = scoreGeneratedCode(longCode);
      const check = result.checks.find(
        c => c.name === 'architecture-file-size'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects too many functions', () => {
      const manyFns = Array.from(
        { length: 12 },
        (_, i) => `export function fn${i}(): void {}`
      ).join('\n');
      const result = scoreGeneratedCode(manyFns);
      const check = result.checks.find(
        c => c.name === 'architecture-function-count'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects components with too many props', () => {
      const props = Array.from(
        { length: 12 },
        (_, i) => `  prop${i}: string;`
      ).join('\n');
      const code = `export interface MyProps {\n${props}\n}`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'architecture-prop-count'
      );
      expect(check?.passed).toBe(false);
    });
  });

  describe('error handling checks', () => {
    it('detects empty catch blocks', () => {
      const code = `export function f(): void {
        try { x(); } catch (e) { }
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'error-handling-empty-catch'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects console-only catch', () => {
      const code = `export function f(): void {
        try { x(); } catch (e) { console.error(e); }
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'error-handling-console-catch'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects unhandled promise chains', () => {
      const code = `export const f = (): void => {
        fetch('/api').then(r => r.json());
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'error-handling-unhandled-promise'
      );
      expect(check?.passed).toBe(false);
    });

    it('passes when promises have catch', () => {
      const code = `export const f = (): void => {
        fetch('/api').then(r => r.json()).catch(console.error);
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'error-handling-unhandled-promise'
      );
      expect(check?.passed).toBe(true);
    });
  });

  describe('scalability checks', () => {
    it('detects N+1 query patterns', () => {
      const code = `export async function f(): Promise<void> {
        for (const id of ids) { await fetch('/api/' + id); }
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'scalability-n-plus-1'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects missing pagination', () => {
      const code = `export function List({ items }: { items: string[] }): JSX.Element {
        return <>{items.map(i => <div>{i}</div>)}</>;
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'scalability-pagination'
      );
      expect(check?.passed).toBe(false);
    });

    it('passes when pagination present', () => {
      const code = `export function List({ items, page, pageSize }: {
        items: string[]; page: number; pageSize: number;
      }): JSX.Element {
        return <>{items.map(i => <div>{i}</div>)}</>;
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'scalability-pagination'
      );
      expect(check?.passed).toBe(true);
    });
  });

  describe('hardcoded values checks', () => {
    it('detects hardcoded URLs', () => {
      const code =
        'export const API = "https://api.production.com/v1";';
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'hardcoded-urls'
      );
      expect(check?.passed).toBe(false);
    });

    it('allows localhost URLs', () => {
      const code =
        'export const API: string = "http://localhost:3000/api";';
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'hardcoded-urls'
      );
      expect(check?.passed).toBe(true);
    });

    it('detects hardcoded secrets', () => {
      const code =
        'export const config = { apiKey: "sk-1234567890abcdef" };';
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'hardcoded-secrets'
      );
      expect(check?.passed).toBe(false);
    });
  });

  describe('engineering checks', () => {
    it('detects @ts-ignore', () => {
      const code =
        'export const x: string = 1; // @ts-ignore';
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'engineering-ts-ignore'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects synchronous I/O', () => {
      const code =
        "import fs from 'fs';\nexport const d: string = fs.readFileSync('f', 'utf8');";
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'engineering-sync-io'
      );
      expect(check?.passed).toBe(false);
    });

    it('detects array index as React key', () => {
      const code = `export function List(): JSX.Element {
        return <>{items.map((item, index) => <div key={index}>{item}</div>)}</>;
      }`;
      const result = scoreGeneratedCode(code);
      const check = result.checks.find(
        c => c.name === 'engineering-index-key'
      );
      expect(check?.passed).toBe(false);
    });
  });

  describe('structure checks', () => {
    it('flags overly long lines', () => {
      const longLine = 'export const x: string = ' + 'a'.repeat(200) + ';';
      const result = scoreGeneratedCode(longLine);
      const check = result.checks.find(c => c.name === 'line-length');
      expect(check?.passed).toBe(false);
    });

    it('detects error handling', () => {
      const withTry = 'export function f(): void { try { x(); } catch (e) { } }';
      const result = scoreGeneratedCode(withTry);
      const check = result.checks.find(c => c.name === 'error-handling');
      expect(check?.passed).toBe(true);
    });
  });
});
