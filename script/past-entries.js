document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM ready, starting to load past entries...");

    // get container where cards will live
    const entriesContainer = document.querySelector(".entries-container");
    let entries = localStorage.getItem('journalEntries')

    if(entries){
        entries = JSON.parse(entries);
    }
    else{
        // if no entries, display no entries
        const noEntries = document.createElement('h1');
        noEntries.classList.add('no-entries');
        entriesContainer.appendChild(noEntries);
        return;
    }
    // Load the HTML template
    const response = await fetch("../templates/past-entries-template.html");
    const html = await response.text();

    // Parse the HTML into a template element
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    const template = temp.querySelector("template");

    // Add each entry to the DOM
    entries.forEach(entry => {
        // Create a container for the current element
        const clone = template.content.cloneNode(true);
        const cardContainer = document.createElement('div');
        cardContainer.classList.add("card-container");
        // Add data to template
        clone.querySelector(".prompt").textContent = entry.prompt;
        clone.querySelector(".date").textContent = new Date(
            entry.date,
        ).toLocaleDateString();
        clone.querySelector(".date").setAttribute("datetime", entry.date);
        clone.querySelector("img").src = entry.image;
        clone.querySelector("img").alt = entry.alt;
        clone.querySelector(".response").textContent = entry.response;
        cardContainer.appendChild(clone);
        entriesContainer.appendChild(cardContainer);
    });

});