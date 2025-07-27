import { BACKEND_URL } from "@/config";
import { showErrorToast } from "@/toast";
import axios, { AxiosError, type AxiosResponse } from "axios";
import z from "zod";
import { refreshAuth } from "../auth";

const ERROR_MESSAGES: Record<string, string> = {
  "product/not-found": "Ce produit n'existe pas",
  "auth/invalid-credentials": "Email ou mot de passe incorrect",
  "token-expired": "Veuillez vous reconnecter",
  forbidden: "Vous n'êtes pas autorisé",
};

export const DEFAULT_ERROR_MESSAGE =
  "Une erreur est survenue, veuillez réessayer plus tard";

export function parseResponse<Schema extends z.ZodType>(
  res: AxiosResponse,
  schema: Schema
): z.infer<Schema> | null {
  const { data, success } = schema.safeParse(res.data);
  if (!success) {
    showErrorToast(DEFAULT_ERROR_MESSAGE);
    return null;
  }

  return data;
}

function handleRejected(err: AxiosError) {
  if (err.response) {
    const { data } = err.response;

    const message =
      typeof data === "string" ? ERROR_MESSAGES[data] : DEFAULT_ERROR_MESSAGE;
    showErrorToast(message);
  }

  return Promise.reject({ ...err, userMessage: err.message });
}

export const apiRequester = axios.create({
  baseURL: BACKEND_URL,
});
apiRequester.interceptors.response.use(null, handleRejected);

export const apiAuthorizedRequester = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
apiAuthorizedRequester.interceptors.request.use(async function (config) {
  const accessToken = await refreshAuth();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
apiAuthorizedRequester.interceptors.response.use(null, handleRejected);
