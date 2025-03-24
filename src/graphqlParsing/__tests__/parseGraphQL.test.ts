import parseQuery from "../parseGraphQL";
import { mockTokens } from "../../__tests__/__mocks__/mockTokens";

describe("parseQuery", () => {
  test("should parse tokens into a structured GraphQL query", () => {
    const result = parseQuery(mockTokens);

    expect(result.operation).toBe("query");
    expect(result.name).toBe("GetCountry");
    expect(result.variables.length).toBe(1);
    expect(result.variables[0].name).toBe("code");
    expect(result.variables[0].type).toBe("ID!");

    expect(result.fields.length).toBe(1);
    expect(result.fields[0].name).toBe("country");
    expect(result.fields[0].arguments?.length).toBe(1);
    expect(result.fields[0].arguments?.[0].name).toBe("code");
    expect(result.fields[0].arguments?.[0].value).toBe("code");

    expect(result.fields[0].subFields?.length).toBe(2);
    expect(result.fields[0].subFields?.[0].name).toBe("name");
    expect(result.fields[0].subFields?.[1].name).toBe("capital");
  });

  test("should throw error for invalid tokens", () => {
    // Create invalid tokens (missing closing brace)
    const invalidTokens = [...mockTokens];
    invalidTokens.pop(); // Remove the last closing brace

    expect(() => {
      parseQuery(invalidTokens);
    }).toThrow();
  });
});
