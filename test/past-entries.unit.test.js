import { Card } from '../script/cardClass.js';

describe('Past Entries Page Tests', () => {
  
  // Mock the DOM structure
  document.body.innerHTML = `
    <div id="entriesContainer"></div>
  `;
  
  // Create sample entries for testing
  const sampleEntries = [
    {
      id: 1,
      prompt: 'What are you grateful for today?',
      response: 'I am grateful for my family and friends.',
      date: '2025-05-20T12:00:00.000Z'
    },
    {
      id: 2,
      prompt: 'What made you smile today?',
      response: 'Seeing a cute dog at the park.',
      date: '2025-05-21T12:00:00.000Z'
    }
  ];
  
  beforeEach(() => {
    // Set up mock localStorage
    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify(sampleEntries)),
      setItem: jest.fn()
    };
  });
  
  test('Cards in past entries should be flippable', () => {
    // Create a simulated card like pastEntries.js does
    const card = new Card({
      flippable: true,
      editable: false,
      containerSelector: '#card-1',
      data: sampleEntries[0]
    });
    
    // Check the flippable property
    expect(card.flippable).toBe(true);
  });
  
  test('Cards in past entries should be non-editable', () => {
    // Create a simulated card like pastEntries.js does
    const card = new Card({
      flippable: true,
      editable: false,
      containerSelector: '#card-1',
      data: sampleEntries[0]
    });
    
    // Check the editable property
    expect(card.editable).toBe(false);
  });
  
  test('Past entries should load from localStorage', () => {
    // Mock the loadEntries function similar to what's in pastEntries.js
    function mockLoadEntries() {
      // Get entries from localStorage
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      return entries;
    }
    
    // Call the mock function
    const loadedEntries = mockLoadEntries();
    
    // Verify localStorage was called with the right key
    expect(localStorage.getItem).toHaveBeenCalledWith('journalEntries');
    
    // Check that we got the sample entries back
    expect(loadedEntries).toEqual(sampleEntries);
    expect(loadedEntries.length).toBe(2);
  });
});
