import {
  GraphQLArgument,
  GraphQLField2,
  GraphQLQuery,
  GraphQLVariable,
} from "./types.ts";
import { Token, TokenType } from "./tokenize.ts";

//Convert the tokens into a structured GraphQLQuery object.

export default function parseQuery(tokens: Token[]): GraphQLQuery {
  let index = 0;

  function consume(expectedType: TokenType): string {
    if (tokens[index].type === expectedType) {
      return tokens[index++].value;
    }
    throw new Error(
      `Expected ${expectedType}, but found ${tokens[index].type}`
    );
  }

  function parseVariables(): GraphQLVariable[] {
    const variables: GraphQLVariable[] = [];
    if (tokens[index].type === "brace" && tokens[index].value === "(") {
      consume("brace"); // Consume '('
      while (tokens[index].type !== "brace" || tokens[index].value !== ")") {
        const name = consume("variable").slice(1); // Remove '$'
        consume("colon"); // Consume ':'
        const type = consume("name");
        variables.push({ name, type });
        if (tokens[index].type === "comma") {
          consume("comma"); // Consume ','
        }
      }
      consume("brace"); // Consume ')'
    }
    return variables;
  }

  function parseFields(): GraphQLField2[] {
    const fields: GraphQLField2[] = [];
    consume("brace"); // Consume '{'
    while (tokens[index].type !== "brace" || tokens[index].value !== "}") {
      const field: GraphQLField2 = { name: consume("name") };
      if (tokens[index].type === "brace" && tokens[index].value === "(") {
        field.arguments = parseArguments();
      }
      if (tokens[index].type === "brace" && tokens[index].value === "{") {
        field.subFields = parseFields();
      }
      fields.push(field);
    }
    consume("brace"); // Consume '}'

    return fields;
  }

  function parseArguments(): GraphQLArgument[] {
    const argumentsList: GraphQLArgument[] = [];
    consume("brace"); // Consume '('
    while (tokens[index].type !== "brace" || tokens[index].value !== ")") {
      const name = consume("name");
      consume("colon"); // Consume ':'
      const value = consume("variable").slice(1); // Remove '$'
      argumentsList.push({ name, value });
      if (tokens[index].type === "comma") {
        consume("comma"); // Consume ','
      }
    }
    consume("brace"); // Consume ')'
    return argumentsList;
  }

  const operation = consume("operation") as "query" | "mutation";

  const name = consume("name");

  const variables = parseVariables();

  const fields = parseFields();

  return { operation, name, variables, fields };
}
