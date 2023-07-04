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
import emailTransporter from "../utils/mailer.nodemailer";

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

  const verifyAddress = `${
    config.endpoint
  }/user/verify-email/${user._id.toString()}`;
  await emailTransporter.sendMail({
    from: config.emailSenderAddress,
    to: normalizedEmail,
    subject: "Verify your email address at Tank Turn Tactics",
    text: `Hello, if you have not made an account at TTT, please disregard this email. To verify your account, head to: ${verifyAddress}`,
    html: `<h1>Verify your email address at TTT</h1>

    <h3>If you have not made an account at TTT, please disregard this email.</h3>
    
    <p>&nbsp;</p>
    
    <p>Hello! You&#39;ve made an account at TTT, and have thereby chosen to begin ruining your friendships!</p>
    
    <p>To get started, head <a href="${verifyAddress}">here to verify your email.</a></p>
    
    <p>&nbsp;</p>
    
    <p>If you cannot click the link, you may paste the following link into your browser: ${verifyAddress}</p>
    `,
  });

  res.status(200).json({
    detail:
      "Account successfully created! Please check your inbox (and junk mail) for a verification email.",
  });
};

export default registerController;
