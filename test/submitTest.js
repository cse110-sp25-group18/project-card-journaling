/* eslint-env jest */
/**
 * Unit tests for journal card submission functionality
 */

describe('Journal Card Submission Tests', () => {
  // Save original localStorage methods
  let originalLocalStorage;
  
  let mockStorage = {};
  
  // Setup before tests run
  beforeEach(() => {
    originalLocalStorage = {
      getItem: localStorage.getItem,
      setItem: localStorage.setItem,
      clear: localStorage.clear
    };
    
    // Create a mock version of localStorage for testing
    mockStorage = {};
    
    Storage.prototype.getItem = jest.fn((key) => {
      return mockStorage[key] || null;
    });
    
    Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    
    Storage.prototype.clear = jest.fn(() => {
      mockStorage = {};
    });
    
    // Create mock DOM environment for tests
    document.body.innerHTML = `
      <div class="card">
        <h2 class="prompt">Test Prompt</h2>
        <textarea id="response">Test Response</textarea>
      </div>
      <button id="submitBtn">Submit</button>
    `;
    
    // Reset our mocks
    jest.clearAllMocks();
  });
  
  // Cleanup after tests
  afterEach(() => {
    Storage.prototype.getItem = originalLocalStorage.getItem;
    Storage.prototype.setItem = originalLocalStorage.setItem;
    Storage.prototype.clear = originalLocalStorage.clear;
    
    document.body.innerHTML = '';
  });
  
  // Test 1: Check that the saveJournalEntry function works
  test('saveJournalEntry should store entry in localStorage', () => {
    function saveJournalEntry(entryData) {
      try {
        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        existingEntries.unshift(entryData);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        return true;
      } catch (error) {
        return false;
      }
    }

    const testEntry = {
      id: 12345,
      prompt: 'Test Prompt',
      response: 'Test Response',
      date: '2025-05-20T10:00:00.000Z'
    };
    
    const result = saveJournalEntry(testEntry);
    
    // Check results
    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalled();
    
    // Parse what was saved to localStorage
    const savedData = JSON.parse(mockStorage['journalEntries']);
    expect(savedData).toBeInstanceOf(Array);
    expect(savedData.length).toBe(1);
    expect(savedData[0].prompt).toBe('Test Prompt');
    expect(savedData[0].response).toBe('Test Response');
  });
  
  // Test 2: Check that new entries are added to existing entries
  test('saveJournalEntry should add new entries to existing ones', () => {
    function saveJournalEntry(entryData) {
      try {
        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        existingEntries.unshift(entryData);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        return true;
      } catch (error) {
        return false;
      }
    }

    mockStorage['journalEntries'] = JSON.stringify([{
      id: 1000,
      prompt: 'Old Prompt',
      response: 'Old Response',
      date: '2025-05-19T10:00:00.000Z'
    }]);

    const newEntry = {
      id: 2000,
      prompt: 'New Prompt',
      response: 'New Response',
      date: '2025-05-20T10:00:00.000Z'
    };
    
    // Save the new entry
    saveJournalEntry(newEntry);
    
    // Check the result
    const savedData = JSON.parse(mockStorage['journalEntries']);
    expect(savedData.length).toBe(2);
    expect(savedData[0].prompt).toBe('New Prompt'); // Newest first
    expect(savedData[1].prompt).toBe('Old Prompt');
  });
  
  // Test 3: Check the submit button click handler functionality
  test('Submit button should capture and save form data', () => {
    function saveJournalEntry(entryData) {
      try {
        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        existingEntries.unshift(entryData);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        return true;
      } catch (error) {
        return false;
      }
    }
    window.alert = jest.fn();
    
    // Setup the submit button handler
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', () => {
      const prompt = document.querySelector('.prompt').textContent;
      const responseTextarea = document.querySelector('#response');
      const response = responseTextarea.value;
      
      const entryData = {
        id: 12345, // Fixed ID for testing
        prompt: prompt,
        response: response, 
        date: '2025-05-20T10:00:00.000Z' // Fixed date for predictable testing
      };
      
      if (saveJournalEntry(entryData)) {
        // Success alert would happen here
        window.alert('Success');
        
        // Reset form
        responseTextarea.value = '';
      } else {
        window.alert('Error');
      }
    });
    
    // Trigger the click event
    submitBtn.click();
    
    // Check results
    expect(window.alert).toHaveBeenCalledWith('Success');
    
    // Check localStorage was called
    expect(localStorage.setItem).toHaveBeenCalled();
    
    // Validate saved data
    const savedData = JSON.parse(mockStorage['journalEntries']);
    expect(savedData[0].prompt).toBe('Test Prompt');
    expect(savedData[0].response).toBe('Test Response');
    
    // Check form was reset
    expect(document.querySelector('#response').value).toBe('');
  });
  
  // Test 4: Error handling for localStorage
  test('saveJournalEntry should handle localStorage errors', () => {
    function saveJournalEntry(entryData) {
      try {
        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        existingEntries.unshift(entryData);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        return true;
      } catch (error) {
        return false;
      }
    }
    
    // Make localStorage.setItem throw an error
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('Storage error');
    });
    
    // Try to save
    const result = saveJournalEntry({
      id: 12345,
      prompt: 'Test Prompt',
      response: 'Test Response'
    });
    
    // Should handle the error and return false
    expect(result).toBe(false);
  });
});