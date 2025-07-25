import { db } from "@/db/connection";
import { categoriesTable, picturesTable, productsTable } from "@/db/schema";
import { formatCategory } from "@/modules/categories/categories.service";
import { CreateProductInput, Product, SetProductInput } from "common";
import { count, eq, like, sql } from "drizzle-orm";

export const PRODUCTS_PER_PAGE = 20;

export function formatProduct(
  product: typeof productsTable.$inferSelect,
  category: typeof categoriesTable.$inferSelect | null,
  pictures: (typeof picturesTable.$inferSelect)[]
): Product {
  return {
    id: product.productId,
    name: product.name,
    description: product.description,
    price: product.price,
    category: category && formatCategory(category),
    pictures: pictures.map((p) => process.env.BACKEND_URL + "/" + p.path),
  };
}

export async function getProducts(
  search: string | undefined,
  page: number = 0
): Promise<Product[]> {
  return db.query.productsTable
    .findMany({
      limit: PRODUCTS_PER_PAGE,
      offset: page * PRODUCTS_PER_PAGE,
      where: search
        ? like(
            sql`lower(${productsTable.name})`,
            search ? `%${search.toLowerCase()}%` : ""
          )
        : undefined,
      with: {
        category: true,
        pictures: true,
      },
    })
    .then((products) =>
      products.map((product) =>
        formatProduct(product, product.category, product.pictures)
      )
    );
}

export async function getProductById(
  productId: string
): Promise<Product | null> {
  return db.query.productsTable
    .findFirst({
      where: eq(productsTable.productId, productId),
      with: {
        category: true,
        pictures: true,
      },
    })
    .then((product) =>
      product
        ? formatProduct(product, product.category, product.pictures)
        : null
    );
}

export async function createProduct(
  input: CreateProductInput
): Promise<string> {
  return db
    .insert(productsTable)
    .values(input)
    .$returningId()
    .then((res) => res[0].productId);
}

export async function updateProduct(
  productId: string,
  input: SetProductInput
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
