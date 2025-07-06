export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup/env.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  // moduleNameMapping: {
  //   '^src/(.*)$': '<rootDir>/src/$1',
  //   '^tests/(.*)$': '<rootDir>/tests/$1',
  // },
};
