import "dotenv/config";
import { pinoHttp } from "./logger";
import logger from "./logger";
import config from "./config";
import express from "express";
import http from "http";
import cors from "cors";
import expressErrorHandler from "./error/express-error-handler.middleware";
import usersRouter from "./user/users.router";
import handleHttpServerError from "./error/handle-http-server-error.function";
import mongoose from "mongoose";
import handleError from "./error/handle-error.function";
import verifyJSON from "./utils/verify-json.function";
import tanksRouter from "./tank/tanks.router";

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

app.use("/users", usersRouter);
app.use("/tanks", tanksRouter);

app.use(expressErrorHandler);

const httpServer = http.createServer(app);
httpServer.on("listening", () =>
  logger.info(`Listening on port ${config.listenPort}`)
);

httpServer.on("error", handleHttpServerError);
process.on("uncaughtException", (err) => handleError(err));
process.on("unhandledRejection", (err) => handleError(err));

const startServer = async () => {
  logger.info(`Connecting to MongoDB...`);
  await mongoose.connect(config.mongoDBUri, { dbName: "tank-turn-tactics" });

  httpServer.listen({
    host: "localhost",
    port: config.listenPort,
  });
};

// Start server after listeners have been registered
setImmediate(() => startServer());
