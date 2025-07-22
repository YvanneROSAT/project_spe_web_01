import '../env';
import { faker } from '@faker-js/faker';
import { db } from '../db/connection';
import { categories, products, pictures } from '../db/schema';

const CATEGORIES = [
  'Alimentation',
  'Ameublement', 
  'Sport'
];

async function seedCategories() {
  console.log('Seeding categories...');
  const categoryData = CATEGORIES.map(label => ({ label }));
  await db.insert(categories).values(categoryData);
  return await db.select().from(categories);
}

async function seedProducts(numberOfProducts: number = 50) {
  console.log(`Seeding ${numberOfProducts} products...`);
  
  const categoryList = await db.select().from(categories);
  const productsData = [];
  
  for (let i = 0; i < numberOfProducts; i++) {
    const category = faker.helpers.arrayElement(categoryList);
    productsData.push({
      label: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 5, max: 500, dec: 2 }),
      Id_categories: category.Id_categories!,
    });
  }
  
  await db.insert(products).values(productsData);
  return await db.select().from(products);
}

async function seedPictures() {
  console.log('Seeding pictures...');
  
  const productList = await db.select().from(products);
  const categoryList = await db.select().from(categories);
  const picturesData = [];
  
  for (const product of productList) {
    const category = categoryList.find(c => c.Id_categories === product.Id_categories);
    const categoryName = category?.label?.toLowerCase() || 'unknown';
    const productName = product.label?.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'product';
    const imageCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 1; i <= imageCount; i++) {
      picturesData.push({
        path: `./image/${categoryName}/${productName}/img${i}.png`,
        Id_Products: product.Id_Products!,
      });
    }
  }
  
  await db.insert(pictures).values(picturesData);
}

export async function seedDatabase(numberOfProducts: number = 50) {
  try {
    console.log('Starting database seeding...');
    
    await seedCategories();
    await seedProducts(numberOfProducts);
    await seedPictures();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

if (require.main === module) {
  const numberOfProducts = parseInt(process.argv[2]) || 50;
  seedDatabase(numberOfProducts)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} 