import {
  type CreateProductInput,
  type CreateProductResponse,
  createProductResponseSchema,
  type Product,
  type ProductsResponse,
  productsResponseSchema,
  singleProductResponseSchema,
} from "common";
import { apiAuthorizedRequester } from "./axios-helper";

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
    const res = await apiAuthorizedRequester.post("/products/new", input);

    return createProductResponseSchema.parse(res.data);
  } catch (err) {
    console.error(err);

    return null;
  }
}
