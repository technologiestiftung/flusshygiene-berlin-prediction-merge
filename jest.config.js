module.exports = {
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest-setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/mocks/",
    "__tests__/jest-setup.js",
  ],
}