import { describe, it } from "@jest/globals";
import { Static, Type } from "@sinclair/typebox";
import { validateData } from "../src/validation";
import { supportedFormats } from "../src/formats";

describe("when validating string formats", () => {
  // all string formats that are expected to be automatically set up by this
  // library should be added here.
  const formats = Object.keys(supportedFormats);
  it.each(formats)("validates against '%s' format", (format) => {
    // Part of the default error message when typebox wants to validate
    // against a string format that was not manually set up.
    const regex = new RegExp(`Unknown format '${format}'`);
    const schema = Type.Object({ stringValue: Type.String({ format }) });
    const data: Static<typeof schema> = { stringValue: "anythingReally" };
    expect(() => {
      return validateData(data, schema);
    }).not.toThrow(regex);
  });
});
