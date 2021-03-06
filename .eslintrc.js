module.exports = {
  extends: 'vaadin',
  rules: {
    'no-shadow': 'off',
    'max-classes-per-file': 'off',
    'no-unused-expressions': 'off',

    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'off',
    'import/no-extraneous-dependencies': 'off',

    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
};
