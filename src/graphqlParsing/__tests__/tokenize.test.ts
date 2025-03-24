import tokenize from "../tokenize";
import { Token } from "../../types/types";

describe("tokenize", () => {
  test("should tokenize a simple query string", () => {
    const query = `query GetItem { item { name } }`;
    const tokens = tokenize(query);

    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0]).toEqual({ type: "operation", value: "query" });
    expect(tokens[1]).toEqual({ type: "name", value: "GetItem" });
  });

  test("should handle variables in queries", () => {
    const query = `query GetItem($id: ID!) { item(id: $id) { name } }`;
    const tokens = tokenize(query);

    // Find the variable token
    const variableToken = tokens.find(
      (t) => t.type === "variable" && t.value === "$id"
    );
    expect(variableToken).toBeDefined();
  });

  test("should handle complex queries with nested structures", () => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          name
          capital
          languages {
            code
            name
          }
        }
      }
    `;

    const tokens = tokenize(query);

    // Should have operation token
    expect(tokens[0]).toEqual({ type: "operation", value: "query" });

    // Should include language subfield tokens
    const languagesToken = tokens.find(
      (t) => t.type === "name" && t.value === "languages"
    );
    expect(languagesToken).toBeDefined();
  });

  test("should handle whitespace and formatting correctly", () => {
    const formattedQuery = `
      query GetItem {
        item {
          name
        }
      }
    `;

    const compactQuery = `query GetItem { item { name } }`;

    const formattedTokens = tokenize(formattedQuery);
    const compactTokens = tokenize(compactQuery);

    // Both should produce the same tokens
    expect(formattedTokens).toEqual(compactTokens);
  });
});
