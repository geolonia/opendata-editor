module.exports = {
  extends: ['@geolonia'],

  env: {
    node: true,
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [ '**/dist/*' ],

  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [{
    files: [ './modules/create/**/*.ts' ],
    parserOptions: {
      project: './modules/create/tsconfig.json',
    },
  }],
};
