import z from "zod";
import { userSchema } from "./user";

export const authRefreshResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema
});

export type AuthRefreshResponse = z.infer<typeof authRefreshResponseSchema>;
