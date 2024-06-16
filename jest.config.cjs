//@ts-check
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    "src/*.ts",
    "!src/index.ts", // this is just file which reexports from other files.
    "!src/dummy.ts", // just a dummy file, ignore it
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/*.(spec|test|d).ts",
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  testMatch: [
    "**/test/**/*.[jt]s?(x)",
    "!**/test/util/**/*.[jt]s?(x)",
    "!**/test/fixture/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
};

module.exports = config;
