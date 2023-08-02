module.exports = {
  extends: ['@geolonia'],

  env: {
    node: true,
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['/dist/*'],
};
