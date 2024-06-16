# typebox-validation-util example with express

## Setup

- Install by running `yarn`
- Start the express server with `yarn start`
- Run a invalid sample request with `curl 'localhost:3000/login?name=test@example,com&password=1234567'`
  - The validation should fail since we expect an email for the name and a
    password with length of at least 8 chars. Something like the following log
    should be shown for the server:

```

Got error with stack:  Error: schema: {"format":"email","type":"string"} msg: Expected string to match 'email' format path: /name value: "test@example,com". schema: {"minLength":8,"type":"string"} msg: Expected string length greater or equal to 8 path: /password value: "1234567"
    at validateData (/home/xddq/... imagine rest of stack here)

```

- You should get the response: `{"message":"server error"}`

- Run a valid sample request with `curl 'localhost:3000/login?name=test@example.com&password=12345678'`
  - No error since validation passes. You get the query params as return `{"name":"test@example.com","password":"12345678"}`.
