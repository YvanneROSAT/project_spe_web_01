import { db } from "@/db/connection";
import { productsTable } from "@/db/schema";

const PRODUCTS_PER_PAGE = 20;

export function getProducts(page: number = 0) {
  return db
    .select()
    .from(productsTable)
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE);
}
