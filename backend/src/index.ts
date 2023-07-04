import "dotenv/config";
import { pinoHttp } from "./logger";
import logger from "./logger";
import config from "./config";
import express from "express";
import http from "http";
import cors from "cors";
import expressErrorHandler from "./error/express-error-handler.middleware";
import userRouter from "./user/user.router";
import handleHttpServerError from "./error/handle-http-server-error.function";
import mongoose from "mongoose";
import handleError from "./error/handle-error.function";
import verifyJSON from "./utils/verify-json.function";
import tankRouter from "./tank/tank.router";
import { Server as SocketIOServer } from "socket.io";
import initialTankSyncController from "./tank/initial-tank-sync.controller";
import TankChangeNotifier from "./utils/tank-change-notifier.class";
import giveAPLoop from "./utils/give-ap-loop.function";

const app = express();
app.disable("x-powered-by");
app.use(pinoHttp);
app.use(cors({ origin: config.corsOrigin }));
app.use(
  express.json({
    // wtf, why isn't this done by default?
    verify: verifyJSON,
  })
);
app.use(express.urlencoded({ extended: false, type: "application/json" }));

app.use("/user", userRouter);
app.use("/tank", tankRouter);
app.get("/initial-tank-sync", initialTankSyncController);

app.use(expressErrorHandler);

const httpServer = http.createServer(app);
httpServer.on("listening", () =>
  logger.info(`Listening on port ${config.listenPort}`)
);

const socketIOServer = new SocketIOServer(httpServer, {
  serveClient: false,
  cors: {
    origin: config.corsOrigin,
  },
});
socketIOServer.of("/tank-events").on("connection", (socket) => {
  logger.debug(`Client ${socket.id} connected to tank events!`);
  socket.on("disconnect", (reason) => {
    logger.debug(
      `Client ${socket.id} disconnected from tank events: ${reason}!`
    );
  });
});

httpServer.on("error", handleHttpServerError);
process.on("uncaughtException", (err) => handleError(err));
process.on("unhandledRejection", (err) => handleError(err));

const startServer = async () => {
  logger.info(`Connecting to MongoDB...`);
  await mongoose.connect(config.mongoDBUri, { dbName: "tank-turn-tactics" });

  // Change stream listen must be done after connection
  new TankChangeNotifier(socketIOServer);

  // Start server after listeners have been registered
  setImmediate(() => {
    httpServer.listen({
      host: "localhost",
      port: config.listenPort,
    });

    giveAPLoop();
  });
};

startServer();
