import { Token, TokenType } from "../types/types.ts";

export default function tokenize(query: string): Token[] {
  const tokens: Token[] = [];

  const normalizedQuery = query
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const regex =
    /(query|mutation)|([a-zA-Z_][a-zA-Z0-9_]*)|(\$[a-zA-Z_][a-zA-Z0-9_]*)|([\{\}\(\)])|(:)|(=)|(,)|("(?:[^"\\]|\\.)*")/g;

  let match;
  while ((match = regex.exec(normalizedQuery)) !== null) {
    if (match[1]) {
      // Operation type (query or mutation)
      tokens.push({ type: "operation", value: match[1] });
    } else if (match[2]) {
      // Field or type name
      tokens.push({ type: "name", value: match[2] });
    } else if (match[3]) {
      // Variable
      tokens.push({ type: "variable", value: match[3] });
    } else if (match[4]) {
      // Brace or parenthesis
      tokens.push({ type: "brace", value: match[4] });
    } else if (match[5]) {
      // Colon
      tokens.push({ type: "colon", value: match[5] });
    } else if (match[6]) {
      // Equals sign
      tokens.push({ type: "equals", value: match[6] });
    } else if (match[7]) {
      // Comma
      tokens.push({ type: "comma", value: match[7] });
    } else if (match[8]) {
      // String literal
      tokens.push({ type: "name", value: match[8] });
    }
  }

  return tokens;
}
