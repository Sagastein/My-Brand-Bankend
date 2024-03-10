/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  silent: true,
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/config/**",
    "src/middleware/**",
    "src/models/**",
    "src/routes/**",
    "!src/controllers/**",
  ],
};
