import { GraphQLQuery, GraphQLSchema } from "../types/types.js";
/**
 * Generates TypeScript hooks and types for GraphQL queries
 */
export declare function generateTypeScript(schema: GraphQLSchema, queries: Map<string, GraphQLQuery>, outputDir: string): void;
