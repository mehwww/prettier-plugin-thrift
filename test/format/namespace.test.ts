import { test } from "vitest";
import { runFormatTest } from "./utils";

test("namespace", async () => {
  await runFormatTest(__filename);
});
