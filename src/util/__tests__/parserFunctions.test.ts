import parseSchema, { parseTypeRef } from "../../util/parserFunctions";
import { GraphQLTypeRef } from "../../types/types";

describe("parseSchema", () => {
  test("should parse introspection result into GraphQLSchema", () => {
    // Mock introspection result (simplified example)
    const mockIntrospectionResult = {
      types: [
        {
          kind: "OBJECT",
          name: "Query",
          fields: [
            {
              name: "country",
              type: {
                kind: "OBJECT",
                name: "Country",
                ofType: null,
              },
            },
          ],
        },
        {
          kind: "OBJECT",
          name: "Country",
          fields: [
            {
              name: "name",
              type: {
                kind: "NON_NULL",
                name: null,
                ofType: {
                  kind: "SCALAR",
                  name: "String",
                },
              },
            },
          ],
        },
      ],
    };

    // Parse the schema
    const parsedSchema = parseSchema(mockIntrospectionResult);

    // Check the structure
    expect(parsedSchema.types.length).toBe(2);

    // Check Query type
    const queryType = parsedSchema.types.find((t) => t.name === "Query");
    expect(queryType).toBeDefined();
    expect(queryType?.kind).toBe("OBJECT");
    expect(queryType?.fields?.length).toBe(1);
    expect(queryType?.fields?.[0].name).toBe("country");

    // Check Country type
    const countryType = parsedSchema.types.find((t) => t.name === "Country");
    expect(countryType).toBeDefined();
    expect(countryType?.kind).toBe("OBJECT");
    expect(countryType?.fields?.length).toBe(1);
    expect(countryType?.fields?.[0].name).toBe("name");
  });

  test("should handle empty fields in types", () => {
    const mockIntrospectionResult = {
      types: [
        {
          kind: "SCALAR",
          name: "String",
          // No fields for scalar types
        },
      ],
    };

    const parsedSchema = parseSchema(mockIntrospectionResult);
    expect(parsedSchema.types.length).toBe(1);
    const stringType = parsedSchema.types[0];
    expect(stringType.name).toBe("String");
    expect(stringType.kind).toBe("SCALAR");
    expect(stringType.fields).toBeUndefined();
  });

  test("should handle null values in types", () => {
    const mockIntrospectionResult = {
      types: [
        {
          kind: "ENUM",
          name: "TestEnum",
          fields: null,
        },
      ],
    };

    const parsedSchema = parseSchema(mockIntrospectionResult);
    expect(parsedSchema.types.length).toBe(1);
    const enumType = parsedSchema.types[0];
    expect(enumType.name).toBe("TestEnum");
    expect(enumType.kind).toBe("ENUM");
    expect(enumType.fields).toBeUndefined();
  });
});

describe("parseTypeRef", () => {
  test("should parse a simple type reference", () => {
    const typeRef = {
      kind: "SCALAR",
      name: "String",
      ofType: null,
    };

    const parsedTypeRef = parseTypeRef(typeRef);
    expect(parsedTypeRef.kind).toBe("SCALAR");
    expect(parsedTypeRef.name).toBe("String");
    expect(parsedTypeRef.ofType).toBeUndefined();
  });

  test("should parse a NON_NULL type reference", () => {
    const typeRef = {
      kind: "NON_NULL",
      name: null,
      ofType: {
        kind: "SCALAR",
        name: "String",
        ofType: null,
      },
    };

    const parsedTypeRef = parseTypeRef(typeRef);
    expect(parsedTypeRef.kind).toBe("NON_NULL");
    expect(parsedTypeRef.name).toBeNull();
    expect(parsedTypeRef.ofType).toBeDefined();
    expect(parsedTypeRef.ofType?.kind).toBe("SCALAR");
    expect(parsedTypeRef.ofType?.name).toBe("String");
  });

  test("should parse a LIST type reference", () => {
    const typeRef = {
      kind: "LIST",
      name: null,
      ofType: {
        kind: "OBJECT",
        name: "Country",
        ofType: null,
      },
    };

    const parsedTypeRef = parseTypeRef(typeRef);
    expect(parsedTypeRef.kind).toBe("LIST");
    expect(parsedTypeRef.name).toBeNull();
    expect(parsedTypeRef.ofType).toBeDefined();
    expect(parsedTypeRef.ofType?.kind).toBe("OBJECT");
    expect(parsedTypeRef.ofType?.name).toBe("Country");
  });

  test("should parse deeply nested type references", () => {
    // NON_NULL LIST of NON_NULL String
    const typeRef = {
      kind: "NON_NULL",
      name: null,
      ofType: {
        kind: "LIST",
        name: null,
        ofType: {
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        },
      },
    };

    const parsedTypeRef = parseTypeRef(typeRef);
    expect(parsedTypeRef.kind).toBe("NON_NULL");
    expect(parsedTypeRef.ofType?.kind).toBe("LIST");
    expect(parsedTypeRef.ofType?.ofType?.kind).toBe("NON_NULL");
    expect(parsedTypeRef.ofType?.ofType?.ofType?.kind).toBe("SCALAR");
    expect(parsedTypeRef.ofType?.ofType?.ofType?.name).toBe("String");
  });
});
