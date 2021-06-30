module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'comma-dangle': 'off',
  },
};
