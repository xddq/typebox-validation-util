# typebox-validation-util example

## Setup

- Install by running `yarn`
- Start the program with `yarn start`
- You should get a console output like that:

```

validated data successfully:  {
  "name": "test@example.org",
  "password": "12345678"
}
error message:  "schema: {\"format\":\"email\",\"type\":\"string\"} msg: Expected string to match 'email' format path: /name value: \"test@example,org\". schema: {\"minLength\":8,\"type\":\"string\"} msg: Expected string length greater or equal to 8 path: /password value: \"1234567\""
error stack:  "Error: schema: {\"format\":\"email\",\"type\":\"string\"} msg: Expected string to match 'email' format path: /name value: \"test@example,org\". schema: {\"minLength\":8,\"type\":\"string\"} msg: Expected string length greater or equal to 8 path: /password value: \"1234567\"\n    at validateData (/home/xddq/... imagine rest of stack here

```
