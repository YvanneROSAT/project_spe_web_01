import {
  getAccessTokenFromRequest,
  getIsTokenBlacklisted,
  verifyAccessToken,
} from "@/modules/auth/jwt";
import { TokenExpiredError } from "common";
import { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.user = null;

  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    return next();
  }

  try {
    const payload = verifyAccessToken(accessToken);
    if (!payload || (await getIsTokenBlacklisted(payload.jti))) {
      throw new TokenExpiredError();
    }

    req.user = Object.freeze({ userId: payload.sub });
    next();
  } catch (err) {
    next(err);
  }
}
