module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./src/setup-jest.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!flat)/", // Exclude modules except 'flat' from transformation
  ],
  // reporters: [
  //   [
  //     "jest-slow-test-reporter",
  //     { numTests: 8, warnOnSlowerThan: 300, color: true },
  //   ],
  // ],
};
