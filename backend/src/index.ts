import "dotenv/config";

import PinoHttp from "pino-http";
import express from "express";
import http from "http";

import expressErrorHandler from "./error/expressErrorHandler.middleware";

const isProductionEnvironment = process.env.DEBUG !== "YES";

const pinoHttp = PinoHttp(
  isProductionEnvironment
    ? {
        level: "warn",
      }
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
);
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

export { logger, isProductionEnvironment };
