import { ForbiddenError } from "@/modules/auth/auth.errors";
import { NextFunction, Request, Response } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new ForbiddenError();
  }

  return next();
}
