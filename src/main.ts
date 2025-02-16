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
  });
});
