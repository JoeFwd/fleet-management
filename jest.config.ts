export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }]
  },
  moduleNameMapper: {
    // imports using @backend alias
    '^@backend/(.*)\\.(m)?js$': '<rootDir>/Backend/src/$1',
    // Relative path imports
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['./Backend/src/**/*.ts']
};
