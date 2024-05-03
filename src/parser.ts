import {
  ErrorType,
  SyntaxNode,
  ThriftDocument,
  ThriftError,
  createDebugger,
  createParser,
  createScanner,
} from "./ast";

function parse(text: string, options: object) {
  const debug = createDebugger(text);
  const scanner = createScanner(text, handleError);
  const tokens = scanner.scan();
  const parser = createParser(tokens, handleError);
  const thrift: ThriftDocument = parser.parse();

  if (debug.hasError()) {
    debug.print();
    throw new Error("Parse thrift failed.");
  } else {
    return thrift;
  }

  function handleError(err: ThriftError): void {
    debug.report(err);
    switch (err.type) {
      case ErrorType.ParseError:
        parser.synchronize();
        break;
      case ErrorType.ScanError:
        scanner.synchronize();
        break;
    }
  }
}
export default {
  parse,
  astFormat: "thrift-parser",
  locStart(node: SyntaxNode) {
    return node.loc.start.index;
  },
  locEnd(node: SyntaxNode) {
    return node.loc.end.index;
  },
};
