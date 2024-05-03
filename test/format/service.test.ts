import { test } from "vitest";
import { runFormatTest } from "./utils";

test("service", async () => {
  await runFormatTest(__filename);
});
