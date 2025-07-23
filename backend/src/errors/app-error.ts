export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}
