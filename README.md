GraphQL Schema Validator
This project is a TypeScript application that validates .graphql files against a GraphQL API schema. It fetches the schema from a GraphQL endpoint, parses it, and compares it with your .graphql files to ensure they are valid.

Features
Fetch a GraphQL schema using a query.

Parse the schema into a usable TypeScript structure.

Parse .graphql files into an Abstract Syntax Tree (AST).

Validate .graphql files against the schema.

Progress
Below is the progress of the project, broken down into stages. Each stage has a progress bar to indicate completion.

1. Fetch the GraphQL Schema
   Description: Fetch the schema from the GraphQL API using an introspection query.

Status: ✅ Completed

2. Parse the Schema into a Usable Structure
   Description: Parse the raw introspection result into a TypeScript-friendly structure.

Status: ✅ Completed

3.  Parse .graphql Files
    Description: Parse .graphql files into an Abstract Syntax Tree (AST) for validation.

         Converting a .graphql file into an Abstract Syntax Tree (AST) is a crucial step in working with GraphQL queries, mutations, or fragments.

         Each node in the tree represents a part of the query, such as:

            -The operation type (query, mutation, etc.).

            -Field names (user, id, name, etc.).

            -Arguments (id: $id).

            -Variables ($id: ID!).

            -Fragments.

Status: 🚧 In Progress

4. Validate .graphql Files Against the Schema
   Description: Compare the parsed .graphql files with the schema to ensure they are valid.

Status: ❌ Not Started

5. Add Error Handling and Edge Cases
   Description: Handle errors and edge cases (e.g., invalid fields, missing arguments).

Status: ❌ Not Started

6. Write Unit Tests
   Description: Write unit tests to ensure the validation logic works correctly.

Status: ❌ Not Started

7. Optimize and Refactor
   Description: Optimize the code for performance and refactor for modularity.

Status: ❌ Not Started

How to use:

Run the codgen command, which runs the main.ts file
