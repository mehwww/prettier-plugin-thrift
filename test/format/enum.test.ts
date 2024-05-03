import { test } from "vitest";
import { runFormatTest } from "./utils";

test("enum", async () => {
  await runFormatTest(__filename);
});
