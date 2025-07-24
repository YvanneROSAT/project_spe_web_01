export class AppError extends Error {
  prefix: string = "app-error";

  constructor(code: string, public status: number) {
    super(code);
    this.name = `AppError`;

    Error.captureStackTrace(this, this.constructor);
  }

  get code(): string {
    return `${this.prefix}/${this.message}`;
  }
}

export class InternalServerError extends AppError {
  constructor() {
    super("internal-server-error", 500);
  }
}
