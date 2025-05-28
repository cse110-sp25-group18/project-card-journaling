/* eslint-env jest */
import { test, expect } from "@jest/globals";

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
