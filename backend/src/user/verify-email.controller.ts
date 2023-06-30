import { Request, Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import { Tank, User } from "../models";
import mongoose from "mongoose";
import { ITankSchema } from "../tank/tank.schema";
import { promisify } from "util";
import { randomInt } from "crypto";
import config from "../config";
import logger from "../logger";

const getRandomPosition = async (): Promise<[number, number]> => {
  const positionX = await promisify(randomInt as any)(0, config.gridXSize);
  const positionY = await promisify(randomInt as any)(0, config.gridYSize);

  return [positionX, positionY];
};

const verifyEmailController = async (req: Request, res: Response) => {
  // Ensure userId param is present
  const result = messageOnlyValidationResult(req);
  if (!result.isEmpty()) {
    throw new APIError(StatusCodes.BAD_REQUEST, result.array()[0], true);
  }

  // Start transaction
  await mongoose.connection.transaction(
    async (session) => {
      // Check if user exists in database
      const user = await User.findById(req.params.userId).session(session);
      if (!user) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Invalid verification code supplied!",
          true
        );
      }

      // Check if email is already verified
      if (user.emailVerified) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Email already verified!",
          true
        );
      }

      // Mark user as verified
      user.emailVerified = true;
      await user.save({ session });

      // Generate random position for new tank
      let [positionX, positionY] = await getRandomPosition();

      // Keep finding new positions until an empty position is found
      let existingTank = await Tank.findOne({ positionX, positionY }).session(
        session
      );
      while (existingTank) {
        [positionX, positionY] = await getRandomPosition();

        existingTank = await Tank.findOne({ positionX, positionY }).session(
          session
        );
      }

      // Create tank with 3 HP, range of 2, and 0 AP at a random location on the grid
      const tank = new Tank<ITankSchema>({
        healthPoints: 3,
        actionPoints: 0,
        range: 2,
        positionX,
        positionY,
        userId: user._id,
      });

      await tank.save({ session });

      // TODO: announce to rest of program new tank has been created

      res.status(200).json({
        detail: `Account ${user.email} successfully verified!`,
      });
    },
    {
      readPreference: "primary",
      readConcern: "majority",
      writeConcern: { w: "majority" },
    }
  );
};

export default verifyEmailController;
