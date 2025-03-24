import {
  mapFieldToTypeScript,
  mapTypeReferenceToTypeScript,
  resolveTypeReference,
} from "../typeMapper";
import { mockSchema } from "../../__tests__/__mocks__/mockSchema";

describe("typeMapper functions", () => {
  test("should map scalar types to correct TypeScript types", () => {
    const stringType = {
      kind: "SCALAR",
      name: "String",
      ofType: null,
    };

    const idType = {
      kind: "SCALAR",
      name: "ID",
      ofType: null,
    };

    const intType = {
      kind: "SCALAR",
      name: "Int",
      ofType: null,
    };

    expect(mapTypeReferenceToTypeScript(mockSchema, stringType)).toBe("string");
    expect(mapTypeReferenceToTypeScript(mockSchema, idType)).toBe("string");
    expect(mapTypeReferenceToTypeScript(mockSchema, intType)).toBe("number");
  });

  test("should correctly map non-null types", () => {
    const nonNullStringType = {
      kind: "NON_NULL",
      name: null,
      ofType: {
        kind: "SCALAR",
        name: "String",
        ofType: null,
      },
    };

    expect(mapTypeReferenceToTypeScript(mockSchema, nonNullStringType)).toBe(
      "string"
    );
  });

  test("should correctly map list types", () => {
    const stringListType = {
      kind: "LIST",
      name: null,
      ofType: {
        kind: "SCALAR",
        name: "String",
        ofType: null,
      },
    };

    expect(mapTypeReferenceToTypeScript(mockSchema, stringListType)).toBe(
      "string[]"
    );
  });

  test("should resolve type references correctly", () => {
    const countryTypeRef = {
      kind: "OBJECT",
      name: "Country",
      ofType: null,
    };

    const resolvedType = resolveTypeReference(mockSchema, countryTypeRef);
    expect(resolvedType?.name).toBe("Country");
    expect(resolvedType?.kind).toBe("OBJECT");
  });
});
