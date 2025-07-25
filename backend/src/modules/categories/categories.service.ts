import { db } from "@/db/connection";
import { categoriesTable } from "@/db/schema";
import type { Category } from "common";

export function formatCategory(
  category: typeof categoriesTable.$inferSelect
): Category {
  return {
    id: category.categoryId,
    label: category.label,
  };
}

export async function getCategories(): Promise<Category[]> {
  return db
    .select()
    .from(categoriesTable)
    .then((rows) => rows.map(formatCategory));
}
