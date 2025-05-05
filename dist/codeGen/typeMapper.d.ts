import { GraphQLField2, GraphQLSchema, GraphQLType, GraphQLTypeRef } from "../types/types.js";
/**
 * Maps a GraphQL field to a TypeScript type
 */
export declare function mapFieldToTypeScript(schema: GraphQLSchema, parentType: GraphQLType, field: GraphQLField2): string;
/**
 * Maps a GraphQL type reference to a TypeScript type
 */
export declare function mapTypeReferenceToTypeScript(schema: GraphQLSchema, typeRef: GraphQLTypeRef): string;
/**
 * Resolves a type reference to an actual GraphQL type
 */
export declare function resolveTypeReference(schema: GraphQLSchema, typeRef: GraphQLTypeRef): GraphQLType | undefined;
/**
 * Parses a GraphQL type string (used for variables)
 */
export declare function parseGraphQLTypeString(typeStr: string): {
    typeName: string;
    isNonNull: boolean;
    isList: boolean;
};
/**
 * Maps a GraphQL type string to TypeScript
 */
export declare function mapGraphQLTypeStringToTypeScript(typeStr: string): string;
