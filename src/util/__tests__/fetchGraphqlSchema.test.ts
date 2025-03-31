// Modified fetchGraphqlSchema.test.ts
import fetchGraphQLSchema from "../fetchGraphqlSchema";
import { endpoint, introspectionQuery } from "../../const/constants";

// Mock node-fetch properly without directly importing it
jest.mock("node-fetch", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { __schema: { types: [] } } }),
    });
  });
});

describe("fetchGraphQLSchema", () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  test("should fetch and return a GraphQL schema", async () => {
    // Setup mock to return successful response
    const mockSchema = { data: { __schema: { types: [] } } };

    const mockFetch = require("node-fetch");
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
    const mockFetch = require("node-fetch");
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
    const mockResponse = {
      ok: true,
      json: async () => ({
        errors: [{ message: "Field not found" }],
      }),
    };

    const mockFetch = require("node-fetch");
    mockFetch.mockResolvedValueOnce(mockResponse);

    // Check that the function throws an error
    await expect(fetchGraphQLSchema()).rejects.toThrow("GraphQL Error:");
  });
});
