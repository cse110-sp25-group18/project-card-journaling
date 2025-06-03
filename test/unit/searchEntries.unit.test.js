/* global describe, beforeEach, afterEach, global, expect, jest, test */
/**
 * Essential unit tests for SearchManager class
 */

// Mock crypto.randomUUID for testing environment
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-12345",
  },
});

import { SearchManager } from "../../script/searchEntries.js";

describe("SearchManager", () => {
  let searchManager;
  let mockGetEntries;
  let mockSearchInput;
  let mockCalendarView;
  let mockSearchBar;

  // Mock journal entries for testing
  const mockEntries = [
    {
      id: 1,
      prompt: "What are you grateful for today?",
      response: "I am grateful for my family and friends.",
      date: "2024-01-15T12:00:00.000Z",
    },
    {
      id: 2,
      prompt: "What made you smile today?",
      response: "Seeing a cute dog at the park made me happy.",
      date: "2024-01-16T12:00:00.000Z",
    },
    {
      id: 3,
      prompt: "grateful for nature",
      response: "The sunset was breathtaking today.",
      date: "2024-01-17T12:00:00.000Z",
    },
  ];

  beforeEach(() => {
    // Mock DOM elements
    mockSearchInput = {
      value: "",
      addEventListener: jest.fn(),
    };

    mockCalendarView = {
      classList: { add: jest.fn(), remove: jest.fn() },
    };

    mockSearchBar = {
      insertAdjacentElement: jest.fn(),
    };

    // Mock document methods
    global.document = {
      getElementById: jest.fn((id) => {
        if (id === "search-input") return mockSearchInput;
        return null;
      }),
      querySelector: jest.fn((selector) => {
        if (selector === ".calendar") return mockCalendarView;
        if (selector === ".search-bar") return mockSearchBar;
        return null;
      }),
      createElement: jest.fn(() => ({
        id: "",
        className: "",
        innerHTML: "",
        classList: { add: jest.fn(), remove: jest.fn() },
        appendChild: jest.fn(),
        insertAdjacentElement: jest.fn(),
      })),
    };

    global.console = {
      error: jest.fn(),
      log: jest.fn(),
    };

    mockGetEntries = jest.fn(() => mockEntries);
    searchManager = new SearchManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Constructor test
  test("should initialize with correct default properties", () => {
    expect(searchManager.searchInput).toBeNull();
    expect(searchManager.calendarView).toBeNull();
    expect(searchManager.isSearchActive).toBe(false);
  });

  // Core search functionality
  describe("searchEntries()", () => {
    beforeEach(() => {
      searchManager.getEntries = mockGetEntries;
    });

    test("should find entries matching prompt text", () => {
      const results = searchManager.searchEntries("grateful");
      expect(results).toHaveLength(2);
      expect(results[0].prompt).toContain("grateful");
    });

    test("should find entries matching response text", () => {
      const results = searchManager.searchEntries("dog");
      expect(results).toHaveLength(1);
      expect(results[0].response).toContain("dog");
    });

    test("should perform case-insensitive search", () => {
      const results = searchManager.searchEntries("GRATEFUL");
      expect(results).toHaveLength(2);
    });

    test("should sort results by relevance - exact matches first", () => {
      const results = searchManager.searchEntries("grateful");
      expect(results[0].prompt).toBe("grateful for nature");
    });

    test("should return empty array when getEntries returns null", () => {
      searchManager.getEntries = jest.fn(() => null);
      const results = searchManager.searchEntries("grateful");
      expect(results).toEqual([]);
    });
  });

  // Text highlighting functionality
  describe("highlightMatches()", () => {
    test("should highlight matches correctly", () => {
      const result = searchManager.highlightMatches("I am grateful today", "grateful");
      expect(result).toBe('I am <mark class="search-highlight">grateful</mark> today');
    });

    test("should be case-insensitive", () => {
      const result = searchManager.highlightMatches("GRATEFUL", "grateful");
      expect(result).toBe('<mark class="search-highlight">GRATEFUL</mark>');
    });

    test("should handle special regex characters", () => {
      const result = searchManager.highlightMatches("test [brackets]", "[brackets]");
      expect(result).toBe('test <mark class="search-highlight">[brackets]</mark>');
    });
  });

  // Essential utility methods
  test("should escape regex characters correctly", () => {
    const result = searchManager.escapeRegExp(".*+?^${}()|[]\\");
    expect(result).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  test("should track search active state", () => {
    expect(searchManager.isActive()).toBe(false);
    searchManager.isSearchActive = true;
    expect(searchManager.isActive()).toBe(true);
  });
});