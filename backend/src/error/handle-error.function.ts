import logger from "../logger";
import isTrustedError from "./is-trusted-error.function";

// Centralised error handler
const handleError = (err: any) => {
  if (isTrustedError(err)) {
    logger.error("This error doesn't seem too severe, moving on...");
    logger.error(err);
  } else {
    logger.fatal(err);

    // Log error in cleartext before exiting
    console.log("\nFatal error encountered: ", err.message);

    process.exit(1);
  }
};

export default handleError;
