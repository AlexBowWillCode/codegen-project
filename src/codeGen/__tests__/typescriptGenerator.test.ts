import { generateTypeScript } from "../typescriptGenerator";
import { mockSchema } from "../../__tests__/__mocks__/mockSchema";
import { mockParsedQuery } from "../../__tests__/__mocks__/mockQueries";
import * as fs from "fs";
import * as path from "path";

// Mock the fs module
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(),
}));

describe("typescriptGenerator", () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  test("should generate TypeScript files for valid queries", () => {
    // Create a map of queries similar to what the main app would create
    const queries = new Map();
    queries.set("getCountry.graphql", mockParsedQuery);

    // Call the generator
    generateTypeScript(mockSchema, queries, "./test-output");

    // Check if directories were created
    expect(fs.mkdirSync).toHaveBeenCalledWith("./test-output", {
      recursive: true,
    });
    expect(fs.mkdirSync).toHaveBeenCalledWith("./test-output/hooks", {
      recursive: true,
    });

    // Check if files were written
    expect(fs.writeFileSync).toHaveBeenCalledTimes(4); // hooks, types, client, index

    // Check for specific file contents
    const writeFileCalls = (fs.writeFileSync as jest.Mock).mock.calls;

    // Find the types.ts file write call
    const typesFileCall = writeFileCalls.find((call) =>
      call[0].endsWith("types.ts")
    );
    expect(typesFileCall).toBeDefined();
    expect(typesFileCall[1]).toContain("export interface GetCountryVariables");
    expect(typesFileCall[1]).toContain("export interface GetCountryResponse");

    // Find the hook file write call
    const hookFileCall = writeFileCalls.find((call) =>
      call[0].endsWith("useGetCountry.ts")
    );
    expect(hookFileCall).toBeDefined();
    expect(hookFileCall[1]).toContain("export const useGetCountry");
  });
});
