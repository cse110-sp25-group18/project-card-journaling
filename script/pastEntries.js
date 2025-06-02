import { Card } from "./cardClass.js";

// initialzies month and day 
let cards = [];
const date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM ready, starting to load past entries...");

  // link button functions
  const prevButton = document.querySelector("#previous-button");
  const nextButton = document.querySelector("#next-button");
  const deleteButton = document.querySelector("#delete-button");
  const favoriteButton = document.querySelector("#favorite-button");
  prevButton.addEventListener("click", () => {
    const { retMonth, retYear } = handlePreviousButton(month, year);
    month = retMonth;
    year = retYear;
  });
  nextButton.addEventListener("click", () => {
    const { retMonth, retYear } = handleNextButton(month, year);
    month = retMonth;
    year = retYear;
  });
  deleteButton.addEventListener("click", () => {handleDeleteButton()});
  favoriteButton.addEventListener("click", () => {handleFavoriteButton()});

  // populate page with current month
  populatePage(month, year);
});

/**
 * Pulls information from local storage and populates past entry cards.
 * If no past entries exist, displays no entries to webpage.
 * @param {number} month - the month of the year : 1-indexed
 * @param {number} year - the year in integer form
 * @returns
 */
function populatePage(month, year) {
  loadCalendar(month, year);

  // get entries and filter for the current displayed month + year
  let entries = getEntries();
  if (!entries) {
    // if no entries, return
    console.log("No entries");
    return;
  }
  let filteredEntries = filterByDate(entries, month, year);

  // Add each entry to the DOM
  filteredEntries.forEach((entry) => {

    // find calendar date for this entry
    const date = new Date(entry.date);
    let day = date.getDate();
    const dateContainer = document.querySelector(
      `div[data-day="${day}"]:not(.inactive)`,
    );

    // create placeholder card and add to DOM
    // each one just displays the prompt and a card outline
    const placeHolder = document.createElement("div");
    placeHolder.classList.add("placeholder");
    const placeHolderPrompt = document.createElement("p");
    placeHolderPrompt.textContent = entry.prompt;
    placeHolder.appendChild(placeHolderPrompt);
    dateContainer.appendChild(placeHolder);

    // Create a flippable, non-editable card
    const card = new Card({
      flippable: true,
      editable: false,
      containerSelector: `#card-${entry.id}`,
      data: {
        id: entry.id,
        prompt: entry.prompt || "No prompt",
        response: entry.response || "No response",
        date: entry.date,
        image: entry.image || "",
        favorite: entry.favorite || false,
      },
    });

    // add event listener for when user clicks the calendar entry
    dateContainer.addEventListener("click", () => {
        handleSelection(entry.id);
    });

    // store reference to this card for rendering, favoriting, and deleting
    cards.push(card);
  });
}

/**
 * Gets all past entries from local storage
 * @returns {JSON|null} an array if past entries exist, null otherwise
 */
function getEntries() {
  let entries = localStorage.getItem("journalEntries");

  if (entries) {
    return JSON.parse(entries);
  } else {
    // if no entries, display no entries
    return null;
  }
}
/**
 * Filters all entries and returns those that fall within a given month + year
 * @param {Array<Object>} entries - array of JSON entries
 * @param {number} targetMonth - target month
 * @param {number} targetYear - target year
 * @returns {Array<Object>} Filtered entries from that month
 */
function filterByDate(entries, targetMonth, targetYear) {
  return entries.filter((entry) => {
    const date = new Date(entry.date);
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    const year = date.getFullYear();
    return month === targetMonth && year === targetYear;
  });
}
/**
 * Populates the DOM with the correct calendar
 * @param {number} month month of the calendar
 * @param {number} year year of the calendar
 */
function loadCalendar(month, year) {
  const monthYearElement = document.getElementById("month-year");
  const datesElement = document.getElementById("dates");

  // month is 0 indexed, so subtract 1
  let currentDate = new Date(year, month - 1);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();

  const monthYearString = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  monthYearElement.textContent = monthYearString;

  let datesHTML = "";

  // trailing days from prev month
  for (let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 0);
    datesHTML += `<div class="date inactive" data-day="${prevDate.getDate() - i + 1}"></div>`;
  }
  const today = new Date();
  // days of current month
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const activeClass = isToday ? "active" : "";
    datesHTML += `<div class="date ${activeClass}" data-day="${i}"></div>`;
  }
  // days leading into next month
  const totalCells = firstDayIndex + totalDays;
  let totalGridCells;
  // need 5 or 6 rows
  if (totalCells <= 35) {
    totalGridCells = 35;
  } else {
    totalGridCells = 42;
  }
  const nextDays = totalGridCells - totalCells;
  for (let i = 1; i <= nextDays; i++) {
    datesHTML += `<div class="date inactive" data-day="${i}"></div>`;
  }
  datesElement.innerHTML = datesHTML;
  console.log("Successfully loaded calendar");
}

