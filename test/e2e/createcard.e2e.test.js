/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from Create Card page", () => {
  beforeAll(async () => {
    await page.goto(
      "https://cse110-sp25-group18.github.io/project-card-journaling/pages/create-card.html",
    );

    await page.waitForSelector(".card", { visible: true });
    await page.waitForSelector(".card-front", { visible: true });
    await page.waitForSelector(".card-back", { visible: true });
  });

  it("Test correct page load", async () => {
    console.log("Testing correct page load...");

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

    // top bar
    const newPromptBtn = await page.$("#newPromptBtn");
    const editPromptBtn = await page.$("#editPromptBtn");

    expect(newPromptBtn).not.toBe(null);
    expect(editPromptBtn).not.toBe(null);

    // card
    const cardFront = await page.$(".card-front");
    const cardBack = await page.$(".card-back");

    expect(cardFront).not.toBe(null);
    expect(cardBack).not.toBe(null);

    // button Row
    const deleteBtn = await page.$("#deleteBtn");
    const submitBtn = await page.$("#submitBtn");

    expect(deleteBtn).not.toBe(null);
    expect(submitBtn).not.toBe(null);
  });

  it("Test that submit saves to localStorage", async () => {
    console.log("Testing that submit saves to localStorage...");

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const cardFront = await page.$(".card-front");
    const cardBack = await page.$(".card-back");

    let flipped = await page.$(".flipped");

    if (!flipped) {
      await cardFront.click();
      await page.waitForSelector(".flipped", { visible: true });
    }
    
    await page.type("#response", "hello");

    let submitBtn = await page.$("#submitBtn");
    await submitBtn.click();

    let local = await page.evaluate(() => {
      return localStorage.getItem("journalEntries");
    });

    let localJSON = JSON.parse(local);
    
    expect(localJSON.length).toBe(1);
    expect(localJSON[0].response).toBe("hello");
  });
});
