//Convert the tokens into a structured GraphQLQuery object.
export default function parseQuery(tokens) {
    let index = 0;
    function consume(expectedType) {
        if (index >= tokens.length) {
            throw new Error(`Unexpected end of tokens, expected ${expectedType}`);
        }
        if (tokens[index].type === expectedType) {
            return tokens[index++].value;
        }
        throw new Error(`Expected ${expectedType}, but found ${tokens[index].type}`);
    }
    function peek() {
        return index < tokens.length ? tokens[index] : null;
    }
    function peekAhead(positions = 1) {
        return index + positions < tokens.length ? tokens[index + positions] : null;
    }
    function parseVariables() {
        const variables = [];
        // Check if we have opening parenthesis for variables
        const nextToken = peek();
        if (nextToken && nextToken.type === "brace" && nextToken.value === "(") {
            consume("brace"); // Consume '('
            while (index < tokens.length &&
                (tokens[index].type !== "brace" || tokens[index].value !== ")")) {
                const name = consume("variable").slice(1); // Remove '$'
                consume("colon"); // Consume ':'
                const type = consume("name");
                variables.push({ name, type });
                if (index < tokens.length && tokens[index].type === "comma") {
                    consume("comma"); // Consume ','
                }
            }
            if (index < tokens.length) {
                consume("brace"); // Consume ')'
            }
        }
        return variables;
    }
    function parseFields() {
        const fields = [];
        consume("brace"); // Consume '{'
        while (index < tokens.length &&
            (tokens[index].type !== "brace" || tokens[index].value !== "}")) {
            // Expect a field name
            if (tokens[index].type !== "name") {
                throw new Error(`Expected a field name, but found ${tokens[index].type} (${tokens[index].value})`);
            }
            const fieldName = consume("name");
            const field = { name: fieldName };
            // Check for arguments
            if (index < tokens.length &&
                tokens[index].type === "brace" &&
                tokens[index].value === "(") {
                field.arguments = parseArguments();
            }
            // Check for subfields
            if (index < tokens.length &&
                tokens[index].type === "brace" &&
                tokens[index].value === "{") {
                field.subFields = parseFields();
            }
            fields.push(field);
        }
        if (index < tokens.length) {
            consume("brace"); // Consume '}'
        }
        else {
            let context = "";
            if (index > 0 && index - 1 < tokens.length) {
                context = `Last token processed: ${tokens[index - 1].type} (${tokens[index - 1].value})`;
            }
            throw new Error(`Unexpected end of tokens while parsing fields. Missing closing brace '}'. ${context}`);
        }
        return fields;
    }
    function parseArguments() {
        const argumentsList = [];
        consume("brace"); // Consume '('
        while (index < tokens.length &&
            (tokens[index].type !== "brace" || tokens[index].value !== ")")) {
            const name = consume("name");
            consume("colon"); // Consume ':'
            // The value could be a variable or a literal
            let value;
            if (tokens[index].type === "variable") {
                value = consume("variable").slice(1); // Remove '$'
            }
            else {
                value = consume("name"); // Could also handle other value types (numbers, booleans, etc.)
            }
            argumentsList.push({ name, value });
            if (index < tokens.length && tokens[index].type === "comma") {
                consume("comma"); // Consume ','
            }
        }
        if (index < tokens.length) {
            consume("brace"); // Consume ')'
        }
        else {
            throw new Error("Unexpected end of tokens while parsing arguments. Missing closing parenthesis ')'");
        }
        return argumentsList;
    }
    const operation = consume("operation");
    const name = consume("name");
    const variables = parseVariables();
    const fields = parseFields();
    return { operation, name, variables, fields };
}
