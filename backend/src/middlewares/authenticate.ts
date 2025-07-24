import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "@/config";
import {
  getAccessTokenFromRequest,
  getIsTokenBlacklisted,
  getRefreshTokenFromRequest,
  refreshTokens,
  verifyAccessToken,
} from "@/modules/auth/jwt";
import { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = getAccessTokenFromRequest(req);
  const refreshToken = getRefreshTokenFromRequest(req);

  try {
    if (accessToken) {
      if (await getIsTokenBlacklisted(accessToken)) {
        return next();
      }

      const payload = verifyAccessToken(accessToken);
      console.log(payload, accessToken);
      if (payload) {
        req.user = { userId: payload.sub };
        return next();
      }
    }

    if (refreshToken) {
      const [newAccessToken, newRefreshToken] = await refreshTokens(
        refreshToken
      );

      res
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          newRefreshToken,
          REFRESH_TOKEN_COOKIE_OPTIONS
        )
        .setHeader("X-New-Access-Token", newAccessToken);

      const payload = verifyAccessToken(newAccessToken);
      if (!payload) {
        throw new Error("Bad access token payload");
      }

      req.user = { userId: payload.sub };
    }

    next();
  } catch (error) {
    next();
  }
}
