import "dotenv/config";

import { pinoHttp } from "./logger";
import logger from "./logger";
import config from "./config";

import express from "express";
import http from "http";

import expressErrorHandler from "./error/express-error-handler.middleware";

const app = express();
app.use(pinoHttp);
app.use(expressErrorHandler);

const httpServer = http.createServer(app);
httpServer.listen({
  host: "localhost",
  port: config.listenPort,
});

logger.info("Hello World!");
