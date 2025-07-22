import { mysqlTable, int, varchar, text, decimal, timestamp, boolean, json, unique } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const categories = mysqlTable('categories', {
  Id_categories: int('Id_categories').primaryKey().autoincrement(),
  label: varchar('label', { length: 50 }),
});

export const users = mysqlTable('users', {
  Id_users: int('Id_users').primaryKey().autoincrement(),
  last_name: varchar('last_name', { length: 50 }),
  first_name: varchar('first_name', { length: 50 }),
  email: varchar('email', { length: 50 }).unique(),
  password: varchar('password', { length: 255 }),
  password_hash: varchar('password_hash', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login'),
  is_active: boolean('is_active').default(true),
});

export const products = mysqlTable('products', {
  Id_Products: int('Id_Products').primaryKey().autoincrement(),
  label: varchar('label', { length: 50 }),
  description: text('description'),
  price: decimal('price', { precision: 5, scale: 2 }),
  Id_categories: int('Id_categories').notNull(),
});

export const pictures = mysqlTable('pictures', {
  Id_Picture: int('Id_Picture').primaryKey().autoincrement(),
  path: varchar('path', { length: 150 }),
  Id_Products: int('Id_Products').notNull(),
});

export const cart = mysqlTable('cart', {
  Id_cart: int('Id_cart').primaryKey().autoincrement(),
  Id_users: int('Id_users').notNull(),
  Id_Products: int('Id_Products').notNull(),
  quantity: int('quantity').default(1),
  created_at: timestamp('created_at').defaultNow(),
});

export const user_sessions = mysqlTable('user_sessions', {
  Id_session: int('Id_session').primaryKey().autoincrement(),
  session_token: varchar('session_token', { length: 255 }).unique(),
  Id_users: int('Id_users').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const csrf_tokens = mysqlTable('csrf_tokens', {
  Id_csrf: int('Id_csrf').primaryKey().autoincrement(),
  token: varchar('token', { length: 255 }).unique(),
  Id_users: int('Id_users').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const csp_reports = mysqlTable('csp_reports', {
  Id_report: int('Id_report').primaryKey().autoincrement(),
  report_data: json('report_data').notNull(),
  user_agent: varchar('user_agent', { length: 255 }),
  ip_address: varchar('ip_address', { length: 45 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.Id_categories],
    references: [categories.Id_categories],
  }),
  pictures: many(pictures),
  cartItems: many(cart),
}));

export const picturesRelations = relations(pictures, ({ one }) => ({
  product: one(products, {
    fields: [pictures.Id_Products],
    references: [products.Id_Products],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cart),
  sessions: many(user_sessions),
  csrfTokens: many(csrf_tokens),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.Id_users],
    references: [users.Id_users],
  }),
  product: one(products, {
    fields: [cart.Id_Products],
    references: [products.Id_Products],
  }),
})); 