
import { useQuery, UseQueryOptions } from 'react-query';
import { GetCountryResponse, GetCountryVariables } from '../types';
import { graphqlRequest } from '../graphqlClient';

/**
 * Generated hook for the GetCountry query
 * Source: getCountry.graphql
 */
export const useGetCountry = (
  variables: GetCountryVariables,
  options?: Omit<UseQueryOptions<GetCountryResponse, Error, GetCountryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetCountryResponse, Error>(
    ['GetCountry', variables],
    () => graphqlRequest<GetCountryResponse, GetCountryVariables>(QUERY, variables),
    options
  );
};

// GraphQL query document
const QUERY = `query GetCountry($code: ID) {
  country(code: $code) {
    name
    native
    capital
    emoji
    currency
    languages {
      code
      name
    }
  }
}`;
