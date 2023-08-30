module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    // 'plugin:tslint-consistent-codestyle',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['UPPER_CASE', 'snake_case'],
      },
      {
        selector: ['classMethod', 'class'],
        format: ['PascalCase'],
      },
    ],
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   {
    //     selector: 'classMethod',
    //     format: ['PascalCase'],
    //   },
    // ],
    // '@typescript-eslint/naming-convention': [
    //   'warn',
    //   {
    //     selector: 'functionVariable',
    //     format: ['camelCase'],
    //   },
    // ],
    // 'tslint-consistent-codestyle':[

    // ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
  },
};
