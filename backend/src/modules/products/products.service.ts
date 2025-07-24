import { db } from "@/db/connection";
import { productsTable, categoriesTable } from "@/db/schema";
import { eq, count } from "drizzle-orm";

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

export async function getPublicStats() {
  try {
    const statsData = await db
      .select({
        nom: categoriesTable.label,
        compte: count(productsTable.productId)
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(categoriesTable.categoryId, productsTable.categoryId))
      .groupBy(categoriesTable.categoryId, categoriesTable.label);

    return statsData;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des statistiques: ${error}`);
  }
}
