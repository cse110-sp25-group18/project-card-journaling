import { makePromptEditable } from "../../script/promptEdit.js";
import { test, expect } from "@jest/globals";

test("makePromptEditable doesn't return a value", () => {
  const result = makePromptEditable();
  expect(result).toBeUndefined();
});
