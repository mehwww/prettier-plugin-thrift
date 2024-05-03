import { AstPath, Doc, ParserOptions, Printer, doc } from "prettier";
import {
  Annotation,
  Annotations,
  Comment,
  CommentBlock,
  CommentLine,
  CommentPosition,
  ConstDefinition,
  ConstList,
  ConstMap,
  EnumDefinition,
  EnumMember,
  FieldDefinition,
  FunctionDefinition,
  IncludeDefinition,
  KeywordType,
  ListType,
  MapType,
  NamespaceDefinition,
  PropertyAssignment,
  ServiceDefinition,
  StringLiteral,
  StructDefinition,
  SyntaxType,
  ThriftDocument,
  TypedefDefinition,
} from "./ast";
import { REVERSED_KEYWORDS } from "./ast/keywords";

const space = " ";
const empty = "";
const quote = `"`;
const { join, hardline, indent, line, lineSuffix, dedentToRoot } = doc.builders;

type PrintContext<T> = {
  path: AstPath<T>;
  options: ParserOptions;
  print: (path: AstPath) => Doc;
};

function printDocument({
  path,
  options,
  print,
}: PrintContext<ThriftDocument>): Doc {
  return [join(hardline, path.map(print, "body")), hardline];
}

function printInclude({
  path,
  options,
  print,
}: PrintContext<IncludeDefinition>): Doc {
  const node = path.node;
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  return [
    preComments.length > 0 ? [join(hardline, preComments), hardline] : "",
    join(space, ["include", [quote, node.path.value, quote]]),
    postComments.length > 0 ? lineSuffix([space, postComments]) : "",
  ];
}

function printStruct({
  path,
  options,
  print,
}: PrintContext<StructDefinition>): Doc {
  const node = path.node;
  const [preComments, innerPostComments, postComments] =
    helpers.getCommentsDocs(path, print);
  const start: Doc = ["struct", space, node.name.value, space, "{"];
  const end: Doc = join(space, [
    "}",
    ...helpers.getAnnotationsDoc(path, print),
    postComments,
  ]);
  const hasInnerPostComments = innerPostComments.length > 0;
  const hasFields = node.fields.length > 0;
  const hasAnnotations = (node.annotations?.annotations.length ?? 0) > 0;

  return [
    path.previous ? hardline : "",
    preComments.length > 0 ? [join(hardline, preComments), hardline] : "",
    start,
    node.fields.length > 0
      ? indent([hardline, join(hardline, path.map(print, "fields"))])
      : "",
    innerPostComments.length > 0
      ? indent([hardline, join(hardline, innerPostComments)])
      : "",
    hasInnerPostComments || hasFields || hasAnnotations ? hardline : "",
    end,
  ];
}

function printTypedef({
  path,
  options,
  print,
}: PrintContext<TypedefDefinition>): Doc {
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  const annotations = helpers.getAnnotationsDoc(path, print);

  return join(hardline, [
    ...preComments,
    join(space, [
      "typedef",
      path.call(print, "definitionType"),
      path.call(print, "name"),
      ...annotations,
      lineSuffix(postComments),
    ]),
  ]);
}

function printField({
  path,
  options,
  print,
}: PrintContext<FieldDefinition>): Doc {
  const node = path.node;
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  const annotations = helpers.getAnnotationsDoc(path, print);

  return [
    preComments.length > 0 ? [join(hardline, preComments), hardline] : "",
    node.fieldID ? [node.fieldID.value.toString(), ": "] : "",
    node.requiredness ? `${node.requiredness} ` : "",
    path.call(print, "fieldType"),
    space,
    path.call(print, "name"),
    ...(node.defaultValue ? [" = ", path.call(print, "defaultValue")] : []),
    ...(annotations.length > 0 ? [space, ...annotations] : []),
    ...(postComments.length > 0 ? [space, lineSuffix(postComments)] : []),
  ];
}

function printEnum({
  path,
  options,
  print,
}: PrintContext<EnumDefinition>): Doc {
  const node = path.node;
  const [preComments, innerPostComments] = helpers.getCommentsDocs(path, print);
  const start: Doc = ["enum", space, node.name.value, space, "{"];
  const end: Doc = join(space, [
    "}",
    ...helpers.getAnnotationsDoc(path, print),
  ]);
  const hasInnerPostComments = innerPostComments.length > 0;
  const hasFields = node.members.length > 0;
  const hasAnnotations = (node.annotations?.annotations.length ?? 0) > 0;

  return [
    path.previous ? hardline : "",
    preComments.length > 0 ? [join(hardline, preComments), hardline] : "",
    start,
    node.members.length > 0
      ? indent([hardline, join(hardline, path.map(print, "members"))])
      : "",
    innerPostComments.length > 0
      ? indent([hardline, join(hardline, innerPostComments)])
      : "",
    hasInnerPostComments || hasFields || hasAnnotations ? hardline : "",
    end,
  ];
}

