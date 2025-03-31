// src/validation/__tests__/validateQueryAgainstSchema.test.ts
import { validateQueryAgainstSchema } from "../validateQueryAgainstSchema";
import { mockSchema } from "../../__tests__/__mocks__/mockSchema";
import { GraphQLQuery } from "../../types/types";

// Define a valid test query that matches the schema
const validTestQuery: GraphQLQuery = {
  operation: "query",
  name: "GetCountry",
  variables: [{ name: "code", type: "ID!" }],
  fields: [
    {
      name: "country",
      arguments: [{ name: "code", value: "code" }],
      subFields: [
        { name: "name", arguments: [], subFields: [] },
        { name: "capital", arguments: [], subFields: [] },
      ],
    },
  ],
};

describe("validateQueryAgainstSchema test suite", () => {
  test("should validate a correct query without errors", () => {
    const errors = validateQueryAgainstSchema(mockSchema, validTestQuery);
    expect(errors.length).toBe(0);
  });

  test("should detect non-existent fields", () => {
    // Create a query with a non-existent field
    const invalidQuery: GraphQLQuery = {
      ...validTestQuery,
      fields: [
        {
          ...validTestQuery.fields[0],
          subFields: [
            ...(validTestQuery.fields[0].subFields || []),
            { name: "nonExistentField", arguments: [], subFields: [] },
          ],
        },
      ],
    };

    const errors = validateQueryAgainstSchema(mockSchema, invalidQuery);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("nonExistentField");
  });

  test("should handle missing arguments gracefully", () => {
    // Create a query missing an argument
    const queryMissingArg: GraphQLQuery = {
      ...validTestQuery,
      fields: [
        {
          name: "country",
          // Missing the 'code' argument
          arguments: [],
          subFields: validTestQuery.fields[0].subFields,
        },
      ],
    };

    // Just make sure validation runs without crashing
    const errors = validateQueryAgainstSchema(mockSchema, queryMissingArg);
    // We don't assert specific behavior here
  });
});
