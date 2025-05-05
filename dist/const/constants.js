export const introspectionQuery = `
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
            }
          }
        }
      }
    }
  }
`;
// Set a placeholder default endpoint that will be overridden by user config
export const endpoint = "YOUR_GRAPHQL_ENDPOINT";
