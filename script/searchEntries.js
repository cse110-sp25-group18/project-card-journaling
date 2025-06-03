import { Card } from "./cardClass.js";

/**
 * Search functionality for past entries
 * Handles real-time search with highlighting and proper UI state management
 */
export class SearchManager {
  constructor() {
    this.searchInput = null;
    this.calendarView = null;
    this.searchResultsContainer = null;
    this.allEntries = [];
    this.isSearchActive = false;
  }

  /**
   * Initialize the search functionality
   * @param {Function} getEntriesFunction - Function to get all entries from storage
   */
  init(getEntriesFunction) {
    this.getEntries = getEntriesFunction;
    this.setupDOMReferences();
    this.createSearchResultsContainer();
    this.attachEventListeners();
  }

  /**
   * Setup references to DOM elements
   */
  setupDOMReferences() {
    this.searchInput = document.getElementById("search-input");
    this.calendarView = document.querySelector(".calendar");

    if (!this.searchInput) {
      console.error("Search input not found");
      return;
    }

    if (!this.calendarView) {
      console.error("Calendar view not found");
      return;
    }
  }

  /**
   * Create container for search results
   */
  createSearchResultsContainer() {
    this.searchResultsContainer = document.createElement("div");
    this.searchResultsContainer.id = "search-results-container";
    this.searchResultsContainer.className = "search-results hidden";

    // Insert after the search bar
    const searchBar = document.querySelector(".search-bar");
    searchBar.insertAdjacentElement("afterend", this.searchResultsContainer);
  }

