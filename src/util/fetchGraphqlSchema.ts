import fetch from "node-fetch";

// Default introspection query that works with most GraphQL APIs
const DEFAULT_INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      types {
        kind
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
        interfaces {
          name
        }
        enumValues {
          name
        }
        possibleTypes {
          name
        }
      }
    }
  }
`;

export default async function fetchGraphQLSchema(
  endpoint: string,
  customIntrospectionQuery?: string
) {
  const introspectionQuery =
    customIntrospectionQuery || DEFAULT_INTROSPECTION_QUERY;

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

  const result = (await response.json()) as {
    data: { __schema: any };
    errors?: any;
  };

  if (result.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors, null, 2)}`);
  }

  return result.data.__schema;
}
