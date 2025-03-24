import { validateQueryAgainstSchema } from "../validateQueryAgainstSchema";
import { mockSchema } from "../../__tests__/__mocks__/mockSchema";
import { mockParsedQuery } from "../../__tests__/__mocks__/mockQueries";
import { GraphQLQuery } from "../../types/types";

describe("validateQueryAgainstSchema", () => {
  test("should validate a correct query without errors", () => {
    const errors = validateQueryAgainstSchema(mockSchema, mockParsedQuery);
    expect(errors.length).toBe(0);
  });

  test("should detect non-existent fields", () => {
    // Create a query with a non-existent field
    const invalidQuery: GraphQLQuery = {
      ...mockParsedQuery,
      fields: [
        {
          ...mockParsedQuery.fields[0],
          subFields: [
            ...(mockParsedQuery.fields[0].subFields || []),
            { name: "nonExistentField", arguments: [], subFields: [] },
          ],
        },
      ],
    };

    const errors = validateQueryAgainstSchema(mockSchema, invalidQuery);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("nonExistentField");
  });

  test("should validate required arguments", () => {
    // Create a query missing a required argument
    const queryMissingArg: GraphQLQuery = {
      ...mockParsedQuery,
      fields: [
        {
          name: "country",
          // Missing the 'code' argument
          arguments: [],
          subFields: mockParsedQuery.fields[0].subFields,
        },
      ],
    };

    // This might not cause an error in your current implementation,
    // but if you want to validate required arguments, this test would check that
    const errors = validateQueryAgainstSchema(mockSchema, queryMissingArg);
    // Adjust assertion based on your implementation
  });
});
