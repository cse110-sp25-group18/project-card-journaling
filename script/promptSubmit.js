/**
 * promptSubmit.js - Handles submission of journal entries to local storage
 */

/**
 * Save a journal entry to local storage
 * @param {Object} entryData - The journal entry data to save
 * @returns {boolean} - Whether the save was successful
 */
function saveJournalEntry(entryData) {
  try {
    // Get existing entries or initialize an
    const existingEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]",
    );
    // Add the new entry to the beginning of the array (most recent first)
    existingEntries.unshift(entryData);

    // Save back to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(existingEntries));

    console.log("Journal entry saved to local storage");
    return true;
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return false;
  }
}

/**
 * Handle the submission of a journal card
 */
function handleSubmitCard() {
  const submitBtn = document.getElementById("submitBtn");

  if (!submitBtn) {
    return;
  }
  submitBtn.addEventListener("click", () => {
    // Get the card elements
    const card = document.querySelector(".card");

    if (!card) {
      console.error("Card not found");
      return;
    }

    // Get data from the card
    const prompt = card.querySelector(".prompt")?.textContent || "";
    const responseTextarea = card.querySelector("textarea#response");
    const response = responseTextarea ? responseTextarea.value.trim() : "";

    // Validate response
    if (!response) {
      alert("Please write a response before submitting.");
      return;
    }

    // Create entry object
    const entryData = {
      id: Date.now(),
      prompt: prompt,
      response: response,
      date: new Date().toISOString(),
      favorite: false,
    };

    // Save to local storage
    if (saveJournalEntry(entryData)) {
      alert("Your journal entry has been saved!");

      // Reset the textarea
      if (responseTextarea) {
        responseTextarea.value = "";
      }

      // Reset the card flip if applicable
      if (card.classList.contains("flipped")) {
        card.classList.remove("flipped");
      }
    } else {
      alert("There was a problem saving your journal entry.");
    }
  });
}

/**
 * Initialize the submission functionality
 */
function initSubmitHandler() {
  // Initialize the submit handler
  handleSubmitCard();
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSubmitHandler);

// Export functions for potential use in other scripts
export { initSubmitHandler, handleSubmitCard, saveJournalEntry };
