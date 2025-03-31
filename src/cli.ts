#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { processGraphQLFiles } from "./main.js";

// Get package info
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, "../package.json");
// Use dynamic import for package.json
import fs from "fs/promises";

const packageJson = await fs
  .readFile(packageJsonPath, "utf-8")
  .then((data) => JSON.parse(data))
  .catch(() => ({ version: "0.1.0" }));

const program = new Command();

program
  .name("graphql-codegen-ts")
  .description("GraphQL Schema Validator and TypeScript Hook Generator")
  .version(packageJson.version);

program
  .command("validate")
  .description("Validate GraphQL queries against a schema")
  .requiredOption("-e, --endpoint <url>", "GraphQL endpoint URL")
  .option(
    "-q, --queries <path>",
    "Path to GraphQL query files",
    "./src/queries"
  )
  .action(async (options) => {
    console.log(chalk.blue("Starting GraphQL schema validation..."));
    await processGraphQLFiles({
      endpoint: options.endpoint,
      queriesPath: options.queries,
      generateCode: false,
    });
  });

program
  .command("generate")
  .description("Generate TypeScript hooks from GraphQL queries")
  .requiredOption("-e, --endpoint <url>", "GraphQL endpoint URL")
  .option(
    "-q, --queries <path>",
    "Path to GraphQL query files",
    "./src/queries"
  )
  .option(
    "-o, --output <path>",
    "Output directory for generated files",
    "./generated"
  )
  .action(async (options) => {
    console.log(chalk.blue("Starting GraphQL code generation..."));
    await processGraphQLFiles({
      endpoint: options.endpoint,
      queriesPath: options.queries,
      outputPath: options.output,
      generateCode: true,
    });
  });

program.parse();
