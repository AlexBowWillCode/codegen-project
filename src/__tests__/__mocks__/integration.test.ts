import parseQuery from "../../graphqlParsing/parseGraphQL";
import tokenize from "../../graphqlParsing/tokenize";
import fetchGraphQLSchema from "../../util/fetchGraphqlSchema";
import parseSchema from "../../util/parserFunctions";
import { validateQueryAgainstSchema } from "../../validation/validateQueryAgainstSchema";

// Mock fetch for schema fetching
jest.mock("node-fetch", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { __schema: { types: [] } } }),
    });
  });
});

// Mock file system operations
jest.mock("fs", () => ({
  readFileSync: jest.fn(
    () => `
    query GetCountry($code: ID!) {
      country(code: $code) {
        name
        capital
      }
    }
  `
  ),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));

describe("GraphQL Validation Pipeline", () => {
  test("should process a valid GraphQL query through the entire pipeline", async () => {
    // This test simulates the main workflow

    // 1. Fetch schema
    const schema = await fetchGraphQLSchema();

    // 2. Parse schema
    const parsedSchema = parseSchema(schema);

    // 3. Read and tokenize a query
    const queryContent = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          name
          capital
        }
      }
    `;
    const tokens = tokenize(queryContent);

    // 4. Parse tokens into a structured query
    const parsedQuery = parseQuery(tokens);

    // 5. Validate query against schema
    const validationErrors = validateQueryAgainstSchema(
      parsedSchema,
      parsedQuery
    );

    // Assertions
    expect(validationErrors.length).toBe(0);
  });
});
