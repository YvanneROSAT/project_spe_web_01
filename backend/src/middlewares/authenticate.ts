import { refreshTokens, verifyAccessToken } from "@/modules/auth/jwt";
import { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  try {
    // Valid access token
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded) {
        req.user = { userId: decoded.sub };
        return next();
      }
    }

    // Attempt refresh if no valid access token
    if (refreshToken) {
      const [newAccessToken, newRefreshToken] = await refreshTokens(
        refreshToken
      );

      // Set new refresh token cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Set new access token in response header
      res.setHeader("X-New-Access-Token", newAccessToken);
      const payload = verifyAccessToken(newAccessToken);
      if (!payload) {
        throw new Error("Bad access token payload");
      }

      req.user = { userId: payload.sub };
    }

    next();
  } catch (error) {
    next(); // Continue without authentication
  }
}
