export interface GraphQLTypeRef {
  kind: string;
  name: string | null;
  ofType?: GraphQLTypeRef;
}

export interface GraphQLField {
  name: string;
  type: GraphQLTypeRef;
}

export interface GraphQLType {
  kind: string;
  name: string;
  fields?: GraphQLField[];
}

export interface GraphQLSchema {
  types: GraphQLType[];
}

// Tokenization types
export type TokenType =
  | "operation"
  | "name"
  | "variable"
  | "field"
  | "brace"
  | "colon"
  | "equals"
  | "comma";

export interface Token {
  type: TokenType;
  value: string;
}

// Query parsing types
export interface GraphQLVariable {
  name: string;
  type: string;
}

export interface GraphQLArgument {
  name: string;
  value: string;
  required?: boolean;
}

export interface GraphQLField2 {
  name: string;
  arguments?: GraphQLArgument[];
  subFields?: GraphQLField2[];
}

export interface GraphQLQuery {
  operation: "query" | "mutation";
  name: string;
  variables: GraphQLVariable[];
  fields: GraphQLField2[];
}
