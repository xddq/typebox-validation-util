import { Type } from "@sinclair/typebox";
import { validateData } from "typebox-validation-util";
import { ErrorRequestHandler, Request, Response } from "express";
import express from "express";

const LoginInputSchema = Type.Object(
  {
    name: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
  },
  { $id: "LoginInputSchema" },
);

export const app = express();
app.use(express.json());

app.get("/login", (req: Request, res: Response) => {
  const data = validateData(req.query, LoginInputSchema);
  res.status(200).json(data);
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Got error with stack: ", err.stack);
  res.status(500).json({ message: "server error" });
};

app.use(errorHandler);

const main = () => {
  app.listen(3000, () => {
    console.log("server listening on port 3000");
  });
};

main();
