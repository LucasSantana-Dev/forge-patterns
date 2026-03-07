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
