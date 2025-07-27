import { type Category, categoriesResponseSchema } from "common";
import { apiAuthorizedRequester } from "./axios-helper";

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiAuthorizedRequester.get("/categories");

    return categoriesResponseSchema.parse(res.data).categories;
  } catch (err) {
    console.error(err);

    return [];
  }
}
