module.exports = {
  env: {
    node: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: [
    // Adds rules of JSDoc.
    // https://github.com/gajus/eslint-plugin-jsdoc/blob/v30.5.1/src/index.js
    'plugin:jsdoc/recommended',
    // Applies the typescript shareable config.
    // https://github.com/typescript-eslint/typescript-eslint/blob/v4.1.0/packages/eslint-plugin/src/configs/recommended.ts
    'plugin:@typescript-eslint/recommended',
    // Turns off all rules that are unnecessary or might conflict with Prettier.
    // https://github.com/prettier/eslint-config-prettier/tree/9444ee0b20f9af3ff364f62d6a9ab967ad673a9d
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'prettier/prettier': 'error',
    // Forces writting JSDoc.
    'jsdoc/require-jsdoc': 'error',
  },
};
