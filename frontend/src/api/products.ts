import {
  type CreateProductInput,
  createProductResponseSchema,
  type Product,
  type ProductsResponse,
  productsResponseSchema,
  singleProductResponseSchema,
} from "common";
import { apiAuthorizedRequester, parseResponse } from "./axios";

export async function getProducts(
  search: string | null,
  page: number = 0
): Promise<ProductsResponse> {
  try {
    const res = await apiAuthorizedRequester.get("/products", {
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
    const res = await apiAuthorizedRequester.get("/products/" + id);

    return parseResponse(res, singleProductResponseSchema)?.product ?? null;
  } catch (err) {
    console.error(err);

    return null;
  }
}

export async function createProduct(
  input: CreateProductInput
): Promise<string | null> {
  try {
    const res = await apiAuthorizedRequester.post("/products/new", input);

    return parseResponse(res, createProductResponseSchema)?.id ?? null;
  } catch (err) {
    console.error(err);

    return null;
  }
}
