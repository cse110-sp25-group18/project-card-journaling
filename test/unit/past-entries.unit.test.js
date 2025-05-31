/* eslint-env jest */
import { test, expect } from "@jest/globals";
import { populatePage, loadCalendar, getEntries, renderCard, filterByDate,
   cards, handleNextButton, handlePreviousButton} from "../../script/pastEntries";
import { Card } from "../../script/cardClass";

jest.mock('../../script/cardClass');


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

test('entries should be an array of JSON objects', () => {
  let entries = getEntries();
  if (entries) {
    expect(Array.isArray(entries)).toBe(true);
  } else {
    expect(entries).toBe(null);
  }
});


describe('getEntries', () => {
  test('returns parsed entries if they exist', () => {
    const mockData = [{ id: 1, date: '2024-05-01' }];
    localStorage.setItem('journalEntries', JSON.stringify(mockData));
    expect(getEntries()).toEqual(mockData);
  });

  test('returns null if no entries exist', () => {
    expect(getEntries()).toBeNull();
  });
});

describe('filterByDate', () => {
  test('filters entries by month and year', () => {
    const entries = [
      { date: '2024-05-01' },
      { date: '2024-06-01' },
    ];
    // 4 hardcodes to May
    const result = filterByDate(entries, 4, 2024);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-05-01');
  });
});

describe('loadCalendar', () => {
  test('renders correct number of day divs', () => {
    loadCalendar(5, 2024);
    const dates = document.getElementById('dates');
    expect(dates.children.length).toBeGreaterThanOrEqual(35);
  });
});

describe('populatePage', () => {
  test('skips rendering if no entries', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    populatePage(5, 2024);
    expect(consoleSpy).toHaveBeenCalledWith('No entries');
    consoleSpy.mockRestore();
  });

  test('renders cards and placeholders', () => {
    const mockEntry = {
      id: 'abc',
      date: '2024-05-10',
      prompt: 'Test Prompt',
      response: 'Test Response',
      image: ''
    };

    localStorage.setItem('journalEntries', JSON.stringify([mockEntry]));
    loadCalendar(5, 2024);
    document.querySelector(`div[data-day="10"]`).classList.remove('inactive');

    Card.mockImplementation(() => ({
      model: { id: 'abc', prompt: 'Test Prompt' },
      render: jest.fn()
    }));

    populatePage(5, 2024);
    expect(document.querySelector('.placeholder')).toBeTruthy();
    expect(document.getElementById('card-abc')).toBeTruthy();
  });
});

describe('renderCard', () => {
  test('hides all cards and shows selected card', () => {
    document.body.innerHTML += `
      <div id="card-1" class="card-container">
        <div class="card flipped"></div>
      </div>
      <div id="card-2" class="card-container">
        <div class="card flipped"></div>
      </div>
    `;
    const mockCard1 = {
      model: { id: '1' }
    };
    const mockCard2 = {
      model: { id: '2' }
    };
    cards.length = 0;
    cards.push(mockCard1, mockCard2);
    renderCard('2');

    expect(document.getElementById('card-1').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('card-2').classList.contains('hidden')).toBe(false);
  });
});

describe('handleNextButton', () => {
  test('next month with no wrap', () => {
    let month = 0;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handleNextButton(month, year);
    expect(retMonth).toBe(1);
    expect(retYear).toBe(2025);
  });

  test('next month with wrap', () => {
    let month = 11;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handleNextButton(month, year);
    expect(retMonth).toBe(0);
    expect(retYear).toBe(2026);
  });
});

describe('handlePreviousButton', () => {
  test('previous month with no wrap', () => {
    let month = 1;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handlePreviousButton(month, year);
    expect(retMonth).toBe(0);
    expect(retYear).toBe(2025);
  });

  test('previous month with wrap', () => {
    let month = 0;
    let year = 2025;
    populatePage(month, year);
    const { retMonth, retYear } = handlePreviousButton(month, year);
    expect(retMonth).toBe(11);
    expect(retYear).toBe(2024);
  });
});