import { JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";
import { AuthPayload } from "./schemas";

export function generateJWToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}
