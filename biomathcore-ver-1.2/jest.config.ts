// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js)"],
  setupFiles: ["<rootDir>/jest.setup.js"],
};
export default config;
