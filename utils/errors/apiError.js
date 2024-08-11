class apiError extends Error {
  constructor(
    statusCode,
    message = "UNDEFINED ERROR",
    multierrors = [],
    stackTrace
  ) {
    super(message);
    this.statusCode = statusCode > 400;
    this.message = message;
    this.success = false;
    this.multierrors = multierrors;

    if (stackTrace) {
      this.stack = stackTrace;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiError };
