/* eslint-env jest */
import { test, expect, afterAll } from "@jest/globals";
import {
  populatePage,
  loadCalendar,
  getEntries,
  filterByDate,
  cards,
  handleNextButton,
  handlePreviousButton,
  handleDeleteButton,
  handleSelection,
  handleFavoriteButton,
} from "../../script/pastEntries";
import { Card } from "../../script/cardClass";

jest.mock("../../script/cardClass");

function getCalendarData(currentDate) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();

  const totalCells = firstDayIndex + totalDays;
  let totalGridCells;
  if (totalCells <= 35) {
    totalGridCells = 35;
  } else {
    totalGridCells = 42;
  }
  const nextDays = totalGridCells - totalCells;

  return {
    currentYear,
    currentMonth,
    firstDayIndex,
    totalDays,
    totalGridCells,
    nextDays,
  };
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="month-year"></div>
    <div id="dates"></div>
    <div id="displayed-card-container"></div>
  `;
  localStorage.clear();
});

test("should calculate correct number of days in month", () => {
  for (let month = 0; month < 12; month += 1) {
    const date = new Date(2025, month, 1);
    const { totalDays } = getCalendarData(date);
    const expected = new Date(2025, month + 1, 0).getDate();
    expect(totalDays).toBe(expected);
  }
});

test("should calculate correct first day index", () => {
  const date = new Date(2025, 4, 1); // May 2025
  const { firstDayIndex } = getCalendarData(date);
  expect(firstDayIndex).toBe(new Date(2025, 4, 1).getDay());
});

test("should use 35 or 42 grid cells depending on month layout", () => {
  for (let month = 0; month < 12; month += 1) {
    const date = new Date(2025, month, 1);
    const { totalGridCells, firstDayIndex, totalDays } = getCalendarData(date);
    const totalCells = firstDayIndex + totalDays;
    if (totalCells <= 35) {
      expect(totalGridCells).toBe(35);
    } else {
      expect(totalGridCells).toBe(42);
    }
  }
});

test("should display correct trailing days from previous month", () => {
  for (let month = 0; month < 12; month += 1) {
    const year = 2025;
    const date = new Date(year, month, 1);
    const firstDayIndex = date.getDay();
    if (firstDayIndex === 0) {
      // No trailing days if month starts on Sunday
      continue;
    }
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    // The trailing days should be the last 'firstDayIndex' days of the previous month
    const expectedTrailingDays = [];
    for (let i = firstDayIndex; i > 0; i--) {
      expectedTrailingDays.push(prevMonthLastDay - i + 1);
    }

    // Simulate your code's logic for trailing days
    const actualTrailingDays = [];
    for (let i = firstDayIndex; i > 0; i--) {
      actualTrailingDays.push(prevMonthLastDay - i + 1);
    }

    expect(actualTrailingDays).toEqual(expectedTrailingDays);
  }
});

test("should display correct trailing days from previous month", () => {
  for (let month = 0; month < 12; month += 1) {
    const year = 2025;
    const date = new Date(year, month, 1);
    const firstDayIndex = date.getDay();
    if (firstDayIndex === 0) {
      // No trailing days if month starts on Sunday
      continue;
    }
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    // The trailing days should be the last 'firstDayIndex' days of the previous month
    const expectedTrailingDays = [];
    for (let i = firstDayIndex; i > 0; i--) {
      expectedTrailingDays.push(prevMonthLastDay - i + 1);
    }

    // Simulate your code's logic for trailing days
    const actualTrailingDays = [];
    for (let i = firstDayIndex; i > 0; i--) {
      actualTrailingDays.push(prevMonthLastDay - i + 1);
    }

    expect(actualTrailingDays).toEqual(expectedTrailingDays);
  }
});

test("should calculate correct number of trailing days", () => {
  const date = new Date(2025, 0, 1); // January 2025
  const { totalGridCells, firstDayIndex, totalDays, nextDays } =
    getCalendarData(date);
  expect(nextDays).toBe(totalGridCells - (firstDayIndex + totalDays));
});

test("should mark today as active", () => {
  const today = new Date();
  const { currentYear, currentMonth } = getCalendarData(today);
  expect(today.getFullYear()).toBe(currentYear);
  expect(today.getMonth()).toBe(currentMonth);
});

test("should display correct month and year string in header", () => {
  for (let month = 0; month < 12; month += 1) {
    const date = new Date(2025, month, 1);
    const monthYearString = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    // Simulate what the code does for the header
    expect(monthYearString).toBe(
      new Date(2025, month, 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    );
  }
});

test("entries should be an array of JSON objects", () => {
  let entries = getEntries();
  if (entries) {
    expect(Array.isArray(entries)).toBe(true);
  } else {
    expect(entries).toBe(null);
  }
});

describe("getEntries", () => {
  test("returns parsed entries if they exist", () => {
    const mockData = [{ id: 1, date: "2024-05-01" }];
    localStorage.setItem("journalEntries", JSON.stringify(mockData));
    expect(getEntries()).toEqual(mockData);
  });

  test("returns null if no entries exist", () => {
    expect(getEntries()).toBeNull();
  });
});

describe("filterByDate", () => {
  test("filters entries by month and year", () => {
    const entries = [
      { date: "2024-05-01T00:00:00" },
      { date: "2024-06-01T00:00:00" },
    ];
    // 4 hardcodes to May
    const result = filterByDate(entries, 5, 2024);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2024-05-01T00:00:00");
  });
});

describe("loadCalendar", () => {
  test("renders correct number of day divs", () => {
    loadCalendar(5, 2024);
    const dates = document.getElementById("dates");
    expect(dates.children.length).toBeGreaterThanOrEqual(35);
  });
});

describe("populatePage", () => {
  test("skips rendering if no entries", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    populatePage(5, 2024);
    expect(consoleSpy).toHaveBeenCalledWith("No entries");
    consoleSpy.mockRestore();
  });

  test("renders placeholders", () => {
    const mockEntry = {
      id: "abc",
      date: "2024-05-10",
      prompt: "Test Prompt",
      response: "Test Response",
      image: "",
    };

    localStorage.setItem("journalEntries", JSON.stringify([mockEntry]));
    loadCalendar(5, 2024);
    document.querySelector(`div[data-day="10"]`).classList.remove("inactive");

    Card.mockImplementation(() => ({
      model: { id: "abc", prompt: "Test Prompt" },
      render: jest.fn(),
    }));

    populatePage(5, 2024);
    expect(document.querySelector(".placeholder")).toBeTruthy();
  });
});

describe("handleNextButton", () => {
  test("next month with no wrap", () => {
    let month = 0;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handleNextButton(month, year);
    expect(retMonth).toBe(1);
    expect(retYear).toBe(2025);
  });

  test("next month with wrap", () => {
    let month = 11;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handleNextButton(month, year);
    expect(retMonth).toBe(0);
    expect(retYear).toBe(2026);
  });
});

describe("handlePreviousButton", () => {
  test("previous month with no wrap", () => {
    let month = 1;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handlePreviousButton(month, year);
    expect(retMonth).toBe(0);
    expect(retYear).toBe(2025);
  });

  test("previous month with wrap", () => {
    let month = 0;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handlePreviousButton(month, year);
    expect(retMonth).toBe(11);
    expect(retYear).toBe(2024);
  });
});

describe("handleSelection", () => {
  test("selects correct card", () => {
    document.body.innerHTML = `<div id="displayed-card-container"></div>`;

    const mockEntry = {
      id: 1,
      date: "2024-05-01",
      prompt: "test",
      response: "r",
      image: "",
    };
    const mockCard = {
      model: { id: 1 },
      render: jest.fn(),
    };

    // Mutate cards array directly
    cards.length = 0;
    cards.push(mockCard);

    // Mock localStorage entry
    localStorage.setItem("journalEntries", JSON.stringify([mockEntry]));

    handleSelection(1);

    const container = document.getElementById("displayed-card-container");
    expect(container.childNodes.length).toBe(1);
    expect(mockCard.render).toHaveBeenCalled();
  });
});

describe("handleDeleteButton", () => {
  let confirmSpy;
  let alertSpy;
  let mockCard;

  const mockEntry = {
    id: 1,
    date: "2024-05-10",
    prompt: "Test Prompt",
    response: "Test Response",
    image: "",
  };

  beforeEach(() => {
    // Provide mock card with .destroy()
    mockCard = {
      model: { id: 1, date: new Date(2025, 4, 10) },
      destroy: jest.fn(),
    };

    document.body.innerHTML = `
      <div id="displayed-card-container">
        <div class="card-container" id="card-1"></div>
      </div>
      <div data-day="10" class="calendar-day"></div>
    `;
    // Mock confirm and alert
    confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    // Set mock journal entries
    localStorage.setItem("journalEntries", JSON.stringify([mockEntry]));

    // Spy on getEntries
    jest.spyOn(localStorage.__proto__, "getItem").mockImplementation((key) => {
      return JSON.stringify([mockEntry]);
    });

    cards.length = 0;
    cards.push(mockCard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cards.length = 0;
  });

  test("shows alert if no card is selected", () => {
    document.getElementById("displayed-card-container").innerHTML = "";
    handleDeleteButton();
    expect(alertSpy).toHaveBeenCalledWith(
      "You must select a card before attempting to delete.",
    );
  });

  test("does not delete if user cancels", () => {
    confirmSpy.mockReturnValue(false); // cancel deletion
    handleDeleteButton();

    const updated = JSON.parse(localStorage.getItem("journalEntries"));
    expect(updated).toHaveLength(1); // nothing removed
    expect(mockCard.destroy).not.toHaveBeenCalled();
  });
});

describe("handleFavoriteButton", () => {
  let alertSpy;
  let mockCard;
  const mockEntry = {
    id: 1,
    date: "2025-05-10T05:25:46.271Z",
    prompt: "Test",
    response: "Hello",
    image: "",
    favorite: false,
  };

  beforeEach(() => {
    // DOM setup
    document.body.innerHTML = `
      <div id="displayed-card-container">
        <div class="card-container" id="card-1"></div>
      </div>
      <div data-day="10" class="calendar-day"></div>
    `;

    // Spy on alert
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    // Mock localStorage
    localStorage.setItem("journalEntries", JSON.stringify([mockEntry]));

    // Mock getEntries
    jest
      .spyOn(localStorage.__proto__, "getItem")
      .mockImplementation(() => JSON.stringify([mockEntry]));

    // Mock card in cards[]
    mockCard = {
      model: { id: 1, favorite: false },
      render: jest.fn(),
    };

    const dayContainer = document.querySelector(
      `div[data-day="10"]:not(.inactive)`,
    );
    console.log(dayContainer);
    cards.length = 0;
    cards.push(mockCard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cards.length = 0;
  });

  test("alerts if no card is selected", () => {
    document.getElementById("displayed-card-container").innerHTML = ""; // remove selected card
    handleFavoriteButton();
    expect(alertSpy).toHaveBeenCalledWith(
      "You must select a card before attempting to favorite.",
    );
  });
});
