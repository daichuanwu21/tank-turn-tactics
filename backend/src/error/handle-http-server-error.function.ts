import config from "../config";
import AppError from "./app.error";
import handleError from "./handle-error.function";

const handleHttpServerError = (err: NodeJS.ErrnoException): void => {
  if (err.syscall !== "listen") handleError(err);

  switch (err.code) {
    case "EACCES":
      handleError(
        new AppError(
          `Listening port ${config.listenPort} requires elevated priviledges`,
          false
        )
      );
      break;
    case "EADDRINUSE":
      handleError(
        new AppError(
          `Listening port ${config.listenPort} is already in use`,
          false
        )
      );
      break;
    default:
      handleError(err);
      break;
  }
};

export default handleHttpServerError;
