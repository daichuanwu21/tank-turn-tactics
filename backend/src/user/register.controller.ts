import { Request, Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import validator from "validator";
import config from "../config";
import { User } from "../models";
import { promisify } from "util";
import { pbkdf2, randomBytes } from "crypto";
import { IUserSchema } from "./user.schema";

const registerController = async (req: Request, res: Response) => {
  // Ensure all fields are present (email, password, invite_code)
  const result = messageOnlyValidationResult(req);
  if (!result.isEmpty()) {
    throw new APIError(StatusCodes.BAD_REQUEST, result.array()[0], true);
  }

  // Check for correct invite code
  if (req.body.invite_code !== config.inviteCode) {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect invite code!",
      true
    );
  }

  // Normalise email
  const normalizedEmail = validator.normalizeEmail(req.body.email) as string; // can assume string as email has already passed validation

  // Check for whitelisted email domain
  if (normalizedEmail.split("@")[1] !== config.whitelistedEmailDomain) {
    throw new APIError(StatusCodes.FORBIDDEN, "Email not in whitelist!", true);
  }

  // Check for existing user with same email address
  const existingUser = await User.findOne({ email: normalizedEmail }).lean();
  if (existingUser) {
    throw new APIError(
      StatusCodes.BAD_REQUEST,
      "A user with the email address supplied already exists!",
      true
    );
  }

  // Hash password
  const passwordSalt = await promisify(randomBytes)(32);
  const passwordHash = await promisify(pbkdf2)(
    req.body.password,
    passwordSalt,
    250000,
    256,
    "sha512"
  );

  // Save user to database
  const user = new User<IUserSchema>({
    email: normalizedEmail,
    emailVerified: false,
    passwordHash: passwordHash.toString("base64"),
    passwordSalt: passwordSalt.toString("base64"),
    creationDate: new Date(),
  });
  await user.save();

  // TODO: send verification email

  res.status(200).json({
    detail:
      "Account successfully created! Please check your inbox for a verification email.",
  });
};

export default registerController;
