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
    // Get existing entries or initialize an empty array
    const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    // Add the new entry to the beginning of the array (most recent first)
    existingEntries.unshift(entryData);
    
    // Save back to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
    
    console.log('Journal entry saved to local storage');
    return true;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return false;
  }
}

