/* eslint-env jest */
/* global beforeEach, afterEach, require, beforeAll, it, expect, jest, global */

/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

function waitForElement(selector, { timeout = 1000, interval = 10 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      if (Date.now() - start > timeout)
        return reject(new Error(`Timeout: Element "${selector}" not found`));
      setTimeout(check, interval);
    })();
  });
}

beforeEach(() => {
  document.body.innerHTML = '<div class="card-input"></div>';
  const templatePath = path.resolve(
    __dirname,
    "../templates/card-template.html",
  );
  const templateHTML = fs.readFileSync(templatePath, "utf8");

  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve(templateHTML),
    }),
  );

  const mockCardData = {
    prompt: "Dynamic prompt",
    date: "2025-05-26",
    image: "https://example.com/dynamic.jpg",
    alt: "a dynamic image",
  };

  jest.resetModules();
  jest.doMock("../script/create-card.js", () => {
    document.addEventListener("DOMContentLoaded", async () => {
      const response = await fetch("../templates/card-template.html");
      const html = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html.trim();
      const template = tempDiv.querySelector("template");

      const clone = template.content.cloneNode(true);
      clone.querySelector(".prompt").textContent = mockCardData.prompt;
      clone.querySelector(".date").textContent = new Date(
        mockCardData.date,
      ).toLocaleDateString();
      clone.querySelector(".date").setAttribute("datetime", mockCardData.date);
      clone.querySelector("img").src = mockCardData.image;
      clone.querySelector("img").alt = mockCardData.alt;

      const container = document.querySelector(".card-input");
      container.innerHTML = "";
      container.appendChild(clone);

      const card = container.querySelector(".card");
      const front = card.querySelector(".card-front");
      const back = card.querySelector(".card-back");

      front.addEventListener("click", (e) => {
        card.classList.add("flipped");
      });

      back.addEventListener("click", (e) => {
        if (!e.target.closest("textarea")) {
          card.classList.remove("flipped");
        }
      });
    });
    return {};
  });
  require("../script/create-card.js");
});

afterEach(() => {
  jest.restoreAllMocks(); // Clean up mocks after each test
});

it("inject the card with dynamic content from JS", async () => {
  const mockCardData = {
    prompt: "Dynamic prompt",
    date: "2025-05-26",
    image: "https://example.com/dynamic.jpg",
    alt: "a dynamic image",
  };
  document.dispatchEvent(new Event("DOMContentLoaded"));
  const card = await waitForElement(".card");
  expect(card).toBeTruthy();
  expect(card.querySelector(".prompt").textContent).toBe(mockCardData.prompt);
  expect(card.querySelector(".date").getAttribute("datetime")).toBe(
    mockCardData.date,
  );
  expect(card.querySelector("img").alt).toBe(mockCardData.alt);
  expect(card.querySelector("img").src).toContain(mockCardData.image);
});

it("flips the card on front click and unflips on back click (not textarea)", async () => {
  const mockCardData = {
    prompt: "Dynamic prompt",
    date: "2025-05-26",
    image: "https://example.com/dynamic.jpg",
    alt: "a dynamic image",
  };
  document.dispatchEvent(new Event("DOMContentLoaded"));

  const card = await waitForElement(".card");
  const front = card.querySelector(".card-front");
  const back = card.querySelector(".card-back");
  const textarea = back.querySelector("textarea");

  // Initially not flipped
  expect(card.classList.contains("flipped")).toBe(false);

  // Simulate front click
  front.click();
  expect(card.classList.contains("flipped")).toBe(true);

  // Simulate textarea click — should stay flipped
  textarea.click();
  expect(card.classList.contains("flipped")).toBe(true);

  // Simulate back click (not on textarea) — should unflip
  back.click();
  expect(card.classList.contains("flipped")).toBe(false);
});
