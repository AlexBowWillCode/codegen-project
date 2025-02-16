export type TokenType =
  | "operation"
  | "name"
  | "variable"
  | "field"
  | "brace"
  | "colon"
  | "equals"
  | "comma";

export interface Token {
  type: TokenType;
  value: string;
}

//Break the query into tokens (e.g., keywords, names, brackets, etc.) to make parsing easier.

// How It Works
//
// Regex Pattern Explanation:
// The regex variable defines a pattern to match different parts of the query:
//
// - (query|mutation): Matches either 'query' or 'mutation' operation.
// - ([a-zA-Z_][a-zA-Z0-9_]*): Matches names (e.g., GetUser, user, id).
// - (\$[a-zA-Z_][a-zA-Z0-9_]*): Matches variables (e.g., $id).
// - ([\{\}\(\)]): Matches braces '{', '}' or parentheses '(', ')'.
// - (:): Matches the colon ':'.
// - (=): Matches the equals sign '='.
// - (,): Matches the comma ','.
//
// Loop Through Matches:
// - The `while` loop uses `regex.exec(query)` to find all matches in the query.
// - For each match, it checks which group in the regex matched and creates a token accordingly.
//
// Create Tokens:
// - If match[1] is found, create an 'operation' token (e.g., query).
// - If match[2] is found, create a 'name' token (e.g., GetUser).
// - If match[3] is found, create a 'variable' token (e.g., $id).
// - If match[4] is found, create a 'brace or paren' token (e.g., {, () ).
// - If match[5] is found, create a 'colon' token (:).
// - If match[6] is found, create an 'equals' token (=).
// - If match[7] is found, create a 'comma' token (,).
//
// Return Tokens:
// - The function returns an array of tokens created based on the matches.

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
