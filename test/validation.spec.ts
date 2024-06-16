import { describe, it } from "@jest/globals";
import { Type } from "@sinclair/typebox";
import { CUT_AFTER_X_ERRORS, validateData } from "../src/validation";
import { TypeCompiler } from "@sinclair/typebox/compiler";

describe("when validating", () => {
  it("validates valid data", () => {
    const schema = Type.Object({ name: Type.String() });
    const data = { name: "test" };
    expect(() => {
      return validateData(data, schema);
    }).not.toThrow();
  });
  it("throws on invalid data", () => {
    const schema = Type.Object({ name: Type.String() });
    const data = { name: 1 };
    expect(() => {
      return validateData(data, schema);
    }).toThrow();
  });
  describe("when handling invalid data", () => {
    it(`the resulting error is cut after ${CUT_AFTER_X_ERRORS} errors`, () => {
      const schema = Type.Array(Type.Object({ name: Type.String() }));
      const data = Array.from({ length: CUT_AFTER_X_ERRORS + 1 }, (_, idx) => {
        return { name: idx };
      });
      try {
        validateData(data, schema);
        fail("should have thrown");
      } catch (err) {
        if (!(err instanceof Error)) {
          fail("expected instance of Error");
        }
        const matches = err.message.match(/schema: /g) ?? [];
        expect(matches.length).toBe(CUT_AFTER_X_ERRORS);
      }
    });
  });
  it("uses cached schema for subsequent validations", () => {
    const spy = jest.spyOn(TypeCompiler, "Compile");
    expect(spy).toHaveBeenCalledTimes(0);

    const schema = Type.Object({ name: Type.String() });
    const data = { name: "test" };
    expect(() => {
      return validateData(data, schema);
    }).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(1);

    // The compiled schema is expected to be cached after the first validateData
    // call for each schema. Therefore `TypeCompiler.Compile` should not be
    // called for subsequent calls to validateData.
    expect(() => {
      return validateData(data, schema);
    }).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(() => {
      return validateData(data, schema);
    }).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
