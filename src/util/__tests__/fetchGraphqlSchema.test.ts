import fetchGraphQLSchema from "../fetchGraphqlSchema";
import { endpoint, introspectionQuery } from "../../const/constants";

// Mock the fetch function
global.fetch = jest.fn();

describe("fetchGraphQLSchema", () => {
  beforeEach(() => {
    // Reset mock before each test
    (global.fetch as jest.Mock).mockReset();
  });

  test("should fetch and return a GraphQL schema", async () => {
    // Setup mock to return successful response
    const mockSchema = { data: { __schema: { types: [] } } };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchema,
    });

    const result = await fetchGraphQLSchema();

    // Check that fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(endpoint, {
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
    (global.fetch as jest.Mock).mockResolvedValueOnce({
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
    const mockResponse = {
      ok: true,
      json: async () => ({
        errors: [{ message: "Field not found" }],
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Check that the function throws an error
    await expect(fetchGraphQLSchema()).rejects.toThrow("GraphQL Error:");
  });
});
