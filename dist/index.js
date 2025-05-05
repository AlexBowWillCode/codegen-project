// Main functionality
export { processGraphQLFiles } from "./main.js";
// Core utilities
export { default as fetchGraphQLSchema } from "./util/fetchGraphqlSchema.js";
export { default as parseSchema } from "./util/parserFunctions.js";
export { default as tokenize } from "./graphqlParsing/tokenize.js";
export { default as parseQuery } from "./graphqlParsing/parseGraphQL.js";
export { validateQueryAgainstSchema } from "./validation/validateQueryAgainstSchema.js";
export { generateTypeScript } from "./codeGen/typescriptGenerator.js";
// Types
export * from "./types/types.js";
/**
 * GraphQL Schema Validator and TypeScript Hook Generator
 *
 * A TypeScript library that validates GraphQL queries against a schema and generates
 * fully typed React Query hooks.
 *
 * @example
 * ```typescript
 * import { processGraphQLFiles } from 'graphql-ts-codegen';
 *
 * // Generate TypeScript hooks from GraphQL queries
 * await processGraphQLFiles({
 *   endpoint: 'https://api.example.com/graphql',
 *   queriesPath: './src/queries',
 *   outputPath: './generated',
 *   generateCode: true
 * });
 * ```
 */
