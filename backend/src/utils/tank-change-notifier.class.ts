import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import { ITankSchema } from "../tank/tank.schema";
import AppError from "../error/app.error";
import { User } from "../models";
import logger from "../logger";

class TankChangeNotifier {
  private readonly socketIOServer: SocketIOServer;
  constructor(socketIOServer: SocketIOServer) {
    this.socketIOServer = socketIOServer;

    const changeStream = mongoose.connection.db.collection("tanks").watch();
    changeStream.on(
      "change",
      (
        next: mongoose.mongo.ChangeStreamDocument<mongoose.mongo.BSON.Document>
      ) => {
        switch (next.operationType) {
          case "insert": // addOne entityadapter
            this.handleInsert(
              next as mongoose.mongo.ChangeStreamInsertDocument<ITankSchema>
            );
            break;
          case "update": // updateOne entityadapter
            this.handleUpdate(
              next as mongoose.mongo.ChangeStreamUpdateDocument<ITankSchema>
            );
            break;
          case "delete": // removeOne entityadapter
            this.handleDelete(
              next as mongoose.mongo.ChangeStreamDeleteDocument<ITankSchema>
            );
            break;
          default:
            throw new AppError("Unimplemented change event received!", false);
        }
      }
    );
  }

  private async getDisplayNameByUserId(userId: string) {
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) throw new AppError("User-tank relationship broken!", false);

    const displayName = user.email.split("@")[0];
    return displayName;
  }

  private async handleInsert(
    next: mongoose.mongo.ChangeStreamInsertDocument<ITankSchema>
  ) {
    const tank = next.fullDocument;
    const user = await User.findById(tank.userId);
    if (!user) throw new AppError("User-tank relationship broken!", false);

    const event = {
      id: (next.fullDocument as any)._id,
      healthPoints: tank.healthPoints,
      range: tank.range,
      positionX: tank.positionX,
      positionY: tank.positionY,
      displayName: user.email.split("@")[0],
    };

    this.socketIOServer
      .of("/tank-events")
      .emit("insert", JSON.stringify(event));

    logger.debug("Emitted insertion of tank with id: " + (tank as any)._id);
  }

  private async handleUpdate(
    next: mongoose.mongo.ChangeStreamUpdateDocument<ITankSchema>
  ) {
    let updatedFields = next.updateDescription.updatedFields;
    if (typeof updatedFields !== "object")
      throw new AppError(
        "Invalid updatedFields type in insert change stream event!",
        false
      );
    updatedFields = updatedFields as object;

    // Do not send update event for tank if the only field that changed is actionPoints, otherwise it can be inferred that an empty change event object implies player healed another
    if (
      Object.keys(updatedFields).length === 1 &&
      (updatedFields.actionPoints !== undefined ||
        (updatedFields as any)._id !== undefined) // Or if _id changes, should throw an error if this somehow happens
    )
      return;

    const event = {
      id: next.documentKey._id.toString(),
      changes: {
        ...(updatedFields.healthPoints !== undefined
          ? { healthPoints: updatedFields.healthPoints }
          : null),
        ...(updatedFields.range !== undefined
          ? { range: updatedFields.range }
          : null),
        ...(updatedFields.positionX !== undefined
          ? { positionX: updatedFields.positionX }
          : null),
        ...(updatedFields.positionY !== undefined
          ? { positionY: updatedFields.positionY }
          : null),
        ...(updatedFields.userId !== undefined
          ? {
              displayName: await this.getDisplayNameByUserId(
                updatedFields.userId.toString()
              ),
            }
          : null),
      },
    };

    this.socketIOServer
      .of("/tank-events")
      .emit("update", JSON.stringify(event));

    logger.debug(
      "Emitted update of tank with id: " + next.documentKey._id.toString()
    );
  }

  private async handleDelete(
    next: mongoose.mongo.ChangeStreamDeleteDocument<ITankSchema>
  ) {
    const event = {
      id: next.documentKey._id.toString(),
    };

    this.socketIOServer
      .of("/tank-events")
      .emit("delete", JSON.stringify(event));

    logger.debug(
      "Emitted deletion of tank with id: " + next.documentKey._id.toString()
    );
  }
}

export default TankChangeNotifier;
