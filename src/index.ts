import { ValueError } from "@sinclair/typebox/build/cjs/errors";
import { Type, Value, type Static } from "./validation";
import "./formats";

const LoginInputSchema = Type.Object({
  name: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});
type LoginInputSchema = Static<typeof LoginInputSchema>;

// const CUT_AFTER_X_ERRORS = 1;
const CUT_AFTER_X_ERRORS = 10;

// {"type":49,"schema":{"format":"email","type":"string"},"path":"/name","value":"test","message":"Unknown format 'email'"}
// {"type":52,"schema":{"minLength":8,"type":"string"},"path":"/password","value":"test","message":"Expected string length greater or equal to 8"}

const demo = () => {
  const data = { name: "test@example,org", password: "123456" };
  // successfully validated
  if (Value.Check(LoginInputSchema, [], data)) {
    return data;
  }
  const errors = Value.Errors(LoginInputSchema, [], data);
  // const firstErr = errors.First() as ValueError;
  // const err = new Error(
  //   '"Expected string length greater or equal to 8" with schema: {"format":"email","type":"string"} at path "/name" for value "test"',
  // );
  let errMessages: string[] = [];
  let idx = 0;
  for (const err of errors) {
    if (idx === 0) {
      errMessages.push(makeError(err, true));
    } else if (idx === CUT_AFTER_X_ERRORS) {
      // some error reporting platforms (e.g. sentry) can set error length
      // limitations. To avoid this, cut after 10 errors. Note: This is not set
      // in stone :]
      errMessages.push(
        `Did cut the error message after ${CUT_AFTER_X_ERRORS} errors to avoid ending up with a huge error string`,
      );
    } else {
      errMessages.push(makeError(err));
    }
    idx = idx + 1;
  }
  throw new Error(errMessages.join(". "));
};

const makeError = (err: ValueError, first = false) => {
  if (first) {
    return `${err.message} schema: ${JSON.stringify(err.schema)} path: ${err.path} value: ${JSON.stringify(err.value)}`;
  }
  return `${err.message} path: ${err.path} value: ${JSON.stringify(err.value)}`;
};

// main without util
const main = () => {
  try {
    demo();
  } catch (e) {
    if (e instanceof Error) {
      console.log(JSON.stringify(e.message, null, 2));
      // console.log(JSON.stringify(e.stack, null, 2));
    }
  }
};

main();
