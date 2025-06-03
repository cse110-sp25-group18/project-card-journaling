document
  .getElementById("shuffle-button")
  .addEventListener("click", function () {
    document.getElementById("placeholderImage").style.display = "none";
    document.getElementById("cardContent").style.display = "block";

    // // Show the flippable card
    // document.getElementById('cardContent').style.display = 'block';

    // // Optional: Populate with new data if needed
    // document.getElementById('cardPrompt').textContent = "New Prompt Goes Here";
    // document.getElementById('response').textContent = "New Response Goes Here";
  });
