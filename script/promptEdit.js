/**
 * promptEdit.js - Allows editing of the current prompt
 */

/**
 * Makes the prompt box editable when the edit button is clicked
 */
function makePromptEditable() {
  const promptBox = document.querySelector("prompt-box");
  const editPromptBtn = document.getElementById("editPromptBtn");

  if (!promptBox || !editPromptBtn) {
    return;
  }

  // Toggle between edit and save modes
  editPromptBtn.addEventListener("click", () => {
    const isEditing = promptBox.getAttribute("contenteditable") === "true";

    if (isEditing) {
      // SAVE MODE
      promptBox.setAttribute("contenteditable", "false");
      promptBox.classList.remove("editing");
      editPromptBtn.textContent = "Edit Prompt";

      // Get the updated prompt
      const newPrompt = promptBox.textContent.trim();

      // Update model and card
      if (window.journalCard) {
        window.journalCard.model.prompt = newPrompt;

        const cardPromptEl =
          window.journalCard.elements.card?.querySelector(".prompt");
        if (cardPromptEl) {
          cardPromptEl.textContent = newPrompt;
        }

        const form = document.querySelector(".card-back form");
        if (form) {
          form.setAttribute("data-prompt", newPrompt);
        }
      }
    } else {
      // EDIT MODE
      promptBox.setAttribute("contenteditable", "true");
      promptBox.classList.add("editing");
      promptBox.focus();
      editPromptBtn.textContent = "Save Prompt";
    }
  });
}

/**
 * Initialize the prompt editing functionality
 */
function initPromptEditor() {
  makePromptEditable();
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initPromptEditor);

// Export functions for potential use in other scripts
export { initPromptEditor, makePromptEditable };
