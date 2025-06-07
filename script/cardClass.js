import { CardModel } from "./cardModel.js";

export class Card {
  constructor(options = {}) {
    // Card configuration
    this.flippable = options.flippable ?? true;
    this.editable = options.editable ?? true;
    this.containerSelector = options.containerSelector || ".card-input";

    // Create a CardModel instance from data or use defaults
    this.model =
      options.model ||
      new CardModel(
        options.data || {
          prompt: options.prompt || null, // Will be filled by promptGen if null
          response: options.response || "",
          date: options.date || new Date().toISOString().split("T")[0],
          image: options.image || "https://via.placeholder.com/300x100",
          alt: options.alt || "Journal card image",
          id: options.id || null,
          favorite: options.favorite || false,
        },
      );

    // References to DOM elements (filled during rendering)
    this.elements = {};

    // Bound event handlers (for easy removal if needed)
    this.eventHandlers = {
      flip: this.handleFlip.bind(this),
      unflip: this.handleUnflip.bind(this),
      submit: this.handleSubmit.bind(this),
    };
  }

  async loadTemplate() {
    try {
      const response = await fetch("../templates/card-template.html");
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`);
      }

      const html = await response.text();
      const temp = document.createElement("div");
      temp.innerHTML = html.trim();
      return temp.querySelector("template").content.cloneNode(true);
    } catch (error) {
      console.error("Error loading card template:", error);
      throw error;
    }
  }

  prepareContainer() {
    const container = document.querySelector(this.containerSelector);
    if (!container) {
      throw new Error(`Container not found: ${this.containerSelector}`);
    }
    container.innerHTML = "";
    return container;
  }

  populateContent(card) {
    // Set the prompt text
    const promptEl = card.querySelector(".prompt");
    if (promptEl) {
      promptEl.textContent = this.model.prompt;
    }

    // Format and set the date
    const dateEl = card.querySelector(".date");
    if (dateEl) {
      dateEl.textContent = this.model.formattedDate;
      dateEl.setAttribute("datetime", this.model.isoDate);
    }

    // Set the response textarea value and disabled state
    const textarea = card.querySelector("textarea#response");
    if (textarea) {
      textarea.value = this.model.response || "";
      textarea.disabled = !this.editable;
    }

    // Set image if it exists
    const img = card.querySelector("img");
    if (img && this.model.image) {
      img.src = this.model.image;
      img.alt = this.model.alt;
    }

    // Store references to key elements
    this.elements.card = card;
    this.elements.front = card.querySelector(".card-front");
    this.elements.back = card.querySelector(".card-back");
    this.elements.textarea = textarea;
  }

  handleFlip() {
    this.elements.card.classList.add("flipped");
  }

  handleUnflip(e) {
    if (!e.target.closest("textarea")) {
      this.elements.card.classList.remove("flipped");
    }
  }

  attachEventListeners() {
    // Add flip functionality if the card is flippable
    if (this.flippable && this.elements.front && this.elements.back) {
      this.elements.front.addEventListener("click", this.eventHandlers.flip);
      this.elements.back.addEventListener("click", this.eventHandlers.unflip);
    }

    // Connect to the global submit button if editable
    if (this.editable) {
      this.connectSubmitButton();
    }
  }

  connectSubmitButton(buttonId = "submitBtn") {
    if (!this.editable) {
      return;
    }

    const submitBtn = document.getElementById(buttonId);
    if (submitBtn) {
      this.elements.submitBtn = submitBtn;
      submitBtn.addEventListener("click", this.eventHandlers.submit);
    }
  }

  handleSubmit() {
    const textarea = this.elements.textarea;
    if (!textarea) {
      return;
    }

    const response = textarea.value.trim();
    if (!response) {
      alert("Please write a response before submitting.");
      return;
    }

    // Update the model with the response
    this.model.response = response;

    const entry = {
      id: this.model.id,
      prompt: this.model.prompt,
      response: this.model.response,
      date: new Date().toISOString(),
      image: this.model.image,
      alt: this.model.alt,
    };

    if (this.dailyLimitMet(new Date(entry.date))) {
      alert(
        "You have already submitted an entry for today, come back tomorrow!",
      );
      return;
    }

    this.saveEntry(entry);
  }

  async saveEntry(entry) {
    try {
      // Use promptSubmit module to save the entry
      const promptSubmit = await import("./promptSubmit.js");

      if (promptSubmit.saveJournalEntry(entry)) {
        alert("Your journal entry has been saved!");

        // Reset textarea and unflip the card
        if (this.elements.textarea) {
          this.elements.textarea.value = "";
          this.model.response = ""; // Update the model too
        }

        if (this.elements.card) {
          this.elements.card.classList.remove("flipped");
        }

        // Reset the modified flag
        this.model.resetModified();
      } else {
        alert("Failed to save your entry.");
      }
    } catch (error) {
      console.error("Error using promptSubmit module:", error);
      alert("An error occurred while saving your entry.");
    }
  }
  /**
   * Checks if an entry has already been submitted for this date
   * @param {Date} date - date to check
   * @return {boolean} true if an entry for this date already exists, false otherwise
   */
  dailyLimitMet(date) {
    const entries = localStorage.getItem("journalEntries");
    if (entries) {
      const parsed = JSON.parse(entries);
      for (const element of parsed) {
        let curDate = new Date(element.date);
        if (
          curDate.getDate() == date.getDate() &&
          curDate.getMonth() == date.getMonth() &&
          curDate.getFullYear() == date.getFullYear()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async render() {
    try {
      // If prompt is not set, try to get one from promptGen
      if (!this.model.prompt) {
        try {
          const promptGen = await import("./promptGen.js");
          this.model.prompt = promptGen.getRandomPrompt();
        } catch (error) {
          console.error("Error importing promptGen:", error);
          // Fall back to a default prompt
          this.model.prompt = "What's on your mind today?";
        }
      }

      // Prepare container and load template
      const container = this.prepareContainer();
      const template = await this.loadTemplate();

      // Add template to container
      container.appendChild(template);

      // Get the card element
      const card = container.querySelector(".card");
      if (!card) {
        throw new Error("Card element not found in template");
      }

      // Add non-flippable class if needed
      if (!this.flippable) {
        card.classList.add("non-flippable");
      }

      // Add favorite class if needed
      if (this.model.favorite) {
        card.classList.add("favorite");
      }

      // Populate the card with content
      this.populateContent(card);

      // Add event handlers
      this.attachEventListeners();

      // Update the prompt box if it exists
      const promptBox = document.querySelector(".prompt-box");
      if (promptBox && this.model.prompt) {
        promptBox.textContent = this.model.prompt;
      }

      return card;
    } catch (error) {
      console.error("Error rendering card:", error);
      throw error;
    }
  }

  connectNewPromptButton(buttonId = "newPromptBtn") {
    const newPromptBtn = document.getElementById(buttonId);
    if (!newPromptBtn) {
      return;
    }

    this.eventHandlers.newPrompt = async () => {
      try {
        // Use promptGen to get a new prompt
        const promptGen = await import("./promptGen.js");
        const newPrompt = promptGen.getRandomPrompt();

        // Update model and card prompt
        this.model.prompt = newPrompt;

        // Update UI elements
        const promptEl = this.elements.card.querySelector(".prompt");
        if (promptEl) {
          promptEl.textContent = newPrompt;
        }

        // Update the prompt box if it exists
        const promptBox = document.querySelector(".prompt-box");
        if (promptBox) {
          promptBox.textContent = newPrompt;
        }
      } catch (error) {
        console.error("Error generating new prompt:", error);
      }
    };

    // Add event listener to the button
    newPromptBtn.addEventListener("click", this.eventHandlers.newPrompt);
  }

  destroy() {
    // Remove flip handlers
    if (this.flippable && this.elements.front && this.elements.back) {
      this.elements.front.removeEventListener("click", this.eventHandlers.flip);
      this.elements.back.removeEventListener(
        "click",
        this.eventHandlers.unflip,
      );
    }

    // Remove submit handler
    if (this.elements.submitBtn) {
      this.elements.submitBtn.removeEventListener(
        "click",
        this.eventHandlers.submit,
      );
    }

    // Remove newPrompt handler if it exists
    const newPromptBtn = document.getElementById("newPromptBtn");
    if (newPromptBtn && this.eventHandlers.newPrompt) {
      newPromptBtn.removeEventListener("click", this.eventHandlers.newPrompt);
    }

    // Clear element references
    this.elements = {};
  }
}
