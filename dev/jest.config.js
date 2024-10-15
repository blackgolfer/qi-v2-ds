// jest.config.js
export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Use JavaScript modules
  testEnvironment: 'node',

  // Define module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // Use ESM transformers if necessary (e.g., Babel)
  transform: {
    '^.+\.jsx?$': 'babel-jest', // Transpile JS and JSX files with Babel
  },

  // Other Jest configurations as needed
};
