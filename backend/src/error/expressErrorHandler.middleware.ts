import { Request, Response, NextFunction } from "express";
import APIError from "./api-error.error";
import handleError from "./handle-error.function";
import isTrustedError from "./is-trusted-error.function";
import { ReasonPhrases, StatusCodes, getReasonPhrase } from "http-status-codes";
import { STATUS_CODES } from "http";
import { logger } from "..";

// Middleware to be used in Express to block stacktraces
const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isTrustedError(err)) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      title: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });

    handleError(err);
  } else if (err instanceof APIError) {
    res.status(err.httpResponseCode).json({
      title: getReasonPhrase(err.httpResponseCode),
      status: err.httpResponseCode,
      detail: err.message,
    });
  }
};

export default expressErrorHandler;
