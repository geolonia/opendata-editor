module.exports = {
  extends: [
    '@geolonia',
    'plugin:storybook/recommended',
  ],

  env: {
    node: true,
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['/dist/*'],

  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
