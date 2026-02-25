'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const fs = require('fs');
const path = require('path');
const os = require('os');
const discovery_1 = require('../src/discovery');
describe('discovery', () => {
    let tmpDir;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-test-'));
        const patternsDir = path.join(tmpDir, 'patterns');
        fs.mkdirSync(path.join(patternsDir, 'ai', 'ml-project'), {
            recursive: true
        });
        fs.mkdirSync(path.join(patternsDir, 'docker', 'multi-stage'), {
            recursive: true
        });
        fs.writeFileSync(path.join(patternsDir, 'ai', 'README.md'), '# AI Patterns\nAI and machine learning project templates.');
        fs.writeFileSync(path.join(patternsDir, 'ai', 'ml-project', 'README.md'), '# ML Project\nStarter template for ML projects.');
        fs.writeFileSync(path.join(patternsDir, 'docker', 'README.md'), '# Docker Patterns\nContainer optimization patterns.');
        fs.writeFileSync(path.join(patternsDir, 'docker', 'multi-stage', 'README.md'), '# Multi-Stage\nOptimized multi-stage Docker builds.');
        fs.writeFileSync(path.join(patternsDir, 'docker', 'multi-stage', 'Dockerfile'), 'FROM node:22-alpine AS builder');
    });
    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    describe('discoverPatterns', () => {
        it('discovers categories and sub-patterns', async () => {
            const patterns = await (0, discovery_1.discoverPatterns)(tmpDir);
            expect(patterns.length).toBe(4);
            const names = patterns.map(p => p.path);
            expect(names).toContain('ai');
            expect(names).toContain('ai/ml-project');
            expect(names).toContain('docker');
            expect(names).toContain('docker/multi-stage');
        });
        it('parses descriptions from README.md', async () => {
            const patterns = await (0, discovery_1.discoverPatterns)(tmpDir);
            const ai = patterns.find(p => p.path === 'ai');
            expect(ai?.description).toBe('AI and machine learning project templates.');
        });
        it('filters by category', async () => {
            const patterns = await (0, discovery_1.discoverPatterns)(tmpDir, 'docker');
            const categories = new Set(patterns.map(p => p.category));
            expect(categories.size).toBe(1);
            expect(categories.has('docker')).toBe(true);
        });
        it('returns empty for nonexistent repo', async () => {
            const patterns = await (0, discovery_1.discoverPatterns)('/nonexistent');
            expect(patterns).toEqual([]);
        });
        it('truncates long descriptions to 80 chars', async () => {
            const longDesc = 'A'.repeat(100);
            fs.writeFileSync(path.join(tmpDir, 'patterns', 'ai', 'README.md'), `# AI\n${longDesc}`);
            const patterns = await (0, discovery_1.discoverPatterns)(tmpDir);
            const ai = patterns.find(p => p.path === 'ai');
            expect(ai.description.length).toBeLessThanOrEqual(81);
            expect(ai.description.endsWith('…')).toBe(true);
        });
    });
    describe('groupByCategory', () => {
        it('groups sub-patterns by category', () => {
            const patterns = [
                { category: 'ai', name: 'ai', path: 'ai', description: '' },
                {
                    category: 'ai', name: 'ml-project',
                    path: 'ai/ml-project', description: ''
                },
                {
                    category: 'docker', name: 'docker',
                    path: 'docker', description: ''
                },
                {
                    category: 'docker', name: 'multi-stage',
                    path: 'docker/multi-stage', description: ''
                }
            ];
            const grouped = (0, discovery_1.groupByCategory)(patterns);
            expect(grouped.get('ai')?.length).toBe(1);
            expect(grouped.get('docker')?.length).toBe(1);
        });
        it('excludes category-level entries', () => {
            const patterns = [
                { category: 'ai', name: 'ai', path: 'ai', description: '' }
            ];
            const grouped = (0, discovery_1.groupByCategory)(patterns);
            expect(grouped.get('ai')).toBeUndefined();
        });
    });
    describe('getPatternFiles', () => {
        it('lists files recursively', () => {
            const patternPath = path.join(tmpDir, 'patterns', 'docker', 'multi-stage');
            const files = (0, discovery_1.getPatternFiles)(patternPath);
            expect(files.length).toBe(2);
            const basenames = files.map(f => path.basename(f));
            expect(basenames).toContain('README.md');
            expect(basenames).toContain('Dockerfile');
        });
        it('skips node_modules and .git', () => {
            const patternPath = path.join(tmpDir, 'patterns', 'docker', 'multi-stage');
            fs.mkdirSync(path.join(patternPath, 'node_modules'));
            fs.writeFileSync(path.join(patternPath, 'node_modules', 'pkg.json'), '{}');
            const files = (0, discovery_1.getPatternFiles)(patternPath);
            const basenames = files.map(f => path.basename(f));
            expect(basenames).not.toContain('pkg.json');
        });
    });
});
//# sourceMappingURL=discovery.test.js.map