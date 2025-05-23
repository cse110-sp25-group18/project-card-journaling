module.exports = {
  verbose: true,
  maxWorkers: 1,
  projects: [
    // configuration for unit tests
    {
      displayName: "unit",
      testEnvironment: "jsdom",
      testMatch: ["**/test/**/*.unit.test.js"],
    },

    // configuration for end-to-end tests 
    {
      displayName: "e2e",
      preset: "jest-puppeteer",
      testMatch: ["**/test/**/*.e2e.test.js"],
    },
  ]
};
