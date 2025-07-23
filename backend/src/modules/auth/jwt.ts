import jwt from "jsonwebtoken";
import { AuthPayload } from "./schemas";

export function generateJWToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}
