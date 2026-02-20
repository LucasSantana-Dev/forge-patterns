/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src', '<rootDir>/patterns'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          verbatimModuleSyntax: false,
          isolatedModules: true
        },
        diagnostics: {
          ignoreCodes: [151002]
        }
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@patterns/(.*)$': '<rootDir>/patterns/$1',
    '^@docs/(.*)$': '<rootDir>/docs/$1'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'patterns/shared-constants/**/*.ts',
    '!src/**/*.d.ts',
    '!patterns/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!patterns/**/*.test.ts',
    '!patterns/**/*.spec.ts',
    '!dist/**',
    '!node_modules/**',
    '!coverage/**',
    '!patterns/ide-extensions/**',
    '!patterns/monitoring/**',
    '!patterns/shared-infrastructure/logger/**'
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
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
