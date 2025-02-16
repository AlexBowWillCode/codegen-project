import fetchGraphQLSchema from "./util/fetchGraphqlSchema.ts";
import parseSchema from "./util/parserFunctions.ts";
import parseQuery from "./graphqlParsing/parseGraphQL.ts";
import tokenize from "./graphqlParsing/tokenize.ts";
import { readFileSync } from "fs";
import { readdirSync } from "fs";
import { join } from "path";

function readGraphQLFile(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

// Fetch and parse the schema
console.log("Starting fetchGraphQLSchema...");
fetchGraphQLSchema().then((introspectionResult) => {
  // Parse the schema
  const schema = parseSchema(introspectionResult);

  console.log("Parsed Schema:", JSON.stringify(schema, null, 2));

  // Converting .graphql files to AST so it can be compared with the schema
  const queriesFolderPath = "./src/queries";
  const queryFiles = readdirSync(queriesFolderPath).filter((file) =>
    file.endsWith(".graphql")
  );

  queryFiles.forEach((queryFile) => {
    const queryFilePath = join(queriesFolderPath, queryFile);
    const queryContent = readGraphQLFile(queryFilePath);
    const tokens = tokenize(queryContent);
    const parsedQuery = parseQuery(tokens);
    console.log(
      `Parsed Query (${queryFile}):`,
      JSON.stringify(parsedQuery, null, 2)
    );

    // Validate the parsed query against the schema
    const validationErrors = validateQueryAgainstSchema(schema, parsedQuery);
    if (validationErrors.length > 0) {
      console.error(`Validation errors in ${queryFile}:`, validationErrors);
    } else {
      console.log(`${queryFile} is valid.`);
    }
  });

  function validateQueryAgainstSchema(schema: any, query: any): string[] {
    // Implement your validation logic here
    // This is a placeholder function
    return [];
  }
});
