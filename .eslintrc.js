// .eslintrc.js

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "prettier", // ✅ ADD THIS LINE
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // ✅ MAKE SURE THIS IS THE LAST ONE
  ],
  rules: {
    // This rule runs Prettier as an ESLint rule and reports differences as errors.
    "prettier/prettier": "error",
  },
  env: {
    node: true,
    jest: true,
  },
};