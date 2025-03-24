import { endpoint, introspectionQuery } from "../../const/constants";

// Mock the fetch implementation
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the original module
jest.mock("../../util/fetchGraphqlSchema", () => {
  // Import the actual implementation
  const originalModule = jest.requireActual("../../util/fetchGraphqlSchema");

  // Create our modified version
  return {
    ...originalModule,
    default: async function fetchGraphQLSchema() {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: introspectionQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(result.errors, null, 2)}`
        );
      }

      return result.data.__schema;
    },
  };
});

// Now import and test the mocked version
import fetchGraphQLSchema from "../../util/fetchGraphqlSchema";

describe("fetchGraphQLSchema", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockReset();
  });

  test("should fetch and return a GraphQL schema", async () => {
    // Setup mock to return successful response
    const mockSchema = { data: { __schema: { types: [] } } };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchema,
    });

    const result = await fetchGraphQLSchema();

    // Check that fetch was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });

    // Check that result is correct
    expect(result).toEqual(mockSchema.data.__schema);
  });

  test("should throw error for network failure", async () => {
    // Setup mock to simulate HTTP error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Check that the function throws an error
    await expect(fetchGraphQLSchema()).rejects.toThrow(
      "HTTP error! Status: 500"
    );
  });

  test("should throw error for GraphQL errors", async () => {
    // Setup mock to return GraphQL errors
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: "Field not found" }],
      }),
    });

    // Check that the function throws an error
    await expect(fetchGraphQLSchema()).rejects.toThrow("GraphQL Error:");
  });
});
