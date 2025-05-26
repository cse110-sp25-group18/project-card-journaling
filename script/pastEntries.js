document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM ready, starting to load past entries...");

    const response = await fetch("../templates/past-entries-template.html");
    const html = await response.text();

    // Load the HTML template
    populateEntries(html);

});

/**
 * Pulls information from local storage and populates past entry cards.
 * If no past entries exist, displays no entries to webpage.
 * @param {string} html - html tags in string form
 * @returns
 */
function populateEntries(html) {
    // get container where cards will live
    const entriesContainer = document.querySelector(".entries-container");
    let entries = getEntries();

    if(!entries) {
        // if no entries, display no entries
        const noEntries = document.createElement('h1');
        noEntries.classList.add('no-entries');
        entriesContainer.appendChild(noEntries);
        return;
    }    

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
        const front = clone.querySelector(".card-front");
        const back = clone.querySelector(".card-back");
        const card = clone.querySelector(".card");
        front.addEventListener("click", () => {
            card.classList.add("flipped");
        });
        back.addEventListener("click", (e) => {
            if (!e.target.closest("textarea")) {
            card.classList.remove("flipped");
            }
        });
            clone.querySelector(".response").textContent = entry.response;
        cardContainer.appendChild(clone);
        entriesContainer.appendChild(cardContainer);
    });
}

/**
 * Gets all past entries from local storage
 * @returns {JSON|null} an array if past entries exist, null otherwise
 */
function getEntries(){
    let entries = localStorage.getItem('journalEntries')

    if(entries){
        return JSON.parse(entries);
    }
    else{
        // if no entries, display no entries
        return null;
    }    
}

export { populateEntries, getEntries }