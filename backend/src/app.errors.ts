import { AppError } from "./app-error";

export class InternalServerError extends AppError {
  constructor() {
    super("internal-server-error", 500);
  }
}
