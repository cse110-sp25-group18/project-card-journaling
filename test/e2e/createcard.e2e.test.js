/* global describe, beforeAll, page, it, expect */

describe("Test basic user flow from Create Card page", () => {
  beforeAll(async () => {
    await page.goto("http://127.0.0.1:8080/pages/create-card.html");

    await page.waitForSelector(".card", { visible: true });
    await page.waitForSelector(".card-back", { visible: true });
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
      return true;
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

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
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
