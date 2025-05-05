export default function parseSchema(introspectionResult) {
    const schema = {
        types: introspectionResult.types.map((type) => ({
            kind: type.kind,
            name: type.name,
            fields: type.fields?.map((field) => ({
                name: field.name,
                type: parseTypeRef(field.type),
            })),
        })),
    };
    return schema;
}
// Helper function to parse type references
export function parseTypeRef(typeRef) {
    return {
        kind: typeRef.kind,
        name: typeRef.name,
        ofType: typeRef.ofType ? parseTypeRef(typeRef.ofType) : undefined,
    };
}
