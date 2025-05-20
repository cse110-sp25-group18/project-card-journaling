const { makePromptEditable } = require("../script/promptEdit.js");

test("makePromptEditable doesn't return a value", () => {
  const result = makePromptEditable();
  expect(result).toBeUndefined();
});
