import { GraphQLSchema } from "../../types/types.js";

export const mockSchema: GraphQLSchema = {
  types: [
    {
      kind: "OBJECT",
      name: "Query",
      fields: [
        {
          name: "country",
          type: {
            kind: "OBJECT",
            name: "Country",
            ofType: undefined,
          },
        },
      ],
    },
    {
      kind: "OBJECT",
      name: "Country",
      fields: [
        {
          name: "name",
          type: {
            kind: "NON_NULL",
            name: null,
            ofType: {
              kind: "SCALAR",
              name: "String",
            },
          },
        },
        {
          name: "capital",
          type: {
            kind: "SCALAR",
            name: "String",
            ofType: undefined,
          },
        },
      ],
    },
    {
      kind: "SCALAR",
      name: "String",
      fields: [],
    },
    {
      kind: "SCALAR",
      name: "ID",
      fields: [],
    },
  ],
};

// Also add the mock parsed query here to ensure they're aligned
export const mockParsedQuery = {
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

// Mock tokens for a simple GetCountry query
export const mockTokens = [
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
