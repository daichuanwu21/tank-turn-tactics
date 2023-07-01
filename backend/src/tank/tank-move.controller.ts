import { Request as JWTRequest } from "express-jwt";
import JWTPayload from "../user/jwt-payload.interface";
import { Response } from "express";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import messageOnlyValidationResult from "../utils/message-only.result-factory";
import mongoose, { Types } from "mongoose";
import { Tank } from "../models";

const tankMoveController = async (
  req: JWTRequest<JWTPayload>,
  res: Response
) => {
  // Ensure all fields are present (positionX, positionY)
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

      // Check if target position is current position
      const targetPosition: [number, number] = [
        parseInt(req.body.positionX),
        parseInt(req.body.positionY),
      ];
      if (
        tank.positionX === targetPosition[0] &&
        tank.positionY === targetPosition[1]
      ) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Already on target position!",
          true
        );
      }

      // Check if target position is adjacent
      const isTargetPosAdjacent =
        (targetPosition[0] === tank.positionX - 1 ||
          targetPosition[0] === tank.positionX ||
          targetPosition[0] === tank.positionX + 1) &&
        (targetPosition[1] === tank.positionY - 1 ||
          targetPosition[1] === tank.positionY ||
          targetPosition[1] === tank.positionY + 1);
      if (!isTargetPosAdjacent) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Cannot move to non-adjcent block!",
          true
        );
      }

      // Get a list of adjacent tanks
      const adjacentTanks = await Tank.find({
        positionX: { $gte: tank.positionX - 1, $lte: tank.positionX + 1 },
        positionY: { $gte: tank.positionY - 1, $lte: tank.positionY + 1 },
        _id: { $ne: tank._id },
      }).session(session);

      // Check if target position is occupied
      let targetPositionOccupied = false;
      adjacentTanks.every((adjTank) => {
        if (
          adjTank.positionX === targetPosition[0] &&
          adjTank.positionY === targetPosition[1]
        ) {
          targetPositionOccupied = true;
          return false;
        }

        return true;
      });
      if (targetPositionOccupied) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "Cannot move to an occupied block!",
          true
        );
      }

      // Check if tank has enough AP
      if (tank.actionPoints <= 0) {
        throw new APIError(
          StatusCodes.BAD_REQUEST,
          "You do not have enough AP to perform this action",
          true
        );
      }

      // Deduct AP
      tank.actionPoints = tank.actionPoints - 1;

      // Update position of current tank
      [tank.positionX, tank.positionY] = targetPosition;

      // Save tank
      await tank.save({ session });

      // TODO: announce tank move

      res.status(200).json({
        detail: `Tank moved successfully.`,
      });
    },
    {
      readPreference: "primary",
      readConcern: "majority",
      writeConcern: { w: "majority" },
    }
  );
};

export default tankMoveController;
