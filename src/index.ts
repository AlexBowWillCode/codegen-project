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
 * Main function to process GraphQL files and generate TypeScript code
 *
 * @example
 * ```typescript
 * import { processGraphQLFiles } from 'graphql-codegen-ts';
 *
 * // Validate GraphQL queries without generating code
 * await processGraphQLFiles({
 *   endpoint: 'https://api.example.com/graphql',
 *   queriesPath: './src/queries',
 *   generateCode: false
 * });
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
