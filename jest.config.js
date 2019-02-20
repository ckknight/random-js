module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsConfig: {
        target: "es3",
        module: "commonjs",
        rootDir: "./src"
      }
    }
  }
};
