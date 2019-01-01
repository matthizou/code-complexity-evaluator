module.exports = {
  env: {
    es6: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 0,
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        singleQuote: true,
        tadWidth: 2,
        trailingComma: 'all',
      },
    ],
  },
}
