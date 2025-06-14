/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from Past Entries page", () => {
  beforeAll(async () => {
    await page.goto("http://127.0.0.1:8080/pages/past-entries.html");
  });

  it("Test correct page load", async () => {
    // nav buttons
    const navButtons = await page.$$eval("nav a img", (imgs) => {
      return imgs.map((img) => {
        return img.getAttribute("src");
      });
    });

    expect(navButtons.length).toBe(3);
    expect(navButtons.includes("../images/home-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/edit-icon.svg")).toBe(true);
    expect(navButtons.includes("../images/calendar-icon.svg")).toBe(true);

    // Entry buttons
  });
});
