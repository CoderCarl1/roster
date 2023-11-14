import type {Config} from 'jest';

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: "coverage",
  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },
  moduleNameMapper: {
    '~/(.*)': '../<rootDir>/app/$1',
  },
  resetMocks: true,
  restoreMocks: false,
  setupFilesAfterEnv: ['<rootDir>/../tests/mocks/prismaclient.ts'],
  slowTestThreshold: 5,
  testEnvironment: "jest-environment-node",
  testMatch: ['<rootDir>/tests/**/*.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.cache/',
    '<rootDir>/build/',
  ],
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
