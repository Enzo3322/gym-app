/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/e2e/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/__tests__/e2e/setup.ts'],
  testTimeout: 10000, // Aumente o timeout para dar mais tempo para as operações de banco de dados
  verbose: true,
}; 