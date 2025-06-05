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
    const { year, month, day } = getLocalYMD(entryData.date);
    const conflictingEntry = existingEntries.find((entry) => {
      const e = getLocalYMD(entry.date);
      return e.year === year && e.month === month && e.day === day;
    });
    if (conflictingEntry) {
      alert("You've already submitted an entry for today, come back tomorrow!");
      return false;
    }
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
 * Returns the year, month, and day of a date string in local time
 * @param {string} dateStr
 * @returns year, month, and day
 */
function getLocalYMD(dateStr) {
  const d = new Date(dateStr);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
  };
}

// Export functions for potential use in other scripts
export { saveJournalEntry };
