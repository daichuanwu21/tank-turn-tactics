import { Request, Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import validator from "validator";
import { Tank, User } from "../models";
import { promisify } from "util";
import { pbkdf2, timingSafeEqual } from "crypto";
import { sign } from "jsonwebtoken";
import config from "../config";

const loginController = async (req: Request, res: Response) => {
  // Ensure all fields are present (email, password)
  const result = messageOnlyValidationResult(req);
  if (!result.isEmpty()) {
    throw new APIError(StatusCodes.UNAUTHORIZED, result.array()[0], true);
  }

  // Normalise email before querying database
  const normalizedEmail = validator.normalizeEmail(req.body.email) as string; // can assume string as email has already passed validation

  // Check if user exists in database
  const user = await User.findOne({ email: normalizedEmail }).lean();
  if (!user) {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect username or password supplied!",
      true
    );
  }

  // Extract password hash and salt from DB
  const passwordSalt = Buffer.from(user.passwordSalt, "base64");
  const passwordHashDB = Buffer.from(user.passwordHash, "base64");

  // Hash submitted password
  const passwordHashSubmitted = await promisify(pbkdf2)(
    req.body.password,
    passwordSalt,
    250000,
    256,
    "sha512"
  );

  // Timing-safe check for equality between hashes
  if (!timingSafeEqual(passwordHashDB, passwordHashSubmitted)) {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect username or password supplied!",
      true
    );
  }

  // Check if user has verified their email address
  if (!user.emailVerified) {
    throw new APIError(
      StatusCodes.FORBIDDEN,
      "You need to verify your email first!",
      true
    );
  }

  const tank = await Tank.findOne({ userId: user._id }).lean();
  if (!tank) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Tank-user relationship broken, potentially inconsistent state!",
      false
    );
  }

  const token = await promisify(sign as any)(
    {
      userId: user._id.toString(),
    },
    config.jwtSecret,
    { algorithm: "HS512" }
  );

  res.status(200).json({
    token,
    email: user.email,
    userId: user._id.toString(),
    tankId: tank._id.toString(),
  });
};

export default loginController;
