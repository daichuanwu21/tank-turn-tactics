import { Router } from "express";
import { checkSchema, param } from "express-validator";
import asyncWrapper from "../utils/async-wrapper.function";
import registerController from "./register.controller";
import verifyEmailController from "./verify-email.controller";
import loginController from "./login.controller";

const userRouter = Router();

userRouter.post(
  "/register",
  checkSchema({
    invite_code: {
      notEmpty: true,
      errorMessage: "Invalid invite code supplied!",
    },
    email: {
      isEmail: true,
      errorMessage: "Invalid email supplied!",
    },
    password: {
      isLength: {
        options: { min: 8, max: 1000 },
      },
      errorMessage: "Password must be at least 8 characters long!",
    },
  }),
  asyncWrapper(registerController)
);

userRouter.get(
  "/verify-email/:userId",
  param("userId")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Invalid verification code supplied!"),
  asyncWrapper(verifyEmailController)
);

userRouter.post(
  "/login",
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: "Incorrect username or password supplied!",
    },
    password: {
      isLength: {
        options: { min: 8, max: 1000 },
      },
      errorMessage: "Incorrect username or password supplied!",
    },
  }),
  asyncWrapper(loginController)
);

export default userRouter;
