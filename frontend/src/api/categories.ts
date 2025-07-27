import { type Category, categoriesResponseSchema } from "common";
import { apiAuthorizedRequester, parseResponse } from "./axios";

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiAuthorizedRequester.get("/categories");

    return parseResponse(res, categoriesResponseSchema)?.categories ?? [];
  } catch (err) {
    console.error(err);

    return [];
  }
}
