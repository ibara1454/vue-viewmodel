import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      // The CommonJS module.
      // Generate a single output file.
      {
        file: pkg.exports.require,
        format: 'cjs',
        sourcemap: true,
      },
      // The ES module.
      // Generate a single output file.
      {
        file: pkg.exports.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      // Note that the official typescript plugin has an issue on version over than 4.0.0.
      // > Error: @rollup/plugin-typescript: 'dir' must be used when 'outDir' is specified.
      // The above error occurred when the 'dir' property is not equal to tsconfig:outDir.
      // For more information, see https://github.com/rollup/plugins/issues/287
      // To avoid this error, we use 'rollup-plugin-typescript2' instead the official typescript
      // plugin.

      // (Optional) Pass options to overrides the default settings from the tsconfig.json.
      // https://github.com/rollup/plugins/tree/bc6a86cb795e8fa752ca078ae0f38e23daf01112/packages/typescript#options
      typescript(),
    ],
  },
  // Roll-up .d.ts definition file.
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
        sourcemap: true,
      },
    ],
    // Use rollup-plugin-dts plugin to generate definition files.
    // https://github.com/Swatinem/rollup-plugin-dts
    plugins: [dts()],
  },
];
