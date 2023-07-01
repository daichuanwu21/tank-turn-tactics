import { Request as JWTRequest } from "express-jwt";
import JWTPayload from "../user/jwt-payload.interface";
import { Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import { Tank } from "../models";

const tankAddHealthPointController = async (
  req: JWTRequest<JWTPayload>,
  res: Response
) => {
  // Ensure all fields are present (tankId, targetTankId)
  const result = messageOnlyValidationResult(req);
  if (!result.isEmpty()) {
    throw new APIError(StatusCodes.BAD_REQUEST, result.array()[0], true);
  }

  // Check if specified tank exists in database
  const tank = await Tank.findById(req.params.tankId);
  if (!tank) {
    throw new APIError(
      StatusCodes.BAD_REQUEST,
      "Invalid tankId supplied!",
      true
    );
  }

  // Check if current tank belongs to the user
  req.auth = req.auth as JWTPayload;
  if (req.auth.userId !== tank.userId.toString()) {
    throw new APIError(
      StatusCodes.FORBIDDEN,
      "You can only add HP onto your own tank!",
      true
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

  // Add HP
  tank.healthPoints = tank.healthPoints + 1;

  // Save target tank and shooter tank
  await tank.save();

  // TODO: announce HP change

  res.status(200).json({
    detail: `You now have an HP of ${tank.healthPoints}`,
  });
};

export default tankAddHealthPointController;
