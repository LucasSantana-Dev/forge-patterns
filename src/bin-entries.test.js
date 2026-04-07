const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const pkg = require('../package.json');

describe('package.json bin entries', () => {
  const binEntries = Object.entries(pkg.bin || {});

  it('declares at least one bin entry', () => {
    expect(binEntries.length).toBeGreaterThan(0);
  });

  it.each(binEntries)('bin "%s" -> "%s" exists in the published files', (name, relPath) => {
    const absPath = path.join(repoRoot, relPath);
    expect(fs.existsSync(absPath)).toBe(true);
  });

  it.each(binEntries)('bin "%s" -> "%s" starts with a node shebang', (name, relPath) => {
    const absPath = path.join(repoRoot, relPath);
    if (!fs.existsSync(absPath)) return;
    const firstLine = fs.readFileSync(absPath, 'utf8').split('\n', 1)[0];
    expect(firstLine).toMatch(/^#!.*\bnode\b/);
  });

  it.each(binEntries)('bin "%s" -> "%s" lives under a path declared in pkg.files', (name, relPath) => {
    const topDir = relPath.split('/')[0] + '/';
    expect(pkg.files).toEqual(expect.arrayContaining([topDir]));
  });
});
