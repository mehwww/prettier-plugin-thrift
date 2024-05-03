import fs from "fs/promises";
import { resolve as r } from "path";
import prettier from "prettier";
import { expect } from "vitest";

export async function format(code: string) {
  const formatted = await prettier.format(code, {
    parser: "thrift-parser",
    plugins: ["./dist/index.js"],
  });
  return formatted;
}

export async function runFormatTest(filename) {
  const [, type] = filename.match(/([^/.]*)\.test\.ts$/) ?? [];
  if (!type) {
    throw new Error(`Invalid filename: ${filename}`);
  }

  const thrift = await fs.readFile(r(__dirname, `${type}.thrift`), "utf-8");
  expect(await format(thrift)).toMatchFileSnapshot(
    r(__dirname, "__snapshots__", `${type}.thrift`)
  );
}
