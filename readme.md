1. ts to define json schema/validation with typebox.

import {getValidator} from "typebox-validation-util"
// compiles schemas, throws on error
validationUtil.prepareValidation({A: ValidatorA, B: ValidatorB})

type X = {
[string]: TSchema
}

const validations
getValidator().prepareValidations({LoginInputSchema, BSchema})
// throws if validation was not prepared..?
getValidator().getValidation("LoginInputSchema")
