module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest', // Only transform .ts files
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./src/setup-jest.ts'],
  testPathIgnorePatterns: ['./src/cypress/'],
  globalSetup: 'jest-preset-angular/global-setup',
  transformIgnorePatterns: [
    '/node_modules/(?!flat)/', // Exclude modules except 'flat' from transformation
  ],
};
