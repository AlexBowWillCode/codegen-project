// src/__tests__/__mocks__/mockQueries.ts
// Basic parsed query for GetCountry
export const mockParsedQuery = {
    operation: "query",
    name: "GetCountry",
    variables: [{ name: "code", type: "ID!" }],
    fields: [
        {
            name: "country",
            arguments: [{ name: "code", value: "code" }],
            subFields: [
                { name: "name", arguments: [], subFields: [] },
                { name: "capital", arguments: [], subFields: [] },
            ],
        },
    ],
};
// Query with non-existent field (for validation testing)
export const mockInvalidQuery = {
    operation: "query",
    name: "GetCountry",
    variables: [{ name: "code", type: "ID!" }],
    fields: [
        {
            name: "country",
            arguments: [{ name: "code", value: "code" }],
            subFields: [
                { name: "name", arguments: [], subFields: [] },
                { name: "capital", arguments: [], subFields: [] },
                { name: "nonExistentField", arguments: [], subFields: [] }, // This field doesn't exist in schema
            ],
        },
    ],
};
// More complex query with nested fields
export const mockComplexQuery = {
    operation: "query",
    name: "GetCountryWithLanguages",
    variables: [
        { name: "code", type: "ID!" },
        { name: "includeLanguages", type: "Boolean" },
    ],
    fields: [
        {
            name: "country",
            arguments: [{ name: "code", value: "code" }],
            subFields: [
                { name: "name", arguments: [], subFields: [] },
                { name: "capital", arguments: [], subFields: [] },
                {
                    name: "languages",
                    arguments: [],
                    subFields: [
                        { name: "code", arguments: [], subFields: [] },
                        { name: "name", arguments: [], subFields: [] },
                    ],
                },
            ],
        },
    ],
};
// Mutation query (for testing mutation validation)
export const mockMutationQuery = {
    operation: "mutation",
    name: "UpdateCountry",
    variables: [
        { name: "code", type: "ID!" },
        { name: "name", type: "String!" },
    ],
    fields: [
        {
            name: "updateCountry",
            arguments: [
                { name: "code", value: "code" },
                { name: "name", value: "name" },
            ],
            subFields: [
                { name: "success", arguments: [], subFields: [] },
                {
                    name: "country",
                    arguments: [],
                    subFields: [
                        { name: "name", arguments: [], subFields: [] },
                        { name: "capital", arguments: [], subFields: [] },
                    ],
                },
            ],
        },
    ],
};
