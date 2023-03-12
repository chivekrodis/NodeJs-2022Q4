/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '.(ts|tsx)': 'ts-jest' },
  testRegex: '/__tests__/.*\\.(test|spec)?\\.(ts|js)$',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/__tests__/', '/models/', '/constants/'],
};
