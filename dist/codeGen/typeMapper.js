/**
 * Maps a GraphQL field to a TypeScript type
 */
export function mapFieldToTypeScript(schema, parentType, field) {
    // Find the field definition in the schema
    const schemaField = parentType.fields?.find((f) => f.name === field.name);
    if (!schemaField) {
        return "any";
    }
    // If there are subfields, it's an object type
    if (field.subFields && field.subFields.length > 0) {
        return mapObjectFieldToTypeScript(schema, schemaField.type, field);
    }
    // Otherwise, map the schema type to TypeScript
    return mapTypeReferenceToTypeScript(schema, schemaField.type);
}
/**
 * Maps an object field with subfields to a TypeScript type
 */
function mapObjectFieldToTypeScript(schema, typeRef, field) {
    // Get the field's type from the schema
    const fieldType = resolveTypeReference(schema, typeRef);
    if (!fieldType) {
        return "any";
    }
    // Build an inline object type with all subfields
    let objectType = "{\n";
    for (const subField of field.subFields || []) {
        const subFieldType = mapFieldToTypeScript(schema, fieldType, subField);
        objectType += `  ${subField.name}: ${subFieldType};\n`;
    }
    objectType += "}";
    // Check if it's a list type
    const isListType = isListTypeReference(typeRef);
    return isListType ? `${objectType}[]` : objectType;
}
/**
 * Maps a GraphQL type reference to a TypeScript type
 */
export function mapTypeReferenceToTypeScript(schema, typeRef) {
    // For non-null and list types, we need to go deeper
    if (typeRef.kind === "NON_NULL") {
        return typeRef.ofType
            ? mapTypeReferenceToTypeScript(schema, typeRef.ofType)
            : "any";
    }
    const isListType = typeRef.kind === "LIST";
    if (isListType) {
        const itemType = typeRef.ofType
            ? mapTypeReferenceToTypeScript(schema, typeRef.ofType)
            : "any";
        return `${itemType}[]`;
    }
    // For named types, map to TypeScript equivalents
    if (typeRef.name) {
        return mapNamedTypeToTypeScript(typeRef.name);
    }
    return "any";
}
/**
 * Maps a named GraphQL type to TypeScript
 */
function mapNamedTypeToTypeScript(typeName) {
    if (!typeName)
        return "any";
    // Map scalar types
    switch (typeName) {
        case "ID":
            return "string";
        case "String":
            return "string";
        case "Int":
        case "Float":
            return "number";
        case "Boolean":
            return "boolean";
        default:
            // For custom types, keep the same name
            return typeName;
    }
}
/**
 * Resolves a type reference to an actual GraphQL type
 */
export function resolveTypeReference(schema, typeRef) {
    // For non-null and list types, we need to go deeper
    if (typeRef.kind === "NON_NULL" || typeRef.kind === "LIST") {
        return typeRef.ofType
            ? resolveTypeReference(schema, typeRef.ofType)
            : undefined;
    }
    // For named types, look them up in the schema
    if (typeRef.name) {
        return schema.types.find((t) => t.name === typeRef.name);
    }
    return undefined;
}
/**
 * Checks if a type reference is a list type
 */
function isListTypeReference(typeRef) {
    // Direct list
    if (typeRef.kind === "LIST") {
        return true;
    }
    // Non-null wrapper around a list
    if (typeRef.kind === "NON_NULL" && typeRef.ofType?.kind === "LIST") {
        return true;
    }
    return false;
}
/**
 * Parses a GraphQL type string (used for variables)
 */
export function parseGraphQLTypeString(typeStr) {
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
/**
 * Maps a GraphQL type string to TypeScript
 */
export function mapGraphQLTypeStringToTypeScript(typeStr) {
    const { typeName, isList } = parseGraphQLTypeString(typeStr);
    // Map the base type
    const baseType = mapNamedTypeToTypeScript(typeName);
    // Add list modifier if needed
    return isList ? `${baseType}[]` : baseType;
}
