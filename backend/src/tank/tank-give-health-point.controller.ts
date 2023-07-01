import { Request as JWTRequest } from "express-jwt";
import JWTPayload from "../utils/jwt-payload.interface";
import { Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import mongoose, { Types } from "mongoose";
import { Tank } from "../models";

const tankGiveHealthPointController = async (
  req: JWTRequest<JWTPayload>,
  res: Response
) => {
  // Ensure all fields are present (targetTankId)
  const result = messageOnlyValidationResult(req);
  if (!result.isEmpty()) {
    throw new APIError(StatusCodes.BAD_REQUEST, result.array()[0], true);
  }

  // Start transaction
  await mongoose.connection.transaction(
    async (session) => {
      req.auth = req.auth as JWTPayload;
      // Check if tank exists in database
      const tank = await Tank.findOne({
        userId: new Types.ObjectId(req.auth.userId),
      }).session(session);
      if (!tank) {
        throw new APIError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Tank not found by userId! Potentially inconsistent state!",
          false
        );
      }

      // Check if tank is dead
      if (tank.healthPoints <= 0) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "You cannot perform this action while you are dead!",
          true
        );
      }

      // Check if tank has enough health to give without dying
      if (tank.healthPoints < 2) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "You do not have enough health to give!",
          true
        );
      }

      // Find target tank in range
      const targetTank = await Tank.findOne({
        positionX: {
          $gte: tank.positionX - tank.range,
          $lte: tank.positionX + tank.range,
        },
        positionY: {
          $gte: tank.positionY - tank.range,
          $lte: tank.positionY + tank.range,
        },
        _id: new Types.ObjectId(req.body.targetTankId),
      }).session(session);
      if (!targetTank) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Target tank not found in range!",
          true
        );
      }

      // Deduct HP
      tank.healthPoints = tank.healthPoints - 1;

      // Add HP to target
      targetTank.healthPoints = targetTank.healthPoints + 1;

      // Save target tank and giver tank
      await Promise.all([tank.save({ session }), targetTank.save({ session })]);

      // TODO: announce health changes

      res.status(200).json({
        detail: `You've given another tank 1 HP.`,
      });
    },
    {
      readPreference: "primary",
      readConcern: "majority",
      writeConcern: { w: "majority" },
    }
  );
};

export default tankGiveHealthPointController;
