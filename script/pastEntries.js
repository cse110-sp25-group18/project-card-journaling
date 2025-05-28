import { Card } from "./cardClass.js";

let cards = []

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM ready, starting to load past entries...");

    const date = new Date();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    populatePage( month, year);

});

/**
 * Pulls information from local storage and populates past entry cards.
 * If no past entries exist, displays no entries to webpage.
 * @param {number} month - the month of the year in integer form
 * @param {number} year - the year in integer form
 * @returns
 */
function populatePage(month, year) {

    loadCalendar(month, year);

    // get container where cards will live
    const entriesContainer = document.querySelector(".entries-container");
    
    // get entries and filter for the current displayed month + year
    let entries = getEntries();
    if(!entries) {
        // if no entries, return
        console.log("No entries");
        return;
    }    
    let filteredEntries = filterByDate(entries, month, year);

    // Add each entry to the DOM
    filteredEntries.forEach(entry => {
        // Create container for this card
        const cardContainer = document.createElement("div");
        cardContainer.id = `card-${entry.id}`;
        

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
            image: entry.image || "../Settings.png",
          },
          
        });
        const date = new Date(entry.date);
        let day = date.getDate();

        // find element that is this day
        const dateContainer = document.querySelector(`div[data-day="${day}"]:not(.inactive)`);
        dateContainer.appendChild(cardContainer);

        cards.push(card);

        card.render();
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
/**
 * Filters all entries and returns those that fall within a given month + year
 * @param {Array<Object>} entries - array of JSON entries 
 * @param {number} targetMonth - target month
 * @param {number} targetYear - target year
 * @returns {Array<Object>} Filtered entries from that month
 */
function filterByDate(entries, targetMonth, targetYear){
    return entries.filter(entry => {
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
function loadCalendar(month, year){
    const monthYearElement = document.getElementById('month-year');
    const datesElement = document.getElementById('dates');

    // month is 0 indexed, so subtract 1
    let currentDate = new Date(year, month-1);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year:'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    // trailing days from prev month
    for(let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0);
        datesHTML += `<div class="date inactive" data-day="${prevDate.getDate() - i + 1}"></div>`;
    }
    const today = new Date();
    // days of current month
    for(let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isToday = date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
        const activeClass = isToday ? 'active' : '';
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
    for(let i = 1; i <= nextDays; i++) {
    datesHTML += `<div class="date inactive" data-day="${i}"></div>`;
    }
    datesElement.innerHTML = datesHTML;
    console.log("Successfully loaded calendar");
}
export { populatePage, getEntries }
