import { Card } from "../script/cardClass.js";
import { saveJournalEntry } from "../script/promptSubmit.js";
/* global describe, test, expect, global */
describe("Create Card Page Tests", () => {
  // Mock the DOM structure
  document.body.innerHTML = `
    <div class="card-input"></div>
    <div class="prompt-box">Test Prompt</div>
    <button id="newPromptBtn">New Prompt</button>
    <button id="submitBtn">Submit</button>
  `;

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

  test("Card should save to localStorage", () => {
    // Mock localStorage
    const originalLocalStorage = global.localStorage;

    // Create mock implementation
    const mockLocalStorage = {
      store: {},
      getItem: function (key) {
        return this.store[key] || null;
      },
      setItem: function (key, value) {
        this.store[key] = value.toString();
      },
    };

    // Replace localStorage with mock
    Object.defineProperty(global, "localStorage", {
      value: mockLocalStorage,
    });

    try {
      // Create a card with mock save method
      const card = new Card({
        flippable: false,
        editable: true,
        containerSelector: ".card-input",
        data: {
          prompt: "Test prompt",
          response: "Test response",
        },
      });
      expect(card.data.prompt).toBe("Test prompt");
      expect(card.data.response).toBe("Test response");

      // Call the save method
      const entry = {
        id: 123,
        prompt: "Test prompt",
        response: "Test response",
        date: new Date().toISOString(),
      };

      // Use the promptSubmit module to save entry
      saveJournalEntry(entry);

      // Check if localStorage was called with correct data
      const savedEntries = JSON.parse(
        mockLocalStorage.getItem("journalEntries") || "[]",
      );
      expect(savedEntries.length).toBeGreaterThan(0);
      expect(savedEntries[0].prompt).toBe("Test prompt");
    } finally {
      // Restore original localStorage
      Object.defineProperty(global, "localStorage", {
        value: originalLocalStorage,
      });
    }
  });
});
