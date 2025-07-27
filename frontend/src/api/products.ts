import {
  type CreateProductInput,
  createProductResponseSchema,
  type Product,
  type ProductsResponse,
  productsResponseSchema,
  type SetProductInput,
  singleProductResponseSchema,
} from "common";
import { apiAuthorizedRequester, parseResponse } from "./axios";

export async function getProducts(
  search: string | null,
  page: number = 0
): Promise<ProductsResponse> {
  const res = await apiAuthorizedRequester.get("/products", {
    params: { search, page },
  });

  return (
    parseResponse(res, productsResponseSchema) ?? { products: [], pageSize: -1 }
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await apiAuthorizedRequester.get("/products/" + id);

  return parseResponse(res, singleProductResponseSchema)?.product ?? null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<string | null> {
  const res = await apiAuthorizedRequester.post("/products/new", input);

  return parseResponse(res, createProductResponseSchema)?.id ?? null;
}

export async function updateProduct(
  productId: string,
  input: SetProductInput
): Promise<boolean> {
  const res = await apiAuthorizedRequester.put(`/products/${productId}`, input);

  return res.statusText === "OK";
}
