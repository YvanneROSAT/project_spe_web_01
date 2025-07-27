import { AppError } from "../../app-error";

class AuthError extends AppError {
  constructor(
    code: string,
    public status: number
  ) {
    super(code, status);

    this.prefix = "auth";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("invalid-credentials", 403);
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super("token-expired", 440);
  }
}

export class ForbiddenError extends AuthError {
  constructor() {
    super("forbidden", 403);
  }
}
