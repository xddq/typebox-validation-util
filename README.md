<h1 align="center">
    Typebox Validation Util
</h1>

<p align="center">
Fast and convenient data validation with typebox in a single line
</p>

<p align="center">
  <a href="https://github.com/xddq/typebox-validation-util/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="typebox-validation-util is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.org/package/typebox-validation-util">
    <img src="https://img.shields.io/npm/v/typebox-validation-util?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://github.com/xddq/typebox-validation-util/actions/workflows/buildAndTest.yaml">
    <img src="https://github.com/xddq/typebox-validation-util/actions/workflows/buildAndTest.yaml/badge.svg" alt="State of Github Action" />
  </a>
</p>

## Installation

When using yarn: `yarn add typebox-validation-util typebox@^0.32.31` or when
using npm: `npm i typebox-validation-util typebox@^0.32.31`

## Use Case

You want to validate unknown data in one of the fastest and most convenient
ways. You are using the excellent
[typebox](https://github.com/sinclairzx81/typebox) library and want to avoid any
unnecessary boilerplate.

## Features

typebox-validation-util implements convenient defaults for you so you don't have
to do extra manual work. This package:

- Gives you an easy and straight forward way to validate typebox data via **the
  only exported function of this package** `validateData`. 🌟
- Adds commonly used string formats such as `email` or `ipv4` to validate
  against. 🛠️
  - These would otherwise have to be added manually, see
    [here](https://github.com/sinclairzx81/typebox/issues/879) for the issue.
    Check the formats.ts file for what is added.
  - If you want any other formats added, feel free to create an issue and a
    followup PR.
- Yields best validation performance. 🚀
  - Fast validation is guaranteed by compiling the schema and validating data
    only against compiled schemas. The compiled schema is cached so that future
    validations don't have to repeat the compilation step.
  - To better understand the huge performance differences for compiled schemas,
    you can check out [this
    benchmark](https://moltar.github.io/typescript-runtime-type-benchmarks/). See
    '@sinclair/typebox-(just-in-time)' which e.g. is twice as fast as ajv when it
    comes to loose asertion.
- Uses _typical_ nodejs error handling by throwing an error if validating the
  data fails. ✅
  - The Error is a typical nodejs `Error`. It contains a `message` and `stack`
    with all required details for debugging the error in a readable manner.
  - By default typebox would return `ValueError` values after you specifically
    request them by calling a separate function after validating.

## Examples

```typescript
import { Type } from "@sinclair/typebox";
import { validateData } from "typebox-validation-util";

const LoginInputSchema = Type.Object({
  name: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});

const demo = () => {
  // this will pass without errors
  const invalidatedData = {
    name: "test@example.org",
    password: "12345678",
  } as unknown;
  const data = validateData(invalidatedData, LoginInputSchema);
  console.log("validated data successfully: ", JSON.stringify(data, null, 2));

  // this will throw an error
  const invalidatedData2 = {
    name: "test@example,org",
    password: "1234567",
  } as unknown;
  const data2 = validateData(invalidatedData2, LoginInputSchema);
  console.log("validated data successfully: ", JSON.stringify(data2, null, 2));
};

const main = () => {
  try {
    // any application code here
    demo();
  } catch (e) {
    // centralized error handling here
    if (e instanceof Error) {
      console.log("error message: ", JSON.stringify(e.message, null, 2));
      console.log("error stack: ", JSON.stringify(e.stack, null, 2));
    }
  }
};

main();
```

The output of the example program given above is the following:

```

validated data successfully:  {
  "name": "test@example.org",
  "password": "12345678"
}

error message:  "schema: {\"format\":\"email\",\"type\":\"string\"} Expected string to match 'email' format path: /name value: \"test@example,org\". Expected string length greater or equal to 8 path: /password value: \"1234567\""
error stack:  "Error: schema: {\"format\":\"email\",\"type\":\"string\"} Expected string to match 'email' format path: /name value: \"test@example,org\". Expected string length greater or equal to 8 path: /password value: \"1234567\"\n    at validateData (/home/xddq/progproj ... imagine rest of stack here)

```

For more examples check out the examples folder.

## DEV/CONTRIBUTOR NOTES

If you have an idea or want to help implement something, feel free to do so.
Please always start by creating an issue to avoid any unnecessary work on
either side.

Please always create tests for new features that are implemented. This will
decrease mental overhead for reviewing and developing in the long run.

### Dev Quickstart

- `yarn`
- `corepack enable`

### Code Coverage

TODO:

- add tests
- add code coveage stuff.

## Similar Projects

- [typebox-validators](https://github.com/jtlapp/typebox-validators) which adds
  some additional functionality to the validation but keeps the error handling
  similar to the approach of typebox.

## Template Repo

Template for this repo was taken from [here](https://github.com/xddq/nodejs-typescript-modern-starter).
