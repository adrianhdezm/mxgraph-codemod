module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 11
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error'
  }
};
