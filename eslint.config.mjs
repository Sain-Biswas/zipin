import { defineConfig } from "eslint/config";

import { FlatCompat } from "@eslint/eslintrc";

import reactQuery from "@tanstack/eslint-plugin-query";
import drizzle from "eslint-plugin-drizzle";
import prettier from "eslint-plugin-prettier/recommended";
import reactCompiler from "eslint-plugin-react-compiler";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = defineConfig(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  prettier,
  reactCompiler.configs.recommended,
  reactQuery.configs["flat/recommended"],
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx",
      "**/*.mjs",
      "**/*.cjs",
    ],
    plugins: {
      drizzle,
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/restrict-template-expressions": "off",
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["database", "ctx.database"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["database", "ctx.database"] },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);

export default eslintConfig;
