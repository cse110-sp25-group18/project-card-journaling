window.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("deleteBtn");
    const submitBtn = document.getElementById("submitBtn");
    const cardInput = document.getElementById("cardInput");
    const promptBox = document.getElementById("promptBox");
    const newPromptBtn = document.getElementById("newPromptBtn");
    const editPromptBtn = document.getElementById("editPromptBtn");

    const prompts = [
        "Prompt 1",
        "Prompt 2",
        "Prompt 3",
        "Prompt 4",
        "Prompt 5"
    ];

    newPromptBtn.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        promptBox.innerText = prompts[randomIndex];
    });

    editPromptBtn.addEventListener("click", () => {
        const customPrompt = prompt("Enter your custom prompt:");
        if (customPrompt) {
            promptBox.innerText = customPrompt;
        }
    });

    submitBtn.addEventListener("click", () => {
        const entry = cardInput.innerText.trim();
        if (entry) {
            alert("Submitted: " + entry);
        } else {
            alert("Please write something before submitting.");
        }
    });

    deleteBtn.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete your entry?");
        if (confirmed) {
            cardInput.innerText = "";
        }
    });
});
