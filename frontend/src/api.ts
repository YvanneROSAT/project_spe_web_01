import axios from "axios";
import {
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
