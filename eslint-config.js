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
      files: ['*.ts', '*.tsx'],
      rules: {
        quotes: ['error', 'double'], // Use double quotes for TSX/JSX files
        semi: ['error', 'always'],
      },
    },
    {
      files: ['*.js', '*.jsx', '*.mjs'],
      rules: {
        quotes: ['error', 'single'], // Use single quotes for JS/JSX files
        semi: ['error', 'always'],
      },
    },
  ],
};
