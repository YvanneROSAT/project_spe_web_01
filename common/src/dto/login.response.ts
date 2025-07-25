import z from "zod";
import { userSchema } from "./user";

export const loginResponseSchema = z.object({
  accessToken: z.jwt(),
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
