import "dotenv/config";

import PinoHttp from "pino-http";
import express from "express";
import http from "http";

const isProductionEnvironment = process.env.DEBUG !== "YES";

const pinoHttp = PinoHttp(
  isProductionEnvironment
    ? {}
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

const httpServer = http.createServer(app);
httpServer.listen({
  host: "localhost",
  port: parseInt(process.env.LISTEN_PORT),
});

logger.info("Hello World!");

export { logger, isProductionEnvironment };
