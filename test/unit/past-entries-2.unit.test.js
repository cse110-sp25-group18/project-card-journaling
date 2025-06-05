/* global describe, beforeEach, global, expect, jest, test */
/**
 * Simple tests for the past-entries.html page
 */
// importing jest and mocking for test

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-12345",
  },
});

import { Card } from "../../script/cardClass.js";

describe("Past Entries Page Tests", () => {
  // Mock the DOM structure
  document.body.innerHTML = `
    <div id="entriesContainer"></div>
  `;

  // Create sample entries for testing
  const sampleEntries = [
    {
      id: 1,
      prompt: "What are you grateful for today?",
      response: "I am grateful for my family and friends.",
      date: "2025-05-20T12:00:00.000Z",
    },
    {
      id: 2,
      prompt: "What made you smile today?",
      response: "Seeing a cute dog at the park.",
      date: "2025-05-21T12:00:00.000Z",
    },
  ];

  // Test if cards are created as flippable in pastEntries.js
  test("Cards in past entries should be flippable", () => {
    // Create a simulated card like pastEntries.js does
    const card = new Card({
      flippable: true,
      editable: false,
      containerSelector: "#card-1",
      data: sampleEntries[0],
    });

    // Check the flippable property
    expect(card.flippable).toBe(true);
  });

  // Test if cards are created as non-editable in pastEntries.js
  test("Cards in past entries should be non-editable", () => {
    // Create a simulated card like pastEntries.js does
    const card = new Card({
      flippable: true,
      editable: false,
      containerSelector: "#card-1",
      data: sampleEntries[0],
    });

    // Check the editable property
    expect(card.editable).toBe(false);
  });
});
