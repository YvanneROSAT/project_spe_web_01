import { JWT_SECRET } from "@/config";
import { User } from "@/db/types";
import jwt from "jsonwebtoken";

export function generateJWToken(payload: Pick<User, "userId" | "email">) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}
