import { usersTable } from "./schema";

export type User = typeof usersTable.$inferSelect;
