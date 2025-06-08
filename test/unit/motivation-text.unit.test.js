import { getRandomMotivationText } from "../../script/motivationText.js";
import { test, expect } from "@jest/globals";

test("getRandomMotivationText returns a string", () => {
  const motivationText = getRandomMotivationText();
  expect(typeof motivationText).toBe("string");
});

test("getRandomMotivationText can return different texts", () => {
  // Run multiple times to get a collection of motivation texts
  const results = new Set();
  for (let i = 0; i < 50; i++) {
    results.add(getRandomMotivationText());
  }
  // Should have more than 1 unique result (this is probabilistic)
  expect(results.size).toBeGreaterThan(1);
});
