// @file Typebox does not register the "officially supported" string formats of JSON Schema
// draft-07 by default. This file adds commonly used formats.
// see: https://json-schema.org/understanding-json-schema/reference/string#built-in-formats
// see: https://github.com/sinclairzx81/typebox/issues/879
import { FormatRegistry } from "@sinclair/typebox";

// format regexes are currently taken from ajv, to be precise the ajv-formats package.
// src: https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts#L1
const supportedFormats = {
  email:
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
};

Object.entries(supportedFormats).map(([format, regex]) => {
  FormatRegistry.Set(format, (value) => regex.test(value));
});
