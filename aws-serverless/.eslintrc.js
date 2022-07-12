module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'max-len': 0,
  },
};
