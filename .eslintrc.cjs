module.exports = {
  extends: ['@geolonia'],

  env: {
    node: true,
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    '/modules/web/bin/*.js',
    '**/dist/*',
  ],

  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
