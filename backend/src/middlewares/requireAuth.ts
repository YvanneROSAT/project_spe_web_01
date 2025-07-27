import { ForbiddenError } from "common";
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
