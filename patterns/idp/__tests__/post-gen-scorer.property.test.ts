import fc from 'fast-check';
import { scoreGeneratedCode } from '../scorecards/post-gen-scorer.js';

describe('scoreGeneratedCode — property tests', () => {
  it('score is always between 0 and 100', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const result = scoreGeneratedCode(code);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      })
    );
  });

  it('grade is consistent with score', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const { score, grade } = scoreGeneratedCode(code);
        if (score >= 90) expect(grade).toBe('A');
        else if (score >= 75) expect(grade).toBe('B');
        else if (score >= 60) expect(grade).toBe('C');
        else if (score >= 40) expect(grade).toBe('D');
        else expect(grade).toBe('F');
      })
    );
  });

  it('passed respects minScore threshold', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.integer({ min: 0, max: 100 }),
        (code, minScore) => {
          const result = scoreGeneratedCode(code, { minScore });
          expect(result.passed).toBe(result.score >= minScore);
        }
      )
    );
  });

  it('all checks have positive weight', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const result = scoreGeneratedCode(code);
        for (const check of result.checks) {
          expect(check.weight).toBeGreaterThan(0);
        }
      })
    );
  });

  it('timestamp is valid ISO format', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const result = scoreGeneratedCode(code);
        expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
      })
    );
  });

  it('clean code scores higher than code with anti-patterns', () => {
    const clean = 'export function hello(): string { return "hi"; }';
    const dirty = 'export function hello(): string { console.log("debug"); // TODO fix\nreturn "hi"; }';

    const cleanScore = scoreGeneratedCode(clean);
    const dirtyScore = scoreGeneratedCode(dirty);

    expect(cleanScore.score).toBeGreaterThanOrEqual(dirtyScore.score);
  });

  it('react framework adds additional checks', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const withReact = scoreGeneratedCode(code, { framework: 'react' });
        const withoutFramework = scoreGeneratedCode(code);

        expect(withReact.checks.length).toBeGreaterThanOrEqual(
          withoutFramework.checks.length
        );
      })
    );
  });

  it('typescript: false removes type checks', () => {
    fc.assert(
      fc.property(fc.string(), (code) => {
        const withTs = scoreGeneratedCode(code, { typescript: true });
        const withoutTs = scoreGeneratedCode(code, { typescript: false });

        expect(withTs.checks.length).toBeGreaterThanOrEqual(
          withoutTs.checks.length
        );
      })
    );
  });

  it('code with exports scores higher on has-export check', () => {
    const withExport = 'export const foo = 42;';
    const withoutExport = 'const foo = 42;';

    const exportResult = scoreGeneratedCode(withExport);
    const noExportResult = scoreGeneratedCode(withoutExport);

    const exportCheck = exportResult.checks.find(c => c.name === 'has-export');
    const noExportCheck = noExportResult.checks.find(c => c.name === 'has-export');

    expect(exportCheck?.passed).toBe(true);
    expect(noExportCheck?.passed).toBe(false);
  });
});
