import * as fs from "fs";

// Step 1: Read the GraphQL schema from the file
const inputText = fs.readFileSync("types.graphql", "utf-8");

// Step 2: Regular Expression to parse types
const typeRegex = /type\s+(\w+)\s*{([\s\S]*?)}/g;
const fieldRegex = /(\w+):\s*(\w+)(!|\?)?/g; // Field regex for name, type, and nullability

// Step 3: Parse the GraphQL schema and extract types
const types: string[] = [];
let typeMatch;
while ((typeMatch = typeRegex.exec(inputText)) !== null) {
  const typeName = typeMatch[1];
  const fieldsText = typeMatch[2];

  let fields: string[] = [];
  let fieldMatch;
  while ((fieldMatch = fieldRegex.exec(fieldsText)) !== null) {
    const fieldName = fieldMatch[1];
    const fieldType = fieldMatch[2];
    const isRequired = fieldMatch[3] === "!" ? true : false;

    // Map GraphQL types to TypeScript types
    const tsType = mapGraphQLTypeToTS(fieldType, isRequired);

    // Add the field to the fields array
    fields.push(`${fieldName}: ${tsType}`);
  }

  // Construct the TypeScript type declaration
  types.push(`type ${typeName} = { ${fields.join("; ")}; }`);
}

// Step 4: Map GraphQL type to TypeScript type
function mapGraphQLTypeToTS(graphqlType: string, isRequired: boolean): string {
  const typeMap: { [key: string]: string } = {
    Int: "number",
    Float: "number",
    String: "string",
    Boolean: "boolean",
    ID: "string", // GraphQL 'ID' can be treated as string
  };

  const tsType = typeMap[graphqlType] || "any"; // Default to 'any' if type is not mapped
  return isRequired ? tsType : `${tsType} | undefined`; // Optional fields become "type | undefined"
}

// Step 5: Generate TypeScript code
const tsCode = types.join("\n");

// Step 6: Write the generated TypeScript code to a file
fs.writeFileSync("generated-types.ts", tsCode);
console.log("TypeScript file generated: generated-types.ts");
