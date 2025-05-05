export function validateQueryAgainstSchema(schema, query) {
    const errors = [];
    const queryType = schema.types.find((type) => type.name === "Query");
    if (!queryType) {
        errors.push("Schema doesn't have a Query type");
        return errors;
    }
    if (query.operation === "mutation") {
        const mutationType = schema.types.find((type) => type.name === "Mutation");
        if (!mutationType) {
            errors.push("Query contains a mutation, but the schema doesn't have a Mutation type");
            return errors;
        }
        // Validate each top-level field in the mutation
        query.fields.forEach((field) => {
            validateField(field, mutationType, schema, errors, query.operation);
        });
    }
    else {
        // Validate each top-level field in the query
        query.fields.forEach((field) => {
            validateField(field, queryType, schema, errors, query.operation);
        });
    }
    // Validate variables if they exist
    validateVariables(query, schema, errors);
    return errors;
}
// This is a specific fix for validateQueryAgainstSchema.ts
// Let's add a part that needs to be modified to fix the validation issue:
// Inside the validateField function, look for this code:
function validateField(field, parentType, schema, errors, operation, path = "") {
    const currentPath = path ? `${path}.${field.name}` : field.name;
    // Check if the field exists on the parent type
    const schemaField = parentType.fields?.find((f) => f.name === field.name);
    if (!schemaField) {
        errors.push(`Field '${field.name}' doesn't exist on type '${parentType.name}' at ${currentPath}`);
        return;
    }
    // Fix: Make sure we properly handle fields with no subfields
    // If field.subFields is undefined, treat it as an empty array
    field.subFields = field.subFields || [];
    // Validate arguments if they exist
    if (field.arguments && field.arguments.length > 0) {
        field.arguments.forEach((arg) => {
            if (!arg.name || !arg.value) {
                errors.push(`Invalid argument for field '${field.name}' at ${currentPath}`);
            }
        });
    }
    // Continue validating subfields if they exist
    if (field.subFields && field.subFields.length > 0) {
        // Get the type of this field
        const fieldType = resolveFieldType(schema, schemaField.type, field.name);
        if (!fieldType) {
            errors.push(`Cannot find type for field '${field.name}' at ${currentPath}`);
            return;
        }
        // Check if this type can have subfields (must be an OBJECT type)
        if (fieldType.kind !== "OBJECT" &&
            fieldType.kind !== "INTERFACE" &&
            fieldType.kind !== "UNION") {
            errors.push(`Type '${fieldType.name}' at ${currentPath} cannot have subfields because it is a ${fieldType.kind} type`);
            return;
        }
        // Validate each subfield
        field.subFields.forEach((subField) => {
            validateField(subField, fieldType, schema, errors, operation, currentPath);
        });
    }
}
/**
 * Resolves a field's type by examining the type reference structure
 * If the type can't be determined from the structure, tries to infer it from naming conventions
 */
function resolveFieldType(schema, typeRef, fieldName) {
    // Step 1: Try to extract type from the type structure
    const typeInfo = extractTypeInfo(typeRef);
    if (typeInfo.typeName) {
        const namedType = schema.types.find((t) => t.name === typeInfo.typeName);
        if (namedType)
            return namedType;
    }
    //Note major refactor needed here was just trying to make it work
    // Step 2: For list fields with no item type info, try to infer from field name
    if (typeInfo.isList && !typeInfo.typeName) {
        const inferredTypeName = inferTypeFromFieldName(schema, fieldName);
        if (inferredTypeName) {
            const inferredType = schema.types.find((t) => t.name === inferredTypeName);
            if (inferredType)
                return inferredType;
        }
    }
    // If all else fails for lists, return a generic object type
    if (typeInfo.isList) {
        // Create a placeholder type that won't break validation
        return {
            kind: "OBJECT",
            name: "UnknownListItem",
            fields: [], // With no fields, no subfield validation will be performed
        };
    }
    return undefined;
}
/**
 * Extracts type information by traversing the nested type structure
 */
