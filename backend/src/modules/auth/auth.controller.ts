import { Request, Response, Router } from "express";
import { AuthService } from "./auth.service";
import { authInput } from "./dto/auth.input";
import { InvalidCredentialsError, UserAlreadyExistsError } from "./errors";

export function AuthController() {
  const authService = AuthService();

  async function handleLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    const { data, success } = authInput.safeParse({ email, password });
    if (!success) {
      return res.sendStatus(422);
    }

    try {
      const token = await authService.login(data);

      res.json({ token });
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  }

  async function handleRegister(req: Request, res: Response) {
    const { data, success } = authInput.safeParse({
      email: req.body.email,
      password: req.body.password,
    });
    if (!success) {
      return res.sendStatus(422);
    }

    try {
      await authService.register(data);

      res.sendStatus(201);
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        return res.sendStatus(403);
      }

      return res.sendStatus(500);
    }
  }

  return Router()
    .get("/auth/login", handleLogin)
    .get("/auth/register", handleRegister);
}
