export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 403);
  }
}

export class InternalServerError extends AppError {
  constructor() {
    super("Internal server error", 500);
  }
}
