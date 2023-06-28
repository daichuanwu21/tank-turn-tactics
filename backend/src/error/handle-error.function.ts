import { logger } from "../index";
import isTrustedError from "./is-trusted-error.function";

// Centralised error handler
const handleError = (err: any) => {
  if (isTrustedError(err)) {
    logger.error(err);
  } else {
    logger.fatal(err);
    process.exit(1);
  }
};

export default handleError;
