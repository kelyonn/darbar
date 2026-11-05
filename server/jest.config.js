module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  setupFiles: ['<rootDir>/src/testEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
