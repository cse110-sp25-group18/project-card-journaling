/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `<div class="card-input"></div>`;

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
    })
  );
});

it("renders the card into the DOM with correct data", async () => {
  require("../script/create-card.js");

  document.dispatchEvent(new Event("DOMContentLoaded"));

  await new Promise((r) => setTimeout(r, 10));

  const card = document.querySelector(".card");
  expect(card).toBeTruthy();
  expect(card.querySelector(".prompt").textContent).toBe("What inspired you today?");
  expect(card.querySelector(".date").getAttribute("datetime")).toBe("2025-05-19");
  expect(card.querySelector("img").alt).toBe("Placeholder image");
  expect(card.querySelector("img").src).toMatch(/placeholder/);
});

it("flips the card on front click and unflips on back click (not textarea)", async () => {
  // Load your script
  require("../script/create-card.js");
  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise((r) => setTimeout(r, 10)); // Wait for DOM + fetch

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


/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `<div class="card-input"></div>`;

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

it("renders the card into the DOM with correct data", async () => {
  require("../script/create-card.js");

  document.dispatchEvent(new Event("DOMContentLoaded"));

  await new Promise((r) => setTimeout(r, 10));

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
  // Load your script
  require("../script/create-card.js");
  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise((r) => setTimeout(r, 10)); // Wait for DOM + fetch

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
