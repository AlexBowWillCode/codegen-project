import fetchGraphQLSchema from "./util/fetchGraphqlSchema.js";
import parseSchema from "./util/parserFunctions.js";
import parseQuery from "./graphqlParsing/parseGraphQL.js";
import tokenize from "./graphqlParsing/tokenize.js";
import { validateQueryAgainstSchema } from "./validation/validateQueryAgainstSchema.js";
import { generateTypeScript } from "./codeGen/typescriptGenerator.js";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import chalk from "chalk";
import { glob } from "glob";
function readGraphQLFile(filePath) {
    try {
        return readFileSync(filePath, "utf-8");
    }
    catch (error) {
        console.error(`${chalk.red("Error reading file")} ${filePath}:`, error);
        return "";
    }
}
// Main function that processes GraphQL files
export async function processGraphQLFiles(options) {
    try {
        const { endpoint, queriesPath, outputPath = "./generated", generateCode, introspectionQuery, } = options;
        console.log(chalk.blue("Fetching GraphQL schema from"), chalk.green(endpoint));
        // Use the provided introspection query or the default one
        const schemaResult = await fetchGraphQLSchema(endpoint, introspectionQuery);
        console.log(chalk.blue("Parsing schema..."));
        const schema = parseSchema(schemaResult);
        // Cache schema for debugging if needed
        try {
            const schemaCacheDir = dirname("./schema-debug.json");
            if (!existsSync(schemaCacheDir)) {
                mkdirSync(schemaCacheDir, { recursive: true });
            }
            writeFileSync("./schema-debug.json", JSON.stringify(schema, null, 2));
            console.log(chalk.gray("Schema cached to schema-debug.json for reference"));
        }
        catch (error) {
            console.warn(chalk.yellow("Could not cache schema:"), error);
        }
        // Find all .graphql files in the specified directory
        const queryFiles = glob.sync(`${queriesPath}/**/*.graphql`);
        if (queryFiles.length === 0) {
            console.log(chalk.yellow(`No .graphql files found in ${queriesPath}`));
            return { validCount: 0, invalidCount: 0, validQueries: new Map() };
        }
        console.log(chalk.blue(`Found ${queryFiles.length} GraphQL files to validate.`));
        let validCount = 0;
        let invalidCount = 0;
        const validQueries = new Map();
        for (const queryFile of queryFiles) {
            try {
                console.log(`\nProcessing ${chalk.cyan(queryFile)}...`);
                const queryContent = readGraphQLFile(queryFile);
                if (!queryContent) {
                    console.error(chalk.red(`Empty or invalid file: ${queryFile}`));
                    invalidCount++;
                    continue;
                }
                console.log(`Tokenizing ${chalk.cyan(queryFile)}...`);
                const tokens = tokenize(queryContent);
                console.log(`Parsing ${chalk.cyan(queryFile)}...`);
                const parsedQuery = parseQuery(tokens);
                console.log(`Validating ${chalk.cyan(queryFile)}...`);
                const validationErrors = validateQueryAgainstSchema(schema, parsedQuery);
                if (validationErrors.length > 0) {
                    console.error(`\n${chalk.red("❌")} Validation errors in ${queryFile}:`);
                    validationErrors.forEach((error, index) => {
                        console.error(`   ${index + 1}. ${error}`);
                    });
                    invalidCount++;
                }
                else {
                    console.log(`\n${chalk.green("✅")} ${queryFile} is valid!`);
                    validQueries.set(queryFile, parsedQuery);
                    validCount++;
                }
            }
            catch (error) {
                console.error(`\n${chalk.red("❌")} Error processing ${queryFile}:`, error);
                invalidCount++;
            }
        }
        console.log("\n---- Validation Summary ----");
        console.log(`Total files: ${chalk.blue(queryFiles.length)}`);
        console.log(`Valid: ${chalk.green(validCount)}`);
        console.log(`Invalid: ${chalk.red(invalidCount)}`);
        console.log("---------------------------");
        // Generate TypeScript code if there are valid queries and generateCode is true
        if (validQueries.size > 0 && generateCode) {
            console.log(`\n${chalk.blue("Generating TypeScript hooks...")}`);
            generateTypeScript(schema, validQueries, outputPath);
            console.log(`${chalk.green("✅")} TypeScript hooks generated in ${outputPath}`);
        }
        else if (generateCode) {
            console.log(`\n${chalk.yellow("⚠")} No valid queries to generate TypeScript hooks from.`);
        }
        return { validCount, invalidCount, validQueries };
    }
    catch (error) {
        console.error(chalk.red("Fatal error:"), error);
        throw error;
    }
}
export { fetchGraphQLSchema, parseSchema, parseQuery, tokenize, validateQueryAgainstSchema, generateTypeScript, };
