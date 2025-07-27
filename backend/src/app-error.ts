export class AppError extends Error {
  prefix: string = "app-error";

  constructor(code: string, public status: number) {
    super(code);
    this.name = `AppError`;

    if (
      "captureStackTrace" in Error &&
      typeof Error.captureStackTrace === "function"
    ) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  get code(): string {
    return `${this.prefix}/${this.message}`;
  }
}
