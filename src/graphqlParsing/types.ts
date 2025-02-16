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
