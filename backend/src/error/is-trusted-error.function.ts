import AppError from "./app-error.error";

const isTrustedError = (err: Error): boolean => {
  return err instanceof AppError && err.isOperational;
};

export default isTrustedError;
