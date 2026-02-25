/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/patterns', '<rootDir>/test'],
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/patterns/**/*.test.ts',
    '<rootDir>/patterns/**/*.spec.ts',
    '<rootDir>/patterns/**/*.test.js',
    '<rootDir>/patterns/**/*.spec.js',
    '<rootDir>/test/**/*.test.ts',
    '<rootDir>/test/**/*.spec.ts'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/patterns/ide-extensions/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          isolatedModules: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      }
    ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@patterns/(.*)$': '<rootDir>/patterns/$1',
    '^@docs/(.*)$': '<rootDir>/docs/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'patterns/shared-constants/**/*.ts',
    '!src/**/*.d.ts',
    '!patterns/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!patterns/**/*.test.ts',
    '!patterns/**/*.spec.ts',
    '!patterns/**/*.test.js',
    '!patterns/**/*.spec.js',
    '!dist/**',
    '!node_modules/**',
    '!coverage/**',
    '!patterns/ide-extensions/**',
    '!patterns/monitoring/**',
    '!patterns/shared-infrastructure/logger/**',
    '!src/mcp-context-server/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  verbose: true,
  transformIgnorePatterns: ['node_modules/(?!(@modelcontextprotocol)/)']
};
