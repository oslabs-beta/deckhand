module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended', // Use recommended rules from ESLint
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      rules: {
        quotes: ['error', 'double'],
        semi: ['error', 'always'],
      },
    },
    {
      files: ['*.js', '*.ts'],
      rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
      },
    },
  ],
};
