module.exports = {
  env: {
    node: true,
    es6: true,
  },
  plugins: [
    'prettier',
    // Using tsdoc plugin to check the tsdoc format.
    // https://github.com/microsoft/tsdoc/tree/%40microsoft/tsdoc_v0.12.21/eslint-plugin
    'tsdoc',
  ],
  extends: [
    // Applies the typescript shareable config.
    // (Note that the recommended config provides the 'overrides.files': ['*.ts, *.tsx]
    // settings, it makes ESLint be applied on TypeScript files)
    // https://github.com/typescript-eslint/typescript-eslint/blob/v4.1.0/packages/eslint-plugin/src/configs/recommended.ts
    // https://github.com/typescript-eslint/typescript-eslint/blob/v4.1.0/packages/eslint-plugin/src/configs/eslint-recommended.ts
    'plugin:@typescript-eslint/recommended',
    // Turns off all rules that are unnecessary or might conflict with Prettier.
    // https://github.com/prettier/eslint-config-prettier/tree/9444ee0b20f9af3ff364f62d6a9ab967ad673a9d
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'prettier/prettier': 'error',
    'tsdoc/syntax': 'warn',
  },
  // By default, without `overrides` section, ESLint will not be applied on
  // non-JavaScript file (*.js).
  overrides: [
    // The rules for *.vue files.
    {
      files: ['*.vue'],
      // Overrides the other extends rules by eslint-plugin-vue.
      // Note that 'plugin:vue/recommended' doesn't specify the 'files'
      // option, so we have to apply it on *.vue files in the 'overrides' section.
      extends: ['plugin:vue/recommended'],
    },
  ],
};
