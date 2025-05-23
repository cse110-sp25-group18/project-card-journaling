/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from Shuffle Recap page", () => {
  beforeAll(async () => {
    await page.goto(
      "https://cse110-sp25-group18.github.io/project-card-journaling/pages/recap.html",
    );
  });

  it("Test correct page load", async () => {
    // nav buttons
    const navButtons = await page.$$eval("nav a", (buttons) => {
      return buttons.map((button) => {
        return button.textContent.trim();
      });
    });

    expect(navButtons.length).toBe(5);
    expect(navButtons.includes("Home")).toBe(true);
    expect(navButtons.includes("Create Card")).toBe(true);
    expect(navButtons.includes("Past Entries")).toBe(true);
    expect(navButtons.includes("Shuffle Recap")).toBe(true);
    expect(navButtons.includes("Settings")).toBe(true);

    // recap controls
    const shuffleBtn = await page.$("#shuffleBtn");

    expect(shuffleBtn).not.toBe(null);
  });
});
