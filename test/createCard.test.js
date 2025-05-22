/* eslint-env jest */
/* global beforeEach, afterEach, beforeAll, it, expect, jest, global, document, Event */

/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = '<div class="card-input"></div>';

  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () =>
        Promise.resolve(`
          <template id="card-template">
            <article class="card" role="region" aria-label="Card Prompt">
              <header class="card-side card-front" tabindex="0">
                <h2 class="prompt"></h2>
                <time class="date"></time>
                <figure>
                  <img src="" alt="Picture">
                </figure>
              </header>
              <section class="card-side card-back">
                <form>
                  <label for="response">Your Response</label>
                  <textarea id="response" name="response" placeholder="Type your response..." aria-label="Response input"></textarea>
                </form>
              </section>
            </article>
          </template>
        `),
    }),
  );
});

afterEach(() => {
  jest.restoreAllMocks(); // Clean up mocks after each test
});

beforeAll(() => {
  // Load your script once before all tests
  require("../script/create-card.js");
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

it("renders the card into the DOM with correct data", async () => {
  document.dispatchEvent(new Event("DOMContentLoaded"));
  await wait(10);

  const card = document.querySelector(".card");
  expect(card).toBeTruthy();
  expect(card.querySelector(".prompt").textContent).toBe(
    "What inspired you today?",
  );
  expect(card.querySelector(".date").getAttribute("datetime")).toBe(
    "2025-05-19",
  );
  expect(card.querySelector("img").alt).toBe("Placeholder image");
  expect(card.querySelector("img").src).toMatch(/placeholder/);
});

it("flips the card on front click and unflips on back click (not textarea)", async () => {
  document.dispatchEvent(new Event("DOMContentLoaded"));
  await wait(10);

  const card = document.querySelector(".card");
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
