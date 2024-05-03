import { Plugin } from "prettier";
import parser from "./parser";
import printer from "./printer";

export = {
  languages: [
    {
      name: "Thrift",
      parsers: ["thrift-parser"],
      extensions: [".thrift"],
      tmScope: "source.thrift",
    },
  ],
  parsers: {
    "thrift-parser": parser,
  },
  printers: {
    "thrift-parser": printer,
  },
} as Plugin;
