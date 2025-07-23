import z from "zod";
import { isPasswordSafe } from "./password";

const emailField = z.email({ pattern: z.regexes.rfc5322Email }).toLowerCase();
const passwordField = z
  .string({ error: "Invalid password" })
  .min(8, "Must be 8 characters or more")
  .refine(isPasswordSafe);
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
