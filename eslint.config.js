const js = require("@eslint/js");
const nextVitals = require("eslint-config-next/core-web-vitals");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.test.{ts,tsx}", "tests/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  },
  {
    ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"]
  }
];
