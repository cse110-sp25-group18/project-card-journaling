/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from Shuffle Recap page", () => {
  beforeAll(async () => {
    await page.goto(
      "https://cse110-sp25-group18.github.io/project-card-journaling/pages/recap.html",
    );
  });

  it("Test correct page load", async () => {
    // nav buttons
    const navButtons = await page.$$eval("nav a img", (imgs) => {
      return imgs.map((img) => {
        return img.getAttribute("src");
      });
    });

    expect(navButtons.length).toBe(5);
    expect(navButtons.includes("../images/home-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/edit-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/calendar-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/shuffle-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/settings-icon.svg")).toBe(true);

    // recap controls
    const shuffleBtn = await page.$("#shuffleBtn");

    expect(shuffleBtn).not.toBe(null);
  });
});
