import { db } from "@/db/connection";
import { categoriesTable, picturesTable, productsTable } from "@/db/schema";
import { count, eq, like, sql } from "drizzle-orm";
import { UpdateProductInput } from "./products.schemas";

export const PRODUCTS_PER_PAGE = 20;

export function formatProduct(
  product: typeof productsTable.$inferSelect,
  category: typeof categoriesTable.$inferSelect | null,
  pictures: (typeof picturesTable.$inferSelect)[]
) {
  return {
    id: product.productId,
    label: product.label,
    description: product.description,
    price: product.price,
    category: category && {
      id: category.categoryId,
      label: category.label,
    },
    pictures: [pictures.map((p) => process.env.BACKEND_URL + "/" + p.path)],
  };
}

export async function getProducts(search: string, page: number = 0) {
  return await db
    .select()
    .from(productsTable)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.categoryId)
    )

    .where(
      like(sql`lower(${productsTable.label})`, `%${search.toLowerCase()}%`)
    )
    .limit(PRODUCTS_PER_PAGE)
    .offset(page * PRODUCTS_PER_PAGE)
    .then((rows) =>
      rows.map(({ products, categories }) =>
        formatProduct(products, categories, [])
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
        ? formatProduct(rows[0].products, rows[1].categories, [])
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

export async function getPublicStats() {
  try {
    const statsData = await db
      .select({
        nom: categoriesTable.label,
        compte: count(productsTable.productId),
      })
      .from(categoriesTable)
      .leftJoin(
        productsTable,
        eq(categoriesTable.categoryId, productsTable.categoryId)
      )
      .groupBy(categoriesTable.categoryId, categoriesTable.label);

    return statsData;
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des statistiques: ${error}`
    );
  }
}
