import { db } from "@/db/connection";
import { categoriesTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpdateProductInput } from "./products.schemas";

const PRODUCTS_PER_PAGE = 20;

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

export async function getProducts(page: number = 0) {
  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE);

  return rows.length > 0
    ? rows.map(({ products, categories }) =>
        formatProduct(products, categories)
      )
    : [];
}

export async function getProductById(id: string) {
  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )
    .where(eq(productsTable.productId, id));

  return rows.length === 1
    ? formatProduct(rows[0].products, rows[0].categories)
    : null;
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