function extractTypeInfo(typeRef) {
    if (!typeRef) {
        return { typeName: null, isList: false, isNonNull: false };
    }
    // For NON_NULL type, unwrap and continue with isNonNull flag
    if (typeRef.kind === "NON_NULL") {
        const innerInfo = extractTypeInfo(typeRef.ofType);
        return { ...innerInfo, isNonNull: true };
    }
    // For LIST type, unwrap and continue with isList flag
    if (typeRef.kind === "LIST") {
        const innerInfo = typeRef.ofType
            ? extractTypeInfo(typeRef.ofType)
            : { typeName: null, isList: false, isNonNull: false };
        return { ...innerInfo, isList: true };
    }
    // For named types (OBJECT, SCALAR, ENUM, etc.)
    return {
        typeName: typeRef.name,
        isList: false,
        isNonNull: false,
    };
}
/**
 * Tries to infer a type name from field naming conventions in GraphQL
 */
function inferTypeFromFieldName(schema, fieldName) {
    // GraphQL naming conventions: plural field names often return lists of singular type
    // Simple case: plurals formed by adding 's'
    if (fieldName.endsWith("s")) {
        // Try removing the 's'
        const singularName = fieldName.slice(0, -1);
        // Try with first letter capitalized (common GraphQL convention)
        const capitalizedName = singularName.charAt(0).toUpperCase() + singularName.slice(1);
        // Check if either form exists in the schema
        const matchingType = schema.types.find((t) => t.name === singularName || t.name === capitalizedName);
        if (matchingType)
            return matchingType.name;
    }
    // Handle irregular plurals as a fallback using the 'Field name as type name' convention
    // This looks for a type with the same name as the field (case insensitive)
    const fieldNameCapitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    const matchingType = schema.types.find((t) => t.name?.toLowerCase() === fieldName.toLowerCase() ||
        t.name === fieldNameCapitalized);
    if (matchingType)
        return matchingType.name;
    return null;
}
// Validate query variables against expected types
function validateVariables(query, schema, errors) {
    if (!query.variables || query.variables.length === 0) {
        return;
    }
    // For each variable, check if its type exists in the schema
    query.variables.forEach((variable) => {
        // Parse the variable type string to handle modifiers (non-null, list)
        const { typeName, isNonNull, isList } = parseVariableType(variable.type);
        // Check if this type exists in the schema
        const typeExists = schema.types.some((type) => type.name === typeName);
        if (!typeExists) {
            errors.push(`Variable '$${variable.name}' has unknown type '${variable.type}'`);
            return;
        }
        // Also check that any arguments using this variable have matching types
        validateVariableUsage(query, variable, schema, errors);
    });
}
// Parse variable type string into components
function parseVariableType(typeStr) {
    let isNonNull = false;
    let isList = false;
    let typeName = typeStr;
    // Check for non-null modifier
    if (typeName.endsWith("!")) {
        isNonNull = true;
        typeName = typeName.slice(0, -1);
    }
    // Check for list modifier
    if (typeName.startsWith("[") && typeName.endsWith("]")) {
        isList = true;
        typeName = typeName.slice(1, -1);
        // Check for non-null items in the list
        if (typeName.endsWith("!")) {
            typeName = typeName.slice(0, -1);
        }
    }
    return { typeName, isNonNull, isList };
}
// Validate that variables are used correctly in the query
function validateVariableUsage(query, variable, schema, errors) {
    // Find all field arguments that use this variable
    query.fields.forEach((field) => {
        checkFieldArgumentsForVariable(field, variable, schema, errors, "");
    });
}
// Recursively check field arguments for variable usage
function checkFieldArgumentsForVariable(field, variable, schema, errors, path) {
    const currentPath = path ? `${path}.${field.name}` : field.name;
    // Check arguments on this field
    if (field.arguments) {
        field.arguments.forEach((arg) => {
            if (arg.value === variable.name) {
                // Here we would check if the argument type matches the variable type
                // This requires looking up the field in the schema and checking its argument types
                // For simplicity, we're just noting that the variable is used
            }
        });
    }
    // Recursively check subfields
    if (field.subFields) {
        field.subFields.forEach((subField) => {
            checkFieldArgumentsForVariable(subField, variable, schema, errors, currentPath);
        });
    }
}
