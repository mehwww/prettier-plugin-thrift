import { test } from "vitest";
import { runFormatTest } from "./utils";

test("struct", async () => {
  await runFormatTest(__filename);
});
