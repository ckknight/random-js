module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      tsconfig: {
        target: 'es5',
        module: 'commonjs',
        rootDir: './src',
      },
    },]
  }
};