  /**
   * Attach event listeners for search functionality
   */
  attachEventListeners() {
    if (!this.searchInput) return;

    // Real-time search on input
    this.searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value.trim());
    });

    // Clear search on escape key
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.clearSearch();
      }
    });
  }

  /**
   * Handle search input and update UI accordingly
   * @param {string} query - Search query
   */
  handleSearch(query) {
    if (query.length === 0) {
      this.clearSearch();
      return;
    }

    this.isSearchActive = true;
    this.hideCalendarView();

    const results = this.searchEntries(query);
    this.displaySearchResults(results, query);
  }

  /**
   * Search through all entries
   * @param {string} query - Search query
   * @returns {Array} Filtered and sorted entries
   */
  searchEntries(query) {
    const entries = this.getEntries();
    if (!entries) return [];

    const normalizedQuery = query.toLowerCase();

    // Filter entries that match the query
    const matchingEntries = entries.filter((entry) => {
      const promptMatch = entry.prompt?.toLowerCase().includes(normalizedQuery);
      const responseMatch = entry.response
        ?.toLowerCase()
        .includes(normalizedQuery);
      return promptMatch || responseMatch;
    });

    // Sort by relevance: exact matches first, then partial matches
    return matchingEntries.sort((a, b) => {
      const aPrompt = a.prompt?.toLowerCase() || "";
      const aResponse = a.response?.toLowerCase() || "";
      const bPrompt = b.prompt?.toLowerCase() || "";
      const bResponse = b.response?.toLowerCase() || "";

      // Check for exact matches in prompts (highest priority)
      const aExactPrompt = aPrompt === normalizedQuery;
      const bExactPrompt = bPrompt === normalizedQuery;
      if (aExactPrompt && !bExactPrompt) return -1;
      if (bExactPrompt && !aExactPrompt) return 1;

      // Check for exact matches in responses
      const aExactResponse = aResponse === normalizedQuery;
      const bExactResponse = bResponse === normalizedQuery;
      if (aExactResponse && !bExactResponse) return -1;
      if (bExactResponse && !aExactResponse) return 1;

      // Check if query appears at the beginning of prompt/response
      const aStartsWithPrompt = aPrompt.startsWith(normalizedQuery);
      const bStartsWithPrompt = bPrompt.startsWith(normalizedQuery);
      if (aStartsWithPrompt && !bStartsWithPrompt) return -1;
      if (bStartsWithPrompt && !aStartsWithPrompt) return 1;

      // Sort by date (newest first) for entries with similar relevance
      return new Date(b.date) - new Date(a.date);
    });
  }

  /**
   * Display search results in the UI
   * @param {Array} results - Search results
   * @param {string} query - Original search query for highlighting
   */
  displaySearchResults(results, query) {
    this.clearSearchResults();

    if (results.length === 0) {
      this.showNoResults();
      return;
    }

    this.showSearchResults();

    // Create search results header
    const header = document.createElement("div");
    header.className = "search-results-header";
    header.innerHTML = `
      <h3>Search Results (${results.length})</h3>
      <p>Found ${results.length} ${results.length === 1 ? "entry" : "entries"} matching "${query}"</p>
    `;
    this.searchResultsContainer.appendChild(header);

    // Create results list
    const resultsList = document.createElement("div");
    resultsList.className = "search-results-list";

    results.forEach((entry, index) => {
      const resultItem = this.createSearchResultItem(entry, query, index);
      resultsList.appendChild(resultItem);
    });

    this.searchResultsContainer.appendChild(resultsList);
  }

  /**
   * Create a search result item
   * @param {Object} entry - Journal entry
   * @param {string} query - Search query for highlighting
   * @param {number} index - Index for unique IDs
   * @returns {HTMLElement} Result item element
   */
  createSearchResultItem(entry, query, index) {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    resultItem.id = `search-result-${index}`;

    // Format date
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Highlight matches in text
    const highlightedPrompt = this.highlightMatches(
      entry.prompt || "No prompt",
      query,
    );
    const highlightedResponse = this.highlightMatches(
      entry.response || "No response",
      query,
    );

    resultItem.innerHTML = `
      <div class="search-result-content">
        <div class="search-result-date">${formattedDate}</div>
        <div class="search-result-prompt">
          <strong>Prompt:</strong> ${highlightedPrompt}
        </div>
        <div class="search-result-response">
          <strong>Response:</strong> ${highlightedResponse}
        </div>
      </div>
    `;

    // No click handler added - search results are not clickable

    return resultItem;
  }

  /**
   * Highlight search matches in text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {string} Text with highlighted matches
   */
  highlightMatches(text, query) {
    if (!text || !query) return text;

    const regex = new RegExp(`(${this.escapeRegExp(query)})`, "gi");
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  /**
   * Escape special regex characters
   * @param {string} string - String to escape
   * @returns {string} Escaped string
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Show no results message
   */
  showNoResults() {
    this.searchResultsContainer.innerHTML = `
      <div class="no-results">
        <h3>No Results Found</h3>
        <p>No entries match your search. Try different keywords or check your spelling.</p>
      </div>
    `;
    this.showSearchResults();
  }

  /**
   * Clear search and return to calendar view
   */
  clearSearch() {
    this.searchInput.value = "";
    this.isSearchActive = false;
    this.hideSearchResults();
    this.showCalendarView();
    this.clearSearchResults();
  }

  /**
   * Clear search results content
   */
  clearSearchResults() {
    if (this.searchResultsContainer) {
      this.searchResultsContainer.innerHTML = "";
    }
  }

  /**
   * Hide calendar view
   */
  hideCalendarView() {
    if (this.calendarView) {
      this.calendarView.classList.add("hidden");
    }
  }

  /**
   * Show calendar view
   */
  showCalendarView() {
    if (this.calendarView) {
      this.calendarView.classList.remove("hidden");
    }
  }

  /**
   * Hide search results
   */
  hideSearchResults() {
    if (this.searchResultsContainer) {
      this.searchResultsContainer.classList.add("hidden");
    }
  }

  /**
   * Show search results
   */
  showSearchResults() {
    if (this.searchResultsContainer) {
      this.searchResultsContainer.classList.remove("hidden");
    }
  }

  /**
   * Check if search is currently active
   * @returns {boolean} True if search is active
   */
  isActive() {
    return this.isSearchActive;
  }

  /**
   * Get current search query
   * @returns {string} Current search query
   */
  getCurrentQuery() {
    return this.searchInput ? this.searchInput.value.trim() : "";
  }
}
