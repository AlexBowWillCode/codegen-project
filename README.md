# 🚀 GraphQL Schema Validator and TypeScript Hook Generator

A **TypeScript application** that validates `.graphql` files against a **GraphQL API schema** and generates type-safe React hooks. It fetches the schema from a GraphQL endpoint, parses it, validates your queries, and generates ready-to-use TypeScript code.

---

## ✨ Features

✅ Fetch a GraphQL schema using an introspection query.\
✅ Parse the schema into a usable TypeScript structure.\
✅ Parse `.graphql` files into an **Abstract Syntax Tree (AST)**.\
✅ Validate `.graphql` files against the schema.\
✅ Generate TypeScript type definitions based on GraphQL types.\
✅ Create React Query hooks for all valid GraphQL operations.\
✅ Bundle hooks and types into a clean, importable package.

---

## 📊 Project Progress

| Stage                              | Description                                                                | Status         |
| ---------------------------------- | -------------------------------------------------------------------------- | -------------- |
| **1. Fetch GraphQL Schema**        | Fetch the schema from the GraphQL API using an introspection query.        | ✅ Completed   |
| **2. Parse Schema**                | Convert the raw introspection result into a TypeScript-friendly structure. | ✅ Completed   |
| **3. Parse GraphQL Files**         | Convert `.graphql` files into an **Abstract Syntax Tree (AST)**.           | ✅ Completed   |
| **4. Validate GraphQL Files**      | Compare parsed `.graphql` files with the schema for validation.            | ✅ Completed   |
| **5. Generate TypeScript Types**   | Create TypeScript interfaces based on GraphQL types.                       | ✅ Completed   |
| **6. Create React Query Hooks**    | Generate custom hooks for each validated GraphQL operation.                | ✅ Completed   |
| **7. Error Handling & Edge Cases** | Handle errors (e.g., invalid fields, missing arguments).                   | ✅ Completed   |
| **8. Unit Tests**                  | Write tests to ensure validation logic works correctly.                    | ❌ Not Started |
| **9. Optimization & Refactoring**  | Improve performance and code modularity.                                   | 🚧 In Progress |

---

## 📝 Understanding the Process

1. **Schema Fetching**: The application starts by fetching the GraphQL schema using an introspection query.

2. **Query Parsing**: Your `.graphql` files are parsed into an Abstract Syntax Tree (AST) structure that represents:

   - Operation types (`query`, `mutation`, etc.)
   - Field names, arguments, and variables
   - Nested field structure

3. **Validation**: Parsed queries are validated against the schema to ensure they're correct.

4. **Code Generation**: For valid queries, the application generates:
   - TypeScript interfaces for request variables and response data
   - React Query hooks that provide loading, error, and data states
   - A simple GraphQL client implementation that you can customize

---

## 🚀 How to Use

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/graphql-schema-validator.git
   cd graphql-schema-validator
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Add your GraphQL queries to the `src/queries` folder with `.graphql` extension.

4. Run the code generator:

   ```sh
   npm run generate-hooks
   ```

5. Use the generated hooks in your React application:

   ```typescript
   import { useGetUser } from "./generated";

   function UserProfile({ userId }) {
     const { data, isLoading, error } = useGetUser({ id: userId });

     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;

     return <div>Name: {data.user.name}</div>;
   }
   ```

---

## 🛠️ Generated Code Structure

After running the code generator, you'll have:

```
generated/
├── hooks/
│   ├── useQueryName1.ts
│   ├── useQueryName2.ts
│   └── ...
├── types.ts
├── graphqlClient.ts
└── index.ts
```

- **hooks/**: Contains individual hook files for each query
- **types.ts**: Contains TypeScript interfaces for all operations
- **graphqlClient.ts**: A customizable GraphQL client
- **index.ts**: Exports all hooks and types for easy importing

---

## 🔄 GraphQL Query to TypeScript Hook Example

Starting with a GraphQL query:

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}
```

The generator produces:

```typescript
// TypeScript interface for variables
export interface GetUserVariables {
  id: string;
}

// TypeScript interface for response
export interface GetUserResponse {
  user: {
    name: string;
    email: string;
  };
}

// React Query hook
export const useGetUser = (
  variables: GetUserVariables,
  options?: UseQueryOptions<GetUserResponse, Error>
) => {
  return useQuery<GetUserResponse, Error>(
    ["GetUser", variables],
    () => graphqlRequest<GetUserResponse, GetUserVariables>(QUERY, variables),
    options
  );
};
```

This gives you fully type-safe access to your GraphQL API with minimal boilerplate code.

---

## 🚀 Next Steps

- Add support for GraphQL fragments
- Generate mutation hooks with optimistic updates
- Add watch mode for continuous generation
- Implement unit and integration tests