function printService({
  path,
  options,
  print,
}: PrintContext<ServiceDefinition>): Doc {
  const node = path.node;
  const [preComments, innerPostComments, postComments] =
    helpers.getCommentsDocs(path, print);
  const start: Doc = [
    "service",
    space,
    node.name.value,
    node.extends ? [space, "extends", space, node.extends.value] : "",
    space,
    "{",
  ];
  const end: Doc = join(space, [
    "}",
    ...helpers.getAnnotationsDoc(path, print),
    postComments,
  ]);

  const hasInnerPostComments = innerPostComments.length > 0;
  const hasFunctions = node.functions.length > 0;
  const hasAnnotations = (node.annotations?.annotations.length ?? 0) > 0;

  return [
    path.previous ? hardline : "",
    preComments.length > 0 ? [join(hardline, preComments), hardline] : "",
    start,
    node.functions.length > 0
      ? indent([hardline, join(hardline, path.map(print, "functions"))])
      : "",
    innerPostComments.length > 0
      ? indent([hardline, join(hardline, innerPostComments)])
      : "",
    hasInnerPostComments || hasFunctions || hasAnnotations ? hardline : "",
    end,
  ];
}

function printFunction({
  path,
  options,
  print,
}: PrintContext<FunctionDefinition>): Doc {
  const node = path.node;
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  const annotations = helpers.getAnnotationsDoc(path, print);
  return [
    ...(preComments.length > 0 ? [join(hardline, preComments), hardline] : []),
    node.oneway ? "oneway " : "",
    path.call(print, "returnType"),
    space,
    node.name.value,
    "(",
    join(", ", path.map(print, "fields")),
    ")",
    ...(node.throws.length > 0
      ? ["throws", "(", join(", ", path.map(print, "throws")), ")"]
      : []),
    ...(annotations.length > 0 ? [space, ...annotations] : []),
    postComments.length > 0 ? [lineSuffix([space, postComments])] : "",
  ];
}

function printNamespace({
  path,
  options,
  print,
}: PrintContext<NamespaceDefinition>): Doc {
  return [
    "namespace",
    space,
    path.call(print, "scope"),
    space,
    path.call(print, "name"),
  ];
}

function printEnumMember({
  path,
  options,
  print,
}: PrintContext<EnumMember>): Doc {
  const node = path.node;
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  const annotations = helpers.getAnnotationsDoc(path, print);

  return join(hardline, [
    ...preComments,
    [
      join(space, [
        path.call(print, "name"),
        ...(node.initializer ? ["=", node.initializer.value.value] : []),
        ...annotations,
      ]),
      postComments.length > 0 ? lineSuffix([space, postComments]) : "",
    ],
  ]);
}

function printCommentLine({
  path,
  options,
  print,
}: PrintContext<CommentLine>): Doc {
  const node = path.node;
  const prev = path.previous?.position === node.position ? path.previous : null;
  const prevLine = prev?.loc.end.line ?? Infinity;
  const startLine = node.loc.start.line;

  return [startLine - prevLine >= 2 ? hardline : "", node.value];
}

function printCommentBlock({
  path,
  options,
  print,
}: PrintContext<CommentBlock>): Doc {
  const node = path.node;
  const prev = path.previous?.position === node.position ? path.previous : null;
  const prevLine = prev?.loc.end.line ?? Infinity;
  const startLine = node.loc.start.line;
  const extraLineBreak = startLine - prevLine >= 2 ? hardline : "";

  if (node.value.length === 1) {
    return [extraLineBreak, node.value[0]];
  }
  return [
    extraLineBreak,
    node.value[0],
    dedentToRoot([hardline, join(hardline, node.value.slice(1))]),
  ];
}

function printAnnotations({
  path,
  options,
  print,
}: PrintContext<Annotations>): Doc {
  return join(", ", path.map(print, "annotations"));
}

function printAnnotation({
  path,
  options,
  print,
}: PrintContext<Annotation>): Doc {
  const node = path.node;
  return join(" = ", [
    node.name.value,
    join(empty, [quote, node.value?.value ?? "", quote]),
  ]);
}

function printList({ path, options, print }: PrintContext<ListType>): Doc {
  const node = path.node;
  return join(empty, [
    node.type === SyntaxType.ListType ? "list" : "set",
    "<",
    path.call(print, "valueType"),
    ">",
  ]);
}

function printMap({ path, options, print }: PrintContext<MapType>): Doc {
  return join(empty, [
    "map",
    "<",
    path.call(print, "keyType"),
    ",",
    space,
    path.call(print, "valueType"),
    ">",
  ]);
}
function printBaseType({
  path,
  options,
  print,
}: PrintContext<{ type: KeywordType }>): Doc {
  return REVERSED_KEYWORDS[path.node.type];
}

function printConstDefinition({
  path,
  options,
  print,
}: PrintContext<ConstDefinition>) {
  const node = path.node;
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  return join(hardline, [
    ...preComments,
    join(space, [
      "const",
      path.call(print, "fieldType"),
      path.call(print, "name"),
      "=",
      path.call(print, "initializer"),
      lineSuffix(postComments),
    ]),
  ]);
}

