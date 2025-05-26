export default {
  verbose: true,
  maxWorkers: 1,

  projects: [
    {
      displayName: "unit",
      testEnvironment: "jsdom",
      testMatch: ["**/test/**/*.unit.test.js"],
    },
    {
      displayName: "e2e",
      preset: "jest-puppeteer",
      testMatch: ["**/test/**/*.e2e.test.js"],
    },
  ],
};
