const motivationText = [
  "OMG! Your writing is so tuff!!!",
  "Okayyy Shakespeare, where'd you learn to write like that?",
  "Keep up the amazing work!!!",
  "Your journal entries are so fire 🔥🔥🔥",
  "Your future self will thank you for these words!",
  '"Fill your paper with the breathings of your heart." - LeBron James',
  "You're a true wordsmith! 💯💯💯",
  "You showed up for yourself today - that's what matters!",
  "RAHHHHHHH U DA GOAT!!!",
  "The vibes of your journal entry today are emmaculate 👌",
];

/**
 * Generates a random motivation text from the pre-defined list
 * @returns {string} A randomly selected motivation text
 */
function getRandomMotivationText() {
  const randomIndex = Math.floor(Math.random() * motivationText.length);
  return motivationText[randomIndex];
}

/**
 * Updates the motivation text element with a randomly selected text
 */
function updateMotivationText() {
  const motivationElement = document.querySelector(".motivation-text");
  if (motivationElement) {
    motivationElement.textContent = getRandomMotivationText();
  }
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", updateMotivationText);

// Export the function to be called from other scripts
export { updateMotivationText, getRandomMotivationText };
