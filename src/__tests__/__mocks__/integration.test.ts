// src/__tests__/__mocks__/integration.test.ts
import parseQuery from "../../graphqlParsing/parseGraphQL";
import tokenize from "../../graphqlParsing/tokenize";
import { validateQueryAgainstSchema } from "../../validation/validateQueryAgainstSchema";

jest.mock("node-fetch", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            __schema: {
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
                        ofType: null,
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
                        kind: "SCALAR",
                        name: "String",
                        ofType: null,
                      },
                    },
                    {
                      name: "capital",
                      type: {
                        kind: "SCALAR",
                        name: "String",
                        ofType: null,
                      },
                    },
                  ],
                },
              ],
            },
          },
        }),
    });
  });
});

import fetchGraphQLSchema from "../../util/fetchGraphqlSchema";
import parseSchema from "../../util/parserFunctions";

describe("GraphQL Validation Pipeline", () => {
  test("should process a valid GraphQL query through the entire pipeline", async () => {
    const schema = await fetchGraphQLSchema();
    const parsedSchema = parseSchema(schema);
    const queryContent = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          name
          capital
        }
      }
    `;
    const tokens = tokenize(queryContent);
    const parsedQuery = parseQuery(tokens);
    const validationErrors = validateQueryAgainstSchema(
      parsedSchema,
      parsedQuery
    );
    expect(validationErrors.length).toBe(1);
  });
});
