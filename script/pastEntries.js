import { Card } from "./cardClass.js";

document.addEventListener("DOMContentLoaded", () => {
  const entriesContainer = document.getElementById("entriesContainer");
  let cards = [];

  //Load and display entries from localStorage

  function loadEntries() {
    // Clear container
    entriesContainer.innerHTML = "";

    try {
      // Get entries from localStorage
      const entries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]",
      );
      console.log(`Loaded ${entries.length} entries`);

      if (entries.length === 0) {
        entriesContainer.innerHTML =
          "<p>No journal entries found. Create some on the Create Card page.</p>";
        return;
      }

      // Display each entry as a card
      entries.forEach((entry, index) => {
        // Create container for this card
        const cardContainer = document.createElement("div");
        cardContainer.style.width = "350px";
        cardContainer.style.margin = "20px";
        cardContainer.id = `card-${index}`;
        entriesContainer.appendChild(cardContainer);

        // Create a flippable, non-editable card
        const card = new Card({
          flippable: true,
          editable: false,
          containerSelector: `#card-${index}`,
          data: {
            prompt: entry.prompt || "No prompt",
            response: entry.response || "No response",
            date: entry.date,
            image: entry.image || "https://via.placeholder.com/300x100",
          },
        });

        // Store reference for cleanup
        cards.push(card);

        // Render the card
        card.render();
      });
    } catch (error) {
      console.error("Error loading entries:", error);
      entriesContainer.innerHTML =
        "<p>Error loading entries. Check the console for details.</p>";
    }
  }

  // Clean up event listeners when leaving the page
  window.addEventListener("beforeunload", () => {
    cards.forEach((card) => card.destroy());
  });

  // Load entries when page loads
  loadEntries();
});
