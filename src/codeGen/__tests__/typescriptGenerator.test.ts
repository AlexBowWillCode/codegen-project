// src/codeGen/__tests__/typescriptGenerator.test.ts
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

// Mock path.join to normalize paths for cross-platform testing
jest.mock("path", () => ({
  join: (...args) => args.join("/"), // Use forward slashes for consistency
  dirname: (path) => path.substring(0, path.lastIndexOf("/")),
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

    // Use a more flexible assertion that works with different path formats
    expect(fs.mkdirSync).toHaveBeenCalledTimes(2);

    const calls = (fs.mkdirSync as jest.Mock).mock.calls;
    const hooksDirCreated = calls.some(
      (call) => call[0].includes("test-output") && call[0].includes("hooks")
    );
    expect(hooksDirCreated).toBe(true);

    // Check if files were written
    expect(fs.writeFileSync).toHaveBeenCalledTimes(4); // hooks, types, client, index

    // Check for specific file contents (more flexible approach)
    const writeFileCalls = (fs.writeFileSync as jest.Mock).mock.calls;

    // Find the types.ts file write call
    const typesFileCall = writeFileCalls.find((call) =>
      call[0].includes("types.ts")
    );
    expect(typesFileCall).toBeDefined();
    expect(typesFileCall[1]).toContain("export interface GetCountryVariables");
    expect(typesFileCall[1]).toContain("export interface GetCountryResponse");

    // Find the hook file write call
    const hookFileCall = writeFileCalls.find((call) =>
      call[0].includes("useGetCountry.ts")
    );
    expect(hookFileCall).toBeDefined();
    expect(hookFileCall[1]).toContain("export const useGetCountry");
  });
});
