import { ResultFactory, validationResult } from "express-validator";
const messageOnlyValidationResult: ResultFactory<string> =
  validationResult.withDefaults({
    formatter: (error) => error.msg,
  });

export default messageOnlyValidationResult;
