import {
  GraphQLSchema,
  GraphQLType,
  GraphQLField,
  GraphQLQuery,
} from "../types/types.ts";
import {
  mapFieldToTypeScript,
  mapGraphQLTypeStringToTypeScript,
  resolveTypeReference,
} from "./typeMapper.ts";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

/**
 * Generates TypeScript hooks and types for GraphQL queries
 */
export function generateTypeScript(
  schema: GraphQLSchema,
  queries: Map<string, GraphQLQuery>,
  outputDir: string
): void {
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create hooks directory
  const hooksDir = join(outputDir, "hooks");
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }

  // Generate individual hooks for each query
  const hookImports: string[] = [];
  const hookExports: string[] = [];

  for (const [fileName, query] of queries.entries()) {
    const queryName = query.name;
    const hookName = `use${queryName}`;
    hookImports.push(`import { ${hookName} } from './hooks/${hookName}';`);
    hookExports.push(hookName);

    // Generate hook file
    generateQueryHook(
      schema,
      query,
      fileName,
      join(hooksDir, `${hookName}.ts`)
    );
  }

  // Generate types file
  generateTypesFile(schema, queries, join(outputDir, "types.ts"));

  // Generate graphql client file
  generateGraphQLClientFile(join(outputDir, "graphqlClient.ts"));

  // Generate index file that exports all hooks
  const indexContent = `
${hookImports.join("\n")}

export {
  ${hookExports.join(",\n  ")}
};

// Also export types
export * from './types';
`;

  writeFileSync(join(outputDir, "index.ts"), indexContent, "utf-8");

  console.log(`Generated TypeScript code in ${outputDir}`);
}

/**
 * Generates a React hook for a specific GraphQL query
 */
function generateQueryHook(
  schema: GraphQLSchema,
  query: GraphQLQuery,
  sourceFileName: string,
  outputPath: string
): void {
  // Create directory if it doesn't exist
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const queryName = query.name;
  const hookName = `use${queryName}`;
  const responseTypeName = `${queryName}Response`;
  const variablesTypeName =
    query.variables.length > 0 ? `${queryName}Variables` : "undefined";

  // Generate GraphQL document
  const graphqlDocument = generateGraphQLDocument(query);

  // Generate hook content
  const hookContent = `
import { useQuery, UseQueryOptions } from 'react-query';
import { ${responseTypeName}, ${variablesTypeName} } from '../types';
import { graphqlRequest } from '../graphqlClient';

/**
 * Generated hook for the ${queryName} query
 * Source: ${sourceFileName}
 */
export const ${hookName} = (
  variables${query.variables.length > 0 ? "" : "?"}: ${variablesTypeName},
  options?: Omit<UseQueryOptions<${responseTypeName}, Error, ${responseTypeName}>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<${responseTypeName}, Error>(
    ['${queryName}', variables],
    () => graphqlRequest<${responseTypeName}, ${variablesTypeName}>(QUERY, variables),
    options
  );
};

// GraphQL query document
const QUERY = \`${graphqlDocument}\`;
`;

  writeFileSync(outputPath, hookContent, "utf-8");
}

/**
 * Generates a types file containing all TypeScript types for the queries
 */
function generateTypesFile(
  schema: GraphQLSchema,
  queries: Map<string, GraphQLQuery>,
  outputPath: string
): void {
  // Create directory if it doesn't exist
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  let typesContent = `
/**
 * Generated TypeScript types for GraphQL operations
 */

// Base client type for making requests
export interface GraphQLClient {
  request<T, V>(query: string, variables?: V): Promise<T>;
}

`;

  // Generate types for each query
  for (const [_, query] of queries.entries()) {
    const queryName = query.name;

    // Generate variables type
    if (query.variables.length > 0) {
      typesContent += `// Variables for ${queryName} query\nexport interface ${queryName}Variables {\n`;

      for (const variable of query.variables) {
        const tsType = mapGraphQLTypeStringToTypeScript(variable.type);
        typesContent += `  ${variable.name}: ${tsType};\n`;
      }

      typesContent += `}\n\n`;
    } else {
      // Generate an empty interface for consistency
      typesContent += `// No variables for ${queryName} query\nexport type ${queryName}Variables = undefined;\n\n`;
    }

    // Generate response type
    typesContent += `// Response type for ${queryName} query\nexport interface ${queryName}Response {\n`;

    // Find the Query type in the schema
    const queryType = schema.types.find((type) => type.name === "Query");
    if (queryType) {
      // Add fields to response type
      for (const field of query.fields) {
        const fieldType = mapFieldToTypeScript(schema, queryType, field);
        typesContent += `  ${field.name}: ${fieldType};\n`;
      }
    }

    typesContent += `}\n\n`;
  }

  writeFileSync(outputPath, typesContent, "utf-8");
}

/**
 * Generates a GraphQL client implementation
 */
function generateGraphQLClientFile(outputPath: string): void {
  // Create directory if it doesn't exist
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const clientContent = `
import { GraphQLClient } from './types';

/**
 * GraphQL client implementation
 * 
 * You should customize this function to use your preferred fetching library
 * and add authentication as needed.
 */
export const graphqlRequest = async <T, V>(query: string, variables?: V): Promise<T> => {
  const endpoint = process.env.GRAPHQL_ENDPOINT || 'YOUR_GRAPHQL_ENDPOINT';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers here if needed
      // Example: 'Authorization': \`Bearer \${yourAuthToken}\`
    },
    body: JSON.stringify({
      query,
      variables
    }),
  });

  const json = await response.json();

  if (json.errors) {
    const errorMessage = json.errors.map((e: any) => e.message).join('\\n');
    throw new Error(\`GraphQL Error: \${errorMessage}\`);
  }

  return json.data;
};
`;

  writeFileSync(outputPath, clientContent, "utf-8");
}

/**
 * Generates a GraphQL query document string from the parsed query
 */
function generateGraphQLDocument(query: GraphQLQuery): string {
  let document = `${query.operation} ${query.name}`;

  // Add variables if they exist
  if (query.variables.length > 0) {
    document += "(";
    document += query.variables.map((v) => `$${v.name}: ${v.type}`).join(", ");
    document += ")";
  }

  document += " {\n";

  // Add fields
  document += generateFieldsString(query.fields, 2);

  document += "}";

  return document;
}

/**
 * Recursively generates a string representation of fields
 */
function generateFieldsString(fields: any[], indent: number): string {
  let result = "";
  const indentStr = " ".repeat(indent);

  for (const field of fields) {
    result += `${indentStr}${field.name}`;

    // Add arguments if they exist
    if (field.arguments && field.arguments.length > 0) {
      result += "(";
      result += field.arguments
        .map((arg: any) => `${arg.name}: $${arg.value}`)
        .join(", ");
      result += ")";
    }

    // Add subfields if they exist
    if (field.subFields && field.subFields.length > 0) {
      result += " {\n";
      result += generateFieldsString(field.subFields, indent + 2);
      result += `${indentStr}}\n`;
    } else {
      result += "\n";
    }
  }

  return result;
}
