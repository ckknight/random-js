import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

const production = !process.env.BUILD || (process.env.BUILD === 'prod');
const inputPath = './src/index.ts';
const outputPath = (format, minify = false) => `dist/${format}/random-js${minify ? '.min' : ''}.js`;
const packageName = 'Random';

const plugins = (isProduction = false) => [
  typescript(),
  // minify for production
  //isProduction ? terser({ keep_classnames: true }) : null,
];

export default [
  // ESM
  {
    input: inputPath,
    output: {
      file: outputPath('esm', production),
      format: 'esm',
      sourcemap: true,
    },
    plugins: plugins(production),
  },
  // UMD
  {
    input: inputPath,
    output: {
      file: outputPath('umd', production),
      format: 'umd',
      name: packageName,
      sourcemap: true,
    },
    plugins: plugins(production),
  },
];
