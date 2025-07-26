import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/connection";
import { categoriesTable, picturesTable, productsTable } from "../db/schema";
import "../env";

const CATEGORIES = ["Alimentation", "Ameublement", "Sport"];

async function seedCategories() {
  console.log("Seeding categories...");
  const categoryData = CATEGORIES.map((label) => ({
    categoryId: createId(),
    label,
  }));
  await db.insert(categoriesTable).values(categoryData);
  return await db.select().from(categoriesTable);
}

async function seedProducts(numberOfProducts: number = 50) {
  console.log(`Seeding ${numberOfProducts} products...`);

  const categoryList = await db.select().from(categoriesTable);
  const productsData = [];

  for (let i = 0; i < numberOfProducts; i++) {
    const category = faker.helpers.arrayElement(categoryList);
    productsData.push({
      productId: createId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 5, max: 500, dec: 2 }),
      categoryId: category.categoryId!,
    });
  }

  await db.insert(productsTable).values(productsData);
  return await db.select().from(productsTable);
}

async function seedPictures() {
  console.log("Seeding pictures...");

  const productList = await db.select().from(productsTable);
  const categoryList = await db.select().from(categoriesTable);
  const picturesData = [];

  for (const product of productList) {
    const category = categoryList.find(
      (c) => c.categoryId === product.categoryId
    );
    const categoryName = category?.label?.toLowerCase() || "unknown";
    const productName =
      product.name?.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "product";
    const imageCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 1; i <= imageCount; i++) {
      picturesData.push({
        pictureId: createId(),
        path: `./image/${categoryName}/${productName}/img${i}.png`,
        productId: product.productId!,
      });
    }
  }

  await db.insert(picturesTable).values(picturesData);
}

export async function seedDatabase(numberOfProducts: number = 50) {
  try {
    console.log("Deleting current data...");

    await db.delete(categoriesTable);
    await db.delete(productsTable);
    await db.delete(picturesTable);

    console.log("Starting database seeding...");

    await seedCategories();
    await seedProducts(numberOfProducts);
    await seedPictures();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

if (require.main === module) {
  const numberOfProducts = parseInt(process.argv[2]) || 50;
  seedDatabase(numberOfProducts)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
