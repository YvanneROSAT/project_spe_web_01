import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  decimal,
  index,
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
  label: varchar("label", { length: 50 }),
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

export const sessionsTable = mysqlTable(
  "session",
  {
    sessionId: varchar("Id_session", { length: 36 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("Id_users", { length: 36 }).notNull(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    expiresAt: datetime("expires_at").notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    tokenHashIdx: index("token_hash_idx").on(table.tokenHash),
    expiresAtIdx: index("expires_at_idx").on(table.expiresAt),
  })
);

export const productsTable = mysqlTable("products", {
  productId: varchar("Id_Products", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  label: varchar("label", { length: 50 }),
  description: text("description"),
  price: decimal("price", { precision: 5, scale: 2 }),
  categoryId: varchar("Id_categories", { length: 36 }),
});

export const picturesTable = mysqlTable("pictures", {
  pictureId: varchar("Id_Picture", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  path: varchar("path", { length: 150 }),
  productId: varchar("Id_Products", { length: 36 }),
});

export const cartTable = mysqlTable("cart", {
  cartId: varchar("Id_cart", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("Id_users", { length: 36 }).$defaultFn(() => createId()),
  productId: varchar("Id_Products", { length: 36 }),
  quantity: int("quantity").default(1),
  created_at: timestamp("created_at").defaultNow(),
});

export const cspReports = mysqlTable("csp_reports", {
  reportId: varchar("Id_report", { length: 36 })
    .primaryKey()
    .$defaultFn(() => createId()),
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
  cartItems: many(cartTable),
}));

export const picturesRelations = relations(picturesTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [picturesTable.productId],
    references: [productsTable.productId],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  cartItems: many(cartTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.userId],
  }),
}));

export const cartRelations = relations(cartTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartTable.userId],
    references: [usersTable.userId],
  }),
  product: one(productsTable, {
    fields: [cartTable.productId],
    references: [productsTable.productId],
  }),
}));
