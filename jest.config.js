module.exports = {
  verbose: true,
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.spec.{js,ts}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    // Set the path alias such that you can use like '@/foo' to reference 'src/foo'.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
