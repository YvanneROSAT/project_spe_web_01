import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { AuthInput } from "./dto/auth.input";
import { InvalidCredentialsError, UserAlreadyExistsError } from "./errors";

interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
}

export const users: Record<string, DbUser> = {};

export function AuthService() {
  async function login(input: AuthInput) {
    const user = Object.values(users).find(
      (user) => user.email === input.email
    );

    if (
      !user?.passwordHash ||
      !(await bcrypt.compare(input.password, user.passwordHash))
    ) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    return token;
  }

  async function register(input: AuthInput) {
    if (Object.values(users).some((user) => user.email === input.email)) {
      throw new UserAlreadyExistsError();
    }

    const id = uuid();
    users[id] = {
      id,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
    };

    return users[id];
  }

  return { login, register };
}
