import { Card } from "./cardClass.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM ready, starting to load card...");

  try {
    const journalCard = new Card({
      flippable: false,
      editable: true,
      containerSelector: ".card-input",
      data: {
        prompt: null,
        response: "",
        date: new Date().toISOString().split("T")[0],
      },
    });

    // Render the card
    await journalCard.render();

    // Add the prompt text to the form element for the non-flippable card
    const updatePromptDisplay = () => {
      const form = document.querySelector(".card-back form");
      const promptText = document.querySelector(".prompt-box").textContent;
      if (form && promptText) {
        form.setAttribute("data-prompt", promptText);
      }
    };

    // Initial update and listen for prompt changes
    updatePromptDisplay();
    const observer = new MutationObserver(updatePromptDisplay);
    observer.observe(document.querySelector(".prompt-box"), {
      characterData: true,
      childList: true,
      subtree: true,
    });

    // Connect to the new prompt button
    journalCard.connectNewPromptButton("newPromptBtn");

    console.log("Card added and initialized!");

    // Add a cleanup function when leaving the page
    window.addEventListener("beforeunload", () => {
      journalCard.destroy();
      observer.disconnect();
    });

    // Add reference to window for debugging purposes
    window.journalCard = journalCard;
  } catch (error) {
    console.error("Error initializing cards:", error);
    document.querySelector(".card-input").textContent =
      "Error loading cards. Please refresh the page.";
  }
});
