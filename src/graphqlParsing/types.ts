export interface GraphQLVariable {
  name: string;
  type: string;
}

export interface GraphQLArgument {
  name: string;
  value: string;
}

export interface GraphQLField2 {
  name: string;
  arguments?: GraphQLArgument[];
  subFields?: string[];
}

export interface GraphQLQuery {
  operation: "query" | "mutation";
  name: string;
  variables: GraphQLVariable[];
  fields: GraphQLField2[];
}
