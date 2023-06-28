import "dotenv/config";

import PinoHttp from "pino-http";
import express from "express";
import http from "http";

import expressErrorHandler from "./error/express-error-handler.middleware";
import { getPinoHttpOptions } from "./environment";

const pinoHttp = PinoHttp(getPinoHttpOptions());
const logger = pinoHttp.logger;

const app = express();
app.use(pinoHttp);
app.use(expressErrorHandler);

const httpServer = http.createServer(app);
httpServer.listen({
  host: "localhost",
  port: parseInt(process.env.LISTEN_PORT),
});

logger.info("Hello World!");

export { logger };
