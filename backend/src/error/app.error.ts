// Error thrown anywhere else in the application
// App errors are always logged, even if trusted
class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(description: string, isOperational: boolean) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export default AppError;
