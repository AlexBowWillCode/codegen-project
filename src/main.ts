import fetchGraphQLSchema from "./util/fetchGraphqlSchema.ts";
import parseSchema from "./util/parserFunctions.ts";
import parseQuery from "./graphqlParsing/parseGraphQL.ts";
import tokenize from "./graphqlParsing/tokenize.ts";
import { validateQueryAgainstSchema } from "./validation/validateQueryAgainstSchema.ts";
import { generateTypeScript } from "./codeGen/typescriptGenerator.ts";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { readdirSync } from "fs";
import { join } from "path";

function readGraphQLFile(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "";
  }
}

// Main function
export async function main() {
  try {
    console.log("Starting GraphQL schema validation...");
    console.log("Fetching GraphQL schema...");
    const introspectionResult = await fetchGraphQLSchema();

    console.log("Parsing schema...");
    const schema = parseSchema(introspectionResult);

    try {
      writeFileSync("./schema-debug.json", JSON.stringify(schema, null, 2));
      console.log("Schema cached to schema-debug.json for reference");
    } catch (error) {
      console.warn("Could not cache schema:", error);
    }

    const queriesFolderPath = "./src/queries";

    if (!existsSync(queriesFolderPath)) {
      console.error(`Queries folder not found: ${queriesFolderPath}`);
      return;
    }

    const queryFiles = readdirSync(queriesFolderPath).filter((file) =>
      file.endsWith(".graphql")
    );

    if (queryFiles.length === 0) {
      console.log("No .graphql files found to validate.");
      return;
    }

    console.log(`Found ${queryFiles.length} GraphQL files to validate.`);

    let validCount = 0;
    let invalidCount = 0;

    const validQueries = new Map();

    for (const queryFile of queryFiles) {
      try {
        const queryFilePath = join(queriesFolderPath, queryFile);
        console.log(`\nProcessing ${queryFile}...`);

        const queryContent = readGraphQLFile(queryFilePath);
        if (!queryContent) {
          console.error(`Empty or invalid file: ${queryFile}`);
          invalidCount++;
          continue;
        }

        console.log(`Tokenizing ${queryFile}...`);
        const tokens = tokenize(queryContent);

        console.log(`Parsing ${queryFile}...`);
        const parsedQuery = parseQuery(tokens);

        console.log(`Validating ${queryFile}...`);
        const validationErrors = validateQueryAgainstSchema(
          schema,
          parsedQuery
        );

        if (validationErrors.length > 0) {
          console.error(`\n❌ Validation errors in ${queryFile}:`);
          validationErrors.forEach((error, index) => {
            console.error(`   ${index + 1}. ${error}`);
          });
          invalidCount++;
        } else {
          console.log(`\n✅ ${queryFile} is valid!`);
          validQueries.set(queryFile, parsedQuery);
          validCount++;
        }
      } catch (error) {
        console.error(`\n❌ Error processing ${queryFile}:`, error);
        invalidCount++;
      }
    }

    console.log("\n---- Validation Summary ----");
    console.log(`Total files: ${queryFiles.length}`);
    console.log(`Valid: ${validCount}`);
    console.log(`Invalid: ${invalidCount}`);
    console.log("---------------------------");

    // Generate TypeScript code if there are valid queries
    if (validQueries.size > 0) {
      console.log("\nGenerating TypeScript hooks...");
      generateTypeScript(schema, validQueries, "./generated");
      console.log("✅ TypeScript hooks generated in ./generated");
    } else {
      console.log("\n❌ No valid queries to generate TypeScript hooks from.");
    }
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

// Run the main function
main();
