import { InvalidCSRFTokenError } from "@/app-error";
import { CSRF_TOKEN_KEY, JWT_TOKEN_KEY } from "@/config";
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

      if (requiresCsrfToken) {
        const csrfToken = req.cookies?.[CSRF_TOKEN_KEY];
        if (csrfToken !== req.user.csrfToken) {
          throw new InvalidCSRFTokenError();
        }
      }

      next();
    } catch (err) {
      res.clearCookie(JWT_TOKEN_KEY).clearCookie(CSRF_TOKEN_KEY);

      throw err;
    }
  };
}
