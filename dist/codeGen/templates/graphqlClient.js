export const graphqlRequest = async (query, variables) => {
    const endpoint = process.env.GRAPHQL_ENDPOINT || "YOUR_GRAPHQL_ENDPOINT";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add authentication headers here if needed
            // Example: 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    const json = await response.json();
    if (json.errors) {
        const errorMessage = json.errors.map((e) => e.message).join("\n");
        throw new Error(`GraphQL Error: ${errorMessage}`);
    }
    return json.data;
};
