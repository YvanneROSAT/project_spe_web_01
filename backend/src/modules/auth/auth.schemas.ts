import z from "zod";

const emailField = z.email({ pattern: z.regexes.rfc5322Email }).toLowerCase();
const passwordField = z
  .string({ error: "Invalid password" })
  .min(8, "Must be 8 characters or more");
const firstNameField = z.string();
const lastNameField = z.string();

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  email: emailField,
  password: passwordField,
});

export const accessTokenPayloadSchema = z.object({
  sub: z.cuid2(),
  exp: z.number(),
  jti: z.cuid2(),
});
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

export const refreshTokenPayloadSchema = z.object({
  sub: z.cuid2(),
  exp: z.number(),
});
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