function printConstList({
  path,
  options,
  print,
}: PrintContext<ConstList>): Doc {
  // ConstList does not support annotation
  // TODO: currently ConstList does not support comment
  return [
    "[",
    indent([
      hardline,
      join(
        hardline,
        path.map(print, "elements").map((x) => [x, ","])
      ),
    ]),
    hardline,
    "]",
  ];
}

function printConstMap({ path, options, print }: PrintContext<ConstMap>): Doc {
  // ConstMap does not support annotation
  return [
    "{",
    indent([
      hardline,
      join(
        hardline,
        path.map(print, "properties").map((x) => [x, ","])
      ),
    ]),
    hardline,
    "}",
  ];
}

function printPropertyAssignment({
  path,
  options,
  print,
}: PrintContext<PropertyAssignment>): Doc {
  const [preComments, , postComments] = helpers.getCommentsDocs(path, print);
  return join(hardline, [
    ...preComments,
    [
      path.call(print, "name"),
      ": ",
      path.call(print, "initializer"),
      ...(postComments.length > 0 ? [lineSuffix([space, postComments])] : []),
    ],
  ]);
}

function print(
  path: AstPath,
  options: ParserOptions,
  print: (path: AstPath) => Doc
) {
  const node = path.node;
  switch (node.type) {
    case SyntaxType.ThriftDocument:
      return printDocument({ path, options, print });
    case SyntaxType.IncludeDefinition:
      return printInclude({ path, options, print });
    case SyntaxType.UnionDefinition:
    case SyntaxType.ExceptionDefinition:
    case SyntaxType.StructDefinition:
      return printStruct({ path, options, print });
    case SyntaxType.TypedefDefinition:
      return printTypedef({ path, options, print });
    case SyntaxType.FieldDefinition:
      return printField({ path, options, print });
    case SyntaxType.EnumDefinition:
      return printEnum({ path, options, print });
    case SyntaxType.ServiceDefinition:
      return printService({ path, options, print });
    case SyntaxType.FunctionDefinition:
      return printFunction({ path, options, print });
    case SyntaxType.NamespaceDefinition:
      return printNamespace({ path, options, print });
    case SyntaxType.ConstDefinition:
      return printConstDefinition({ path, options, print });
    case SyntaxType.EnumMember:
      return printEnumMember({ path, options, print });
    case SyntaxType.CommentLine:
      return printCommentLine({ path, options, print });
    case SyntaxType.CommentBlock:
      return printCommentBlock({ path, options, print });
    case SyntaxType.Annotations:
      return printAnnotations({ path, options, print });
    case SyntaxType.Annotation:
      return printAnnotation({ path, options, print });
    case SyntaxType.SetType:
    case SyntaxType.ListType:
      return printList({ path, options, print });
    case SyntaxType.MapType:
      return printMap({ path, options, print });
    case SyntaxType.StringKeyword:
    case SyntaxType.DoubleKeyword:
    case SyntaxType.BoolKeyword:
    case SyntaxType.I8Keyword:
    case SyntaxType.I16Keyword:
    case SyntaxType.I32Keyword:
    case SyntaxType.I64Keyword:
    case SyntaxType.BinaryKeyword:
    case SyntaxType.ByteKeyword:
    case SyntaxType.VoidKeyword:
      return printBaseType({ path, options, print });
    case SyntaxType.ConstList:
      return printConstList({ path, options, print });
    case SyntaxType.ConstMap:
      return printConstMap({ path, options, print });
    case SyntaxType.PropertyAssignment:
      return printPropertyAssignment({ path, options, print });
    case SyntaxType.StringLiteral:
      return [quote, (path.node as StringLiteral).value, quote];
    case SyntaxType.Identifier:
      return path.node.value;
    case SyntaxType.BooleanLiteral:
      return path.node.value ? "true" : "false";
    case SyntaxType.DoubleConstant:
    case SyntaxType.IntConstant:
      return path.node.value.value;
    default:
      throw new Error("unsupported node type: " + node.type);
  }
}

namespace helpers {
  export function getCommentsDocs(
    path: AstPath,
    print: (path: AstPath) => Doc
  ): [pre: Doc[], innerPost: Doc[], post: Doc[]] {
    const pre: Doc[] = [];
    const innerPost: Doc[] = [];
    const post: Doc[] = [];
    path.each((p) => {
      const node = p.node as Comment;
      switch (node.position) {
        case CommentPosition.Pre:
          pre.push(print(p));
          break;
        case CommentPosition.InnerPost:
          innerPost.push(print(p));
          break;
        case CommentPosition.Post:
          post.push(print(p));
          break;
        default:
          break;
      }
    }, "comments");
    return [pre, innerPost, post];
  }

  export function getAnnotationsDoc(
    path: AstPath,
    print: (path: AstPath) => Doc
  ): Doc[] {
    const node = path.node;
    const annotations =
      (node.annotations?.annotations.length ?? 0) > 0
        ? ["(", path.call(print, "annotations"), ")"]
        : [];
    return annotations.length > 0 ? [join(empty, annotations)] : [];
  }
}

export default { print } as Printer;
