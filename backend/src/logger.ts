import PinoHttp from "pino-http";

const pinoHttp = PinoHttp({
  useLevel: "debug", // Don't log every API request to console
  ...(process.env.DEBUG !== "YES"
    ? {}
    : {
        level: "debug", // Allow seeing API requests
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
