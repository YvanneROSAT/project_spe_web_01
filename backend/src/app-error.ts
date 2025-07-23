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

export class SessionExpiredError extends AppError {
  constructor() {
    super("Session expired", 440);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("Forbidden", 403);
  }
}

export class InternalServerError extends AppError {
  constructor() {
    super("Internal server error", 500);
  }
}
