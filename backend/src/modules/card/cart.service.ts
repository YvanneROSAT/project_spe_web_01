import { db } from "@/db/connection";
import { cartTable, categoriesTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatProduct } from "../products/products.service";

export async function addToCart(
  userId: string,
  productId: string
): Promise<boolean> {
  return db
    .insert(cartTable)
    .values({
      userId,
      productId,
    })
    .then((res) => res[0].affectedRows > 0);
}

export async function getUserCart(userId: string) {
  return db
    .select()
    .from(cartTable)
    .leftJoin(productsTable, eq(cartTable.productId, productsTable.productId))
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .where(eq(cartTable.userId, userId))
    .then((rows) =>
      rows.flatMap(({ products, categories }) =>
        products ? formatProduct(products, categories) : []
      )
    );
}
