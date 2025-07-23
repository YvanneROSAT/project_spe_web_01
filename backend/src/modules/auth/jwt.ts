import { JWT_SECRET } from "@/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AuthPayload } from "./schemas";

export function generateJWToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
