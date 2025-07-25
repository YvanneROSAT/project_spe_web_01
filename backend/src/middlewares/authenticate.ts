import {
  SessionExpiredError,
  TokenExpiredError,
} from "@/modules/auth/auth.errors";
import {
  getAccessTokenFromRequest,
  getIsTokenBlacklisted,
  verifyAccessToken,
} from "@/modules/auth/jwt";
import { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    return next();
  }

  try {
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return next(new TokenExpiredError());
    }

    const isBlacklisted = await getIsTokenBlacklisted(payload.jti);
    if (isBlacklisted) {
      return next(new SessionExpiredError());
    }

    req.user = { userId: payload.sub };
    next();
  } catch (err) {
    next(err);
  }
}
