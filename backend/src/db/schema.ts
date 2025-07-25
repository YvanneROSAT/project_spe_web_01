import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  decimal,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const categoriesTable = mysqlTable("categories", {
  categoryId: varchar("Id_categories", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  label: varchar("label", { length: 50 }).notNull(),
});

export const usersTable = mysqlTable("users", {
  userId: varchar("Id_users", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const sessionsTable = mysqlTable("session", {
  sessionId: varchar("Id_session", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("Id_users", { length: 36 }).notNull(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  expiresAt: datetime("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const productsTable = mysqlTable("products", {
  productId: varchar("Id_Products", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  label: varchar("label", { length: 50 }),
  description: text("description"),
  price: decimal("price", { precision: 5, scale: 2 }),
  categoryId: varchar("Id_categories", { length: 36 }).notNull(),
});

export const picturesTable = mysqlTable("pictures", {
  pictureId: varchar("Id_Picture", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  path: varchar("path", { length: 150 }),
  productId: varchar("Id_Products", { length: 36 }).notNull(),
});

export const cspReports = mysqlTable("csp_reports", {
  reportId: int("Id_report").primaryKey().autoincrement(),
  reportData: json("report_data").notNull(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.categoryId],
  }),
  pictures: many(picturesTable),
}));

export const picturesRelations = relations(picturesTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [picturesTable.productId],
    references: [productsTable.productId],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.userId],
  }),
}));
