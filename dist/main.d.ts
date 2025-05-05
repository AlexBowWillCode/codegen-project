import fetchGraphQLSchema from "./util/fetchGraphqlSchema.js";
import parseSchema from "./util/parserFunctions.js";
import parseQuery from "./graphqlParsing/parseGraphQL.js";
import tokenize from "./graphqlParsing/tokenize.js";
import { validateQueryAgainstSchema } from "./validation/validateQueryAgainstSchema.js";
import { generateTypeScript } from "./codeGen/typescriptGenerator.js";
interface ProcessOptions {
    endpoint: string;
    queriesPath: string;
    outputPath?: string;
    generateCode: boolean;
    introspectionQuery?: string;
}
export declare function processGraphQLFiles(options: ProcessOptions): Promise<{
    validCount: number;
    invalidCount: number;
    validQueries: Map<any, any>;
}>;
export { fetchGraphQLSchema, parseSchema, parseQuery, tokenize, validateQueryAgainstSchema, generateTypeScript, };
