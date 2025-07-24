import { AppError } from "@/app-error";

class ProductError extends AppError {
  constructor(code: string, public status: number) {
    super(code, status);

    this.prefix = "product";
  }
}

export class ProductNotFoundError extends ProductError {
  constructor() {
    super("not-found", 404);
  }
}
