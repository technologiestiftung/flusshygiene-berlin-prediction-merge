module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    jest: true,
  },
  globals: {
    "jest/globals": true,
  },
  extends: ["prettier"],
  plugins: ["prettier", "jest"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
};