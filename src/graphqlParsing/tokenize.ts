export type TokenType =
  | "operation"
  | "name"
  | "variable"
  | "field"
  | "brace"
  | "paren"
  | "colon"
  | "equals"
  | "comma";

export interface Token {
  type: TokenType;
  value: string;
}

export default function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  const regex =
    /(query|mutation)|([a-zA-Z_][a-zA-Z0-9_]*)|(\$[a-zA-Z_][a-zA-Z0-9_]*)|([\{\}\(\)])|(:)|(=)|(,)/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    if (match[1]) {
      tokens.push({ type: "operation", value: match[1] });
    } else if (match[2]) {
      tokens.push({ type: "name", value: match[2] });
    } else if (match[3]) {
      tokens.push({ type: "variable", value: match[3] });
    } else if (match[4]) {
      tokens.push({ type: "brace", value: match[4] });
    } else if (match[5]) {
      tokens.push({ type: "colon", value: match[5] });
    } else if (match[6]) {
      tokens.push({ type: "equals", value: match[6] });
    } else if (match[7]) {
      tokens.push({ type: "comma", value: match[7] });
    }
  }

  return tokens;
}
