import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { scaffoldPattern, ScaffoldResult } from '../src/scaffolding';
import { PatternInfo } from '../src/discovery';

jest.mock('vscode', () => ({
  window: {
    createOutputChannel: () => ({
      appendLine: jest.fn(),
      show: jest.fn()
    })
  }
}), { virtual: true });

describe('scaffolding', () => {
  let repoDir: string;
  let targetDir: string;
  const pattern: PatternInfo = {
    category: 'docker',
    name: 'multi-stage',
    path: 'docker/multi-stage',
    description: 'Multi-stage builds'
  };

  beforeEach(() => {
    repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-repo-'));
    targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-target-'));

    const patternDir = path.join(
      repoDir, 'patterns', 'docker', 'multi-stage'
    );
    fs.mkdirSync(patternDir, { recursive: true });
    fs.writeFileSync(
      path.join(patternDir, 'Dockerfile'),
      'FROM node:22-alpine'
    );
    fs.writeFileSync(
      path.join(patternDir, 'README.md'),
      '# Multi-stage\nOptimized builds.'
    );
    fs.mkdirSync(path.join(patternDir, 'scripts'));
    fs.writeFileSync(
      path.join(patternDir, 'scripts', 'build.sh'),
      '#!/bin/bash\nnpm run build'
    );
  });

  afterEach(() => {
    fs.rmSync(repoDir, { recursive: true, force: true });
    fs.rmSync(targetDir, { recursive: true, force: true });
  });

  it('copies all files in dry-run without writing', async () => {
    const result = await scaffoldPattern(
      pattern, repoDir, targetDir,
      { dryRun: true, overwrite: false }
    );
    expect(result.created.length).toBe(3);
    const targetFiles = fs.readdirSync(targetDir);
    expect(targetFiles.length).toBe(0);
  });

  it('copies files to target directory', async () => {
    const result = await scaffoldPattern(
      pattern, repoDir, targetDir,
      { dryRun: false, overwrite: false }
    );
    expect(result.created.length).toBe(3);
    expect(
      fs.existsSync(path.join(targetDir, 'Dockerfile'))
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(targetDir, 'scripts', 'build.sh')
      )
    ).toBe(true);
  });

  it('detects conflicts without overwrite', async () => {
    fs.writeFileSync(
      path.join(targetDir, 'Dockerfile'), 'existing'
    );
    const result = await scaffoldPattern(
      pattern, repoDir, targetDir,
      { dryRun: false, overwrite: false }
    );
    expect(result.conflicts).toContain('Dockerfile');
    expect(result.created.length).toBe(2);
    expect(
      fs.readFileSync(
        path.join(targetDir, 'Dockerfile'), 'utf8'
      )
    ).toBe('existing');
  });

  it('overwrites conflicts when overwrite is true', async () => {
    fs.writeFileSync(
      path.join(targetDir, 'Dockerfile'), 'existing'
    );
    const result = await scaffoldPattern(
      pattern, repoDir, targetDir,
      { dryRun: false, overwrite: true }
    );
    expect(result.conflicts.length).toBe(0);
    expect(result.created.length).toBe(3);
    expect(
      fs.readFileSync(
        path.join(targetDir, 'Dockerfile'), 'utf8'
      )
    ).toBe('FROM node:22-alpine');
  });

  it('throws for nonexistent pattern', async () => {
    const bad: PatternInfo = {
      category: 'nope', name: 'nope',
      path: 'nope/nope', description: ''
    };
    await expect(
      scaffoldPattern(bad, repoDir, targetDir, {
        dryRun: false, overwrite: false
      })
    ).rejects.toThrow('Pattern not found');
  });

  it('blocks path traversal via crafted file list', async () => {
    const discovery = require('../src/discovery');
    const original = discovery.getPatternFiles;

    const outsideFile = path.join(os.tmpdir(), 'fp-evil.txt');
    fs.writeFileSync(outsideFile, 'evil');

    discovery.getPatternFiles = () => [outsideFile];

    try {
      await expect(
        scaffoldPattern(pattern, repoDir, targetDir, {
          dryRun: false, overwrite: false
        })
      ).rejects.toThrow('Path traversal blocked');
    } finally {
      discovery.getPatternFiles = original;
      try { fs.unlinkSync(outsideFile); } catch {}
    }
  });
});
