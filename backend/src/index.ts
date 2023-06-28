import "dotenv/config";
import { pinoHttp } from "./logger";
import logger from "./logger";
import config from "./config";
import express from "express";
import http from "http";
import cors from "cors";
import expressErrorHandler from "./error/express-error-handler.middleware";

const app = express();
app.disable("x-powered-by");
app.use(pinoHttp);
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(expressErrorHandler);

const httpServer = http.createServer(app);
httpServer.listen({
  host: "localhost",
  port: config.listenPort,
});

logger.info("Hello World!");
