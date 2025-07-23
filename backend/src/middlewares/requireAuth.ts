import { JWT_TOKEN_KEY } from "@/config";
import { authPayloadSchema } from "@/modules/auth/schemas";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.[JWT_TOKEN_KEY];
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await authPayloadSchema.parseAsync(payload);

    next();
  } catch (err) {
    res.clearCookie(JWT_TOKEN_KEY);

    throw err;
  }
}
