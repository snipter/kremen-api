module.exports =  {
  parser:  '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends:  [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions:  {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx:  true,
    },
  },
  rules:  {
    // Missing return type on functions
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 'iLatLngToCoordArray' was used before it was defined
    '@typescript-eslint/no-use-before-define': 'off',
    // Type boolean trivially inferred from a boolean literal, remove type annotation
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/camelcase': 'off',
    'max-len': ['warn', { code: 120, tabWidth: 2, ignoreStrings: true }],
    'no-console': 'error',
    'no-import-assign': 'error',
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
