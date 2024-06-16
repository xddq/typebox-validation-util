import { type TSchema } from "@sinclair/typebox";
import { Value, type ValueError } from "@sinclair/typebox/value";
import { TypeCompiler, type TypeCheck } from "@sinclair/typebox/compiler";

export const CUT_AFTER_X_ERRORS = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cachedSchemas = new Map<TSchema, TypeCheck<any>>();

const getCompiledSchema = <T extends TSchema>(
  schema: T,
  references: TSchema[] = []
) => {
  const cachedSchema = cachedSchemas.get(schema);
  if (cachedSchema === undefined) {
    const compiledSchema = TypeCompiler.Compile(schema, references);
    cachedSchemas.set(schema, compiledSchema);
    return compiledSchema;
  }
  return cachedSchema as TypeCheck<T>;
};

/**
 * Validates the given data based on the given schema and its possibly required
 * references. For highly improved validation speed the given schema will be
 * compiled for validation. The compilation step is costly and therefore cached
 * in-memory after the first validation for every schema.
 *
 * @throws Error If the validation fails. The error contains all required
 * information to investigate the reason of failure. The '.message' attribute
 * contains one complete error message for each validation failure that occured.
 * The error messages are separated by '. '. The '.stack' attribute contains the
 * content of the '.message' attribute and the stack trace for the error.
 */
export const validateData = <T extends TSchema>(
  data: unknown,
  schema: T,
  references: TSchema[] = []
) => {
  const compiledSchema = getCompiledSchema(schema, references);
  if (compiledSchema.Check(data)) {
    return data;
  }
  const errors = Value.Errors(schema, references, data);
  const errMessages: string[] = [];
  let idx = 0;
  for (const err of errors) {
    // Restrict size of resulting error message to avoid some out of memory
    // issues where big payloads (e.g. lists with many elements) get evaluated
    // and a specific part of the schema fails against all of them.
    if (idx === CUT_AFTER_X_ERRORS) {
      errMessages.push(
        `Did cut the error message after ${CUT_AFTER_X_ERRORS} errors trying to avoid out of memory issues when having many errors.`
      );
      break;
    }
    errMessages.push(makeError(err));
    idx = idx + 1;
  }
  throw new Error(errMessages.join(". "));
};

/**
 * Creates user-readable error with all infos necessary to investigate the
 * error.
 */
const makeError = (err: ValueError) => {
  return `schema: ${JSON.stringify(err.schema)} msg: ${err.message} path: ${
    err.path
  } value: ${JSON.stringify(err.value)}`;
};
