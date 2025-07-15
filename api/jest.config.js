module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: "\\.spec\\.js$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "<rootDir>/api/src/**/*.ts",
    "!<rootDir>/api/src/main.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "node",
};
