import { Request as JWTRequest } from "express-jwt";
import JWTPayload from "../utils/jwt-payload.interface";
import { Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import { Tank } from "../models";
import { Types } from "mongoose";

const tankAPController = async (req: JWTRequest<JWTPayload>, res: Response) => {
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

  res.status(200).json({
    ap: tank.actionPoints,
    detail: `Successfully fetched AP count!`,
  });
};

export default tankAPController;
