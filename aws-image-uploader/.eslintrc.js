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
    'class-methods-use-this': 0,
    'no-return-await': 0,
    'max-classes-per-file': 0,
    'no-unused-vars': 0,
    'linebreak-style': 0,
    'lines-between-class-members': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'max-len': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
  },
};
