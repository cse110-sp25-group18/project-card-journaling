/**
 * promptEdit.js - Allows editing of the current prompt
 */

/**
 * Makes the prompt box editable when the edit button is clicked
 */
function makePromptEditable() {
  const promptBox = document.querySelector(".prompt-box");
  const editPromptBtn = document.getElementById("editPromptBtn");

  if (!promptBox || !editPromptBtn) {
    return;
  }

  // Toggle between edit and save modes
  editPromptBtn.addEventListener("click", () => {
    if (promptBox.getAttribute("contenteditable") === "true") {
      // Save mode - make not editable
      promptBox.setAttribute("contenteditable", "false");
      promptBox.classList.remove("editing");
      editPromptBtn.textContent = "Edit Prompt";
    } else {
      // Edit mode - make editable
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
