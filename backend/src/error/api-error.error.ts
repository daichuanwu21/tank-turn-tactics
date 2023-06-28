import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.error";

// Error thrown by Express (i.e. within routes)
// API errors are not logged if trusted
class APIError extends AppError {
  public readonly httpResponseCode: StatusCodes;

  constructor(
    httpResponseCode: StatusCodes,
    description: string,
    isOperational: boolean
  ) {
    super(description, isOperational);

    this.httpResponseCode = httpResponseCode;
  }
}

export default APIError;
