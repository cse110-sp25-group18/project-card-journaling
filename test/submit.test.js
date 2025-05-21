import { saveJournalEntry, handleSubmitCard } from "../script/promptSubmit.js";
import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";

// Add a comment to tell ESLint that these globals are okay to use
/* global document, alert, localStorage */

let mockStorage = {};

beforeEach(() => {
  // Create a mock localStorage
  window.localStorage = {
    getItem: jest.fn((key) => mockStorage[key] || null),
    setItem: jest.fn((key, value) => {
      mockStorage[key] = value;
    }),
    clear: jest.fn(() => {
      mockStorage = {};
    }),
  };

  // Create a simple HTML environment for testing
  document.body.innerHTML = `
    <div class="card">
      <h2 class="prompt">Test Prompt</h2>
      <textarea id="response">Test Response</textarea>
    </div>
    <button id="submitBtn">Submit</button>
  `;
  // Mock alert function
  window.alert = jest.fn();

  mockStorage = {};
});

afterEach(() => {
  // Clean up
  document.body.innerHTML = "";
  jest.clearAllMocks();
});

// Test 1: Check that saveJournalEntry works
test("saveJournalEntry should store data in localStorage", () => {
  const testEntry = {
    id: 12345,
    prompt: "Test Prompt",
    response: "Test Response",
    date: "2025-05-20T10:00:00.000Z",
  };

  const result = saveJournalEntry(testEntry);

  // Check results
  expect(result).toBe(true);
  expect(localStorage.setItem).toHaveBeenCalled();

  // Verify stored data
  const savedData = JSON.parse(mockStorage["journalEntries"]);
  expect(savedData).toBeInstanceOf(Array);
  expect(savedData.length).toBe(1);
  expect(savedData[0].prompt).toBe("Test Prompt");
});

// Test 2: Button click should save entry
test("Submit button should save journal entry when clicked", () => {
  // Set up the event handler
  handleSubmitCard();

  // Trigger the click event
  document.getElementById("submitBtn").click();

  // Check if alert was called (success message)
  expect(alert).toHaveBeenCalledWith("Your journal entry has been saved!");

  // Check if localStorage was updated
  expect(localStorage.setItem).toHaveBeenCalled();

  // Check textarea was cleared
  expect(document.getElementById("response").value).toBe("");
});
