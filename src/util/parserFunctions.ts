import { GraphQLSchema, GraphQLTypeRef } from "../types/types.js";

export default function parseSchema(introspectionResult: any): GraphQLSchema {
  const schema: GraphQLSchema = {
    types: introspectionResult.types.map((type: any) => ({
      kind: type.kind,
      name: type.name,
      fields: type.fields?.map((field: any) => ({
        name: field.name,
        type: parseTypeRef(field.type),
      })),
    })),
  };

  return schema;
}

// Helper function to parse type references
export function parseTypeRef(typeRef: any): GraphQLTypeRef {
  return {
    kind: typeRef.kind,
    name: typeRef.name,
    ofType: typeRef.ofType ? parseTypeRef(typeRef.ofType) : undefined,
  };
}
