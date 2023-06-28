import { Options as PinoHttpOptions } from "pino-http";

const isProduction = process.env.DEBUG !== "YES";

const getPinoHttpOptions = (): PinoHttpOptions => {
  return {
    useLevel: "debug", // Don't log every API request to console
    ...(isProduction
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
  };
};

export { isProduction, getPinoHttpOptions };
