
/**
 * Generated TypeScript types for GraphQL operations
 */

// Base client type for making requests
export interface GraphQLClient {
  request<T, V>(query: string, variables?: V): Promise<T>;
}

// Variables for GetCountry query
export interface GetCountryVariables {
  code: string;
}

// Response type for GetCountry query
export interface GetCountryResponse {
  country: {
  name: string;
  native: string;
  capital: string;
  emoji: string;
  currency: string;
  languages: any;
};
}

