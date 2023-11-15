import type { Config } from "jest";

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/app/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/app/lib/**",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
  },
  resetMocks: true,
  restoreMocks: false,
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.ts",
  ],
  slowTestThreshold: 5,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/build/",
    "<rootDir>/tests/mocks"
    ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
};

export default config;
