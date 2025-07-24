import { db } from "@/db/connection";
import { categoriesTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpdateProductInput } from "./products.schemas";

const PRODUCTS_PER_PAGE = 20;

export async function getProducts(page: number = 0) {
  return db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE);
}

export async function getProductById(id: string) {
  const res = await db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .where(eq(productsTable.productId, id));

  console.log(res);

  return res.length === 1 ? res[0] : null;
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput
): Promise<boolean> {
  const res = await db
    .update(productsTable)
    .set(input)
    .where(eq(productsTable.productId, productId));

  return res[0].affectedRows > 0;
}
