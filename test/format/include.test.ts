import { test } from "vitest";
import { runFormatTest } from "./utils";

test("include", async () => {
  await runFormatTest(__filename);
});
