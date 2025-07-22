import z from "zod";

export const authInput = z.object({
  email: z.email(),
  password: z.string().min(8).max(80),
});

export type AuthInput = z.infer<typeof authInput>;
