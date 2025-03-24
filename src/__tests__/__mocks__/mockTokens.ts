// src/__tests__/__mocks__/mockTokens.ts
import { Token } from "../../types/types";

// Mock tokens for a simple GetCountry query
export const mockTokens: Token[] = [
  { type: "operation", value: "query" },
  { type: "name", value: "GetCountry" },
  { type: "brace", value: "(" },
  { type: "variable", value: "$code" },
  { type: "colon", value: ":" },
  { type: "name", value: "ID!" },
  { type: "brace", value: ")" },
  { type: "brace", value: "{" },
  { type: "name", value: "country" },
  { type: "brace", value: "(" },
  { type: "name", value: "code" },
  { type: "colon", value: ":" },
  { type: "variable", value: "$code" },
  { type: "brace", value: ")" },
  { type: "brace", value: "{" },
  { type: "name", value: "name" },
  { type: "name", value: "capital" },
  { type: "brace", value: "}" },
  { type: "brace", value: "}" },
];

// Mock tokens for an invalid query (missing closing brace)
export const mockInvalidTokens: Token[] = [
  { type: "operation", value: "query" },
  { type: "name", value: "GetCountry" },
  { type: "brace", value: "{" },
  { type: "name", value: "country" },
  { type: "brace", value: "{" },
  { type: "name", value: "name" },
  // Missing closing braces
];

// More complex query with nested fields and multiple arguments
export const mockComplexTokens: Token[] = [
  { type: "operation", value: "query" },
  { type: "name", value: "GetCountryWithLanguages" },
  { type: "brace", value: "(" },
  { type: "variable", value: "$code" },
  { type: "colon", value: ":" },
  { type: "name", value: "ID!" },
  { type: "comma", value: "," },
  { type: "variable", value: "$includeLanguages" },
  { type: "colon", value: ":" },
  { type: "name", value: "Boolean" },
  { type: "brace", value: ")" },
  { type: "brace", value: "{" },
  { type: "name", value: "country" },
  { type: "brace", value: "(" },
  { type: "name", value: "code" },
  { type: "colon", value: ":" },
  { type: "variable", value: "$code" },
  { type: "brace", value: ")" },
  { type: "brace", value: "{" },
  { type: "name", value: "name" },
  { type: "name", value: "capital" },
  { type: "name", value: "languages" },
  { type: "brace", value: "{" },
  { type: "name", value: "code" },
  { type: "name", value: "name" },
  { type: "brace", value: "}" },
  { type: "brace", value: "}" },
  { type: "brace", value: "}" },
];
