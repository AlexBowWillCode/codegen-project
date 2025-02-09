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

export const endpoint = 'https://countries.trevorblades.com/graphql';