/**
 * Renders a single card
 * @param {number} id - id of card to render
 */
function renderCard(id) {
  // hides all cards at the start and unflips
  cards.forEach((card) => {
    const cardContainerElem = document.querySelector(`#card-${card.model.id}`);
    cardContainerElem.classList.add("hidden");
    cardContainerElem.querySelector(".card").classList.remove("flipped");
  });
  document.querySelector(`#card-${id}`).classList.remove("hidden");
}

/**
 * Loads next month's calendar
 * @return {number, number} returns the new month and year
 */
function handleNextButton(retMonth, retYear) {
  if (retMonth === 11) {
    retMonth = 0;
    retYear++;
  } else {
    retMonth++;
  }
  populatePage(retMonth, retYear);
  return { retMonth, retYear };
}

/**
 * Loads the previous month's calendar
 * @return {number, number} returns the new month and year
 */
function handlePreviousButton(retMonth, retYear) {
  if (retMonth === 0) {
    retMonth = 11;
    retYear--;
  } else {
    retMonth--;
  }
  populatePage(retMonth, retYear);
  return { retMonth, retYear };
}

function handleSelection(id){
    // get entries and filter for the current displayed month + year
    let entries = getEntries();
    if (!entries) {
        // if no entries, return
        console.log("No entries");
        return;
    }

    // get reference to display container and clear it
    const displayedCardContainer = document.getElementById(
        "displayed-card-container"
    );
    displayedCardContainer.innerHTML = "";

    // get the correct entry
    let entry = entries.find(obj => obj.id == id);
    
    // Create container for this card
    const cardContainer = document.createElement("div");
    cardContainer.id = `card-${entry.id}`;
    cardContainer.classList.add("card-container");
    displayedCardContainer.appendChild(cardContainer);

    // make correct card render
    const card = cards.find(obj => obj.model.id == entry.id);
    card.render();

}
function handleDeleteButton(){
    // checks if a card is currently being displayed, hence it is "selected"
    const displayedCardContainer = document.getElementById("displayed-card-container");
    const selectedCard = displayedCardContainer.querySelector(".card-container");
    if(selectedCard == null){
        alert("You must select a card before attempting to delete.");
        return;
    }
    const confirmed = confirm("Are you sure you want to delete this entry?");
    if (confirmed) {
        // Proceed with delete

        // keep reference to card id
        const id = Number(selectedCard.id.split('-')[1]);

        // delete from journalEntries/localStorage
        let entries = getEntries();
        const updatedEntries = entries.filter(obj => obj.id !== id);
        const entry = entries.find(obj => obj.id == id);
        localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));

        // delete prompt placeholder
        const date = new Date(entry.date);
        let day = date.getDate();
        const dayContainer = document.querySelector(`div[data-day="${day}"]:not(.inactive)`);
        dayContainer.innerHTML = "";
        
        // remove event listener from calendar entry
        const dateContainer = document.querySelector(
            `div[data-day="${day}"]:not(.inactive)`,
        );
        dateContainer.removeEventListener("click", renderCard); 

        // destroy the card itself 
        let card = cards.find(obj => obj.model.id === entry.id);
        card.destroy();
        
        // delete from card array
        cards = cards.filter(obj => obj.model.date !== date);

        // clear display container
        displayedCardContainer.innerHTML = "";
        return; 

    } else {
        // Delete was cancelled
        console.log("Deletion canceled.");
        return;
    }
}

function handleFavoriteButton(){
    const displayedCardContainer = document.getElementById("displayed-card-container");
    const selectedCard = displayedCardContainer.querySelector(".card-container");
    if(selectedCard == null){
        alert("You must select a card before attempting to favorite.");
        return;
    }

    // Proceed with favorite
    // get  reference to card id
    const id = Number(selectedCard.id.split('-')[1]);

    // delete from journalEntries/localStorage
    let entries = getEntries();
    let entry = entries.find(obj => obj.id == id);
    const card = cards.find(obj => obj.model.id == id);

    // get placeholder element in the calendar
    const date = new Date(entry.date);
    let day = date.getDate();
    const dayContainer = document.querySelector(`div[data-day="${day}"]:not(.inactive)`);

    // toggle favorite flag and re-render displayed card
    if(entry.favorite){
        entry.favorite = false;
        card.model.favorite = false;
        dayContainer.classList.remove("favorite");
        card.render();
        alert("Card unfavorited");
    } else {
        entry.favorite = true;
        card.model.favorite = true;
        dayContainer.classList.add("favorite");
        card.render();
        alert("Card favorited");
    }

    // update localStorage
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    return; 
}


export {
  populatePage,
  getEntries,
  renderCard,
  loadCalendar,
  filterByDate,
  cards,
  handleNextButton,
  handlePreviousButton,
  handleSelection, 
  handleDeleteButton,
  handleFavoriteButton,
};
