import { Request, Response, Router } from "express";
import z from "zod";
import { AuthService } from "./auth.service";
import { AuthInput, authInput as authInputSchema } from "./dto/auth.input";
import { InvalidCredentialsError, UserAlreadyExistsError } from "./errors";

function makeHandler<T extends Record<string, unknown>>(
  useCase: (data: T) => Promise<unknown>,
  schema: z.ZodObject,
  successStatus: number,
  errorMap: [new () => Error, number][]
) {
  return async function handler(req: Request, res: Response) {
    const { data, success } = schema.safeParse(req.body);
    if (!success) {
      return res.sendStatus(422);
    }

    try {
      const result = await useCase(data as T);

      return result
        ? res.status(successStatus).json(result)
        : res.sendStatus(successStatus);
    } catch (err) {
      for (const [Err, status] of errorMap) {
        if (err instanceof Err) {
          return res.sendStatus(status);
        }
      }

      return res.sendStatus(500);
    }
  };
}

export function AuthController() {
  const authService = AuthService();

  return Router()
    .get(
      "/auth/login",
      makeHandler<AuthInput>(authService.login, authInputSchema, 200, [
        [InvalidCredentialsError, 401],
      ])
    )
    .get(
      "/auth/register",
      makeHandler<AuthInput>(authService.register, authInputSchema, 200, [
        [UserAlreadyExistsError, 403],
      ])
    );
}
