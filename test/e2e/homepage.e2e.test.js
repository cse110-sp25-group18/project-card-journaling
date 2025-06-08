/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from homepage", () => {
  beforeAll(async () => {
    await page.goto("http://127.0.0.1:8080");
  });

  it("Check that buttons loaded", async () => {
    console.log("Checking that nav buttons loaded...");

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

    console.log("Checking that journal entry buttons loaded...");

    const homeButtons = await page.$$eval(".home-buttons", (buttons) => {
      return buttons.map((button) => {
        return button.textContent.trim();
      });
    });

    expect(homeButtons.length).toBe(2);
    expect(homeButtons.includes("Create a new journal entry?")).toBe(true);
    expect(homeButtons.includes("View past journal entries?")).toBe(true);
  });

  it(`Testing 'new journal entry' button`, async () => {
    console.log(`Testing 'new journal entry' button`);

    let newButton = await page.$(
      `.home-buttons[onclick="location.href='./pages/create-card.html'"]`,
    );
    await newButton.click();

    await page.waitForSelector(".card-input");

    let card = await page.$(".card-input");

    expect(card).not.toBe(null);

    await page.goto("http://127.0.0.1:8080");
  });

  it(`Testing 'past journal entry' button`, async () => {
    console.log(`Testing 'past journal entry' button`);

    let pastButton = await page.$(
      `.home-buttons[onclick="location.href='./pages/past-entries.html'"]`,
    );
    await pastButton.click();

    await page.waitForSelector(".calendar");

    let calendar = await page.$(".calendar");

    expect(calendar).not.toBe(null);

    await page.goto("http://127.0.0.1:8080");
  });

  it.skip(`Testing 'Home' button`, async () => {
    console.log(`Testing 'Home' button`);

    // TODO: test that 'Home' button takes user to correct page
  });
});
