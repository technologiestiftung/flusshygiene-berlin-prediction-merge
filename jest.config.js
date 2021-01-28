module.exports = {
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest-setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/mocks/",
    "__tests__/jest-setup.js",
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};
