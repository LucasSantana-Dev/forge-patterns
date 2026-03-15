const fs = require('node:fs');

describe('Core package import side effects', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not write project files when importing package root', () => {
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync');
    const writeSpy = jest.spyOn(fs, 'writeFileSync');

    jest.isolateModules(() => {
      require('./index');
    });

    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
