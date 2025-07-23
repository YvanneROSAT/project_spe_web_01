import { db } from "@/db/connection";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const PRODUCTS_PER_PAGE = 20;

export async function getProducts(page: number = 0) {
  return db
    .select()
    .from(productsTable)
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE);
}

export async function getProductById(id: string) {
  const res = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.productId, id));

  return res.length === 1 ? res[0] : null;
}
