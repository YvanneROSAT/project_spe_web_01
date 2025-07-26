import axios from "axios";
import {
  type AuthRefreshResponse,
  authRefreshResponseSchema,
  categoriesResponseSchema,
  type Category,
  type CreateProductInput,
  type CreateProductResponse,
  createProductResponseSchema,
  type LoginInput,
  type LoginResponse,
  loginResponseSchema,
  type Product,
  type ProductsResponse,
  productsResponseSchema,
  type RegisterInput,
  singleProductResponseSchema,
} from "common";
import { refreshAuth } from "./auth";
import { BACKEND_URL } from "./config";

const authorizedAxios = axios.create();

authorizedAxios.interceptors.request.use(async function (config) {
  config.withCredentials = true;

  const accessToken = await refreshAuth();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export async function getProducts(
  search: string | null,
  page: number = 0
): Promise<ProductsResponse> {
  try {
    const res = await authorizedAxios.get(BACKEND_URL + "/products", {
      params: { search, page },
    });

    return productsResponseSchema.parse(res.data);
  } catch (err) {
    console.error(err);

    return {
      products: [],
      pageSize: 0,
    };
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await authorizedAxios.get(BACKEND_URL + "/products/" + id);

    return singleProductResponseSchema.parse(res.data).product;
  } catch (err) {
    console.error(err);

    return null;
  }
}

export async function createProduct(
  input: CreateProductInput
): Promise<CreateProductResponse | null> {
  try {
    const res = await authorizedAxios.post(
      BACKEND_URL + "/products/new",
      input
    );

    return createProductResponseSchema.parse(res.data);
  } catch (err) {
    console.error(err);

    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await authorizedAxios.get(BACKEND_URL + "/categories");

    return categoriesResponseSchema.parse(res.data).categories;
  } catch (err) {
    console.error(err);

    return [];
  }
}

export async function login(input: LoginInput): Promise<LoginResponse | null> {
  const res = await authorizedAxios.post(BACKEND_URL + "/auth/login", input);

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
  const res = await authorizedAxios.post(BACKEND_URL + "/auth/register", input);

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
    const res = await authorizedAxios.delete(BACKEND_URL + "/auth/logout");

    return res.status === 200;
  } catch (err) {
    console.error(err);

    return false;
  }
}

export async function getRefreshedAccessToken(): Promise<AuthRefreshResponse | null> {
  try {
    const res = await axios.post(BACKEND_URL + "/auth/refresh", null, {
      withCredentials: true,
    });

    return authRefreshResponseSchema.parse(res.data);
  } catch (err) {
    console.error(err);

    return null;
  }
}
