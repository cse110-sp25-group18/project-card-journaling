/* global describe, test, expect, global */
// Mock crypto.randomUUID for testing environment
// Mocking for test
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-12345",
  },
});

import { Card } from "../../script/cardClass.js";

describe("Create Card Page Tests", () => {
  // Simple test for non-flippable card
  test("Card should not be flippable", () => {
    // Create a card
    const card = new Card({
      flippable: false,
      editable: true,
      containerSelector: ".card-input",
    });

    // Check the flippable property
    expect(card.flippable).toBe(false);
  });

  // Simple test for editable card
  test("Card should be editable", () => {
    // Create a card
    const card = new Card({
      flippable: false,
      editable: true,
      containerSelector: ".card-input",
    });

    // Check the editable property
    expect(card.editable).toBe(true);
  });
});
