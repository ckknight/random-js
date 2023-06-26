import typescript from 'rollup-plugin-typescript2';

const inputPath = './src/index.ts';

export default {
  input: inputPath,
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: "es3",
          declaration: false,
          declarationMap: false
        },
        exclude: ["dist/**", "**/*.test.ts"]
      }
    })
  ]
};
