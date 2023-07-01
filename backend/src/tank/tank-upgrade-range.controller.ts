import { Request as JWTRequest } from "express-jwt";
import JWTPayload from "../user/jwt-payload.interface";
import { Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import { Tank } from "../models";
import { Types } from "mongoose";

const tankUpgradeRangeController = async (
  req: JWTRequest<JWTPayload>,
  res: Response
) => {
  req.auth = req.auth as JWTPayload;

  // Check if tank exists in database
  const tank = await Tank.findOne({
    userId: new Types.ObjectId(req.auth.userId),
  });
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

  // Check if tank has enough AP
  if (tank.actionPoints < 3) {
    throw new APIError(
      StatusCodes.BAD_REQUEST,
      "You do not have enough AP to perform this action!",
      true
    );
  }

  // Deduct AP
  tank.actionPoints = tank.actionPoints - 3;

  // Upgrade range
  tank.range = tank.range + 1;

  // Save target tank and shooter tank
  await tank.save();

  // TODO: announce range change

  res.status(200).json({
    detail: `You now have a range of ${tank.range}`,
  });
};

export default tankUpgradeRangeController;
