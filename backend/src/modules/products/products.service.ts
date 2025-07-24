import { db } from "@/db/connection";
import { categoriesTable, productsTable } from "@/db/schema";
import { eq, like, sql } from "drizzle-orm";
import { UpdateProductInput } from "./products.schemas";

export const PRODUCTS_PER_PAGE = 20;

function formatProduct(
  p: typeof productsTable.$inferSelect,
  c: typeof categoriesTable.$inferSelect | null
) {
  return {
    id: p.productId,
    label: p.label,
    description: p.description,
    price: p.price,
    category: c && {
      id: c.categoryId,
      label: c.label,
    },
  };
}

export async function getProducts(query: string, page: number = 0) {
  return await db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .where(like(sql`lower(${productsTable.label})`, `%${query.toLowerCase()}%`))
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE)
    .then((rows) =>
      rows.map(({ products, categories }) =>
        formatProduct(products, categories)
      )
    );
}

export async function getProductById(id: string) {
  return db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .where(eq(productsTable.productId, id))
    .then((rows) =>
      rows.length === 1
        ? formatProduct(rows[0].products, rows[1].categories)
        : null
    );
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput
): Promise<boolean> {
  return db
    .update(productsTable)
    .set(input)
    .where(eq(productsTable.productId, productId))
    .then(([resultSet]) => resultSet.affectedRows > 0);
}

export async function deleteProduct(productId: string): Promise<boolean> {
  return db
    .delete(productsTable)
    .where(eq(productsTable.productId, productId))
    .then(([resultSet]) => resultSet.affectedRows > 0);
}
