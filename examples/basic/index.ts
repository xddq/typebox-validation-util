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
