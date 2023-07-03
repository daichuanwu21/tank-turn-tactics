import { Request, Response } from "express";
import { Tank } from "../models";

const initialTankSyncController = async (req: Request, res: Response) => {
  const aggregate = await Tank.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "fromUser",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromUser", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        healthPoints: "$healthPoints",
        // actionPoints: "$actionPoints",
        range: "$range",
        positionX: "$positionX",
        positionY: "$positionY",
        displayName: { $arrayElemAt: [{ $split: ["$email", "@"] }, 0] },
      },
    },
    { $unwind: "$displayName" },
  ]);

  res.json(aggregate);
};

export default initialTankSyncController;
