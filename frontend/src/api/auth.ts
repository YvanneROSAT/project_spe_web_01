import {
  type AuthRefreshResponse,
  authRefreshResponseSchema,
  type LoginInput,
  type LoginResponse,
  loginResponseSchema,
  type RegisterInput,
} from "common";
import { apiAuthorizedRequester, apiRequester } from "./axios-helper";

export async function login(input: LoginInput): Promise<LoginResponse | null> {
  const res = await apiAuthorizedRequester.post("/auth/login", input);

  switch (res.status) {
    case 200: {
      const { data, success } = loginResponseSchema.safeParse(res.data);
      if (!success) {
        return null;
      }

      return data;
    }
    case 403:
      alert("Email ou mot de passe incorrect");
      break;
    default:
      alert("Une erreur est survenue");
  }

  return null;
}

export async function register(input: RegisterInput): Promise<boolean> {
  const res = await apiAuthorizedRequester.post("/auth/register", input);

  switch (res.status) {
    case 200:
      return true;
    case 403:
      alert("Identifiants deja utilises");
      break;
    default:
      alert("Une erreur est survenue");
  }

  return false;
}

export async function logout(): Promise<boolean> {
  try {
    const res = await apiAuthorizedRequester.delete("/auth/logout");

    return res.status === 200;
  } catch (err) {
    console.error(err);

    return false;
  }
}

export async function getRefreshedAccessToken(): Promise<AuthRefreshResponse | null> {
  try {
    const res = await apiRequester.post("/auth/refresh", null, {
      withCredentials: true,
    });

    return authRefreshResponseSchema.parse(res.data);
  } catch (err) {
    console.error(err);

    return null;
  }
}
