/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  roots: ["<rootDir>"],

  testMatch: ["**/(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "^@(|/.*)$": "<rootDir>/src/$1"
  }
};
