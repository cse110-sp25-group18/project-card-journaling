/**
 * promptGen.js - Generates random prompts for journaling
 */

// Array of pre-generated prompts
const prompts = [
  "What made you smile today?",
  "What's something new you learned this week?",
  "Describe a challenge you overcame recently.",
  "What are you grateful for right now?",
  "What's a goal you're working towards?",
  "Describe your ideal day.",
  "What was the most interesting conversation you had recently?",
  "Write about a small joy in your life.",
  "What's something you've always wanted to try?",
  "Reflect on a mistake and what you learned from it.",
  "What's something you're proud of?",
  "What's your favorite memory from the past year?",
  "What's something that made you laugh recently?",
  "Write about a person who has positively impacted your life.",
  "What are three things you did well today?",
  "What's a place you'd like to visit and why?",
  "Describe something beautiful you saw recently.",
  "What's a skill you'd like to develop?",
  "What advice would you give to your younger self?",
  "What are you looking forward to in the coming months?",
];

/**
 * Generates a random prompt from the pre-defined list
 * @returns {string} A randomly selected prompt
 */
function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Updates the prompt box with a randomly selected prompt
 */
function updatePromptBox() {
  const promptBox = document.querySelector(".prompt-box");
  if (promptBox) {
    // Don't update if currently in edit mode
    if (promptBox.getAttribute("contenteditable") === "true") {
      console.log("Prompt is currently being edited. Not updating.");
      return;
    }

    promptBox.textContent = getRandomPrompt();
  }
}

/**
 * Initialize the prompt generator functionality
 */
function initPromptGenerator() {
  const newPromptButton = document.getElementById("newPromptBtn");

  if (newPromptButton) {
    // Add event listener to the "New Prompt" button
    newPromptButton.addEventListener("click", updatePromptBox);

    // Optionally, set an initial random prompt when the page loads
    updatePromptBox();
  }
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initPromptGenerator);

// Export functions for potential use in other scripts
module.exports = { getRandomPrompt, updatePromptBox, initPromptGenerator }; 
