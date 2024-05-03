import { test } from "vitest";
import { runFormatTest } from "./utils";

test("const", async () => {
  await runFormatTest(__filename);
});
