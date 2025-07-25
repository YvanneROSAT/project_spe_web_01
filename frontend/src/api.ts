import axios from "axios";
import {
  type LoginResponse,
  loginResponseSchema,
  type Product,
  productResponseSchema,
  productsResponseSchema,
} from "common";
import { BACKEND_URL } from "./config";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await axios.get(BACKEND_URL + "/products");

    return productsResponseSchema.parse(res.data).products;
  } catch (err) {
    console.error(err);

    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await axios.get(BACKEND_URL + "/products/" + id);

    return productResponseSchema.parse(res.data).product;
  } catch (err) {
    console.error(err);

    return null;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse | null> {
  const res = await axios.post(BACKEND_URL + "/auth/login", {
    headers: { "Content-Type": "application/json" },
    body: {
      email,
      password,
    },
  });

  switch (res.status) {
    case 200: {
      const { data, success } = loginResponseSchema.safeParse(res.data);
      if (!success) {
        return null;
      }

      return data

    }
    case 403:
      alert("Email ou mot de passe incorrect");
      break;
    default:
      alert("Une erreur est survenue");
  }

  return null;
}
