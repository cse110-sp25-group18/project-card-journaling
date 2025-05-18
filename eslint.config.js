import js from "@eslint/js";
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      js,
      "@stylistic": stylistic
    },
    extends: ["js/recommended"],
    rules: {
      // require curly braces for all control statements (if, else, for, while, etc.)
      curly: "error", 

      // always require semicolons at the end of statements
      "@stylistic/semi": ["error", "always"],

      // enforce consistent brace style for blocks
      "@stylistic/brace-style": "error",

      // enforce consistent indentation (2 spaces, with switch cases indented once)
      "@stylistic/indent": ["error", 2, { "SwitchCase": 1 }],

      // limit the number of statements per line to improve readability
      "@stylistic/max-statements-per-line": ["error", { "max": 1 }]
    }
  }
]);
