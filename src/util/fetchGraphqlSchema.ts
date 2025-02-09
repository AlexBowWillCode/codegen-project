import { introspectionQuery, endpoint } from "../const/constants.ts";
import fetch from "node-fetch";

export default async function fetchGraphQLSchema() {
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
