/* global describe, beforeAll, page, it, expect, jest */

jest.setTimeout(30000);

describe("Test basic user flow from Create Card page", () => {
  beforeAll(async () => {
    await page.goto("http://127.0.0.1:8080/pages/create-card.html");

    await page.waitForSelector(".card", { visible: true });
    await page.waitForSelector(".card-back", { visible: true });

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
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

    // top bar
    const newPromptBtn = await page.$("#newPromptBtn");
    const editPromptBtn = await page.$("#editPromptBtn");

    expect(newPromptBtn).not.toBe(null);
    expect(editPromptBtn).not.toBe(null);

    // card
    const cardBack = await page.$(".card-back");
    expect(cardBack).not.toBe(null);

    // Verify the response form is directly accessible (no flipping needed)
    const responseTextarea = await page.$("textarea#response");
    expect(responseTextarea).not.toBe(null);

    // Verify card is not flippable
    const isNotFlippable = await page.evaluate(() => {
      const card = document.querySelector(".card");
      return !card.classList.contains("flipped");
    });

    expect(isNotFlippable).toBe(true);
    // button Row
    const deleteBtn = await page.$("#deleteBtn");
    const submitBtn = await page.$("#submitBtn");

    expect(deleteBtn).not.toBe(null);
    expect(submitBtn).not.toBe(null);
  });

  it("Test that submit saves to localStorage", async () => {
    console.log("Testing that submit saves to localStorage...");

    await page.type("#response", "hello");

    let submitBtn = await page.$("#submitBtn");
    await submitBtn.click();

    let local = await page.evaluate(() => {
      return localStorage.getItem("journalEntries");
    });

    let localJSON = JSON.parse(local);

    expect(localJSON.length).toBe(1);
    expect(localJSON[0].response).toBe("hello");

    // clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  it("Test the submit to pastEntries pipeline", async () => {
    await page.type("#response", "hello");

    let submitBtn = await page.$("#submitBtn");
    await submitBtn.click();

    let pastEntriesBtn = await page.$(`a[href="past-entries.html"]`);
    await pastEntriesBtn.click();

    await page.waitForSelector(".active");

    let currentDate = await page.$(".active");
    await currentDate.click();

    // Test that card appears
    let hidden = await page.$(".card-container.hidden");
    expect(hidden).toBe(null);

    // Test that card appears unflipped
    let flipped = await page.$(".flipped");
    expect(flipped).toBe(null);

    let cardFront = await page.$(".card-front");
    await cardFront.click();

    // Test that card properly flips
    flipped = await page.$(".flipped");
    expect(flipped).not.toBe(null);

    // Test that the value is correct
    let value = await page.$eval(".card-back #response", (el) => el.value);
    expect(value).toBe("hello");
  });
});
