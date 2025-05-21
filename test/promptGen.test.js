const { getRandomPrompt } = require("../script/promptGen.js");

test("getRandomPrompt returns a string", () => {
  const prompt = getRandomPrompt();
  expect(typeof prompt).toBe("string");
});

test("getRandomPrompt can return different prompts", () => {
  // Run multiple times to get a collection of prompts
  const results = new Set();
  for (let i = 0; i < 50; i++) {
    results.add(getRandomPrompt());
  }
  // Should have more than 1 unique result (this is probabilistic)
  expect(results.size).toBeGreaterThan(1);
});
