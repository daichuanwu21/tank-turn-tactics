import PinoHttp from "pino-http";

const pinoHttp = PinoHttp({
  useLevel: "trace", // Don't log every API request to console
  ...(process.env.DEBUG !== "YES"
    ? {}
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }),
});

export default pinoHttp.logger;
export { pinoHttp };
