# 🚀 GraphQL Schema Validator

A **TypeScript application** that validates `.graphql` files against a **GraphQL API schema**. It fetches the schema from a GraphQL endpoint, parses it, and compares it with your `.graphql` files to ensure they are valid.

---

## ✨ Features

✅ Fetch a GraphQL schema using an introspection query.\
✅ Parse the schema into a usable TypeScript structure.\
✅ Parse `.graphql` files into an **Abstract Syntax Tree (AST)**.\
🚧 Validate `.graphql` files against the schema.\
❌ Add error handling and edge cases.\
❌ Write unit tests for validation logic.\
❌ Optimize and refactor for better performance.

---

## 📊 Project Progress

| Stage                              | Description                                                                | Status         |
| ---------------------------------- | -------------------------------------------------------------------------- | -------------- |
| **1. Fetch GraphQL Schema**        | Fetch the schema from the GraphQL API using an introspection query.        | ✅ Completed   |
| **2. Parse Schema**                | Convert the raw introspection result into a TypeScript-friendly structure. | ✅ Completed   |
| **3. Parse **``** Files**          | Convert `.graphql` files into an **Abstract Syntax Tree (AST)**.           | ✅ Completed   |
| **4. Validate **``** Files**       | Compare parsed `.graphql` files with the schema for validation.            | 🚧 In Progress |
| **5. Error Handling & Edge Cases** | Handle errors (e.g., invalid fields, missing arguments).                   | ❌ Not Started |
| **6. Unit Tests**                  | Write tests to ensure validation logic works correctly.                    | ❌ Not Started |
| **7. Optimization & Refactoring**  | Improve performance and code modularity.                                   | ❌ Not Started |

---

## 📝 Understanding AST Parsing (Stage 3)

Parsing a `.graphql` file into an **Abstract Syntax Tree (AST)** is crucial for understanding the query structure. Each node in the tree represents a part of the query, such as:

- **Operation Type** (`query`, `mutation`, etc.)
- **Field Names** (e.g., `user`, `id`, `name`)
- **Arguments** (e.g., `id: $id`)
- **Variables** (e.g., `$id: ID!`)
- **Fragments**

This enables **validation** against the schema to ensure correctness.

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

3. Run the **codegen** command to fetch and validate GraphQL schemas:

   ```sh
   npm run codegen
   ```

---

# The graphql feature I am trying to recreate: GraphQL Query to AST Conversion

To convert a GraphQL query into an Abstract Syntax Tree (AST) using tokens, you can utilize the `graphql/language` module from the GraphQL.js library. This module provides functions for lexical analysis and parsing, which are essential for transforming GraphQL source code into an AST.

## Steps to Convert GraphQL Query to AST:

### 1. Import the Required Functions:

Begin by importing the `parse` function from the `graphql/language` module.

```javascript
import { parse } from "graphql/language";
```

### 2. Define the GraphQL Query:

Specify the GraphQL query you wish to parse.

```javascript
const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`;
```

### 3. Parse the Query into an AST:

Use the parse function to convert the query string into an AST.

```javascript
const ast = parse(query);
```
