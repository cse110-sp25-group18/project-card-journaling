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
        id: new Date().getTime(),
      },
    });

    // Render the card
    await journalCard.render();

    // Force sync between prompts upon page load
    let initPromptBox = document.querySelector("prompt-box");
    if (initPromptBox) {
      initPromptBox.textContent = journalCard.model.prompt;
    }

    // Add the prompt text to the form element for the non-flippable card
    const updatePromptDisplay = () => {
      const form = document.querySelector(".card-back form");
      journalCard.model.prompt = document
        .querySelector("prompt-box")
        .textContent.trim();
      const promptText = journalCard.model.prompt;
      if (form && promptText) {
        form.setAttribute("data-prompt", promptText || "");
      }
    };

    // Initial update and listen for prompt changes
    updatePromptDisplay();
    let observer = null;
    const promptBox = document.querySelector("prompt-box");
    if (promptBox) {
      observer = new MutationObserver(updatePromptDisplay);
      observer.observe(promptBox, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    // Connect to the new prompt button
    journalCard.connectNewPromptButton("newPromptBtn");

    console.log("Card added and initialized!");

    // Add a cleanup function when leaving the page
    window.addEventListener("beforeunload", () => {
      journalCard.destroy();
      if (observer) {
        observer.disconnect();
      }
    });

    // Add reference to window for debugging purposes
    window.journalCard = journalCard;
  } catch (error) {
    console.error("Error initializing cards:", error);
    document.querySelector(".card-input").textContent =
      "Error loading cards. Please refresh the page.";
  }
});
