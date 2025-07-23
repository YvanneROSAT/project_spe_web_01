import { JWT_TOKEN_KEY } from "@/config";
import { authPayloadSchema } from "@/modules/auth/schemas";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(requiresCsrfToken?: boolean): RequestHandler {
  return async function (req, res, next) {
    const token = req.cookies?.[JWT_TOKEN_KEY];
    if (!token) {
      return res.sendStatus(401);
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await authPayloadSchema.parseAsync(payload);

      next();
    } catch {
      res.clearCookie(JWT_TOKEN_KEY);
      res.sendStatus(403);
    }
  };
}
