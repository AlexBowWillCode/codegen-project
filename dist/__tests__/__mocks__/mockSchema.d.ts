import { GraphQLSchema } from "../../types/types.js";
export declare const mockSchema: GraphQLSchema;
export declare const mockParsedQuery: {
    operation: string;
    name: string;
    variables: {
        name: string;
        type: string;
    }[];
    fields: {
        name: string;
        arguments: {
            name: string;
            value: string;
        }[];
        subFields: {
            name: string;
            arguments: never[];
            subFields: never[];
        }[];
    }[];
};
export declare const mockTokens: {
    type: string;
    value: string;
}[];
