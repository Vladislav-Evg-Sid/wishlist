import { createDefaultEsmPreset } from "ts-jest";

const preset = createDefaultEsmPreset({
  tsconfig: "./tsconfig.test.json",
});

export default {
  ...preset,

  testEnvironment: "node",

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["<rootDir>/src/modules/auth/auth.service.unit.test.ts"],
};
