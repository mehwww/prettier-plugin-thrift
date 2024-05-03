import { test } from "vitest";
import { runFormatTest } from "./utils";

test("typedef", async () => {
  await runFormatTest(__filename);
});
