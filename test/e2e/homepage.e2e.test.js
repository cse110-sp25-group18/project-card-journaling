/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from homepage", () => {
  beforeAll(async () => {
    await page.goto(
      "http://127.0.0.1:8080",
    );
  });

  it("Check that buttons loaded", async () => {
    console.log("Checking that nav buttons loaded...");

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

    console.log("Checking that journal entry buttons loaded...");

    const homeButtons = await page.$$eval(".home-buttons button", (buttons) => {
      return buttons.map((button) => {
        return button.textContent.trim();
      });
    });

    expect(homeButtons.length).toBe(2);
    expect(homeButtons.includes("📝 Create a new journal entry?")).toBe(true);
    expect(homeButtons.includes("📔 View past journal entries?")).toBe(true);
  });

  it.skip(`Testing 'new journal entry' button`, async () => {
    console.log(`Testing 'new journal entry' button`);

    // TODO: test that 'new journal entry' button takes user to correct page
  });

  it.skip(`Testing 'past journal entry' button`, async () => {
    console.log(`Testing 'past journal entry' button`);

    // TODO: test that 'past journal entry' button takes user to correct page
  });

  it.skip(`Testing 'Home' button`, async () => {
    console.log(`Testing 'Home' button`);

    // TODO: test that 'Home' button takes user to correct page
  });
});
