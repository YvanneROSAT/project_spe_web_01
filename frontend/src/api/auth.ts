import {
  type AuthRefreshResponse,
  authRefreshResponseSchema,
  type LoginInput,
  type LoginResponse,
  loginResponseSchema,
  type RegisterInput,
} from "common";
import { apiAuthorizedRequester, apiRequester, parseResponse } from "./axios";

export async function login(input: LoginInput): Promise<LoginResponse | null> {
  const res = await apiAuthorizedRequester.post("/auth/login", input);

  return parseResponse(res, loginResponseSchema);
}

export async function register(input: RegisterInput): Promise<boolean> {
  const res = await apiAuthorizedRequester.post("/auth/register", input);

  return res.statusText === "OK";
}

export async function logout(): Promise<boolean> {
  const res = await apiAuthorizedRequester.delete("/auth/logout");

  return res.statusText === "OK";
}

export async function getRefreshedAccessToken(): Promise<AuthRefreshResponse | null> {
  const res = await apiRequester.post("/auth/refresh", null, {
    withCredentials: true,
  });

  return parseResponse(res, authRefreshResponseSchema);
}
