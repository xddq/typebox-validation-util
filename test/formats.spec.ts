import { describe, it } from "@jest/globals";
import { validateData } from "../src/index";
import { Static, Type } from "@sinclair/typebox";

describe("when validating string formats", () => {
  // all string formats that are expected to be automatically set up by this
  // library should be added here.
  const stringFormatTestData: Array<string> = ["email", "ipv4"];
  it.each(stringFormatTestData)("validates against '%s' format", (format) => {
    // Part of the default error message when typebox wants to validate
    // against a string format that was not manually set up.
    const regex = new RegExp(`Unknown format '${format}'`);
    const schema = Type.Object({ stringValue: Type.String({ format }) });
    const data: Static<typeof schema> = { stringValue: "anythingReally" };
    expect(() => validateData(data, schema)).not.toThrow(regex);
  });
});
