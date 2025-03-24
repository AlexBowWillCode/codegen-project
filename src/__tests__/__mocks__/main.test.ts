// src/__tests__/main.test.ts

import { main } from "../../main";

// Mock all the imported modules
jest.mock("../util/fetchGraphqlSchema", () => {
  return jest.fn().mockResolvedValue({ types: [] });
});

jest.mock("../util/parserFunctions", () => {
  return {
    default: jest.fn().mockReturnValue({ types: [] }),
  };
});

jest.mock("../graphqlParsing/tokenize", () => {
  return {
    default: jest.fn().mockReturnValue([]),
  };
});

jest.mock("../graphqlParsing/parseGraphQL", () => {
  return {
    default: jest.fn().mockReturnValue({
      operation: "query",
      name: "GetCountry",
      variables: [{ name: "code", type: "ID!" }],
      fields: [],
    }),
  };
});

jest.mock("../validation/validateQueryAgainstSchema", () => {
  return {
    validateQueryAgainstSchema: jest.fn().mockReturnValue([]),
  };
});

jest.mock("../codeGen/typescriptGenerator", () => {
  return {
    generateTypeScript: jest.fn(),
  };
});

// Mock file system
jest.mock("fs", () => ({
  readFileSync: jest.fn(() => "query { field }"),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ["getCountry.graphql"]),
}));

// Mock path module
jest.mock("path", () => ({
  join: (...args) => args.join("/"),
}));

describe("main function", () => {
  test("should execute the full workflow without errors", async () => {
    // Redirect console.log output
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await main();

    // Check that console logs show progress
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Starting GraphQL schema validation..."
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("Fetching GraphQL schema...");
    expect(consoleLogSpy).toHaveBeenCalledWith("Parsing schema...");

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});
