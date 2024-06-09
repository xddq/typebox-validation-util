import { type TSchema } from "@sinclair/typebox";
import { Value, type ValueError } from "@sinclair/typebox/value";
import { TypeCompiler, type TypeCheck } from "@sinclair/typebox/compiler";
// sets up string formats
import "./formats";

// const CUT_AFTER_X_ERRORS = 1;
const CUT_AFTER_X_ERRORS = 10;

const cachedSchemas = new Map<string, TypeCheck<any>>();

export const getCompiledSchema = <T extends TSchema>(
  schema: T,
  references: TSchema[] = [],
) => {
  if (schema.$id === undefined) {
    return TypeCompiler.Compile(schema, references);
  }

  const cachedSchema = cachedSchemas.get(schema.$id);
  if (cachedSchema === undefined) {
    const compiledSchema = TypeCompiler.Compile(schema, references);
    cachedSchemas.set(schema.$id, compiledSchema);
    return compiledSchema;
  }
  return cachedSchema as TypeCheck<T>;
};

/**
 * TODO: comment this
 */
export const validateData = <T extends TSchema>(
  data: unknown,
  schema: T,
  references: TSchema[] = [],
) => {
  const compiledSchema = getCompiledSchema(schema, references);
  if (compiledSchema.Check(data)) {
    return data;
  }
  const errors = Value.Errors(schema, references, data);
  const errMessages: string[] = [];
  let idx = 0;
  for (const err of errors) {
    if (idx === 0) {
      errMessages.push(makeError(err, true));
    } else if (idx === CUT_AFTER_X_ERRORS) {
      // Some error reporting platforms (e.g. sentry) can set error length
      // limitations. To avoid this, cut after 10 errors. Note: This is not set
      // in stone. Perhaps make this configurable if it yields issues.
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

/**
 * Creates user-readable error with all infos necessary to investigate the
 * error.
 */
const makeError = (err: ValueError, first = false) => {
  if (first) {
    return `schema: ${JSON.stringify(err.schema)} ${err.message} path: ${err.path} value: ${JSON.stringify(err.value)}`;
  }
  return `${err.message} path: ${err.path} value: ${JSON.stringify(err.value)}`;
};
